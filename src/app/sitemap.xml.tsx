import { getAllCalculatorSlugs } from "@/lib/loadCalculator";

const CANONICAL_DOMAIN = "https://www.insightcalculator.com";

export default async function sitemap() {
  const slugs = await getAllCalculatorSlugs();
  const now = new Date().toISOString();

  const calculatorUrls = slugs.map((slug) => ({
    url: `${CANONICAL_DOMAIN}/calculators/${slug}`,
    lastModified: now,
  }));

  return [
    {
      url: CANONICAL_DOMAIN,
      lastModified: now,
    },
    ...calculatorUrls,
  ];
}
