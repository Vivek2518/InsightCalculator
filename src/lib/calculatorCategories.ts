// Helper utilities for calculator categories and routing

export const TOP_CATEGORIES = [
  "aerospace",
  "drone",
] as const;

export type TopCategoryKey = (typeof TOP_CATEGORIES)[number];

export const SUBCATEGORIES = [
  "atmosphere",
  "structures",
  "propulsion",
  "flight-mechanics",
  "orbital-mechanics",
  "flight-time-energy",
] as const;

export type SubCategoryKey = (typeof SUBCATEGORIES)[number];

export type CalculatorCategoryKey = TopCategoryKey | SubCategoryKey;

export const CATEGORY_DISPLAY_NAME: Record<CalculatorCategoryKey, string> = {
  // Top-level categories
  aerospace: "Aerospace",
  drone: "Drones",

  // Subcategories
  atmosphere: "Aerodynamics",
  structures: "Structures",
  propulsion: "Propulsion",
  "flight-mechanics": "Flight Mechanics",
  "orbital-mechanics": "Space",
  "flight-time-energy": "Drones",
};

// Maps old subcategories to top-level categories
const SUBCATEGORY_TO_TOP: Record<SubCategoryKey, TopCategoryKey> = {
  atmosphere: "aerospace",
  structures: "aerospace",
  propulsion: "aerospace",
  "flight-mechanics": "aerospace",
  "orbital-mechanics": "aerospace",
  "flight-time-energy": "drone",
};

// Mapping from calculator slug -> subcategory (based on SEO grouping rules)
const SLUG_TO_SUBCATEGORY: Record<string, SubCategoryKey> = {
  // Aerodynamics (atmosphere)
  "mach-number": "atmosphere",
  "speed-of-sound": "atmosphere",
  "air-density": "atmosphere",
  "pressure-vs-altitude": "atmosphere",
  "temperature-lapse-rate": "atmosphere",

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

  // Space (orbital-mechanics)
  "escape-velocity": "orbital-mechanics",
  "orbital-velocity": "orbital-mechanics",
  "orbital-period": "orbital-mechanics",
  "circular-orbit-speed": "orbital-mechanics",

  // Drones
  "drone-flight-time": "flight-time-energy",
  "battery-capacity-converter": "flight-time-energy",
  "power-consumption": "flight-time-energy",
  "motor-efficiency": "flight-time-energy",
  "energy-density": "flight-time-energy",
  "hover-power": "flight-time-energy",
  "battery-discharge-rate": "flight-time-energy",
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
  const topCategory = getTopCategoryForSlug(slug);
  const subCategory = getSubCategoryForSlug(slug);
  const calculatorSegment = slug.endsWith("-calculator") ? slug : `${slug}-calculator`;
  if (subCategory && subCategory !== topCategory) {
    return `/calculators/${topCategory}/${subCategory}/${calculatorSegment}`;
  }
  return `/calculators/${topCategory}/${calculatorSegment}`;
}

export function getCategoryPath(category: string): string {
  const normalized = category?.trim().toLowerCase();

  // Top-level category
  if (TOP_CATEGORIES.includes(normalized as TopCategoryKey)) {
    return `/calculators/${normalized}`;
  }

  // Subcategory
  if (SUBCATEGORIES.includes(normalized as SubCategoryKey)) {
    const top = SUBCATEGORY_TO_TOP[normalized as SubCategoryKey];
    return `/calculators/${top}/${normalized}`;
  }

  // Fallback
  return `/calculators/${normalized}`;
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
  "atmosphere",
  "structures",
  "propulsion",
  "flight-mechanics",
  "orbital-mechanics",
  "flight-time-energy",
];
