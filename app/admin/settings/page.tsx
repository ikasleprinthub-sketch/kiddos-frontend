"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Save, Plus, Trash2 } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
}

const DEFAULT_GROUPS = [
  {
    group: "general",
    label: "General",
    fields: [
      { key: "store_name", label: "Store Name", type: "text" },
      { key: "store_email", label: "Store Email", type: "email" },
      { key: "store_phone", label: "Store Phone", type: "text" },
      { key: "store_address", label: "Store Address", type: "text" },
      { key: "currency", label: "Currency Symbol", type: "text" },
    ],
  },
  {
    group: "shipping",
    label: "Shipping",
    fields: [
      { key: "free_shipping_threshold", label: "Free Shipping Above (₹)", type: "number" },
      { key: "default_delivery_fee", label: "Default Delivery Fee (₹)", type: "number" },
      { key: "delivery_eta_days", label: "Estimated Delivery Days", type: "number" },
    ],
  },
  {
    group: "notifications",
    label: "Notifications",
    fields: [
      { key: "order_email_enabled", label: "Order Confirmation Email", type: "checkbox" },
      { key: "low_stock_threshold", label: "Low Stock Alert Threshold", type: "number" },
      { key: "low_stock_email", label: "Low Stock Alert Email", type: "email" },
    ],
  },
  {
    group: "social",
    label: "Social Media",
    fields: [
      { key: "facebook_url", label: "Facebook URL", type: "url" },
      { key: "instagram_url", label: "Instagram URL", type: "url" },
      { key: "twitter_url", label: "Twitter URL", type: "url" },
      { key: "whatsapp_number", label: "WhatsApp Number", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [customKey, setCustomKey] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customSettings, setCustomSettings] = useState<SettingItem[]>([]);

  useEffect(() => {
    adminApi
      .get<{ settings: SettingItem[]; grouped: Record<string, Record<string, string>> }>("/admin/settings")
      .then((data) => {
        const flat: Record<string, string> = {};
        for (const s of data.settings) flat[s.key] = s.value;
        setSettings(flat);
        const knownKeys = new Set(DEFAULT_GROUPS.flatMap((g) => g.fields.map((f) => f.key)));
        setCustomSettings(data.settings.filter((s) => !knownKeys.has(s.key)));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const allGroups = DEFAULT_GROUPS.flatMap((g) =>
        g.fields.map((f) => ({ key: f.key, value: settings[f.key] || "", group: g.group }))
      );
      await adminApi.put("/admin/settings", { settings: allGroups });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const addCustomSetting = async () => {
    if (!customKey.trim() || !customValue.trim()) return;
    await adminApi.post("/admin/settings", { key: customKey.trim(), value: customValue.trim(), group: "custom" });
    setCustomSettings((cs) => [...cs, { id: Date.now().toString(), key: customKey, value: customValue, group: "custom" }]);
    setCustomKey("");
    setCustomValue("");
  };

  const currentGroup = DEFAULT_GROUPS.find((g) => g.group === activeTab);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Settings" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-6">
          {/* Tab bar */}
          <div className="flex gap-2 flex-wrap">
            {DEFAULT_GROUPS.map((g) => (
              <button key={g.group} onClick={() => setActiveTab(g.group)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === g.group
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
                {g.label}
              </button>
            ))}
            <button onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "custom"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              Custom
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === "custom" ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Custom Settings</h2>
              <div className="space-y-2">
                {customSettings.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm text-gray-600 flex-1">{s.key}</span>
                    <span className="text-sm text-gray-800 flex-1 truncate">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input value={customKey} onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="setting_key"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 font-mono" />
                <input value={customValue} onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="value"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                <button onClick={addCustomSetting}
                  className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          ) : currentGroup ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">{currentGroup.label} Settings</h2>
              <div className="space-y-4">
                {currentGroup.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === "checkbox" ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[field.key] === "true"}
                          onChange={(e) => handleChange(field.key, e.target.checked ? "true" : "false")}
                          className="w-4 h-4 accent-emerald-600"
                        />
                        <span className="text-sm text-gray-600">Enabled</span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        value={settings[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                  <Save size={15} />
                  {saving ? "Saving…" : "Save Settings"}
                </button>
                {saved && <span className="text-sm text-emerald-600 font-medium">Saved!</span>}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
