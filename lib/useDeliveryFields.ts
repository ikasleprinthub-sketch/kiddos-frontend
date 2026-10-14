"use client";

import { useEffect, useState } from "react";

export const DELIVERY_FIELDS = ["name", "phone", "addressLine1", "addressLine2", "city", "state", "pincode"] as const;
export type DeliveryField = (typeof DELIVERY_FIELDS)[number];
export type DeliveryFieldConfig = Record<DeliveryField, boolean>;

// Mirrors the backend defaults; used until the admin's saved settings load
export const DEFAULT_DELIVERY_FIELDS: DeliveryFieldConfig = {
  name: true,
  phone: true,
  addressLine1: true,
  addressLine2: false,
  city: true,
  state: true,
  pincode: true,
};

/** Fetches which delivery fields the admin marked Required, fresh on every mount. */
export function useDeliveryFields() {
  const [fields, setFields] = useState<DeliveryFieldConfig>(DEFAULT_DELIVERY_FIELDS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/delivery-fields", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.fields) setFields({ ...DEFAULT_DELIVERY_FIELDS, ...data.fields });
      })
      .catch(() => { /* keep defaults; the backend enforces the real rules */ })
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  return { fields, loaded };
}
