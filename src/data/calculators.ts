export type CalculatorCategory = string;

export type Calculator = {
  slug: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  popular?: boolean;
  added: string; // ISO date
  tags?: string[];
};

export const calculators: Calculator[] = [];

export const categories: { name: CalculatorCategory; description: string }[] = [
  {
    name: "loans",
    description: "Loan calculators for EMIs, eligibility, and interest.",
  },
  {
    name: "investment",
    description: "Tools to model and forecast investment returns.",
  },
  {
    name: "savings",
    description: "Calculate savings growth and inflation impact.",
  },
  {
    name: "tax",
    description: "Tax planning and compliance calculators.",
  },
  {
    name: "government",
    description: "Government scheme and retirement planning tools.",
  },
  {
    name: "aerospace",
    description: "Aerospace and flight calculators for aircraft and orbital mechanics.",
  },
  {
    name: "drone",
    description: "Drone calculators for flight time, power, energy, and battery management.",
  },
  {
    name: "creator",
    description: "Creator economy tools for earnings and engagement.",
  },
  {
    name: "business",
    description: "Business planning tools for startups and freelancers.",
  },
  {
    name: "utility",
    description: "Everyday utility calculators for quick checks.",
  },
  {
    name: "income",
    description: "Salary and income calculators for payroll and paychecks.",
  },
  {
    name: "health",
    description: "Health and wellness calculators.",
  },
];

// NOTE: Calculator loading and discovery now uses:
// - @/lib/loadCalculator (for JSON config loading)
// - @/lib/getRelatedCalculators (for related/popular/search queries)
//
// The helper functions below operate on the static calculators array
// and are used by components for basic metadata lookup.

export function getCalculatorBySlug(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}

export function getRecentCalculators(limit = 6) {
  return calculators
    .slice()
    .sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
    .slice(0, limit);
}
