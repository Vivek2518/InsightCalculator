import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  getAerospaceCategory,
  getAerospaceSubcategory,
  getAerospaceCalculators,
  getAerospaceCalculatorPath,
  getAerospaceSubcategoryPath,
  isAerospaceCategoryKey,
  AEROSPACE_CATEGORIES,
  type AerospaceCategoryKey,
} from "@/lib/aerospaceTaxonomy";

type PageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const categoryLower = category.toLowerCase();
  const subLower = subcategory.toLowerCase();

  if (!isAerospaceCategoryKey(categoryLower)) {
    return {};
  }

  const categoryConfig = getAerospaceCategory(categoryLower);
  const subConfig = getAerospaceSubcategory(categoryLower, subLower);
  const calculators = getAerospaceCalculators(categoryLower, subLower);

  if (!categoryConfig || !subConfig) {
    return {};
  }

  return {
    title: `${subConfig.title} Calculators | ${categoryConfig.title} | InsightCalculator`,
    description: `Use ${calculators.length} free ${subConfig.title.toLowerCase()} calculators for ${categoryConfig.title.toLowerCase()} workflows and quick engineering estimates.`,
    alternates: {
      canonical: getAerospaceSubcategoryPath(categoryLower as AerospaceCategoryKey, subLower),
    },
  };
}

export default async function AerospaceSubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  const categoryLower = category.toLowerCase();
  const subLower = subcategory.toLowerCase();

  if (!isAerospaceCategoryKey(categoryLower)) {
    notFound();
  }

  const categoryConfig = getAerospaceCategory(categoryLower);
  const subConfig = getAerospaceSubcategory(categoryLower, subLower);
  const calculators = getAerospaceCalculators(categoryLower, subLower);

  if (!categoryConfig || !subConfig) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 lg:px-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header>
        <h1 className="text-4xl font-bold">{subConfig.title}</h1>
        <p className="mt-2 text-muted-foreground">
          Browse calculators under {subConfig.title}.
        </p>
      </header>

      <section className="space-y-2">
        {calculators.map((calculator) => (
          <Link
            key={calculator.key}
            href={getAerospaceCalculatorPath(
              categoryLower as AerospaceCategoryKey,
              subLower,
              calculator.key
            )}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-6 py-4 shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-foreground">{calculator.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                Open calculator
              </p>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return AEROSPACE_CATEGORIES.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      category: cat.key,
      subcategory: sub.key,
    }))
  );
}
