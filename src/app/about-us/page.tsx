import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | InsightCalculator",
  description: "Learn about InsightCalculator - your trusted source for accurate, fast, and professional online calculators for aerospace, drones, and more.",
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">About InsightCalculator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            InsightCalculator is a comprehensive suite of professional-grade online calculators designed to deliver accurate results instantly. From aerospace engineering to drone analytics, we provide the tools professionals and enthusiasts need.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            We believe that accurate calculations should be fast, accessible, and free. Our mission is to provide professionals, engineers, students, and enthusiasts with reliable tools that simplify complex computations and help them make informed decisions.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you're calculating aerodynamic properties, drone flight times, or orbital mechanics, InsightCalculator delivers precision and clarity in every result.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">What We Offer</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Aerodynamics</h3>
              <p className="text-sm text-muted-foreground">Air density, pressure, and aerodynamic flow calculations for flight analysis.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Flight Mechanics</h3>
              <p className="text-sm text-muted-foreground">Lift, drag, wing loading, and aircraft performance metrics.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Propulsion</h3>
              <p className="text-sm text-muted-foreground">Thrust, specific impulse, and fuel consumption calculations for rockets.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Space & Orbital</h3>
              <p className="text-sm text-muted-foreground">Orbital velocity, escape velocity, and orbital period computations.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Structures</h3>
              <p className="text-sm text-muted-foreground">Load analysis and structural engineering calculations.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Drones & UAVs</h3>
              <p className="text-sm text-muted-foreground">Flight time prediction, battery capacity, and power consumption analysis.</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Why Choose InsightCalculator</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Accuracy:</strong> All calculators are built on validated engineering formulas and industry standards.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Speed:</strong> Get instant results without complex setups or lengthy configurations.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Simplicity:</strong> Intuitive interfaces designed for both professionals and beginners.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Accessibility:</strong> Completely free, no registration required, and mobile-friendly.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Reliability:</strong> Enterprise-grade calculations you can trust for critical decisions.</span>
            </li>
          </ul>
        </section>

        {/* Technology */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Technology & Quality</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            InsightCalculator is built with modern web technologies ensuring fast load times, smooth performance, and compatibility across all devices. Every calculator is tested thoroughly to guarantee accuracy and reliability.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We continuously update our tools to reflect the latest engineering standards and best practices in aerospace, physics, and UAV technology.
          </p>
        </section>
      </div>
    </div>
  );
}
