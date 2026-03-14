/**
 * Calculator Loader
 * Dynamically loads calculator configurations from JSON files
 */

export interface CalculatorField {
  key: string;
  label: string;
  type: "number" | "percentage" | "text" | "select";
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
}

export interface CalculatorOutput {
  key: string;
  label: string;
  format: "currency" | "percentage" | "number";
}

export interface CalculatorExample {
  inputs: Record<string, number>;
  outputs: Record<string, any>;
  explanation: string;
}

export interface CalculatorFAQ {
  question: string;
  answer: string;
}

export interface CalculatorConfig {
  slug: string;
  name: string;
  description: string;
  category: string;
  popular?: boolean;
  tags?: string[];
  fields: CalculatorField[];
  formula: string;
  formulaDescription?: string;
  computationType: string;
  computeParams?: Record<string, string>;
  outputs: CalculatorOutput[];
  example: CalculatorExample;
  faqs: CalculatorFAQ[];
}

/**
 * Load a calculator configuration by slug
 * Fetches from the public/calculators folder
 */
export async function loadCalculator(slug: string): Promise<CalculatorConfig | null> {
  try {
    // Prefer reading from disk when running on the server (build/runtime).
    // This avoids relying on runtime network fetches and avoids needing
    // a correct base URL in environments like Vercel.
    if (typeof window === "undefined") {
      try {
        const { readFile } = await import("fs/promises");
        const { join } = await import("path");
        const filePath = join(process.cwd(), "public", "calculators", `${slug}.json`);
        const fileContents = await readFile(filePath, "utf-8");
        return JSON.parse(fileContents) as CalculatorConfig;
      } catch (fsError) {
        // Fallback to fetching from the public folder if reading from disk fails
        // (e.g., edge runtime or restricted environments).
        console.warn(
          `Failed to read calculator config from disk for ${slug}, falling back to fetch.`,
          fsError
        );
      }
    }

    // In browser/runtime environments (or as a fallback), fetch the JSON from the public folder.
    const response = await fetch(`/calculators/${slug}.json`, {
      cache: "force-cache", // Cache indefinitely since these are static files
    });

    if (!response.ok) {
      console.warn(`Calculator not found: ${slug}`);
      return null;
    }

    const config: CalculatorConfig = await response.json();
    return config;
  } catch (error) {
    console.error(`Error loading calculator config for ${slug}:`, error);
    return null;
  }
}

/**
 * Load all calculator slugs for metadata generation
 * Can be used in generateStaticParams
 */
export async function getAllCalculatorSlugs(): Promise<string[]> {
  // This would typically be generated at build time by scanning the public/calculators folder
  // For now, return a list of all known calculator slugs
  // In production, you might fetch from a manifest file
  return [
    "home-loan-emi",
    "personal-loan-emi",
    "car-loan-emi",
    "education-loan-emi",
    "loan-eligibility",
    "loan-interest-rate",
    "sip",
    "lumpsum-investment",
    "mutual-fund-return",
    "cagr",
    "swp",
    "step-up-sip",
    "income-tax",
    "gst",
    "hra",
    "capital-gains",
    "tds",
    "fd",
    "rd",
    "compound-interest",
    "inflation",
    "ppf",
    "nps",
    "gratuity",
    "epf",
    "youtube-money",
    "instagram-engagement",
    "youtube-thumbnail-ctr",
    "influencer-earnings",
    "affiliate-commission",
    "freelance-hourly-rate",
    "startup-runway",
    "saas-revenue",
    "break-even",
    "income-split",
  ];
}

/**
 * Load all calculators (for dynamic indexing, client-side search, etc.)
 * Use sparingly - typically only for server-side operations at build time
 */
export async function getAllCalculators(): Promise<CalculatorConfig[]> {
  const slugs = await getAllCalculatorSlugs();
  const calculators: CalculatorConfig[] = [];

  for (const slug of slugs) {
    const calc = await loadCalculator(slug);
    if (calc) {
      calculators.push(calc);
    }
  }

  return calculators;
}

/**
 * Get calculator summary for listings (without heavy operations/compute functions)
 */
export async function getCalculatorSummary(slug: string) {
  const config = await loadCalculator(slug);
  if (!config) return null;

  return {
    slug: config.slug,
    name: config.name,
    description: config.description,
    category: config.category,
    popular: config.popular || false,
  };
}

/**
 * Search calculators by keyword
 */
export async function searchCalculators(query: string): Promise<CalculatorConfig[]> {
  const calculators = await getAllCalculators();
  const lowerQuery = query.toLowerCase();

  return calculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.description.toLowerCase().includes(lowerQuery) ||
      calc.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get calculators by category
 */
export async function getCalculatorsByCategory(
  category: string
): Promise<CalculatorConfig[]> {
  const calculators = await getAllCalculators();
  return calculators.filter((calc) => calc.category === category);
}

/**
 * Get popular calculators
 */
export async function getPopularCalculators(): Promise<CalculatorConfig[]> {
  const calculators = await getAllCalculators();
  return calculators.filter((calc) => calc.popular).slice(0, 10);
}
