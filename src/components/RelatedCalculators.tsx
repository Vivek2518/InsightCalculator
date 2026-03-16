import Link from "next/link";
import { getCalculatorPathFromSlug } from "@/lib/calculatorCategories";

interface RelatedCalc {
  slug: string;
  name: string;
  description: string;
  category: string;
}

type RelatedCalculatorsProps = {
  related: RelatedCalc[];
};

export function RelatedCalculators({ related }: RelatedCalculatorsProps) {
  if (!related || related.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Related Calculators</h3>
      <div className="grid gap-3 grid-cols-1">
        {related.map((calculator) => (
          <Link
            key={calculator.slug}
            href={getCalculatorPathFromSlug(calculator.slug)}
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
