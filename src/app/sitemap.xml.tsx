import type { MetadataRoute } from "next";
import {
  AEROSPACE_CATEGORIES,
  getAerospaceCalculatorPath,
  getAerospaceCategoryPath,
  getAerospaceSubcategoryPath,
  type AerospaceCategoryKey,
} from "@/lib/aerospaceTaxonomy";

const CANONICAL_DOMAIN = "https://www.insightcalculator.com";
const STATIC_PATHS = ["/", "/aerospace", "/about-us", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticUrls = STATIC_PATHS.map((path) => ({
    url: `${CANONICAL_DOMAIN}${path}`,
    lastModified: now,
  }));

  const categoryUrls = AEROSPACE_CATEGORIES.map((category) => ({
    url: `${CANONICAL_DOMAIN}${getAerospaceCategoryPath(category.key)}`,
    lastModified: now,
  }));

  const subcategoryUrls = AEROSPACE_CATEGORIES.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      url: `${CANONICAL_DOMAIN}${getAerospaceSubcategoryPath(category.key, subcategory.key)}`,
      lastModified: now,
    }))
  );

  const calculatorUrls = AEROSPACE_CATEGORIES.flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      subcategory.calculators.map((calculatorTitle) => {
        const calculatorKey = calculatorTitle
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        return {
          url: `${CANONICAL_DOMAIN}${getAerospaceCalculatorPath(
            category.key as AerospaceCategoryKey,
            subcategory.key,
            calculatorKey
          )}`,
          lastModified: now,
        };
      })
    )
  );

  return [...staticUrls, ...categoryUrls, ...subcategoryUrls, ...calculatorUrls];
}
