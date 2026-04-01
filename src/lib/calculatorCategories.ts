// Helper utilities for calculator categories and routing

export const TOP_CATEGORIES = [
  "aerospace",
] as const;

export type TopCategoryKey = (typeof TOP_CATEGORIES)[number];

export const SUBCATEGORIES = [
  "aerodynamics",
  "structures",
  "propulsion",
  "flight-mechanics",
  "space",
  "drone",
] as const;

export type SubCategoryKey = (typeof SUBCATEGORIES)[number];

export type CalculatorCategoryKey = TopCategoryKey | SubCategoryKey;

export const CATEGORY_DISPLAY_NAME: Record<CalculatorCategoryKey, string> = {
  // Top-level categories
  aerospace: "Aerospace",
  drone: "Drones",

  // Subcategories
  aerodynamics: "Aerodynamics",
  structures: "Structures",
  propulsion: "Propulsion",
  "flight-mechanics": "Flight Mechanics",
  space: "Space",
  drone: "Drones",
};

// Maps old subcategories to top-level categories
const SUBCATEGORY_TO_TOP: Record<SubCategoryKey, TopCategoryKey> = {
  aerodynamics: "aerospace",
  structures: "aerospace",
  propulsion: "aerospace",
  "flight-mechanics": "aerospace",
  space: "aerospace",
  drone: "aerospace",
};

// Mapping from calculator slug -> subcategory (based on SEO grouping rules)
const SLUG_TO_SUBCATEGORY: Record<string, SubCategoryKey> = {
  // Aerodynamics
  "mach-number": "aerodynamics",
  "speed-of-sound": "aerodynamics",
  "air-density": "aerodynamics",
  "pressure-vs-altitude": "aerodynamics",
  "temperature-lapse-rate": "aerodynamics",

  // Flight Mechanics
  "lift-force": "flight-mechanics",
  "drag-force": "flight-mechanics",
  "lift-to-drag-ratio": "flight-mechanics",
  "stall-speed": "flight-mechanics",
  "wing-loading": "flight-mechanics",
  "glide-ratio": "flight-mechanics",

  // Propulsion
  "thrust": "propulsion",
  "thrust-to-weight": "propulsion",
  "fuel-consumption": "propulsion",
  "specific-impulse": "propulsion",

  // Space
  "escape-velocity": "space",
  "orbital-velocity": "space",
  "orbital-period": "space",
  "circular-orbit-speed": "space",

  // Structures
  "wing-aspect-ratio": "structures",
  "structural-load-factor": "structures",

  // Drones
  "drone-flight-time": "drone",
  "battery-capacity-converter": "drone",
  "power-consumption": "drone",
  "motor-efficiency": "drone",
  "energy-density": "drone",
  "hover-power": "drone",
  "battery-discharge-rate": "drone",
};

export function getSubCategoryForSlug(slug: string): SubCategoryKey | undefined {
  const normalized = slug?.trim().toLowerCase();
  return SLUG_TO_SUBCATEGORY[normalized];
}

export function getTopCategoryForSlug(slug: string): TopCategoryKey {
  const normalized = slug?.trim().toLowerCase();
  const subCategory = getSubCategoryForSlug(normalized);
  if (subCategory && SUBCATEGORY_TO_TOP[subCategory]) {
    return SUBCATEGORY_TO_TOP[subCategory];
  }

  // If the slug itself matches a top category, return it
  if (TOP_CATEGORIES.includes(normalized as TopCategoryKey)) {
    return normalized as TopCategoryKey;
  }

  // Default to everyday for unknown slugs
  return "everyday";
}

export function getCategoryForSlug(slug: string): TopCategoryKey {
  return getTopCategoryForSlug(slug);
}

export function isValidCategory(category: string): category is TopCategoryKey {
  const normalized = category?.trim().toLowerCase();
  return TOP_CATEGORIES.includes(normalized as TopCategoryKey);
}

export function getCalculatorPathFromSlug(slug: string): string {
  const subCategory = getSubCategoryForSlug(slug);
  const topCategory = getTopCategoryForSlug(slug);
  const category = subCategory || topCategory;
  const calculatorSegment = slug.endsWith("-calculator") ? slug : `${slug}-calculator`;
  
  if (category && category !== "everyday") {
    return `/${category}/${calculatorSegment}`;
  }
  return `/everyday/${calculatorSegment}`;
}

export function getCategoryPath(category: string): string {
  const normalized = category?.trim().toLowerCase();

  // New Aerospace hierarchy
  if (normalized === "aerospace") {
    return "/aerospace";
  }
  if (SUBCATEGORIES.includes(normalized as SubCategoryKey)) {
    return `/aerospace/${normalized}`;
  }

  // Subcategory or Top-level category
  if (SUBCATEGORIES.includes(normalized as SubCategoryKey) || TOP_CATEGORIES.includes(normalized as TopCategoryKey)) {
    return `/${normalized}`;
  }

  // Fallback
  return `/${normalized}`;
}

export function formatCategoryName(category: string): string {
  const key = category as CalculatorCategoryKey;
  if (CATEGORY_DISPLAY_NAME[key]) {
    return CATEGORY_DISPLAY_NAME[key];
  }
  // Fallback: capitalise and add "Calculators"
  const formatted = category
    .toString()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return `${formatted} Calculators`;
}

export const CATEGORY_ORDER: (TopCategoryKey | SubCategoryKey)[] = [
  "aerospace",
  "drone",
  "aerodynamics",
  "structures",
  "propulsion",
  "flight-mechanics",
  "space",
];
