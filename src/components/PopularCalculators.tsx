"use client";

import { useEffect, useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";

interface Calculator {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export function PopularCalculators() {
  const [popular, setPopular] = useState<Calculator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const response = await fetch('/api/calculators/popular');
        if (response.ok) {
          const results = await response.json();
          setPopular(results);
        } else {
          console.error("Error fetching popular calculators");
        }
      } catch (error) {
        console.error("Error fetching popular calculators:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopular();
  }, []);

  if (isLoading || popular.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Popular Calculators</h2>
        <p className="text-sm text-muted-foreground">
          These tools are frequently used by our community.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((calculator) => {
          // Convert to Calculator type for CalculatorCard
          const calc = {
            slug: calculator.slug,
            name: calculator.name,
            description: calculator.description,
            category: calculator.category as any,
            added: new Date().toISOString(),
          };
          return <CalculatorCard key={calculator.slug} calculator={calc} />;
        })}
      </div>
    </section>
  );
}
