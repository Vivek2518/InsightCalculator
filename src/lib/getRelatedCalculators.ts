import { getAllCalculators } from "@/lib/loadCalculator";
import { getTopCategoryForSlug } from "@/lib/calculatorCategories";

/**
 * Get related calculators based on category, tags, and similarity
 * Used for internal linking and user navigation
 * 
 * @param currentSlug - The slug of the current calculator
 * @param category - The category of the current calculator
 * @param limit - Maximum number of related calculators to return (default 4)
 * @returns Array of related calculator slugs with metadata
 */
export async function getRelatedCalculators(
  currentSlug: string,
  category: string,
  limit: number = 4
): Promise<
  Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
  }>
> {
  try {
    // Load all calculators once; this is cached in production
    const allConfigs = await getAllCalculators();

    const otherConfigs = allConfigs.filter((config) => config.slug !== currentSlug);

    const scored = otherConfigs.map((config) => {
      let score = 0;

      // Same category - highest priority (score: 10)
      if (config.category === category) {
        score += 10;
      }

      // Related categories (score: 5)
      if (isRelatedCategory(category, config.category)) {
        score += 5;
      }

      // Popular calculators boost (score: 2)
      if (config.popular) {
        score += 2;
      }

      return { ...config, score };
    });

    const related = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ slug, name, description, category }) => ({
        slug,
        name,
        description,
        category,
      }));

    return related;
  } catch (error) {
    console.error("Error fetching related calculators:", error);
    return [];
  }
}

/**
 * Determine if two categories are related
 * Used to suggest calculators from related financial areas
 */
function isRelatedCategory(category1: string, category2: string): boolean {
  const relatedGroups = [
    ["loans", "investment", "savings"],
    ["tax", "government"],
    ["business", "creator"],
    ["utility", "health"],
  ];

  return relatedGroups.some(
    (group) => group.includes(category1) && group.includes(category2)
  );
}

/**
 * Get calculators by category for discovery pages
 * @param category - The category to filter by
 * @param limit - Maximum number to return
 */
export async function getCalculatorsByCategory(
  category: string,
  limit: number = 6
): Promise<
  Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
  }>
> {
  try {
    const allConfigs = await getAllCalculators();
    const filteredConfigs = allConfigs.filter((config) => config.category === category);

    return filteredConfigs
      .slice(0, limit)
      .map((config) => ({
        slug: config.slug,
        name: config.name,
        description: config.description,
        category: config.category,
      }));
  } catch (error) {
    console.error("Error fetching category calculators:", error);
    return [];
  }
}

/**
 * Get popular calculators for homepage
 * @param limit - Maximum number to return
 */
export async function getPopularCalculators(
  limit: number = 6
): Promise<
  Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
  }>
> {
  try {
    const allConfigs = await getAllCalculators();
    const popularConfigs = allConfigs.filter((config) => {
      const topCategory = getTopCategoryForSlug(config.slug);
      return config.popular === true && topCategory === "aerospace";
    });

    return popularConfigs
      .slice(0, limit)
      .map((config) => ({
        slug: config.slug,
        name: config.name,
        description: config.description,
        category: config.category,
      }));
  } catch (error) {
    console.error("Error fetching popular calculators:", error);
    return [];
  }
}

/**
 * Search calculators by keyword
 * @param query - Search query
 * @param limit - Maximum number to return
 */
export async function searchCalculators(
  query: string,
  limit: number = 10
): Promise<
  Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
  }>
> {
  try {
    const allConfigs = await getAllCalculators();
    const queryLower = query.toLowerCase();

    const validConfigs = allConfigs.filter((config) => {
      return (
        config.name.toLowerCase().includes(queryLower) ||
        config.description.toLowerCase().includes(queryLower) ||
        config.category.toLowerCase().includes(queryLower) ||
        (config.tags && config.tags.some((tag) => tag.toLowerCase().includes(queryLower)))
      );
    });

    return validConfigs
      .slice(0, limit)
      .map((config) => ({
        slug: config.slug,
        name: config.name,
        description: config.description,
        category: config.category,
      }));
  } catch (error) {
    console.error("Error searching calculators:", error);
    return [];
  }
}

