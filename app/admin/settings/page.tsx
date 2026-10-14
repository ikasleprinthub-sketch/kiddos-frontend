"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Bell, Check, MapPin, RotateCcw, Save, Settings2, Store, Truck } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
}

type Field = { key: string; label: string; type: "text" | "email" | "number" | "textarea" | "checkbox" | "required"; placeholder?: string; help?: string; default?: string };
type Group = { group: string; label: string; description: string; icon: typeof Store; fields: Field[] };

const SETTING_GROUPS: Group[] = [
  {
    group: "general", label: "General", description: "Store identity and contact information.", icon: Store,
    fields: [
      { key: "maintenance_mode", label: "Maintenance mode", type: "checkbox", help: "Temporarily replace the public storefront with a maintenance notice. Admin pages remain accessible." },
      { key: "maintenance_message", label: "Maintenance message", type: "textarea", placeholder: "We are improving your shopping experience. Please check back soon." },
      { key: "store_name", label: "Store name", type: "text", placeholder: "Kiddos Foods" },
      { key: "store_email", label: "Store email", type: "email", placeholder: "support@example.com" },
      { key: "store_phone", label: "Store phone", type: "text", placeholder: "+91 98765 43210" },
      { key: "store_address", label: "Store address", type: "textarea", placeholder: "Full business address" },
      { key: "currency", label: "Currency symbol", type: "text", placeholder: "₹" },
    ],
  },
  {
    group: "shipping", label: "Shipping", description: "Delivery charges, thresholds and timelines.", icon: Truck,
    fields: [
      { key: "free_shipping_threshold", label: "Free shipping above (₹)", type: "number", placeholder: "500" },
      { key: "default_delivery_fee", label: "Default delivery fee (₹)", type: "number", placeholder: "50" },
      { key: "delivery_eta_days", label: "Estimated delivery days", type: "number", placeholder: "3" },
    ],
  },
  {
    group: "delivery", label: "Delivery Fields", description: "Choose which checkout address fields customers must fill in. Changes apply to the storefront immediately after saving.", icon: MapPin,
    fields: [
      { key: "delivery_field_name_required", label: "Full name", type: "required", default: "true" },
      { key: "delivery_field_phone_required", label: "Mobile number", type: "required", default: "true", help: "When filled, must be a valid 10-digit number." },
      { key: "delivery_field_addressLine1_required", label: "Address line 1", type: "required", default: "true" },
      { key: "delivery_field_addressLine2_required", label: "Address line 2", type: "required", default: "false" },
      { key: "delivery_field_city_required", label: "City", type: "required", default: "true" },
      { key: "delivery_field_state_required", label: "State", type: "required", default: "true" },
      { key: "delivery_field_pincode_required", label: "Pincode", type: "required", default: "true", help: "When filled, must be a valid 6-digit pincode." },
    ],
  },
  {
    group: "notifications", label: "Notifications", description: "Order emails and stock alert preferences.", icon: Bell,
    fields: [
      { key: "order_email_enabled", label: "Order confirmation email", type: "checkbox", help: "Send an email after a customer places an order." },
      { key: "low_stock_threshold", label: "Low stock alert threshold", type: "number", placeholder: "10" },
      { key: "low_stock_email", label: "Low stock alert email", type: "email", placeholder: "inventory@example.com" },
    ],
  },
  {
    group: "franchise", label: "Franchise", description: "Content used by the public franchise hero section.", icon: Settings2,
    fields: [
      { key: "franchise_hero_title", label: "Hero title", type: "text", placeholder: "Franchise Opportunity" },
      { key: "franchise_hero_subtitle", label: "Hero subtitle", type: "textarea", placeholder: "Be a part of the Kiddos Foods family" },
      { key: "franchise_hero_image", label: "Hero image URL", type: "text", placeholder: "/images/franchisis/franchisis_hero.webp", help: "Use a public image path or a complete HTTPS URL." },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [savedSettings, setSavedSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    adminApi.get<{ settings: SettingItem[] }>("/admin/settings")
      .then((data) => {
        const flat: Record<string, string> = {};
        for (const item of data.settings) flat[item.key] = item.value;
        for (const group of SETTING_GROUPS) for (const field of group.fields) if (field.default !== undefined && flat[field.key] === undefined) flat[field.key] = field.default;
        setSettings(flat);
        setSavedSettings(flat);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const dirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(savedSettings), [settings, savedSettings]);
  const currentGroup = SETTING_GROUPS.find((group) => group.group === activeTab) ?? SETTING_GROUPS[0];

  const handleChange = (key: string, value: string) => {
    setSaved(false);
    setError("");
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const payload = SETTING_GROUPS.flatMap((group) => group.fields.map((field) => ({
        key: field.key,
        value: settings[field.key] ?? field.default ?? "",
        group: group.group,
      })));
      await adminApi.put("/admin/settings", { settings: payload });
      setSavedSettings({ ...settings });
      setSaved(true);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f9f8]">
      <AdminHeader title="Settings" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Store settings</h2>
            <p className="mt-1 text-sm text-slate-500">Manage storefront, delivery, notification and franchise preferences.</p>
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}

          {loading ? (
            <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-2 lg:shadow-sm" aria-label="Settings sections">
                {SETTING_GROUPS.map((group) => {
                  const Icon = group.icon;
                  const active = activeTab === group.group;
                  return <button key={group.group} onClick={() => setActiveTab(group.group)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:w-full ${active ? "bg-emerald-700 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 lg:border-transparent"}`}><Icon size={17} />{group.label}</button>;
                })}
              </nav>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                  <h3 className="font-extrabold text-slate-900">{currentGroup.label} settings</h3>
                  <p className="mt-1 text-xs text-slate-500">{currentGroup.description}</p>
                </div>
                <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6">
                  {currentGroup.fields.map((field) => (
                    <div key={field.key} className={field.type === "textarea" || field.type === "checkbox" ?  "sm:col-span-2" : ""}>
                      {field.type === "required" ? (
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <span><span className="block text-sm font-bold text-slate-800">{field.label}{settings[field.key] === "true" && <span className="text-rose-500"> *</span>}</span>{field.help && <span className="mt-1 block text-xs text-slate-500">{field.help}</span>}</span>
                          <button type="button" role="switch" aria-checked={settings[field.key] === "true"} aria-label={`${field.label}: ${settings[field.key] === "true" ? "Required" : "Optional"}`} onClick={() => handleChange(field.key, settings[field.key] === "true" ? "false" : "true")} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${settings[field.key] === "true" ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-600"}`}>{settings[field.key] === "true" ? "Required" : "Optional"}</button>
                        </div>
                      ) : field.type === "checkbox" ? (
                        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <span><span className="block text-sm font-bold text-slate-800">{field.label}</span>{field.help && <span className="mt-1 block text-xs text-slate-500">{field.help}</span>}</span>
                          <input type="checkbox" checked={settings[field.key] === "true"} onChange={(event) => handleChange(field.key, event.target.checked ? "true" : "false")} className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-700" />
                        </label>
                      ) : (
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold text-slate-600">{field.label}</span>
                          {field.type === "textarea" ? <textarea rows={3} value={settings[field.key] ?? ""} placeholder={field.placeholder} onChange={(event) => handleChange(field.key, event.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /> : <input type={field.type} min={field.type === "number" ? 0 : undefined} value={settings[field.key] ?? ""} placeholder={field.placeholder} onChange={(event) => handleChange(field.key, event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />}
                          {field.help && <span className="mt-1.5 block text-[11px] text-slate-400">{field.help}</span>}
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="min-h-5 text-sm font-semibold">{saved && <span className="inline-flex items-center gap-1.5 text-emerald-700"><Check size={16} /> Settings saved</span>}</div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSettings({ ...savedSettings }); setSaved(false); setError(""); }} disabled={!dirty || saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"><RotateCcw size={16} /> Reset</button>
                    <button onClick={handleSave} disabled={!dirty || saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"><Save size={16} />{saving ? "Saving..." : "Save settings"}</button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}