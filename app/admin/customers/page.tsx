"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { adminApi } from "@/lib/adminApi";
import { BadgeCheck, Ban, Copy, Download, Eye, MailCheck, MoreVertical, Pencil, ShoppingBag, Trash2, UserCheck, UserX, UsersRound } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  /** Phone from the customer's latest order — sign-up doesn't collect one (list endpoint only) */
  orderPhone?: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { orders: number };
}

const phoneOf = (c: Customer) => c.phone || c.orderPhone || null;

interface CustomerDetail extends Customer {
  updatedAt: string;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: string;
    createdAt: string;
  }>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search] = useState("");
  const [view, setView] = useState<"all" | "verified" | "unverified" | "blocked">("all");
  const [detail, setDetail] = useState<{ customer: CustomerDetail; totalSpent: string } | null>(null);
  const [toggling, setToggling] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", isVerified: false });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ kind: "suspend" | "delete"; customer: { id: string; name: string; email: string } } | null>(null);
  // Row action menu — fixed-positioned so the table's horizontal scroll container can't clip it
  const [menu, setMenu] = useState<{ customer: Customer; top: number; right: number } | null>(null);
  const [menuBusy, setMenuBusy] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [menu]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ customers: Customer[]; total: number; pages: number }>(
        `/admin/customers?page=${page}&search=${search}`
      );
      setCustomers(data.customers);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const openDetail = async (c: Customer) => {
    setIsEditing(false);
    const data = await adminApi.get<{ customer: CustomerDetail; totalSpent: string }>(`/admin/customers/${c.id}`);
    setDetail(data);
    setEditForm({
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone || "",
      isVerified: data.customer.isVerified,
    });
  };

  const toggleActive = async () => {
    if (!detail) return;
    setToggling(true);
    try {
      await adminApi.put(`/admin/customers/${detail.customer.id}`, { isActive: !detail.customer.isActive });
      setDetail((d) => d ? { ...d, customer: { ...d.customer, isActive: !d.customer.isActive } } : null);
      load();
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await adminApi.put<{ customer: Customer }>(`/admin/customers/${detail.customer.id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || null,
        isVerified: editForm.isVerified,
      });
      setDetail((d) => d ? {
        ...d,
        customer: {
          ...d.customer,
          name: updated.customer.name,
          email: updated.customer.email,
          phone: updated.customer.phone,
          isVerified: updated.customer.isVerified,
        }
      } : null);
      setIsEditing(false);
      load();
    } catch {
      alert("Failed to save customer details");
    } finally {
      setSaving(false);
    }
  };

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>, customer: Customer) => {
    e.stopPropagation();
    if (menu?.customer.id === customer.id) { setMenu(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const MENU_HEIGHT = 250;
    const top = rect.bottom + MENU_HEIGHT > window.innerHeight ? Math.max(8, rect.top - MENU_HEIGHT) : rect.bottom + 4;
    setMenu({ customer, top, right: window.innerWidth - rect.right });
  };

  const copyToClipboard = async (text: string) => {
    setMenu(null);
    try { await navigator.clipboard.writeText(text); } catch { alert("Could not copy to clipboard"); }
  };

  // Reactivating is harmless and runs directly; suspending asks first (see ConfirmDialog below)
  const setCustomerActive = async (customer: Customer, isActive: boolean) => {
    setMenu(null);
    if (!isActive) { setPendingAction({ kind: "suspend", customer }); return; }
    setMenuBusy(true);
    try {
      await adminApi.put(`/admin/customers/${customer.id}`, { isActive });
      load();
    } catch {
      alert("Failed to update account status");
    } finally {
      setMenuBusy(false);
    }
  };

  // From the row menu or the detail drawer: both open the same confirmation
  const deleteCustomer = (customer: { id: string; name: string; email: string }) => {
    setMenu(null);
    setPendingAction({ kind: "delete", customer });
  };
  const handleDelete = () => { if (detail) deleteCustomer(detail.customer); };

  // Runs from the confirm dialog; a thrown error is shown inside it
  const runPendingAction = async () => {
    if (!pendingAction) return;
    const { kind, customer } = pendingAction;
    setDeleting(kind === "delete");
    setMenuBusy(true);
    try {
      if (kind === "suspend") {
        await adminApi.put(`/admin/customers/${customer.id}`, { isActive: false });
      } else {
        await adminApi.delete(`/admin/customers/${customer.id}`);
        if (detail?.customer.id === customer.id) setDetail(null);
      }
      setPendingAction(null);
      load();
    } finally {
      setDeleting(false);
      setMenuBusy(false);
    }
  };

  const visibleCustomers = customers.filter((customer) => view === "all" || (view === "verified" ? customer.isVerified : view === "unverified" ? !customer.isVerified : !customer.isActive));
  const verifiedCount = customers.filter((customer) => customer.isVerified).length;
  const repeatBuyers = customers.filter((customer) => customer._count.orders >= 2).length;
  const blockedCount = customers.filter((customer) => !customer.isActive).length;
  const exportCustomers = () => { const rows = [["Name","Email","Phone","Orders","Verified","Status","Joined"], ...visibleCustomers.map((customer) => [customer.name, customer.email, phoneOf(customer) || "", String(customer._count.orders), customer.isVerified ? "Yes" : "No", customer.isActive ? "Active" : "Blocked", new Date(customer.createdAt).toLocaleDateString("en-IN")])]; const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"','""')}"`).join(",")).join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "customers.csv"; link.click(); URL.revokeObjectURL(url); };
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f9f8]">
      <AdminHeader title="Customers" />
      <main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Customer management</h2><p className="mt-1 text-sm text-slate-500">View customer profiles, purchase history and account status.</p></div><button onClick={exportCustomers} className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm"><Download size={17}/> Export customers</button></div>
        <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"><CustomerCard icon={UsersRound} tone="emerald" label="Total customers" value={total}/><CustomerCard icon={MailCheck} tone="emerald" label="Verified customers" value={verifiedCount}/><CustomerCard icon={ShoppingBag} tone="amber" label="Repeat buyers" value={repeatBuyers}/><CustomerCard icon={UserX} tone="rose" label="Blocked accounts" value={blockedCount}/></section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex gap-7 overflow-x-auto border-b border-slate-200 px-5 pt-4 whitespace-nowrap">
            <CustomerTab active={view === "all"} onClick={() => setView("all")}>All customers ({total})</CustomerTab>
            <CustomerTab active={view === "verified"} onClick={() => setView("verified")}>Verified ({verifiedCount})</CustomerTab>
            <CustomerTab active={view === "unverified"} onClick={() => setView("unverified")}>Unverified ({customers.length - verifiedCount})</CustomerTab>
            <CustomerTab active={view === "blocked"} onClick={() => setView("blocked")}>Blocked ({blockedCount})</CustomerTab>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 text-left">Customer / Contact</th>
                  <th className="px-4 py-3.5 text-center">Orders</th>
                  <th className="px-4 py-3.5 text-left">Verification</th>
                  <th className="px-4 py-3.5 text-left">Account Status</th>
                  <th className="px-4 py-3.5 text-left">Joined</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                    </td>
                  </tr>
                ) : visibleCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  visibleCustomers.map((customer) => (
                    <tr key={customer.id} className="transition-colors hover:bg-emerald-50/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 ring-2 ring-violet-50">
                            {customer.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{customer.name}</p>
                            <p className="text-xs text-slate-500 truncate">{customer.email}</p>
                            {phoneOf(customer) ? (
                              <p className="text-xs font-semibold text-slate-600 mt-0.5">{phoneOf(customer)}</p>
                            ) : (
                              <p className="text-xs italic text-slate-400 mt-0.5">No phone number</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {customer._count.orders}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${customer.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {customer.isVerified && <BadgeCheck size={13} />} {customer.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${customer.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${customer.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {customer.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                        {new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={(e) => openMenu(e, customer)}
                            disabled={menuBusy}
                            aria-label={`Actions for ${customer.name}`}
                            aria-haspopup="menu"
                            aria-expanded={menu?.customer.id === customer.id}
                            className={`rounded-xl p-2 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 ${menu?.customer.id === customer.id ? "bg-slate-100 text-slate-800" : "text-slate-400"}`}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 sm:flex-row">
            <p className="text-xs text-slate-500">
              {`Showing ${visibleCustomers.length ? ((page - 1) * 10) + 1 : 0}–${Math.min(page * 10, total)} of ${total} customers`}
            </p>
            <AdminPagination page={page} pages={pages} onPageChange={setPage} />
          </div>
        </section>
        <p className="text-xs text-slate-400">Repeat buyers: customers with 2 or more orders.</p>
      </div></main>      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Customer Details</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="flex-1 p-6 space-y-6 text-sm flex flex-col justify-between">
              <div className="space-y-6">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="isVerified"
                        checked={editForm.isVerified}
                        onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">Email Verified</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border border-gray-200 hover:bg-gray-50 font-medium py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{detail.customer.name}</p>
                        <p className="text-gray-500">{detail.customer.email}</p>
                        {detail.customer.phone && <p className="text-gray-500">{detail.customer.phone}</p>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={toggleActive} disabled={toggling}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            detail.customer.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}>
                          {toggling ? "…" : detail.customer.isActive ? "Suspend" : "Activate"}
                        </button>
                        <button onClick={() => setIsEditing(true)}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-700">{detail.customer._count.orders}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Total Orders</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-700">₹{detail.totalSpent}</p>
                        <p className="text-xs text-blue-600 mt-0.5">Total Spent</p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${detail.customer.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {detail.customer.isVerified ? "Email Verified" : "Not Verified"}
                      </span>
                      <span className="text-gray-400">Joined {new Date(detail.customer.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Recent Orders</h3>
                      {detail.customer.orders.length === 0 ? (
                        <p className="text-gray-400">No orders yet</p>
                      ) : (
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                          {detail.customer.orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-4 py-3">
                              <div>
                                <p className="font-mono text-sm font-medium">#{order.orderNumber}</p>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                  {order.status}
                                </span>
                                <span className="font-semibold text-sm">₹{order.total}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting || detail.customer.isActive}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-lg transition disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Customer"}
                </button>
                {detail.customer.isActive && (
                  <p className="text-center text-xs text-gray-400">
                    Please suspend the customer account before deleting.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {menu && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          style={{ top: menu.top, right: menu.right }}
          className="fixed z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-xl"
        >
          <MenuItem icon={Eye} onClick={() => { const c = menu.customer; setMenu(null); openDetail(c); }}>View profile</MenuItem>
          <MenuItem icon={Pencil} onClick={async () => { const c = menu.customer; setMenu(null); await openDetail(c); setIsEditing(true); }}>Edit details</MenuItem>
          <MenuItem icon={Copy} onClick={() => copyToClipboard(menu.customer.email)}>Copy email</MenuItem>
          <MenuItem icon={Copy} disabled={!phoneOf(menu.customer)} onClick={() => copyToClipboard(phoneOf(menu.customer) || "")}>Copy phone</MenuItem>
          <div className="my-1 border-t border-slate-100" />
          {menu.customer.isActive ? (
            <MenuItem icon={Ban} tone="amber" onClick={() => setCustomerActive(menu.customer, false)}>Suspend account</MenuItem>
          ) : (
            <MenuItem icon={UserCheck} tone="emerald" onClick={() => setCustomerActive(menu.customer, true)}>Activate account</MenuItem>
          )}
          <MenuItem
            icon={Trash2}
            tone="rose"
            disabled={menu.customer.isActive}
            title={menu.customer.isActive ? "Suspend the account before deleting" : undefined}
            onClick={() => deleteCustomer(menu.customer)}
          >
            Delete customer
          </MenuItem>
        </div>
      )}
      <ConfirmDialog
        open={!!pendingAction}
        title={pendingAction?.kind === "suspend" ? "Suspend customer?" : "Delete customer?"}
        message={pendingAction && (pendingAction.kind === "suspend"
          ? <p><b className="text-slate-900">{pendingAction.customer.name}</b> ({pendingAction.customer.email}) will not be able to log in until you reactivate the account.</p>
          : <><p>You are about to delete <b className="text-slate-900">{pendingAction.customer.name}</b> ({pendingAction.customer.email}).</p><p className="mt-2 font-medium text-rose-700">This permanently deletes their account, wishlist and all their orders. It cannot be undone.</p></>)}
        confirmLabel={pendingAction?.kind === "suspend" ? "Suspend" : "Delete customer"}
        onConfirm={runPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
function MenuItem({ icon: Icon, tone, disabled, title, onClick, children }: { icon: React.ComponentType<{ size?: number }>; tone?: "amber" | "emerald" | "rose"; disabled?: boolean; title?: string; onClick: () => void; children: React.ReactNode }) {
  const color = tone === "amber" ? "text-amber-700" : tone === "emerald" ? "text-emerald-700" : tone === "rose" ? "text-rose-600" : "text-slate-700";
  return (
    <button type="button" role="menuitem" disabled={disabled} title={title} onClick={onClick} className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left font-medium transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${color}`}>
      <Icon size={15} />
      {children}
    </button>
  );
}
function CustomerTab({active,onClick,children}:{active:boolean;onClick:()=>void;children:React.ReactNode}){return <button onClick={onClick} className={`pb-3 text-sm font-semibold ${active?"border-b-2 border-emerald-700 text-emerald-700":"text-slate-500"}`}>{children}</button>}
function CustomerCard({icon:Icon,tone,label,value}:{icon:React.ComponentType<{size?:number}>;tone:"emerald"|"amber"|"rose";label:string;value:number}){const color={emerald:"bg-emerald-100 text-emerald-700",amber:"bg-amber-100 text-amber-700",rose:"bg-rose-100 text-rose-700"}[tone];return <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-5"><div className={`shrink-0 rounded-full p-2 sm:p-3 ${color}`}><Icon size={22}/></div><div className="min-w-0"><p className="text-[11px] leading-tight text-slate-500 sm:text-sm">{label}</p><p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">{value}</p></div></div>}
