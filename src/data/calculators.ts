export type CalculatorCategory =
  | "loans"
  | "investment"
  | "savings"
  | "tax"
  | "government"
  | "business"
  | "creator"
  | "utility"
  | "health"
  | "income"
  | "Finance"
  | "Investment"
  | "Tax"
  | "Savings"
  | "Government"
  | "Creator Economy";

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
    category: "loans",
    popular: true,
    added: "2026-02-01",
    tags: ["emi", "loan", "home"],
  },
  {
    slug: "personal-loan-emi",
    name: "Personal Loan EMI Calculator",
    description: "Calculate EMI for personal loans across rates and tenures.",
    category: "loans",
    added: "2026-02-07",
    tags: ["emi", "loan", "personal"],
  },
  {
    slug: "car-loan-emi",
    name: "Car Loan EMI Calculator",
    description: "Find out your car loan monthly installments.",
    category: "loans",
    added: "2026-02-10",
    tags: ["emi", "loan", "car"],
  },
  {
    slug: "education-loan-emi",
    name: "Education Loan EMI Calculator",
    description: "Plan education loan payments with interest and tenure.",
    category: "loans",
    added: "2026-02-12",
    tags: ["emi", "loan", "education"],
  },
  {
    slug: "loan-eligibility",
    name: "Loan Eligibility Calculator",
    description: "Estimate your loan eligibility based on income & expenses.",
    category: "loans",
    added: "2026-02-15",
    tags: ["eligibility", "loan"],
  },
  {
    slug: "loan-interest-rate",
    name: "Loan Interest Rate Calculator",
    description: "Compare interest costs across different loan rates.",
    category: "loans",
    added: "2026-02-18",
    tags: ["interest", "loan"],
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description: "Calculate the monthly EMI payment for a loan.",
    category: "loans",
    popular: true,
    added: "2026-03-16",
    tags: ["emi", "loan"],
  },
  {
    slug: "loan-amortization-calculator",
    name: "Loan Amortization Calculator",
    description: "Estimate your repayment schedule and total interest cost.",
    category: "loans",
    added: "2026-03-16",
    tags: ["amortization", "loan"],
  },
  {
    slug: "credit-card-emi-calculator",
    name: "Credit Card EMI Calculator",
    description: "Calculate EMI for credit card purchases converted into installments.",
    category: "loans",
    added: "2026-03-16",
    tags: ["credit card", "emi"],
  },
  {
    slug: "interest-rate-calculator",
    name: "Interest Rate Calculator",
    description: "Estimate the annual interest rate based on EMI, principal, and tenure.",
    category: "loans",
    added: "2026-03-16",
    tags: ["interest", "rate"],
  },
  {
    slug: "prepayment-calculator",
    name: "Prepayment Calculator",
    description: "See how a lump sum prepayment affects your loan balance.",
    category: "loans",
    added: "2026-03-16",
    tags: ["prepayment", "loan"],
  },

  // Investment Calculators
  {
    slug: "sip",
    name: "SIP Calculator",
    description: "Plan your systematic investment plan returns.",
    category: "investment",
    popular: true,
    added: "2026-01-20",
    tags: ["sip", "mutual fund", "investment"],
  },
  {
    slug: "lumpsum-investment",
    name: "Lumpsum Investment Calculator",
    description: "Project the future value of a one-time investment.",
    category: "investment",
    added: "2026-01-22",
    tags: ["lumpsum", "investment"],
  },
  {
    slug: "mutual-fund-return",
    name: "Mutual Fund Return Calculator",
    description: "Estimate returns from mutual funds over time.",
    category: "investment",
    added: "2026-01-25",
    tags: ["mutual fund", "return"],
  },
  {
    slug: "cagr",
    name: "CAGR Calculator",
    description: "Calculate compound annual growth rate for investments.",
    category: "investment",
    added: "2026-01-28",
    tags: ["cagr", "growth"],
  },
  {
    slug: "swp",
    name: "SWP Calculator",
    description: "Plan systematic withdrawal plan from investments.",
    category: "investment",
    added: "2026-01-30",
    tags: ["swp", "withdrawal"],
  },
  {
    slug: "step-up-sip",
    name: "Step-Up SIP Calculator",
    description: "Model SIPs with periodic increase in contributions.",
    category: "investment",
    added: "2026-02-02",
    tags: ["sip", "step-up"],
  },
  {
    slug: "stock-return-calculator",
    name: "Stock Return Calculator",
    description: "Calculate percentage gain or loss on a stock investment.",
    category: "investment",
    added: "2026-03-16",
    tags: ["stock", "return"],
  },
  {
    slug: "dividend-yield-calculator",
    name: "Dividend Yield Calculator",
    description: "Calculate dividend yield based on dividend and share price.",
    category: "investment",
    added: "2026-03-16",
    tags: ["dividend", "yield"],
  },
  {
    slug: "retirement-corpus-calculator",
    name: "Retirement Corpus Calculator",
    description: "Estimate corpus required to fund retirement expenses.",
    category: "investment",
    added: "2026-03-16",
    tags: ["retirement", "corpus"],
  },
  {
    slug: "inflation-adjusted-return-calculator",
    name: "Inflation Adjusted Return Calculator",
    description: "Compute real return after accounting for inflation.",
    category: "investment",
    added: "2026-03-16",
    tags: ["inflation", "return"],
  },
  {
    slug: "portfolio-return-calculator",
    name: "Portfolio Return Calculator",
    description: "Calculate weighted average return for a portfolio.",
    category: "investment",
    added: "2026-03-16",
    tags: ["portfolio", "return"],
  },

  // Tax Calculators
  {
    slug: "income-tax",
    name: "Income Tax Calculator",
    description: "Compare old vs new tax regimes for salaried individuals.",
    category: "tax",
    popular: true,
    added: "2026-01-05",
    tags: ["tax", "income"],
  },
  {
    slug: "gst",
    name: "GST Calculator",
    description: "Compute GST amounts for invoices and billing.",
    category: "tax",
    popular: true,
    added: "2026-01-08",
    tags: ["gst", "tax"],
  },
  {
    slug: "hra",
    name: "HRA Calculator",
    description: "Estimate HRA exemption based on rent and salary.",
    category: "tax",
    added: "2026-01-10",
    tags: ["hra", "tax"],
  },
  {
    slug: "capital-gains",
    name: "Capital Gains Tax Calculator",
    description: "Calculate tax on capital gains for assets.",
    category: "tax",
    added: "2026-01-12",
    tags: ["capital gains", "tax"],
  },
  {
    slug: "tds",
    name: "TDS Calculator",
    description: "Estimate tax deducted at source for payments.",
    category: "tax",
    added: "2026-01-15",
    tags: ["tds", "tax"],
  },

  // Savings Calculators
  {
    slug: "fd",
    name: "Fixed Deposit (FD) Calculator",
    description: "Estimate maturity amount of fixed deposits.",
    category: "savings",
    added: "2026-01-18",
    tags: ["fd", "interest"],
  },
  {
    slug: "rd",
    name: "Recurring Deposit (RD) Calculator",
    description: "Compute returns on recurring deposits.",
    category: "savings",
    added: "2026-01-20",
    tags: ["rd", "interest"],
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    description: "See how your investment grows with compounding.",
    category: "savings",
    added: "2026-01-22",
    tags: ["compound", "interest"],
  },
  {
    slug: "inflation",
    name: "Inflation Calculator",
    description: "Understand purchasing power changes over time.",
    category: "savings",
    added: "2026-01-25",
    tags: ["inflation", "savings"],
  },

  // Government Scheme Calculators
  {
    slug: "ppf",
    name: "PPF Calculator",
    description: "Project returns from Public Provident Fund investments.",
    category: "government",
    added: "2026-01-28",
    tags: ["ppf", "scheme"],
  },
  {
    slug: "nps",
    name: "NPS Calculator",
    description: "Estimate growth of National Pension Scheme investments.",
    category: "government",
    added: "2026-01-30",
    tags: ["nps", "pension"],
  },
  {
    slug: "gratuity",
    name: "Gratuity Calculator",
    description: "Calculate gratuity based on salary and service years.",
    category: "government",
    added: "2026-02-01",
    tags: ["gratuity", "retirement"],
  },
  {
    slug: "epf",
    name: "EPF Calculator",
    description: "Estimate employee provident fund accumulation.",
    category: "government",
    added: "2026-02-03",
    tags: ["epf", "retirement"],
  },

  // Creator Economy Calculators
  {
    slug: "youtube-money",
    name: "YouTube Money Calculator",
    description: "Estimate earnings based on views and RPM.",
    category: "creator",
    popular: true,
    added: "2026-02-05",
    tags: ["youtube", "creator"],
  },
  {
    slug: "instagram-engagement",
    name: "Instagram Engagement Rate Calculator",
    description: "Measure engagement percentage for your posts.",
    category: "creator",
    added: "2026-02-07",
    tags: ["instagram", "engagement"],
  },
  {
    slug: "youtube-thumbnail-ctr",
    name: "YouTube Thumbnail CTR Calculator",
    description: "Estimate click-through-rate impact from thumbnails.",
    category: "creator",
    added: "2026-02-09",
    tags: ["youtube", "ctr"],
  },
  {
    slug: "influencer-earnings",
    name: "Influencer Earnings Calculator",
    description: "Project earnings based on audience and rates.",
    category: "creator",
    added: "2026-02-11",
    tags: ["influencer", "earnings"],
  },
  {
    slug: "affiliate-commission",
    name: "Affiliate Commission Calculator",
    description: "Calculate affiliate payouts via conversion rate.",
    category: "creator",
    added: "2026-02-13",
    tags: ["affiliate", "commission"],
  },

  // Business / Startup Calculators
  {
    slug: "freelance-hourly-rate",
    name: "Freelance Hourly Rate Calculator",
    description: "Set rates by covering costs and desired income.",
    category: "business",
    added: "2026-02-15",
    tags: ["freelance", "rate"],
  },
  {
    slug: "startup-runway",
    name: "Startup Runway Calculator",
    description: "Show months of runway before funds run out.",
    category: "business",
    added: "2026-02-17",
    tags: ["runway", "startup"],
  },
  {
    slug: "saas-revenue",
    name: "SaaS Revenue Calculator",
    description: "Estimate monthly recurring revenue and growth.",
    category: "business",
    added: "2026-02-19",
    tags: ["saas", "revenue"],
  },
  {
    slug: "break-even",
    name: "Break-even Calculator",
    description: "Determine when revenue covers costs.",
    category: "business",
    added: "2026-02-21",
    tags: ["break-even", "business"],
  },
  {
    slug: "income-split",
    name: "Income Split Calculator",
    description: "Split earnings across collaborators or partners.",
    category: "business",
    added: "2026-02-23",
    tags: ["income", "split"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate your exact age in years, months, and days.",
    category: "business",
    added: "2026-03-15",
    tags: ["age", "date"],
  },
  {
    slug: "test-grade-calculator",
    name: "Test Grade Calculator",
    description: "Compute percentage score and letter grade from test results.",
    category: "business",
    added: "2026-03-15",
    tags: ["grade", "percentage"],
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    description: "Calculate the average of a list of numbers.",
    category: "business",
    added: "2026-03-15",
    tags: ["average", "mean"],
  },
  {
    slug: "overtime-pay-calculator",
    name: "Overtime Pay Calculator",
    description: "Estimate pay for overtime hours based on rate and multiplier.",
    category: "business",
    added: "2026-03-15",
    tags: ["overtime", "pay"],
  },
  {
    slug: "margin-calculator",
    name: "Margin Calculator",
    description: "Calculate profit margin based on cost and selling price.",
    category: "business",
    added: "2026-03-15",
    tags: ["margin", "profit"],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    description: "Estimate daily calorie needs based on BMR and activity level.",
    category: "health",
    added: "2026-03-15",
    tags: ["calorie", "bmr"],
  },
  {
    slug: "bmi",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index (BMI) to check if your weight is in a healthy range.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "health"],
  },
  {
    slug: "bmi-kids",
    name: "BMI Calculator for Kids",
    description: "Estimate BMI for children and find healthy growth ranges.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "kids", "health"],
  },
  {
    slug: "bmi-men",
    name: "BMI Calculator for Men",
    description: "Estimate BMI and see standard male BMI category ranges.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "men", "health"],
  },
  {
    slug: "bmi-teens",
    name: "BMI Calculator for Teens",
    description: "Estimate BMI for teenagers and learn about healthy ranges.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "teens", "health"],
  },
  {
    slug: "bmi-women",
    name: "BMI Calculator for Women",
    description: "Estimate BMI and see standard female BMI category ranges.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "women", "health"],
  },
  {
    slug: "bmi-weight-loss",
    name: "BMI Weight Loss Calculator",
    description: "Estimate how much weight you need to lose to reach a target BMI.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "weight loss", "health"],
  },
  {
    slug: "bmi-geriatric",
    name: "Geriatric BMI Calculator",
    description: "Calculate BMI for older adults and see recommended ranges.",
    category: "health",
    added: "2026-03-16",
    tags: ["bmi", "geriatric", "health"],
  },
  {
    slug: "salary-hike-calculator",
    name: "Salary Hike Calculator",
    description: "Calculate your new salary after a percentage hike.",
    category: "income",
    added: "2026-03-16",
    tags: ["salary", "raise"],
  },
  {
    slug: "take-home-salary-calculator",
    name: "Take Home Salary Calculator",
    description: "Estimate take-home pay after tax and deductions.",
    category: "income",
    added: "2026-03-16",
    tags: ["take home", "salary"],
  },
  {
    slug: "in-hand-salary-calculator",
    name: "In-Hand Salary Calculator",
    description: "Estimate net in-hand pay after deductions.",
    category: "income",
    added: "2026-03-16",
    tags: ["salary", "in-hand"],
  },
  {
    slug: "overtime-calculator",
    name: "Overtime Calculator",
    description: "Calculate pay including overtime for extra hours worked.",
    category: "income",
    added: "2026-03-16",
    tags: ["overtime", "pay"],
  },
  {
    slug: "hourly-to-salary-calculator",
    name: "Hourly to Salary Calculator",
    description: "Convert hourly wage into annual salary based on hours worked.",
    category: "income",
    added: "2026-03-16",
    tags: ["hourly", "salary"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate what percentage one number is of another.",
    category: "utility",
    added: "2026-03-16",
    tags: ["percentage", "math"],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    description: "Compute discounted price and savings from a discount percentage.",
    category: "utility",
    added: "2026-03-16",
    tags: ["discount", "price"],
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    description: "Find the number of years, months, and days between two dates.",
    category: "utility",
    added: "2026-03-16",
    tags: ["date", "difference"],
  },
  {
    slug: "time-duration-calculator",
    name: "Time Duration Calculator",
    description: "Calculate the time difference between two clock times.",
    category: "utility",
    added: "2026-03-16",
    tags: ["time", "duration"],
  },
  {
    slug: "average-percentage-calculator",
    name: "Average Percentage Calculator",
    description: "Compute the average of multiple percentage values.",
    category: "utility",
    added: "2026-03-16",
    tags: ["average", "percentage"],
  },
  {
    slug: "ratio-calculator",
    name: "Ratio Calculator",
    description: "Simplify the ratio between two numbers.",
    category: "utility",
    added: "2026-03-16",
    tags: ["ratio", "math"],
  },
];

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
