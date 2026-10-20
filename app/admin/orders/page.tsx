"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import RowActionsMenu, { type RowAction } from "@/components/admin/RowActionsMenu";
import { adminApi } from "@/lib/adminApi";
import { ArrowRight, Ban, CheckCircle2, CircleX, Clock3, Copy, Download, Eye, FileText, RefreshCw, Truck, X } from "lucide-react";

interface Order { id:string; orderNumber:string; status:string; paymentStatus:string; paymentMethod:string|null; subtotal:string; discount:string; deliveryFee:string; total:string; createdAt:string; user:{id:string;name:string;email:string}; items:Array<{id:string;quantity:number;price:string;product:{name:string}}> }
interface OrderDetail extends Order { notes:string|null; shippingAddress:Record<string,string>; coupon?:{code:string}|null }
const ORDER_STATUSES=["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"];
const PAYMENT_STATUSES=["PENDING","PAID","FAILED","REFUNDED"];
const STATUS_COLORS:Record<string,string>={PENDING:"bg-amber-100 text-amber-700",CONFIRMED:"bg-sky-100 text-sky-700",PROCESSING:"bg-blue-100 text-blue-700",SHIPPED:"bg-indigo-100 text-indigo-700",DELIVERED:"bg-emerald-100 text-emerald-700",CANCELLED:"bg-rose-100 text-rose-700",REFUNDED:"bg-violet-100 text-violet-700"};
const PAYMENT_COLORS:Record<string,string>={PAID:"bg-emerald-100 text-emerald-700",PENDING:"bg-amber-100 text-amber-700",REFUNDED:"bg-violet-100 text-violet-700",FAILED:"bg-rose-100 text-rose-700"};
// The normal fulfilment path; the row menu moves an order one step along it
const NEXT_STATUS:Record<string,string>={PENDING:"CONFIRMED",CONFIRMED:"PROCESSING",PROCESSING:"SHIPPED",SHIPPED:"DELIVERED"};
const FINAL_STATUSES=new Set(["DELIVERED","CANCELLED","REFUNDED"]);

