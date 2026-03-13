import { CalculatorSearch } from "@/components/CalculatorSearch";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-5 text-center">
          <p className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Smart calculators, instant answers
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Smart Online Calculators for Finance, Business and Creators
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Free powerful tools to help you make better financial and business decisions.
          </p>
        </div>
        <CalculatorSearch className="mx-auto" />
      </div>
    </section>
  );
}
