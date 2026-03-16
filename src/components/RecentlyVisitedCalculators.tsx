"use client";

import { useEffect, useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { useRecent } from "@/lib/recent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type CalculatorSummary = {
  slug: string;
  name: string;
  description: string;
  category: string;
};

export function RecentlyVisitedCalculators() {
  const { recent, clearRecent } = useRecent();
  const [mounted, setMounted] = useState(false);
  const [calculators, setCalculators] = useState<CalculatorSummary[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || recent.length === 0) {
      setCalculators([]);
      return;
    }

    let canceled = false;

    async function loadRecent() {
      const results = await Promise.all(
        recent.map(async (slug) => {
          try {
            const response = await fetch(`/api/calculators/${slug}`);
            if (!response.ok) return null;

            const payload = await response.json();
            if (!payload.success || !payload.data) return null;

            const { slug: s, name, description, category } = payload.data;
            return { slug: s, name, description, category };
          } catch {
            return null;
          }
        })
      );

      if (canceled) return;
      setCalculators(results.filter((item): item is CalculatorSummary => Boolean(item)));
    }

    loadRecent();

    return () => {
      canceled = true;
    };
  }, [mounted, recent]);

  if (!mounted || calculators.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Recently Viewed</h2>
          <p className="text-sm text-muted-foreground">
            Pick up where you left off — these calculators were recently opened.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearRecent}
          className="shrink-0"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
    </section>
  );
}
