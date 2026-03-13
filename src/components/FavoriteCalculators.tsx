"use client";

import { Calculator, getCalculatorBySlug } from "@/data/calculators";
import { CalculatorCard } from "@/components/CalculatorCard";
import { useFavorites } from "@/lib/favorites-context";

export function FavoriteCalculators() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return null;
  }

  const favoriteCalculators = favorites
    .map((slug) => getCalculatorBySlug(slug))
    .filter((calculator): calculator is Calculator => Boolean(calculator));

  if (favoriteCalculators.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Favorites</h2>
        <p className="text-sm text-muted-foreground">
          Quick access to your most-used calculators.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteCalculators.map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
    </section>
  );
}
