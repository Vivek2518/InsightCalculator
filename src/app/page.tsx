import Link from "next/link";
import { Airplay, BarChart2, Drone, Globe2, Rocket } from "lucide-react";
import { getAllCalculators } from "@/lib/loadCalculator";
import { getCalculatorPathFromSlug, getCategoryPath } from "@/lib/calculatorCategories";

const categoryCards = [
  { key: "aerodynamics", title: "Aerodynamics", subtitle: "Air density, pressure, and flow", icon: Airplay },
  { key: "structures", title: "Structures", subtitle: "Strength, loads, and materials", icon: BarChart2 },
  { key: "propulsion", title: "Propulsion", subtitle: "Thrust, Isp, and fuel performance", icon: Rocket },
  { key: "flight-mechanics", title: "Flight Mechanics", subtitle: "Lift, drag, and wing performance", icon: BarChart2 },
  { key: "space", title: "Space", subtitle: "Orbits, escape velocity, and mechanics", icon: Globe2 },
  { key: "drone", title: "Drones", subtitle: "UAV flight time and battery", icon: Drone },
];

export default async function Home() {
  const calculators = await getAllCalculators();

  const categoryCounts = calculators.reduce<Record<string, number>>((map, calculator) => {
    const category = calculator.subcategory || calculator.category;
    map[category] = (map[category] || 0) + 1;
    return map;
  }, {});

  const cards = categoryCards.map((card) => {
    const normalized = card.alias || card.key;
    const count = categoryCounts[normalized] || 0;

    return {
      ...card,
      count,
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 lg:px-8">
      <section className="space-y-5 text-center">
        <h2 className="text-4xl font-bold">Aerospace Calculator Suite</h2>
        <p className="text-lg text-muted-foreground">Fast tools for flight, propulsion, and UAV analysis</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const normalized = card.alias || card.key;
          const href = getCategoryPath(normalized);
          
          return (
            <Link href={href} key={card.key} className="group overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition duration-200 group-hover:bg-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.subtitle}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.count} calculator{card.count === 1 ? "" : "s"}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {/* Placeholder if you'd like to keep Favorites/Popular/Recent widgets. */}
      </section>
    </div>
  );
}

