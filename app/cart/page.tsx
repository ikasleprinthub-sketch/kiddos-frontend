"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Tag,
  Check,
  AlertCircle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  MapPin,
  X,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Checkout overlay states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep] = useState<"cart">("cart");
  const [generatedOrderNumber] = useState("");

  // Apply Coupon logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    const formattedCode = couponCode.trim().toUpperCase();
    if (formattedCode === "KIDDOS20") {
      setActiveCoupon("KIDDOS20");
      setCouponSuccess("20% discount applied to your order!");
    } else if (formattedCode === "FREESHIP") {
      setActiveCoupon("FREESHIP");
      setCouponSuccess("Free delivery applied to your order!");
    } else {
      setCouponError("Invalid coupon code. Try KIDDOS20 or FREESHIP.");
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponSuccess(null);
    setCouponCode("");
  };

  // Cart Calculations
  const calculations = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const isFreeDelivery = subtotal >= 500 || activeCoupon === "FREESHIP" || subtotal === 0;
    const deliveryFee = isFreeDelivery ? 0 : 40;
    const tax = Math.round(subtotal * 0.05);
    let discount = 0;
    if (activeCoupon === "KIDDOS20" && subtotal > 0) {
      discount = Math.round(subtotal * 0.2);
    }
    const total = subtotal + tax + deliveryFee - discount;
    return { subtotal, deliveryFee, tax, discount, total, isFreeDelivery };
  }, [items, activeCoupon]);

  // Navigate to checkout with active coupon
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const params = new URLSearchParams();
    if (activeCoupon) params.set("coupon", activeCoupon);
    router.push(`/checkout?${params.toString()}`);
  };

  const resetCart = () => {
    clearCart();
    setActiveCoupon(null);
    setCouponCode("");
  };

  // ── ADDRESS STEP ──
  if (checkoutStep === "address") {
    return (
      <div className="w-full bg-[#faf8f5] dark:bg-[#061410] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-bold text-xs flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-400">Cart</span>
            </div>
            <div className="h-px bg-brand-green dark:bg-brand-gold flex-1" />
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-bold text-xs flex items-center justify-center shadow-sm">
                2
              </span>
              <span className="text-xs sm:text-sm font-bold text-brand-green dark:text-brand-gold">Delivery</span>
            </div>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-600 font-bold text-xs flex items-center justify-center">3</span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-400">Payment</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-green/10 rounded-xl">
                  <MapPin className="w-5 h-5 text-brand-green" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delivery Address</h2>
              </div>
              <button
                onClick={() => setCheckoutStep("cart")}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">Full Name</label>
                  <input
                    value={address.name}
                    onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold"
                  />
                  {addressErrors.name && <p className="text-xs text-red-500 mt-1">{addressErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">Phone Number</label>
                  <input
                    value={address.phone}
                    onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold"
                  />
                  {addressErrors.phone && <p className="text-xs text-red-500 mt-1">{addressErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">Street Address</label>
                <input
                  value={address.street}
                  onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                  placeholder="Door no, Street, Area"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold"
                />
                {addressErrors.street && <p className="text-xs text-red-500 mt-1">{addressErrors.street}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">City</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold"
                  />
                  {addressErrors.city && <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">State</label>
                  <input
                    value={address.state}
                    onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold"
                  />
                  {addressErrors.state && <p className="text-xs text-red-500 mt-1">{addressErrors.state}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">Pincode</label>
                  <input
                    value={address.pincode}
                    onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold"
                  />
                  {addressErrors.pincode && <p className="text-xs text-red-500 mt-1">{addressErrors.pincode}</p>}
                </div>
              </div>

              {placeError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {placeError}
                </div>
              )}

              {/* Order summary strip */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-4 space-y-2 text-sm border border-zinc-100 dark:border-zinc-800 mt-2">
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal</span><span>₹{calculations.subtotal}</span>
                </div>
                {calculations.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({activeCoupon})</span><span>−₹{calculations.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>GST (5%)</span><span>₹{calculations.tax}</span>
                </div>
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Delivery</span><span>{calculations.deliveryFee === 0 ? "Free" : `₹${calculations.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-700 pt-2">
                  <span>Total</span><span className="text-brand-green dark:text-brand-gold">₹{calculations.total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPlacing}
                className="w-full py-4 bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl text-sm font-bold tracking-wide uppercase shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {isPlacing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white dark:border-brand-green border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place Order · ₹{calculations.total}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── SUCCESS STEP ──
  if (checkoutStep === "success") {
    return (
      <div className="w-full bg-[#faf8f5] dark:bg-[#061410] min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/50 dark:border-zinc-850 p-8 sm:p-12 text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/25 flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
            <Check className="w-10 h-10 stroke-[3px] animate-pulse" />
          </div>

          <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-850 dark:text-zinc-100 mb-3 tracking-tight">
            Order Placed Successfully!
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-450 max-w-md mx-auto mb-8 leading-relaxed">
            Thank you for shopping with us. Amma is already packing your wholesome goodies with
            absolute care and love.
          </p>

          {/* Order Details box */}
          <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/40 dark:border-zinc-850 rounded-2xl p-5 mb-8 text-left space-y-3">
            {placedOrderNumber && (
              <>
                <div className="flex justify-between items-center text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  <span>Order Number</span>
                  <span className="text-zinc-700 dark:text-zinc-350 font-mono">{placedOrderNumber}</span>
                </div>
                <div className="h-px bg-zinc-200/60 dark:bg-zinc-800" />
              </>
            )}
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span>Amount Charged</span>
              <span className="text-brand-green dark:text-brand-gold text-sm font-black">
                ₹{calculations.total}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="/orders"
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-2xl bg-brand-green text-white hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light text-xs font-bold tracking-wide uppercase transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View My Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/products"
              onClick={resetCart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-2xl bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 text-xs font-bold tracking-wide uppercase transition-all"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── CART STEP ──
  return (
    <div className="w-full bg-[#faf8f5] dark:bg-[#061410] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── STEPS PROGRESS TRACKER ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-bold text-xs flex items-center justify-center shadow-sm">
              1
            </span>
            <span className="text-xs sm:text-sm font-bold text-brand-green dark:text-brand-gold">
              Shopping Cart
            </span>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
          <div className="flex items-center gap-2 opacity-50">
            <span className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-650 dark:text-zinc-400">
              Delivery
            </span>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
          <div className="flex items-center gap-2 opacity-50">
            <span className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-650 dark:text-zinc-400">
              Payment
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-850 dark:text-zinc-100 tracking-tight mb-8">
          Your Shopping Cart{" "}
          <span className="text-brand-gold text-lg font-bold ml-1">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ── LEFT COLUMN: CART ITEMS LIST ── */}
            <div className="flex-1 w-full space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Visual & Details */}
                  <div className="flex items-center gap-4">
                    {/* Product Thumbnail Box */}
                    <Link href={`/products/${item.slug}`} className="shrink-0">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-inner relative overflow-hidden hover:scale-105 transition-transform`}
                      >
                        <div className="absolute inset-0 plastic-sheen opacity-40" />
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover relative z-10"
                          />
                        ) : (
                          <span className="text-4xl select-none relative z-10">{item.emoji}</span>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-sm sm:text-base font-extrabold text-zinc-800 dark:text-zinc-100 line-clamp-1 hover:text-brand-green dark:hover:text-brand-gold transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
                        {item.weightOrQty}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector & Item Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 pt-3 sm:pt-0">
                    {/* Controls */}
                    <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-850 p-1 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-40 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price calculation & remove */}
                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-zinc-800 dark:text-zinc-150 min-w-[70px] text-right">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-zinc-400 hover:text-red-550 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-green dark:text-brand-gold hover:underline mt-4 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* ── RIGHT COLUMN: ORDER SUMMARY ── */}
            <aside className="w-full lg:w-[380px] shrink-0 space-y-6">
              {/* PROMO CODE BOX */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-5 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3.5 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>Promo Coupon</span>
                </h3>

                {activeCoupon ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3px]" />
                      <div>
                        <span className="text-xs font-black text-emerald-850 dark:text-emerald-400 tracking-wide uppercase">
                          {activeCoupon} Applied
                        </span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
                          {couponSuccess}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. KIDDOS20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-green dark:focus:ring-brand-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-650 dark:text-red-450 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}

                {!activeCoupon && (
                  <div className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    💡 Use{" "}
                    <strong className="text-zinc-650 dark:text-zinc-300">KIDDOS20</strong> for
                    20% off or{" "}
                    <strong className="text-zinc-650 dark:text-zinc-300">FREESHIP</strong> for
                    free shipping.
                  </div>
                )}
              </div>

              {/* PRICING BREAKDOWN */}
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-zinc-650 dark:text-zinc-300">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{calculations.subtotal}</span>
                  </div>

                  {calculations.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount ({activeCoupon})</span>
                      <span className="font-semibold">-₹{calculations.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-650 dark:text-zinc-300">
                    <span>GST (5%)</span>
                    <span className="font-semibold">₹{calculations.tax}</span>
                  </div>

                  <div className="flex justify-between text-zinc-650 dark:text-zinc-300 items-center">
                    <div className="flex items-center gap-1">
                      <span>Delivery Fee</span>
                      {calculations.isFreeDelivery && calculations.subtotal > 0 && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">
                          Free
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">
                      {calculations.deliveryFee === 0 ? "₹0" : `₹${calculations.deliveryFee}`}
                    </span>
                  </div>

                  {!calculations.isFreeDelivery && calculations.subtotal > 0 && (
                    <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-xl p-2.5 border border-zinc-150/40 dark:border-zinc-800/40 text-[11px] text-zinc-500 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>
                        Add <strong>₹{500 - calculations.subtotal}</strong> more for{" "}
                        <strong>FREE shipping</strong>!
                      </span>
                    </div>
                  )}

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2 flex justify-between text-zinc-850 dark:text-zinc-50 font-black text-base items-center">
                    <span>Grand Total</span>
                    <span className="text-xl text-brand-green dark:text-brand-gold">
                      ₹{calculations.total}
                    </span>
                  </div>
                </div>

                {/* SECURE CHECKOUT BUTTON */}
                <button
                  id="cart-checkout-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full mt-6 py-4 bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl text-sm font-bold tracking-wide uppercase shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed To Checkout</span>
                </button>

                <div className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Secure Checkout powered by SSL Encryption</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          // ── EMPTY STATE ──
          <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-12 text-center border border-zinc-200/50 dark:border-zinc-850 shadow-sm flex flex-col items-center justify-center min-h-[400px] max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-550 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-2">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
              Looks like you haven&apos;t added any traditional batters, cold-pressed oils, or spicy
              condiments to your cart yet.
            </p>
            <Link
              href="/products"
              className="flex items-center gap-2 py-3 px-8 rounded-2xl bg-brand-green text-white hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light text-xs font-bold tracking-wide uppercase transition-all shadow-md"
            >
              <span>Explore The Pantry</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
