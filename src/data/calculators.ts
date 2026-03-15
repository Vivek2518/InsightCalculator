export type CalculatorCategory =
  | "Finance"
  | "Investment"
  | "Tax"
  | "Savings"
  | "Government"
  | "Creator Economy"
  | "Business";

export type Calculator = {
  slug: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  popular?: boolean;
  added: string; // ISO date
  tags?: string[];
};

export const calculators: Calculator[] = [
  // Finance Calculators
  {
    slug: "home-loan-emi",
    name: "Home Loan EMI Calculator",
    description: "Estimate monthly EMI payments for home loans.",
    category: "Finance",
    popular: true,
    added: "2026-02-01",
    tags: ["emi", "loan", "home"],
  },
  {
    slug: "personal-loan-emi",
    name: "Personal Loan EMI Calculator",
    description: "Calculate EMI for personal loans across rates and tenures.",
    category: "Finance",
    added: "2026-02-07",
    tags: ["emi", "loan", "personal"],
  },
  {
    slug: "car-loan-emi",
    name: "Car Loan EMI Calculator",
    description: "Find out your car loan monthly installments.",
    category: "Finance",
    added: "2026-02-10",
    tags: ["emi", "loan", "car"],
  },
  {
    slug: "education-loan-emi",
    name: "Education Loan EMI Calculator",
    description: "Plan education loan payments with interest and tenure.",
    category: "Finance",
    added: "2026-02-12",
    tags: ["emi", "loan", "education"],
  },
  {
    slug: "loan-eligibility",
    name: "Loan Eligibility Calculator",
    description: "Estimate your loan eligibility based on income & expenses.",
    category: "Finance",
    added: "2026-02-15",
    tags: ["eligibility", "loan"],
  },
  {
    slug: "loan-interest-rate",
    name: "Loan Interest Rate Calculator",
    description: "Compare interest costs across different loan rates.",
    category: "Finance",
    added: "2026-02-18",
    tags: ["interest", "loan"],
  },

  // Investment Calculators
  {
    slug: "sip",
    name: "SIP Calculator",
    description: "Plan your systematic investment plan returns.",
    category: "Investment",
    popular: true,
    added: "2026-01-20",
    tags: ["sip", "mutual fund", "investment"],
  },
  {
    slug: "lumpsum-investment",
    name: "Lumpsum Investment Calculator",
    description: "Project the future value of a one-time investment.",
    category: "Investment",
    added: "2026-01-22",
    tags: ["lumpsum", "investment"],
  },
  {
    slug: "mutual-fund-return",
    name: "Mutual Fund Return Calculator",
    description: "Estimate returns from mutual funds over time.",
    category: "Investment",
    added: "2026-01-25",
    tags: ["mutual fund", "return"],
  },
  {
    slug: "cagr",
    name: "CAGR Calculator",
    description: "Calculate compound annual growth rate for investments.",
    category: "Investment",
    added: "2026-01-28",
    tags: ["cagr", "growth"],
  },
  {
    slug: "swp",
    name: "SWP Calculator",
    description: "Plan systematic withdrawal plan from investments.",
    category: "Investment",
    added: "2026-01-30",
    tags: ["swp", "withdrawal"],
  },
  {
    slug: "step-up-sip",
    name: "Step-Up SIP Calculator",
    description: "Model SIPs with periodic increase in contributions.",
    category: "Investment",
    added: "2026-02-02",
    tags: ["sip", "step-up"],
  },

  // Tax Calculators
  {
    slug: "income-tax",
    name: "Income Tax Calculator",
    description: "Compare old vs new tax regimes for salaried individuals.",
    category: "Tax",
    popular: true,
    added: "2026-01-05",
    tags: ["tax", "income"],
  },
  {
    slug: "gst",
    name: "GST Calculator",
    description: "Compute GST amounts for invoices and billing.",
    category: "Tax",
    popular: true,
    added: "2026-01-08",
    tags: ["gst", "tax"],
  },
  {
    slug: "hra",
    name: "HRA Calculator",
    description: "Estimate HRA exemption based on rent and salary.",
    category: "Tax",
    added: "2026-01-10",
    tags: ["hra", "tax"],
  },
  {
    slug: "capital-gains",
    name: "Capital Gains Tax Calculator",
    description: "Calculate tax on capital gains for assets.",
    category: "Tax",
    added: "2026-01-12",
    tags: ["capital gains", "tax"],
  },
  {
    slug: "tds",
    name: "TDS Calculator",
    description: "Estimate tax deducted at source for payments.",
    category: "Tax",
    added: "2026-01-15",
    tags: ["tds", "tax"],
  },

  // Savings Calculators
  {
    slug: "fd",
    name: "Fixed Deposit (FD) Calculator",
    description: "Estimate maturity amount of fixed deposits.",
    category: "Savings",
    added: "2026-01-18",
    tags: ["fd", "interest"],
  },
  {
    slug: "rd",
    name: "Recurring Deposit (RD) Calculator",
    description: "Compute returns on recurring deposits.",
    category: "Savings",
    added: "2026-01-20",
    tags: ["rd", "interest"],
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    description: "See how your investment grows with compounding.",
    category: "Savings",
    added: "2026-01-22",
    tags: ["compound", "interest"],
  },
  {
    slug: "inflation",
    name: "Inflation Calculator",
    description: "Understand purchasing power changes over time.",
    category: "Savings",
    added: "2026-01-25",
    tags: ["inflation", "savings"],
  },

  // Government Scheme Calculators
  {
    slug: "ppf",
    name: "PPF Calculator",
    description: "Project returns from Public Provident Fund investments.",
    category: "Government",
    added: "2026-01-28",
    tags: ["ppf", "scheme"],
  },
  {
    slug: "nps",
    name: "NPS Calculator",
    description: "Estimate growth of National Pension Scheme investments.",
    category: "Government",
    added: "2026-01-30",
    tags: ["nps", "pension"],
  },
  {
    slug: "gratuity",
    name: "Gratuity Calculator",
    description: "Calculate gratuity based on salary and service years.",
    category: "Government",
    added: "2026-02-01",
    tags: ["gratuity", "retirement"],
  },
  {
    slug: "epf",
    name: "EPF Calculator",
    description: "Estimate employee provident fund accumulation.",
    category: "Government",
    added: "2026-02-03",
    tags: ["epf", "retirement"],
  },

  // Creator Economy Calculators
  {
    slug: "youtube-money",
    name: "YouTube Money Calculator",
    description: "Estimate earnings based on views and RPM.",
    category: "Creator Economy",
    popular: true,
    added: "2026-02-05",
    tags: ["youtube", "creator"],
  },
  {
    slug: "instagram-engagement",
    name: "Instagram Engagement Rate Calculator",
    description: "Measure engagement percentage for your posts.",
    category: "Creator Economy",
    added: "2026-02-07",
    tags: ["instagram", "engagement"],
  },
  {
    slug: "youtube-thumbnail-ctr",
    name: "YouTube Thumbnail CTR Calculator",
    description: "Estimate click-through-rate impact from thumbnails.",
    category: "Creator Economy",
    added: "2026-02-09",
    tags: ["youtube", "ctr"],
  },
  {
    slug: "influencer-earnings",
    name: "Influencer Earnings Calculator",
    description: "Project earnings based on audience and rates.",
    category: "Creator Economy",
    added: "2026-02-11",
    tags: ["influencer", "earnings"],
  },
  {
    slug: "affiliate-commission",
    name: "Affiliate Commission Calculator",
    description: "Calculate affiliate payouts via conversion rate.",
    category: "Creator Economy",
    added: "2026-02-13",
    tags: ["affiliate", "commission"],
  },

  // Business / Startup Calculators
  {
    slug: "freelance-hourly-rate",
    name: "Freelance Hourly Rate Calculator",
    description: "Set rates by covering costs and desired income.",
    category: "Business",
    added: "2026-02-15",
    tags: ["freelance", "rate"],
  },
  {
    slug: "startup-runway",
    name: "Startup Runway Calculator",
    description: "Show months of runway before funds run out.",
    category: "Business",
    added: "2026-02-17",
    tags: ["runway", "startup"],
  },
  {
    slug: "saas-revenue",
    name: "SaaS Revenue Calculator",
    description: "Estimate monthly recurring revenue and growth.",
    category: "Business",
    added: "2026-02-19",
    tags: ["saas", "revenue"],
  },
  {
    slug: "break-even",
    name: "Break-even Calculator",
    description: "Determine when revenue covers costs.",
    category: "Business",
    added: "2026-02-21",
    tags: ["break-even", "business"],
  },
  {
    slug: "income-split",
    name: "Income Split Calculator",
    description: "Split earnings across collaborators or partners.",
    category: "Business",
    added: "2026-02-23",
    tags: ["income", "split"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate your exact age in years, months, and days.",
    category: "Business",
    added: "2026-03-15",
    tags: ["age", "date"],
  },
  {
    slug: "test-grade-calculator",
    name: "Test Grade Calculator",
    description: "Compute percentage score and letter grade from test results.",
    category: "Business",
    added: "2026-03-15",
    tags: ["grade", "percentage"],
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    description: "Calculate the average of a list of numbers.",
    category: "Business",
    added: "2026-03-15",
    tags: ["average", "mean"],
  },
  {
    slug: "overtime-pay-calculator",
    name: "Overtime Pay Calculator",
    description: "Estimate pay for overtime hours based on rate and multiplier.",
    category: "Business",
    added: "2026-03-15",
    tags: ["overtime", "pay"],
  },
  {
    slug: "margin-calculator",
    name: "Margin Calculator",
    description: "Calculate profit margin based on cost and selling price.",
    category: "Business",
    added: "2026-03-15",
    tags: ["margin", "profit"],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    description: "Estimate daily calorie needs based on BMR and activity level.",
    category: "Business",
    added: "2026-03-15",
    tags: ["calorie", "bmr"],
  },
];

export const categories: { name: CalculatorCategory; description: string }[] = [
  {
    name: "Finance",
    description: "Tools for loans, interest and eligibility.",
  },
  {
    name: "Investment",
    description: "Plan and track your investment growth.",
  },
  {
    name: "Tax",
    description: "Calculate taxes, deductions and compliance.",
  },
  {
    name: "Savings",
    description: "Grow savings with interest and inflation tools.",
  },
  {
    name: "Government",
    description: "Government scheme trackers and projection tools.",
  },
  {
    name: "Creator Economy",
    description: "Tools for creators to price and measure performance.",
  },
  {
    name: "Business",
    description: "Financial planning tools for startups and freelancers.",
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
