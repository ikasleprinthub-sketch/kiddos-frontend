"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useDeliveryFields } from "@/lib/useDeliveryFields";
import {
  ArrowLeft, ShieldCheck, Truck, MapPin, Check, AlertCircle,
} from "lucide-react";

// Extend window to include Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name?: string; contact?: string; email?: string };
  theme: { color: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance { open(): void }
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderSummary {
  subtotal: string;
  discount: string;
  deliveryFee: string;
  total: string;
  couponCode: string | null;
  lineItems: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productName: string;
  }>;
}

const EMPTY_ADDRESS: ShippingAddress = {
  name: "", phone: "", addressLine1: "", addressLine2: "",
  city: "", state: "", pincode: "",
};

// Parse a response body without throwing, so a down/erroring backend gives a clear message
// instead of "Unexpected end of JSON input".
async function readJson(res: Response): Promise<{ message?: string; success?: boolean; order?: { id?: string; orderNumber: string; total: string | number }; razorpayPaymentId?: string; razorpayOrderId?: string; keyId?: string; orderSummary?: OrderSummary }> {
  try { return await res.json(); } catch { return {} as never; }
}
const serverDown = (status: number) =>
  `The server could not process your request (error ${status}). Please try again in a moment.`;

// Same rule as the backend: starts with a letter; letters (any language), spaces, . ' - only, 2–100 chars
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}\s.'-]{1,99}$/u;

