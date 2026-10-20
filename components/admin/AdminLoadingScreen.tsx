import Image from "next/image";

/** Full-screen admin transition state (auth check / redirects) — same gradient and logo card as the admin login page. */
export default function AdminLoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-4">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/logo.webp" alt="Kiddos Foods" width={72} height={72} className="object-contain" />
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        {message && <p className="animate-pulse text-base font-bold text-emerald-900">{message}</p>}
      </div>
    </div>
  );
}
