import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/common/PublicShell";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <PublicShell>
                {children}
              </PublicShell>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
