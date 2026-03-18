// Helper utilities for calculator categories and routing

export const TOP_CATEGORIES = [
  "finance",
  "creator",
  "health",
  "math",
  "physics",
  "aerospace",
  "drone",
  "everyday",
] as const;

export type TopCategoryKey = (typeof TOP_CATEGORIES)[number];

export const SUBCATEGORIES = [
  "loans",
  "investment",
  "savings",
  "tax",
  "government",
  "business",
  "income",
  "utility",
  "creator",
  "health",
  "dietary",
  "bmi",
  "math",
  "atmosphere",
  "flight-mechanics",
  "propulsion",
  "orbital-mechanics",
  "flight-time-energy",
] as const;

export type SubCategoryKey = (typeof SUBCATEGORIES)[number];

export type CalculatorCategoryKey = TopCategoryKey | SubCategoryKey;

export const CATEGORY_DISPLAY_NAME: Record<CalculatorCategoryKey, string> = {
  // Top-level categories
  finance: "Finance ",
  creator: "Creator Economy ",
  health: "Health ",
  math: "Math ",
  physics: "Physics ",
  aerospace: "Aerospace ",
  drone: "Drone ",
  everyday: "Everyday",

  // Subcategories
  loans: "Loan Calculators",
  investment: "Investment Calculators",
  savings: "Savings Calculators",
  tax: "Tax Calculators",
  government: "Government Scheme Calculators",
  business: "Business Calculators",
  income: "Income & Salary Calculators",
  utility: "Utility Calculators",
  dietary: "Dietary calculators 🥗",
  bmi: "BMI Calculators",
  atmosphere: "Atmosphere & Flight Basics",
  "flight-mechanics": "Flight Mechanics (Aircraft)",
  propulsion: "Rocket & Propulsion Basics",
  "orbital-mechanics": "Orbital Mechanics (Space Basics)",
  "flight-time-energy": "Flight Time & Energy",
};

// Maps old subcategories to top-level categories
const SUBCATEGORY_TO_TOP: Record<SubCategoryKey, TopCategoryKey> = {
  loans: "finance",
  investment: "finance",
  savings: "finance",
  tax: "finance",
  government: "finance",
  business: "finance",
  income: "finance",
  utility: "everyday",
  creator: "creator",
  health: "health",
  dietary: "health",
  bmi: "health",
  math: "math",
  atmosphere: "aerospace",
  "flight-mechanics": "aerospace",
  propulsion: "aerospace",
  "orbital-mechanics": "aerospace",
  "flight-time-energy": "drone",
};

// Mapping from calculator slug -> subcategory (based on SEO grouping rules)
const SLUG_TO_SUBCATEGORY: Record<string, SubCategoryKey> = {
  // loans
  "car-loan-emi": "loans",
  "home-loan-emi": "loans",
  "personal-loan-emi": "loans",
  "education-loan-emi": "loans",
  "loan-eligibility": "loans",
  "loan-interest-rate": "loans",
  "emi-calculator": "loans",
  "loan-amortization-calculator": "loans",
  "credit-card-emi-calculator": "loans",
  "interest-rate-calculator": "loans",
  "prepayment-calculator": "loans",

  // investment
  sip: "investment",
  "step-up-sip": "investment",
  swp: "investment",
  "mutual-fund-return": "investment",
  "lumpsum-investment": "investment",
  cagr: "investment",
  "stock-return-calculator": "investment",
  "dividend-yield-calculator": "investment",
  "retirement-corpus-calculator": "investment",
  "inflation-adjusted-return-calculator": "investment",
  "portfolio-return-calculator": "investment",

  // savings
  fd: "savings",
  rd: "savings",
  "compound-interest": "savings",
  inflation: "savings",

  // tax
  "income-tax": "tax",
  gst: "tax",
  hra: "tax",
  "capital-gains": "tax",
  tds: "tax",

  // government
  epf: "government",
  ppf: "government",
  nps: "government",
  gratuity: "government",

  // business
  "break-even": "business",
  "margin-calculator": "business",
  "saas-revenue": "business",
  "startup-runway": "business",
  "freelance-hourly-rate": "business",
  "income-split": "business",

  // creator
  "youtube-money": "creator",
  "youtube-thumbnail-ctr": "creator",
  "influencer-earnings": "creator",
  "affiliate-commission": "creator",
  "instagram-engagement": "creator",

  // utility (everyday tools)
  "age-calculator": "utility",
  "average-calculator": "utility",
  "test-grade-calculator": "utility",
  "percentage-calculator": "utility",
  "discount-calculator": "utility",
  "date-difference-calculator": "utility",
  "time-duration-calculator": "utility",
  "average-percentage-calculator": "utility",
  "ratio-calculator": "utility",

  // income (within finance)
  "overtime-pay-calculator": "income",
  "salary-hike-calculator": "income",
  "take-home-salary-calculator": "income",
  "in-hand-salary-calculator": "income",
  "overtime-calculator": "income",
  "hourly-to-salary-calculator": "income",

  // health
  "calorie-calculator": "dietary",
  "bmi": "bmi",
  "bmi-kids": "bmi",
  "bmi-men": "bmi",
  "bmi-teens": "bmi",
  "bmi-women": "bmi",
  "bmi-weight-loss": "bmi",
  "bmi-geriatric": "bmi",

  // aerospace / flight
  "mach-number": "atmosphere",
  "speed-of-sound": "atmosphere",
  "air-density": "atmosphere",
  "pressure-vs-altitude": "atmosphere",
  "temperature-lapse-rate": "atmosphere",

  "lift-force": "flight-mechanics",
  "drag-force": "flight-mechanics",
  "lift-to-drag-ratio": "flight-mechanics",
  "stall-speed": "flight-mechanics",
  "wing-loading": "flight-mechanics",
  "glide-ratio": "flight-mechanics",

  "thrust": "propulsion",
  "thrust-to-weight": "propulsion",
  "fuel-consumption": "propulsion",
  "specific-impulse": "propulsion",

  "escape-velocity": "orbital-mechanics",
  "orbital-velocity": "orbital-mechanics",
  "orbital-period": "orbital-mechanics",
  "circular-orbit-speed": "orbital-mechanics",

  // drone / flight-time-energy
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
  "finance",
  "creator",
  "health",
  "math",
  "physics",
  "aerospace",
  "drone",
  "atmosphere",
  "flight-mechanics",
  "propulsion",
  "orbital-mechanics",
  "flight-time-energy",
  "everyday",
  "loans",
  "investment",
  "savings",
  "tax",
  "government",
  "business",
  "income",
  "utility",
  "dietary",
  "bmi",
];
