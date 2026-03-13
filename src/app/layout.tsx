import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from "@/lib/favorites-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GanitaHub — Smart Calculators for Finance, Business & Creators",
  description:
    "Free online calculators for finance, taxes, investments, business planning, and creator economy tools.",
  keywords: "free online calculators, financial calculators, business calculators, investment tools, tax calculators, loan calculators, EMI calculator, SIP calculator, GST calculator, savings calculator, creator tools",
  alternates: {
    canonical: "https://ganitahub.vercel.app",
  },
  openGraph: {
    title: "GanitaHub — Smart Calculators",
    description:
      "Free online calculators for finance, taxes, investments, business planning, and creator economy tools.",
    type: "website",
    url: "https://ganitahub.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "GanitaHub — Smart Calculators",
    description:
      "Free online calculators for finance, taxes, investments, business planning, and creator economy tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
