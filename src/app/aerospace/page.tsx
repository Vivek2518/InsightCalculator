import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { AEROSPACE_CATEGORIES, getAerospaceCategoryPath } from "@/lib/aerospaceTaxonomy";

export default function AerospacePage() {
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
        <h1 className="text-4xl font-bold">Aerospace</h1>
        <p className="mt-2 text-muted-foreground">
          Browse aerospace topics by category. Calculators will be added under each subcategory.
        </p>
      </header>

      <section className="space-y-2">
        {AEROSPACE_CATEGORIES.map((category) => (
          <Link
            key={category.key}
            href={getAerospaceCategoryPath(category.key)}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-6 py-4 shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-foreground">{category.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {category.subcategories.length} subcategories
              </p>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </section>
    </div>
  );
}

export const dynamic = "force-static";

