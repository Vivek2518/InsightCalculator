import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getAllCalculators } from "@/lib/loadCalculator";
import { getCalculatorPathFromSlug, getCategoryPath } from "@/lib/calculatorCategories";
import { notFound } from "next/navigation";

const categoryMapping: Record<string, { topCategory: string; subcategory: string; displayName: string }> = {
  atmosphere: { topCategory: "aerospace", subcategory: "atmosphere", displayName: "Atmosphere" },
  "flight-mechanics": { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "Flight Mechanics" },
  propulsion: { topCategory: "aerospace", subcategory: "propulsion", displayName: "Propulsion" },
  "orbital-mechanics": { topCategory: "aerospace", subcategory: "orbital-mechanics", displayName: "Space" },
  aerodynamics: { topCategory: "aerospace", subcategory: "atmosphere", displayName: "Aerodynamics" },
  performance: { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "Performance" },
  gnc: { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "GNC" },
  structures: { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "Structures" },
  drones: { topCategory: "drone", subcategory: "drone", displayName: "Drones" },
};

type PageProps = {
  params: Promise<{
    topCategory: string;
    subcategory: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { topCategory, subcategory } = await params;
  const topCategoryLower = topCategory.toLowerCase();
  const subcategoryLower = subcategory.toLowerCase();
  const categoryConfig = categoryMapping[subcategoryLower];

  if (!categoryConfig || categoryConfig.topCategory !== topCategoryLower) {
    notFound();
  }

  const allCalculators = await getAllCalculators();
  const categoryCalculators = allCalculators.filter((calc) => (calc.subcategory || calc.category) === categoryConfig.subcategory);

  if (categoryCalculators.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 lg:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header>
        <h1 className="text-4xl font-bold">{categoryConfig.displayName}</h1>
      </header>

      <section className="space-y-2">
        {categoryCalculators.map((calculator) => (
          <Link
            key={calculator.slug}
            href={getCalculatorPathFromSlug(calculator.slug)}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-6 py-4 shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-foreground">{calculator.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{calculator.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(categoryMapping).map((subcategory) => {
    const topCategory = categoryMapping[subcategory].topCategory;
    return {
      topCategory,
      subcategory,
    };
  });
}

export async function generateMetadata({ params }: PageProps) {
  const { topCategory, subcategory } = await params;
  const topCategoryLower = topCategory.toLowerCase();
  const subcategoryLower = subcategory.toLowerCase();
  const categoryConfig = categoryMapping[subcategoryLower];

  if (!categoryConfig || categoryConfig.topCategory !== topCategoryLower) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryConfig.displayName} | Insight Calculator`,
    description: `Browse all ${categoryConfig.displayName} calculators`,
  };
}