// Always two decimals: ₹550.00, ₹82.50
const money=(value:string|number)=>`₹${Number(value).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
// Order numbers are "KD" + base-36 timestamp + 4 random chars; show them grouped: KD-MST70AX5-2TY8
const formatOrderId=(n:string)=>/^KD[A-Z0-9]{6,}$/.test(n)?`KD-${n.slice(2,-4)}-${n.slice(-4)}`:n;
// CONFIRMED → Confirmed, RAZORPAY → Razorpay
const label=(value:string|null|undefined)=>value?value.charAt(0)+value.slice(1).toLowerCase():"—";
const formatDate=(iso:string)=>new Date(iso).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const formatTime=(iso:string)=>new Date(iso).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

export default function OrdersPage(){
 const [orders,setOrders]=useState<Order[]>([]); const [total,setTotal]=useState(0); const [page,setPage]=useState(1); const [pages,setPages]=useState(1); const [loading,setLoading]=useState(true); const [statusFilter,setStatusFilter]=useState(""); const [detail,setDetail]=useState<OrderDetail|null>(null); const [updating,setUpdating]=useState(false); const [serverCounts,setServerCounts]=useState<Record<string,number>>({}); const [limit,setLimit]=useState(20);
 const [cancelling,setCancelling]=useState<Order|null>(null); const [notice,setNotice]=useState<{text:string;error?:boolean}|null>(null);
 const load=useCallback(async(silent?:boolean)=>{if(!silent)setLoading(true);try{const params=new URLSearchParams({page:String(page)});if(statusFilter)params.set("status",statusFilter);const data=await adminApi.get<{orders:Order[];total:number;pages:number;limit:number;counts?:Record<string,number>}>(`/admin/orders?${params}`);setOrders(data.orders);setTotal(data.total);setPages(data.pages);setLimit(data.limit||20);setServerCounts(data.counts||{})}finally{if(!silent)setLoading(false)}},[page,statusFilter]);
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{load()},[load]);
 // keep the list current: new orders show up without a manual reload (every 30s and when the tab regains focus)
 useEffect(()=>{const tick=()=>{if(document.visibilityState==="visible")load(true).catch(()=>{})};const id=setInterval(tick,30000);document.addEventListener("visibilitychange",tick);return()=>{clearInterval(id);document.removeEventListener("visibilitychange",tick)}},[load]);
 // Short-lived feedback for menu actions
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(null),3000);return()=>clearTimeout(t)},[notice]);
 const openDetail=async(order:Order)=>{const data=await adminApi.get<{order:OrderDetail}>(`/admin/orders/${order.id}`);setDetail(data.order)};
 // The update response has no coupon, so keep the one already loaded
 const updateStatus=async(field:"status"|"paymentStatus",value:string)=>{if(!detail)return;setUpdating(true);try{const data=await adminApi.put<{order:OrderDetail}>(`/admin/orders/${detail.id}`,{[field]:value});setDetail(d=>({...data.order,coupon:d?.coupon}));load(true)}finally{setUpdating(false)}};
 // Status change from the row menu (same API as the detail drawer)
 const setOrderStatus=async(order:Order,status:string)=>{await adminApi.put(`/admin/orders/${order.id}`,{status});setNotice({text:`${formatOrderId(order.orderNumber)} marked as ${label(status)}`});if(detail?.id===order.id)setDetail(d=>d&&{...d,status});load(true)};
 const advance=(order:Order)=>setOrderStatus(order,NEXT_STATUS[order.status]).catch((e:unknown)=>setNotice({text:e instanceof Error?e.message:"Could not update the order",error:true}));
 const copyId=async(order:Order)=>{try{await navigator.clipboard.writeText(order.orderNumber);setNotice({text:`Copied ${order.orderNumber}`})}catch{setNotice({text:"Could not copy to clipboard",error:true})}};
 const rowActions=(o:Order):RowAction[]=>[
  {label:"View details",icon:Eye,onClick:()=>openDetail(o)},
  ...(NEXT_STATUS[o.status]?[{label:`Mark as ${label(NEXT_STATUS[o.status])}`,icon:ArrowRight,onClick:()=>advance(o)}]:[]),
  {label:"Copy order ID",icon:Copy,onClick:()=>copyId(o)},
  {label:"Cancel order",icon:Ban,danger:true,disabled:FINAL_STATUSES.has(o.status),onClick:()=>setCancelling(o)},
 ];
 const PROCESS_FILTER="PENDING,CONFIRMED,PROCESSING"; const sc=(k:string)=>serverCounts[k]||0;
 const counts=useMemo(()=>({all:Object.values(serverCounts).reduce((a,b)=>a+b,0),process:sc("PENDING")+sc("CONFIRMED")+sc("PROCESSING"),transit:sc("SHIPPED"),delivered:sc("DELIVERED"),cancelled:sc("CANCELLED")}),[serverCounts]); // eslint-disable-line react-hooks/exhaustive-deps
 const exportOrders=()=>{const rows=[["Order ID","Date","Customer","Items","Total","Payment status","Payment method","Order status"],...orders.map(o=>[o.orderNumber,formatDate(o.createdAt),o.user.name,String(o.items.length),Number(o.total).toFixed(2),label(o.paymentStatus),label(o.paymentMethod),label(o.status)])];const csv=rows.map(r=>r.map(v=>`"${v.replaceAll('"','""')}"`).join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const a=document.createElement("a");a.href=url;a.download="orders.csv";a.click();URL.revokeObjectURL(url)};
 return <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f9f8]"><AdminHeader title="Orders"/><main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Order management</h2><p className="mt-1 text-sm text-slate-500">Track payments, process orders and manage deliveries.</p></div><div className="flex gap-2"><button onClick={()=>load()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><RefreshCw size={16} className={loading?"animate-spin":""}/> Refresh</button><button onClick={exportOrders} className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Download size={17}/> Export orders</button></div></div>
  <section className="grid grid-cols-3 gap-2 xl:grid-cols-5 xl:gap-4"><OrderSummary icon={FileText} tone="emerald" label="Total orders" value={counts.all}/><OrderSummary icon={Clock3} tone="amber" label="To process" value={counts.process}/><OrderSummary icon={Truck} tone="blue" label="In transit" value={counts.transit}/><OrderSummary icon={CheckCircle2} tone="emerald" label="Delivered" value={counts.delivered}/><OrderSummary icon={CircleX} tone="rose" label="Cancelled" value={counts.cancelled}/></section>
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex gap-7 overflow-x-auto border-b border-slate-200 px-5 pt-4 text-sm whitespace-nowrap"><Tab active={!statusFilter} onClick={()=>{setPage(1);setStatusFilter("")}}>All orders ({counts.all})</Tab><Tab active={statusFilter===PROCESS_FILTER} onClick={()=>{setPage(1);setStatusFilter(PROCESS_FILTER)}}>To process ({counts.process})</Tab><Tab active={statusFilter==="SHIPPED"} onClick={()=>{setPage(1);setStatusFilter("SHIPPED")}}>In transit ({counts.transit})</Tab><Tab active={statusFilter==="DELIVERED"} onClick={()=>{setPage(1);setStatusFilter("DELIVERED")}}>Delivered ({counts.delivered})</Tab><Tab active={statusFilter==="CANCELLED"} onClick={()=>{setPage(1);setStatusFilter("CANCELLED")}}>Cancelled ({counts.cancelled})</Tab></div>
  <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500"><tr><th className="px-5 py-3">Order ID</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3 text-center">Items</th><th className="px-3 py-3 text-right">Total</th><th className="px-3 py-3">Payment status</th><th className="px-3 py-3">Payment method</th><th className="px-3 py-3">Order status</th><th className="px-3 py-3">Actions</th></tr></thead>
  <tbody className="divide-y divide-slate-100">{loading?<tr><td colSpan={9} className="py-16 text-center"><span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"/></td></tr>:orders.length===0?<tr><td colSpan={9} className="py-16 text-center text-slate-400">No orders found</td></tr>:orders.map(o=><tr key={o.id} className="hover:bg-emerald-50/30">
   <td className="px-5 py-3"><span title={o.orderNumber} className="font-mono text-[13px] font-bold tracking-wide text-slate-900">{formatOrderId(o.orderNumber)}</span></td>
   <td className="px-3 py-3"><p className="font-medium text-slate-800">{formatDate(o.createdAt)}</p><p className="text-xs text-slate-400">{formatTime(o.createdAt)}</p></td>
   <td className="px-3 py-3"><p className="font-semibold text-slate-800">{o.user.name}</p><p className="max-w-48 truncate text-xs text-slate-400">{o.user.email}</p></td>
   <td className="px-3 py-3 text-center font-semibold">{o.items.reduce((sum,item)=>sum+item.quantity,0)}</td>
   <td className="px-3 py-3 text-right font-bold tabular-nums">{money(o.total)}</td>
   <td className="px-3 py-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${PAYMENT_COLORS[o.paymentStatus]||"bg-slate-100 text-slate-600"}`}>{label(o.paymentStatus)}</span></td>
   <td className="px-3 py-3 text-slate-600">{label(o.paymentMethod)}</td>
   <td className="px-3 py-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[o.status]||"bg-slate-100 text-slate-600"}`}>{label(o.status)}</span></td>
   <td className="px-3 py-3"><div className="flex items-center gap-1"><button onClick={()=>openDetail(o)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"><Eye size={14}/> View</button><RowActionsMenu actions={rowActions(o)} label={`More actions for order ${formatOrderId(o.orderNumber)}`}/></div></td>
  </tr>)}</tbody></table></div><div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 sm:flex-row"><p className="text-xs text-slate-500">{`Showing ${orders.length?((page-1)*limit)+1:0}–${(page-1)*limit+orders.length} of ${total} orders`}</p><AdminPagination page={page} pages={pages} onPageChange={setPage} /></div></section>
 </div></main>
 {detail&&<div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45" onMouseDown={e=>{if(e.target===e.currentTarget)setDetail(null)}}><div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Order details</p><h2 title={detail.orderNumber} className="mt-1 font-mono text-xl font-extrabold tracking-wide">{formatOrderId(detail.orderNumber)}</h2><p className="mt-0.5 text-xs text-slate-500">Placed {formatDate(detail.createdAt)}, {formatTime(detail.createdAt)}</p></div><button onClick={()=>setDetail(null)} aria-label="Close" className="rounded-xl p-2 hover:bg-slate-100"><X size={20}/></button></div><div className="flex-1 space-y-6 p-6 text-sm">
  <div className="grid grid-cols-2 gap-3"><Field label="Order status"><select value={detail.status} onChange={e=>updateStatus("status",e.target.value)} disabled={updating} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500">{ORDER_STATUSES.map(s=><option key={s} value={s}>{label(s)}</option>)}</select></Field><Field label="Payment status"><select value={detail.paymentStatus} onChange={e=>updateStatus("paymentStatus",e.target.value)} disabled={updating} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500">{PAYMENT_STATUSES.map(s=><option key={s} value={s}>{label(s)}</option>)}</select></Field></div>
  <p className="-mt-3 text-xs text-slate-500">Payment method: <b className="text-slate-700">{label(detail.paymentMethod)}</b></p>
  <Info title="Customer"><p className="font-semibold">{detail.user.name}</p><p className="text-slate-500">{detail.user.email}</p></Info>
  <Info title="Shipping address"><ShippingAddress address={detail.shippingAddress}/></Info>
  <Info title="Items"><div className="divide-y rounded-xl border border-slate-200">{detail.items.map(item=><div key={item.id} className="flex justify-between p-4"><div><p className="font-semibold">{item.product.name}</p><p className="text-xs text-slate-500">× {item.quantity} @ {money(item.price)}</p></div><b className="tabular-nums">{money(Number(item.price)*item.quantity)}</b></div>)}</div></Info>
  <div className="space-y-2 rounded-xl bg-slate-50 p-4 tabular-nums"><div className="flex justify-between"><span>Subtotal</span><span>{money(detail.subtotal)}</span></div>{Number(detail.discount)>0&&<div className="flex justify-between text-emerald-700"><span>Discount {detail.coupon?`(${detail.coupon.code})`:""}</span><span>−{money(detail.discount)}</span></div>}<div className="flex justify-between"><span>Delivery</span><span>{money(detail.deliveryFee)}</span></div><div className="flex justify-between border-t pt-2 text-base font-extrabold"><span>Total</span><span>{money(detail.total)}</span></div></div>
  {detail.notes&&<Info title="Notes"><p className="rounded-xl bg-slate-50 p-4">{detail.notes}</p></Info>}
 </div></div></div>}
 <ConfirmDialog open={!!cancelling} title="Cancel order?" confirmLabel="Cancel order" onCancel={()=>setCancelling(null)}
  message={cancelling&&<><p>Order <b className="font-mono text-slate-900">{formatOrderId(cancelling.orderNumber)}</b> for {cancelling.user.name} ({money(cancelling.total)}) will be marked as cancelled.</p>{cancelling.paymentStatus==="PAID"&&<p className="mt-2 font-medium text-amber-700">This order is paid. Cancelling does not refund the customer — issue the refund in Razorpay and then set the payment status to Refunded.</p>}</>}
  onConfirm={async()=>{if(!cancelling)return;await setOrderStatus(cancelling,"CANCELLED");setCancelling(null)}}/>
 {notice&&<div role="status" className={`fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg ${notice.error?"bg-rose-600":"bg-slate-900"}`}>{notice.text}</div>}
 </div>
}
// Postal format: name / line 1 / line 2 / City, State – Pincode / phone
function ShippingAddress({address}:{address:Record<string,string>|null}){
 const a=address||{}; const v=(k:string)=>(a[k]||"").trim();
 const cityLine=[v("city"),v("state")].filter(Boolean).join(", ")+(v("pincode")?` – ${v("pincode")}`:"");
 const phone=v("phone"); const formattedPhone=/^\d{10}$/.test(phone)?`+91 ${phone.slice(0,5)} ${phone.slice(5)}`:phone;
 return <address className="space-y-0.5 rounded-xl bg-slate-50 p-4 not-italic leading-relaxed text-slate-700">
  {v("name")&&<p className="font-semibold text-slate-900">{v("name")}</p>}
  {v("addressLine1")&&<p>{v("addressLine1")}</p>}
  {v("addressLine2")&&<p>{v("addressLine2")}</p>}
  {cityLine.trim()&&<p>{cityLine}</p>}
  {phone&&<p className="pt-1.5 text-slate-600">Phone: <a href={`tel:+91${phone}`} className="font-medium text-slate-800 hover:text-emerald-700">{formattedPhone}</a></p>}
 </address>
}
function Tab({active,onClick,children}:{active:boolean;onClick:()=>void;children:React.ReactNode}){return <button onClick={onClick} className={`pb-3 font-semibold ${active?"border-b-2 border-emerald-700 text-emerald-700":"text-slate-500"}`}>{children}</button>}
function OrderSummary({icon:Icon,tone,label,value}:{icon:React.ComponentType<{size?:number}>;tone:"emerald"|"amber"|"blue"|"rose";label:string;value:number}){const color={emerald:"bg-emerald-100 text-emerald-700",amber:"bg-amber-100 text-amber-600",blue:"bg-blue-100 text-blue-700",rose:"bg-rose-100 text-rose-600"}[tone];return <div className="flex min-w-0 flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 text-center shadow-sm sm:p-4 xl:flex-row xl:gap-4 xl:p-5 xl:text-left"><div className={`shrink-0 rounded-xl p-2 sm:p-3 ${color}`}><Icon size={22}/></div><div className="min-w-0"><p className="flex min-h-6 items-center justify-center text-[10px] leading-tight text-slate-500 sm:min-h-8 sm:text-xs xl:min-h-0 xl:justify-start xl:text-sm">{label}</p><p className="mt-0.5 text-xl font-extrabold sm:text-2xl">{value}</p></div></div>}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label><span className="mb-1.5 block text-xs font-bold text-slate-500">{label}</span>{children}</label>}
function Info({title,children}:{title:string;children:React.ReactNode}){return <section><h3 className="mb-2 font-bold text-slate-800">{title}</h3>{children}</section>}
