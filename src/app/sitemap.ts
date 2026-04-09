import type { MetadataRoute } from "next";
import {
  AEROSPACE_CATEGORIES,
  getAerospaceCalculators,
  getAerospaceCalculatorPath,
  getAerospaceCategoryPath,
  getAerospaceSubcategoryPath,
} from "@/lib/aerospaceTaxonomy";

const CANONICAL_DOMAIN = "https://www.insightcalculator.com";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_PATHS: Array<
  Pick<SitemapEntry, "changeFrequency" | "priority"> & { path: string }
> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/aerospace", changeFrequency: "daily", priority: 0.95 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.3 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export const revalidate = 86400;

function getAbsoluteUrl(path: string): string {
  return `${CANONICAL_DOMAIN}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticUrls: SitemapEntry[] = STATIC_PATHS.map((entry) => ({
    url: getAbsoluteUrl(entry.path),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const categoryUrls: SitemapEntry[] = AEROSPACE_CATEGORIES.map((category) => ({
    url: getAbsoluteUrl(getAerospaceCategoryPath(category.key)),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const subcategoryUrls: SitemapEntry[] = AEROSPACE_CATEGORIES.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      url: getAbsoluteUrl(getAerospaceSubcategoryPath(category.key, subcategory.key)),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    }))
  );

  const calculatorUrls: SitemapEntry[] = AEROSPACE_CATEGORIES.flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      getAerospaceCalculators(category.key, subcategory.key).map((calculator) => ({
        url: getAbsoluteUrl(
          getAerospaceCalculatorPath(category.key, subcategory.key, calculator.key)
        ),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      }))
    )
  );

  const seen = new Set<string>();

  return [...staticUrls, ...categoryUrls, ...subcategoryUrls, ...calculatorUrls].filter(
    (entry) => {
      if (seen.has(entry.url)) {
        return false;
      }

      seen.add(entry.url);
      return true;
    }
  );
}
