/** name@domain.tld — the domain must end in a letters-only extension (rejects e.g. "user@gmail.com123"). Keep in sync with the backend's isValidEmail. */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export const isValidEmail = (v: string): boolean => v.length <= 254 && EMAIL_RE.test(v);
