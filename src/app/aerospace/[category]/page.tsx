import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  getAerospaceCategory,
  getAerospaceCategoryPath,
  getAerospaceSubcategoryPath,
  isAerospaceCategoryKey,
  type AerospaceCategoryKey,
  AEROSPACE_CATEGORIES,
} from "@/lib/aerospaceTaxonomy";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryLower = category.toLowerCase();

  if (!isAerospaceCategoryKey(categoryLower)) {
    return {};
  }

  const categoryConfig = getAerospaceCategory(categoryLower);

  if (!categoryConfig) {
    return {};
  }

  return {
    title: `${categoryConfig.title} Calculators | InsightCalculator`,
    description: `Browse free ${categoryConfig.title.toLowerCase()} calculators from InsightCalculator. Explore ${categoryConfig.subcategories.length} subcategories for fast aerospace engineering estimates.`,
    alternates: {
      canonical: getAerospaceCategoryPath(categoryLower),
    },
  };
}

export default async function AerospaceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryLower = category.toLowerCase();

  if (!isAerospaceCategoryKey(categoryLower)) {
    notFound();
  }

  const categoryConfig = getAerospaceCategory(categoryLower);
  if (!categoryConfig) {
    notFound();
  }

  const categoryKey = categoryLower as AerospaceCategoryKey;

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
        <h1 className="text-4xl font-bold">{categoryConfig.title}</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a subcategory to explore. Calculators will be added under these sections.
        </p>
      </header>

      <section className="space-y-2">
        {categoryConfig.subcategories.map((sub) => (
          <Link
            key={sub.key}
            href={getAerospaceSubcategoryPath(categoryKey, sub.key)}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-6 py-4 shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-foreground">{sub.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {sub.calculators.length} calculator{sub.calculators.length === 1 ? "" : "s"}
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
  return AEROSPACE_CATEGORIES.map((c) => ({ category: c.key }));
}
