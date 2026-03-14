"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchResult {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export function CalculatorSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/calculators/search?query=${encodeURIComponent(query)}&limit=10`);
        if (response.ok) {
          const searchResults = await response.json();
          setResults(searchResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [query]);

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
        {showResults && !isSearching && (
          <p className="text-sm text-muted-foreground">
            {results.length} calculator{results.length === 1 ? "" : "s"} found.
          </p>
        )}
        {showResults && isSearching && (
          <p className="text-sm text-muted-foreground">Searching...</p>
        )}
      </div>
      {showResults ? (
        results.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((calculator) => (
              <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-blue-600 mb-2 line-clamp-1">
                  {calculator.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {calculator.description}
                </p>
              </Link>
            ))}
          </div>
        ) : !isSearching ? (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No calculators match "{query}". Try different keywords.
            </p>
          </div>
        ) : null
      ) : null}
    </section>
  );
}
