"use client";

import { useEffect, useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { useFavorites } from "@/lib/favorites-context";
import { getCalculatorBySlug } from "@/data/calculators";

export function FavoriteCalculators() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || favorites.length === 0) {
    return null;
  }

  const favoriteCalculators = favorites
    .map((slug) => getCalculatorBySlug(slug))
    .filter((calc) => !!calc);

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
          <CalculatorCard key={calculator!.slug} calculator={calculator!} />
        ))}
      </div>
    </section>
  );
}
