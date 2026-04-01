import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getAllCalculators } from "@/lib/loadCalculator";
import { getCalculatorPathFromSlug } from "@/lib/calculatorCategories";
import { notFound, redirect } from "next/navigation";
import { isAerospaceCategoryKey } from "@/lib/aerospaceTaxonomy";

const categoryMapping: Record<string, { displayName: string }> = {
  aerodynamics: { displayName: "Aerodynamics" },
  "flight-mechanics": { displayName: "Flight Mechanics" },
  propulsion: { displayName: "Propulsion" },
  space: { displayName: "Space" },
  structures: { displayName: "Structures" },
  drone: { displayName: "Drones" },
  aerospace: { displayName: "Aerospace" },
  everyday: { displayName: "Everyday Utility" },
};

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryLower = category.toLowerCase();

  // New Aerospace hierarchy lives under `/aerospace/...`
  if (categoryLower === "aerospace") {
    redirect("/aerospace");
  }
  if (isAerospaceCategoryKey(categoryLower)) {
    redirect(`/aerospace/${categoryLower}`);
  }

  const categoryConfig = categoryMapping[categoryLower];

  if (!categoryConfig) {
    notFound();
  }

  const allCalculators = await getAllCalculators();
  const categoryCalculators = allCalculators.filter(
    (calc) => (calc.subcategory || calc.category) === categoryLower || calc.category === categoryLower
  );

  if (categoryCalculators.length === 0 && categoryLower !== "aerospace") {
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
  return Object.keys(categoryMapping).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryLower = category.toLowerCase();
  const categoryConfig = categoryMapping[categoryLower];

  if (!categoryConfig) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryConfig.displayName} | Insight Calculator`,
    description: `Browse all ${categoryConfig.displayName} calculators for precision engineering and aerospace.`,
  };
}
