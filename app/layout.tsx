import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import PublicShell, { DEFAULT_MAINTENANCE_MESSAGE, type MaintenanceSettings } from "@/components/common/PublicShell";
import { backendGet } from "@/lib/serverBackend";
import Script from "next/script";

const GTM_ID = "GTM-N7BQMJ7K";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kiddosfoods.com"),
  title: "Kiddos Foods",
  description: "Premium food delivery and franchises for kids and families",
  alternates: { canonical: "./" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Kiddos Foods",
    title: "Kiddos Foods",
    description: "Premium food delivery and franchises for kids and families",
    url: "./",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read on the server so pages render straight away instead of waiting for a browser fetch
  const settings = await backendGet<Record<string, string>>("/api/settings?group=general");
  const maintenance: MaintenanceSettings | null = settings && {
    enabled: settings.maintenance_mode === "true",
    message: settings.maintenance_message || DEFAULT_MAINTENANCE_MESSAGE,
    storeName: settings.store_name || "Kiddos Foods",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        {GTM_ID && (
          <>
            {/* Standard GTM snippet, loaded after hydration so it doesn't delay first paint */}
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
            </noscript>
          </>
        )}
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <PublicShell initialMaintenance={maintenance}>
                {children}
              </PublicShell>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
