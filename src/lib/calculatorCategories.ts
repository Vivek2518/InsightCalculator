// Helper utilities for the live aerospace route structure.

export const TOP_CATEGORIES = ["aerospace"] as const;

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
  aerospace: "Aerospace",
  aerodynamics: "Aerodynamics",
  structures: "Structures",
  propulsion: "Propulsion",
  "flight-mechanics": "Flight Mechanics",
  space: "Space",
  drone: "Drones",
};

export function getCategoryPath(category: string): string {
  const normalized = category.trim().toLowerCase();

  if (normalized === "aerospace") {
    return "/aerospace";
  }

  if (SUBCATEGORIES.includes(normalized as SubCategoryKey)) {
    return `/aerospace/${normalized}`;
  }

  return "/aerospace";
}

export function formatCategoryName(category: string): string {
  const key = category as CalculatorCategoryKey;
  if (CATEGORY_DISPLAY_NAME[key]) {
    return CATEGORY_DISPLAY_NAME[key];
  }

  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const CATEGORY_ORDER: CalculatorCategoryKey[] = [
  "aerospace",
  "aerodynamics",
  "structures",
  "propulsion",
  "flight-mechanics",
  "space",
  "drone",
];
