"use client";

import { useMemo, useState } from "react";
import { searchCalculators } from "@/data/calculators";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Search } from "lucide-react";

export function CalculatorSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCalculators(query), [query]);

  const showResults = query.trim().length > 0;

  return (
    <section className={className}>
      <div className="flex flex-col gap-3">
        <div className="relative w-full max-w-3xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search calculators..."
            className="pl-10"
          />
        </div>
        {showResults && (
          <p className="text-sm text-muted-foreground">
            {results.length} calculator{results.length === 1 ? "" : "s"} found.
          </p>
        )}
      </div>
      {showResults ? (
        results.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((calculator) => (
              <CalculatorCard key={calculator.slug} calculator={calculator} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No calculators match "{query}". Try different keywords.
            </p>
          </div>
        )
      ) : null}
    </section>
  );
}
