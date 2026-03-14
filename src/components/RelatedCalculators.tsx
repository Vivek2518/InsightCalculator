"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RelatedCalculatorsProps = {
  slug: string;
  category: string;
};

interface RelatedCalc {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export function RelatedCalculators({ slug, category }: RelatedCalculatorsProps) {
  const [related, setRelated] = useState<RelatedCalc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const response = await fetch(`/api/calculators/related?slug=${encodeURIComponent(slug)}&category=${encodeURIComponent(category)}`);
        if (response.ok) {
          const results = await response.json();
          setRelated(results);
        } else {
          console.error("Error fetching related calculators");
        }
      } catch (error) {
        console.error("Error fetching related calculators:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelated();
  }, [slug, category]);

  if (isLoading || related.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Related Calculators</h3>
      <div className="grid gap-3 grid-cols-1">
        {related.map((calculator) => (
          <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}`}
            className="block p-3 border rounded-lg hover:shadow-md transition-shadow hover:border-blue-400"
          >
            <h4 className="font-medium text-blue-600 hover:text-blue-700">
              {calculator.name}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {calculator.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