function CheckoutInner() {
  const { items, clearCart, ready } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponCode = searchParams.get("coupon") || "";
  const { fields: required } = useDeliveryFields();

  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState("");
  const [keyId, setKeyId] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string; total: string | number; razorpayPaymentId: string;
  } | null>(null);

  useEffect(() => {
    if (step === "payment") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [step]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Auto-fill the address: last order's address first, then the account's name/phone.
  // Only empty fields are filled, so anything the customer already typed is kept.
  const prefilledFor = useRef<string | null>(null);
  useEffect(() => {
    if (!user || prefilledFor.current === user.id) return;
    prefilledFor.current = user.id;

    const fillEmpty = (saved: Partial<ShippingAddress>) =>
      setAddress((cur) => {
        const next = { ...cur };
        (Object.keys(saved) as (keyof ShippingAddress)[]).forEach((k) => {
          if (!next[k] && saved[k]) next[k] = String(saved[k]);
        });
        return next;
      });

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    (async () => {
      try {
        const res = await fetch("/api/orders?limit=1", { headers });
        if (res.ok) {
          const data = await res.json();
          const last = data.orders?.[0]?.shippingAddress;
          if (last) fillEmpty(last);
        }
      } catch { /* ignore, fall back to profile */ }
      try {
        const res = await fetch("/api/auth/me", { headers });
        if (res.ok) {
          const data = await res.json();
          fillEmpty({ name: data.user?.name, phone: data.user?.phone ?? "" });
        }
      } catch { /* ignore */ }
    })();
  }, [user]);

  // Pincode -> city & state (India Post public API); only fills empty city/state
  useEffect(() => {
    const pin = address.pincode.trim();
    if (!/^\d{6}$/.test(pin)) return;
    const ctrl = new AbortController();
    fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => {
        const office = data?.[0]?.PostOffice?.[0];
        if (!office) return;
        setAddress((cur) =>
          cur.pincode.trim() !== pin
            ? cur
            : { ...cur, city: cur.city || office.District || "", state: cur.state || office.State || "" }
        );
      })
      .catch(() => { /* lookup is a convenience; ignore failures */ });
    return () => ctrl.abort();
  }, [address.pincode]);

  // Redirect to cart if empty or not logged in
  useEffect(() => {
    // Wait for the cart to load, or a just-logged-in user would be bounced before their items appear
    if (ready && items.length === 0 && step === "address") {
      router.replace("/cart");
    }
  }, [ready, items.length, step, router]);

  const validate = useCallback((): boolean => {
    const errs: Partial<ShippingAddress> = {};
    const v = (k: keyof ShippingAddress) => address[k].trim();
    // Required fields must be filled; optional ones are only format-checked when filled
    if (!v("name") ? required.name : !NAME_PATTERN.test(v("name"))) {
      errs.name = v("name") ? "Enter a valid name (letters and spaces only)" : "Name is required";
    }
    if (!v("phone") ? required.phone : !/^[6-9]\d{9}$/.test(v("phone"))) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    if (!v("addressLine1") && required.addressLine1) errs.addressLine1 = "Address is required";
    if (!v("addressLine2") && required.addressLine2) errs.addressLine2 = "Address line 2 is required";
    if (!v("city") && required.city) errs.city = "City is required";
    if (!v("state") && required.state) errs.state = "State is required";
    if (!v("pincode") ? required.pincode : !/^\d{6}$/.test(v("pincode"))) {
      errs.pincode = "Enter a valid 6-digit pincode";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [address, required]);

  const verifyingRef = useRef(false);
  const pendingPaymentRef = useRef<RazorpayResponse | null>(null);
  const verifyRef = useRef<(r: RazorpayResponse) => Promise<void>>(async () => {});

  const createRazorpayOrder = useCallback(async () => {
    if (!validate()) return;
    if (!user) { router.push("/login?redirect=/checkout"); return; }

    setLoading(true);
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          shippingAddress: address,
          couponCode: couponCode || undefined,
          notes,
        }),
      });

      const data = await readJson(res);
      if (!res.ok) throw new Error(data.message || serverDown(res.status));
      if (!data.razorpayOrderId || !data.orderSummary) throw new Error("Could not start the payment. Please try again.");

      setOrderSummary(data.orderSummary);
      setRazorpayOrderId(data.razorpayOrderId ?? "");
      setKeyId(data.keyId ?? "");
      setStep("payment");
    } catch (e: unknown) {
      setApiError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Cannot reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [validate, user, items, address, couponCode, notes, router]);

  const openRazorpay = useCallback(() => {
    // Already paid but the order could not be saved: retry saving it (safe, the server is idempotent)
    // instead of opening the payment window again.
    if (pendingPaymentRef.current) { void verifyRef.current(pendingPaymentRef.current); return; }
    if (verifyingRef.current) return;
    if (!window.Razorpay) { setApiError("Payment gateway is loading. Please try again."); return; }
    setApiError("");

    const rzp = new window.Razorpay({
      key: keyId,
      amount: Math.round(Number(orderSummary!.total) * 100),
      currency: "INR",
      name: "Kiddos Foods",
      description: "Order Payment",
      order_id: razorpayOrderId,
      prefill: {
        name: address.name,
        contact: address.phone,
        email: user?.email,
      },
      theme: { color: "#059669" },
      handler: async (response: RazorpayResponse) => {
        await verifyRef.current(response);
      },
      modal: {
        ondismiss: () => setApiError("Payment was cancelled. You can try again."),
      },
    });
    rzp.open();
  }, [keyId, orderSummary, razorpayOrderId, address, user]);

  const verifyPayment = useCallback(async (response: RazorpayResponse) => {
    if (verifyingRef.current) return; // ignore double clicks / duplicate handler calls
    verifyingRef.current = true;
    pendingPaymentRef.current = response; // kept until the order is confirmed saved
    setLoading(true);
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          orderSummary,
          shippingAddress: address,
          couponCode: couponCode || undefined,
          notes,
        }),
      });

      const data = await readJson(res);
      if (!res.ok) throw new Error(data.message || serverDown(res.status));
      // Only show success once the server confirms a saved order with an id
      if (!data.success || !data.order?.id || !data.order?.orderNumber) {
        throw new Error("The server did not confirm your order.");
      }

      pendingPaymentRef.current = null;
      setConfirmedOrder({
        orderNumber: data.order.orderNumber,
        total: data.order.total,
        razorpayPaymentId: data.razorpayPaymentId ?? response.razorpay_payment_id,
      });
      clearCart();
      setStep("success");
    } catch (e: unknown) {
      const reason = e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Cannot reach the server.";
      setApiError(
        `Your payment (ID ${response.razorpay_payment_id}) went through, but we could not save your order: ${reason} ` +
        `Press the button again to retry saving it - you will not be charged twice. If it keeps failing, contact support with this payment ID.`
      );
    } finally {
      verifyingRef.current = false;
      setLoading(false);
    }
  }, [orderSummary, address, couponCode, notes, clearCart]);
  useEffect(() => { verifyRef.current = verifyPayment; }, [verifyPayment]);

  const field = (key: keyof ShippingAddress, label: string, placeholder: string, type = "text", maxLength?: number) => (
    <div>
      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
        {label}{required[key] && <span className="text-red-500"> *</span>}
        {!required[key] && <span className="font-normal text-zinc-400"> (optional)</span>}
      </label>
      <input
        type={type}
        value={address[key]}
        onChange={(e) => {
          let val = e.target.value;
          if (type === "tel") val = val.replace(/\D/g, ""); // allow only digits
          setAddress((a) => ({ ...a, [key]: val }));
        }}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
          errors[key]
            ? "border-red-400 bg-red-50 dark:bg-red-950/20"
            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
        } text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
      />
      {errors[key] && (
        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={10} /> {errors[key]}
        </p>
      )}
    </div>
  );

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (step === "success" && confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] py-16 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 text-center max-w-lg w-full shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/25 flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <Check size={36} strokeWidth={3} />
          </div>
          <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Payment Confirmed
          </span>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            Thank you for your order. We&apos;re preparing your goodies with care.
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-8 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Order Number</span>
              <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200">
                {confirmedOrder.orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Payment ID</span>
              <span className="font-mono text-xs text-zinc-500 truncate max-w-48">
                {confirmedOrder.razorpayPaymentId}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <span className="text-zinc-600 font-semibold">Amount Paid</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                ₹{confirmedOrder.total}
              </span>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 py-3 px-8 bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl text-sm font-bold tracking-wide uppercase transition-all shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── PAYMENT REVIEW ────────────────────────────────────────────────────────────
  if (step === "payment" && orderSummary) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep("address")} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Review & Pay</h1>
          </div>

          {apiError && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              {apiError}
            </div>
          )}

          {/* Delivery address summary */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-emerald-600" />
              <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">Delivering to</span>
            </div>
            {address.name && <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{address.name}</p>}
            {address.phone && <p className="text-sm text-zinc-500">{address.phone}</p>}
            <p className="text-sm text-zinc-500">
              {[address.addressLine1, address.addressLine2].filter(Boolean).join(", ")}
            </p>
            <p className="text-sm text-zinc-500">
              {[[address.city, address.state].filter(Boolean).join(", "), address.pincode].filter(Boolean).join(" – ")}
            </p>
          </div>

          {/* Order items */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                Order Items ({orderSummary.lineItems.length})
              </h2>
            </div>
            <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {orderSummary.lineItems.map((item) => (
                <div key={item.productId} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    ₹{item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Subtotal</span><span>₹{orderSummary.subtotal}</span>
            </div>
            {Number(orderSummary.discount) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount {orderSummary.couponCode ? `(${orderSummary.couponCode})` : ""}</span>
                <span>−₹{orderSummary.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400 items-center">
              <div className="flex items-center gap-1.5">
                <Truck size={13} className="text-zinc-400" />
                <span>Delivery</span>
              </div>
              <span>{Number(orderSummary.deliveryFee) === 0 ? "Free" : `₹${orderSummary.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-black text-base text-zinc-900 dark:text-zinc-100 border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span>Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">₹{orderSummary.total}</span>
            </div>
          </div>

          <button
            onClick={openRazorpay}
            disabled={loading}
            className="w-full py-4 bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl text-sm font-bold uppercase tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying…</>
            ) : (
              <><ShieldCheck size={16} /> Pay ₹{orderSummary.total} Securely</>
            )}
          </button>

          <p className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={12} />
            Secured by Razorpay · Your payment info is encrypted
          </p>
        </div>
      </div>
    );
  }

  // ── ADDRESS FORM ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Delivery Address</h1>
            <p className="text-xs text-zinc-500">{items.length} item{items.length !== 1 ? "s" : ""} in cart</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-500 text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-xs font-medium text-zinc-400">Cart</span>
          </div>
          <div className="h-px bg-zinc-200 flex-1" />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green text-xs font-bold flex items-center justify-center shadow-sm">2</span>
            <span className="text-xs font-bold text-brand-green dark:text-brand-gold">Delivery</span>
          </div>
          <div className="h-px bg-zinc-200 flex-1" />
          <div className="flex items-center gap-2 opacity-50">
            <span className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-500 text-xs font-bold flex items-center justify-center">3</span>
            <span className="text-xs font-medium text-zinc-400">Payment</span>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {apiError}
          </div>
        )}

        {!user && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
            Please{" "}
            <Link href="/login?redirect=/checkout" className="font-bold underline">
              log in
            </Link>{" "}
            to continue checkout.
          </div>
        )}

        {/* Address form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <MapPin size={16} className="text-emerald-600" /> Shipping Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("name", "Full Name", "Your name")}
            {field("phone", "Mobile Number", "10-digit number", "tel", 10)}
          </div>
          {field("addressLine1", "Address Line 1", "House / Flat No., Building, Street")}
          {field("addressLine2", "Address Line 2", "Area, Landmark")}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {field("city", "City", "Mumbai")}
            {field("state", "State", "Maharashtra")}
            {field("pincode", "Pincode", "400001", "tel", 6)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Order Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for delivery…"
              rows={2}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>
        </div>

        {/* Cart summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h2 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 mb-3">
            Order Summary ({items.length} items)
          </h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {couponCode && (
              <p className="text-xs text-emerald-600 font-medium">Coupon: {couponCode}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={createRazorpayOrder}
          disabled={loading || !user}
          className="w-full py-4 bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl text-sm font-bold uppercase tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Please wait…</>
          ) : (
            <><Truck size={16} /> Proceed to Payment</>
          )}
        </button>

        <p className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
          <ShieldCheck size={12} />
          Secured by Razorpay · SSL Encrypted
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
