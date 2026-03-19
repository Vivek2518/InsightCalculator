/**
 * Calculator Loader
 * Dynamically loads calculator configurations from JSON files in src/calculators
 */

import { promises as fs } from "fs";
import { join, basename } from "path";
import {
  getTopCategoryForSlug,
  getSubCategoryForSlug,
  getCalculatorPathFromSlug,
} from "@/lib/calculatorCategories";

export interface CalculatorField {
  key: string;
  label: string;
  type: "number" | "percentage" | "text" | "date" | "select";
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
}

export interface CalculatorOutput {
  key: string;
  label: string;
  format: "currency" | "percentage" | "number" | "text";
}

export interface CalculatorExample {
  inputs: Record<string, any>;
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
  path: string;
  subcategory?: string;
  popular?: boolean;
  tags?: string[];
  fields: CalculatorField[];
  formula: string;
  formulaDescription?: string;
  introduction?: string;
  eligibilityCriteria?: string;
  calculationNotes?: string[];
  benefits?: string[];
  howToUse?: string[];
  computationType: string;
  computeParams?: Record<string, string>;
  outputs: CalculatorOutput[];
  example: CalculatorExample;
  faqs: CalculatorFAQ[];
}

/**
 * Validate a calculator configuration object
 */
function validateCalculatorConfig(config: any): config is CalculatorConfig {
  if (!config || typeof config !== 'object') return false;

  // Required string fields
  const requiredStrings = ['slug', 'name', 'description', 'category', 'formula', 'computationType'];
  for (const field of requiredStrings) {
    if (typeof config[field] !== 'string' || !config[field].trim()) return false;
  }

  // Required arrays
  const requiredArrays = ['fields', 'outputs', 'faqs'];
  for (const field of requiredArrays) {
    if (!Array.isArray(config[field]) || config[field].length === 0) return false;
  }

  // Validate fields array
  for (const field of config.fields) {
    if (
      !field.key ||
      !field.label ||
      !["number", "percentage", "text", "date", "select"].includes(field.type)
    ) {
      return false;
    }
  }

  // Validate outputs array
  for (const output of config.outputs) {
    if (!output.key || !output.label || !['currency', 'percentage', 'number', 'text'].includes(output.format)) {
      return false;
    }
  }

  // Validate example
  if (!config.example || typeof config.example !== 'object' ||
      !config.example.inputs || !config.example.outputs || !config.example.explanation) {
    return false;
  }

  // Validate faqs
  for (const faq of config.faqs) {
    if (!faq.question || !faq.answer) return false;
  }

  return true;
}

// In-memory cache for calculator configurations
let calculatorCache: Record<string, CalculatorConfig> | null = null;

// In development we avoid long-lived cache so newly added JSON files show up without restarting.
const isProduction = process.env.NODE_ENV === "production";

/**
 * Load all calculator configurations from src/calculators
 * Caches them in memory for subsequent calls (production only).
 */
async function walkDir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadAllCalculators(): Promise<Record<string, CalculatorConfig>> {
  if (calculatorCache && isProduction) {
    return calculatorCache;
  }

  const dirPath = join(process.cwd(), "src", "calculators");
  const filePaths = await walkDir(dirPath);
  const cache: Record<string, CalculatorConfig> = {};

  for (const filePath of filePaths) {
    const slug = basename(filePath).replace('.json', '');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (validateCalculatorConfig(parsed)) {
        const category = getTopCategoryForSlug(slug);
        const subcategory = getSubCategoryForSlug(slug);
        cache[slug] = {
          ...parsed,
          slug,
          category,
          subcategory,
          path: getCalculatorPathFromSlug(slug),
        };
      } else {
        console.error(`Invalid calculator config for ${slug}: validation failed`);
      }
    } catch (error) {
      console.error(`Error loading calculator ${slug}:`, error);
    }
  }

  calculatorCache = cache;
  return cache;
}

/**
 * Load a calculator configuration by slug
 * Loads from src/calculators folder using filesystem
 */
export async function loadCalculator(slug: string): Promise<CalculatorConfig | null> {
  try {
    const allCalculators = await loadAllCalculators();
    return allCalculators[slug] || null;
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
  const allCalculators = await loadAllCalculators();
  return Object.keys(allCalculators);
}

/**
 * Load all calculators (for dynamic indexing, client-side search, etc.)
 * Use sparingly - typically only for server-side operations at build time
 */
export async function getAllCalculators(): Promise<CalculatorConfig[]> {
  const allCalculators = await loadAllCalculators();
  return Object.values(allCalculators);
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
    path: config.path,
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
