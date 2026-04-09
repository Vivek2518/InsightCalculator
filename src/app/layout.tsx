import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const CANONICAL_DOMAIN = "https://www.insightcalculator.com";

export const metadata: Metadata = {
  title: "InsightCalculator | Precision Aerospace, Drone & Engineering Tools",
  description:
    "Fast, accurate, and free online calculators for Aerospace, Drone, and Engineering professionals. Get instant results for Mach number, air density, flight mechanics, and more with InsightCalculator.",
  keywords: "aerospace calculator, drone calculator, engineering tools, mach number calculator, air density calculator, flight mechanics, propulsion tools, orbit calculator, wing loading, stall speed, free online calculators",
  alternates: {
    canonical: CANONICAL_DOMAIN,
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "InsightCalculator", url: CANONICAL_DOMAIN }],
  publisher: "InsightCalculator",
  icons: {
    icon: "/logo.jpeg",
  },
  openGraph: {
    title: "InsightCalculator | Precision Aerospace, Drone & Engineering Tools",
    description:
      "Fast, accurate, and free online calculators for Aerospace, Drone, and Engineering professionals. Get instant results for Mach number, air density, flight mechanics, and more with InsightCalculator.",
    type: "website",
    url: CANONICAL_DOMAIN,
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "InsightCalculator | Precision Aerospace, Drone & Engineering Tools",
    description:
      "Fast, accurate, and free online calculators for Aerospace, Drone, and Engineering professionals. Get instant results for Mach number, air density, flight mechanics, and more with InsightCalculator.",
    images: ["/logo.svg"],
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
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
