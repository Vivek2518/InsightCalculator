import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">InsightCalculator</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Professional-grade online calculators for aerospace, engineering, and more.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">Product</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">Company</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/about-us" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">Calculators</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/aerodynamics" className="hover:text-foreground transition-colors">
                  Aerodynamics
                </Link>
              </li>
              <li>
                <Link href="/structures" className="hover:text-foreground transition-colors">
                  Structures
                </Link>
              </li>
              <li>
                <Link href="/propulsion" className="hover:text-foreground transition-colors">
                  Propulsion
                </Link>
              </li>
              <li>
                <Link href="/flight-mechanics" className="hover:text-foreground transition-colors">
                  Flight Mechanics
                </Link>
              </li>
            </ul>
          </div>

          {/* More Calculators */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">More</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/space" className="hover:text-foreground transition-colors">
                  Space & Orbital
                </Link>
              </li>
              <li>
                <Link href="/drone" className="hover:text-foreground transition-colors">
                  Drones
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            <p>© {currentYear} InsightCalculator. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <a href="mailto:support@insightcalculator.com" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
