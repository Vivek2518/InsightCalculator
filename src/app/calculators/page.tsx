import { CalculatorSearch } from "@/components/CalculatorSearch";
import { CategorySection } from "@/components/CategorySection";
import { calculators } from "@/data/calculators";
import { CalculatorCard } from "@/components/CalculatorCard";

export const metadata = {
  title: "Calculators — GanitaHub",
  description: "Browse all available calculators for finance, taxation, investment, and more.",
  keywords: "calculators, financial calculators, online tools, business calculators, investment calculators, tax calculators, loan calculators, free calculators",
  alternates: {
    canonical: "https://ganitahub.vercel.app/calculators",
  },
};

export default function CalculatorsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">All Calculators</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and explore all tools available at GanitaHub.
        </p>
      </header>
      <div className="mt-8">
        <CalculatorSearch />
      </div>
      <div className="mt-10">
        <CategorySection />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Explore everything</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the entire library of calculators.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </section>
    </div>
  );
}
