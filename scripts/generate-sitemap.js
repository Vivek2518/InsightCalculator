/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const CANONICAL_DOMAIN = "https://www.insightcalculator.com";
const OUTPUT_PATH = path.join(process.cwd(), "public", "sitemap.xml");
const CALCULATORS_DIR = path.join(process.cwd(), "src", "calculators");

function buildSitemap(urls) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const footer = "</urlset>\n";

  const body = urls
    .map((url) => {
      return [
        "  <url>",
        `    <loc>${url}</loc>`,
        `    <lastmod>${new Date().toISOString()}</lastmod>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `${header}${body}\n${footer}`;
}

function getCalculatorCategory(slug) {
  const map = {
    // loans
    "car-loan-emi": "finance/loans",
    "home-loan-emi": "finance/loans",
    "personal-loan-emi": "finance/loans",
    "education-loan-emi": "finance/loans",
    "loan-eligibility": "finance/loans",
    "loan-interest-rate": "finance/loans",
    "emi-calculator": "finance/loans",
    "loan-amortization-calculator": "finance/loans",
    "credit-card-emi-calculator": "finance/loans",
    "interest-rate-calculator": "finance/loans",
    "prepayment-calculator": "finance/loans",

    // investment
    sip: "finance/investment",
    "step-up-sip": "finance/investment",
    swp: "finance/investment",
    "mutual-fund-return": "finance/investment",
    "lumpsum-investment": "finance/investment",
    cagr: "finance/investment",
    "stock-return-calculator": "finance/investment",
    "dividend-yield-calculator": "finance/investment",
    "retirement-corpus-calculator": "finance/investment",
    "inflation-adjusted-return-calculator": "finance/investment",
    "portfolio-return-calculator": "finance/investment",

    // savings
    fd: "finance/savings",
    rd: "finance/savings",
    "compound-interest": "finance/savings",
    inflation: "finance/savings",

    // tax
    "income-tax": "finance/tax",
    gst: "finance/tax",
    hra: "finance/tax",
    "capital-gains": "finance/tax",
    tds: "finance/tax",

    // government
    epf: "finance/government",
    ppf: "finance/government",
    nps: "finance/government",
    gratuity: "finance/government",

    // business
    "break-even": "finance/business",
    "margin-calculator": "finance/business",
    "saas-revenue": "finance/business",
    "startup-runway": "finance/business",
    "freelance-hourly-rate": "finance/business",
    "income-split": "finance/business",

    // creator
    "youtube-money": "creator",
    "youtube-thumbnail-ctr": "creator",
    "influencer-earnings": "creator",
    "affiliate-commission": "creator",
    "instagram-engagement": "creator",

    // utility (everyday)
    "age-calculator": "everyday/utility",
    "average-calculator": "everyday/utility",
    "test-grade-calculator": "everyday/utility",
    "percentage-calculator": "everyday/utility",
    "discount-calculator": "everyday/utility",
    "date-difference-calculator": "everyday/utility",
    "time-duration-calculator": "everyday/utility",
    "average-percentage-calculator": "everyday/utility",
    "ratio-calculator": "everyday/utility",

    // income (finance)
    "overtime-pay-calculator": "finance/income",
    "salary-hike-calculator": "finance/income",
    "take-home-salary-calculator": "finance/income",
    "in-hand-salary-calculator": "finance/income",
    "overtime-calculator": "finance/income",
    "hourly-to-salary-calculator": "finance/income",

    // health
  "calorie-calculator": "health/dietary",
  "bmi": "health/bmi",
  "bmi-kids": "health/bmi",
  "bmi-men": "health/bmi",
  "bmi-teens": "health/bmi",
  "bmi-women": "health/bmi",
  "bmi-weight-loss": "health/bmi",
  "bmi-geriatric": "health/bmi",
  };
  return map[slug] || "everyday";
}

function getAllJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getCalculatorUrls() {
  const files = getAllJsonFiles(CALCULATORS_DIR);
  const slugs = files.map((file) => path.basename(file).replace(/\.json$/, ""));

  const calculatorUrls = slugs.map((slug) => {
    const categoryPath = getCalculatorCategory(slug);
    return `${CANONICAL_DOMAIN}/calculators/${categoryPath}/${slug}-calculator`;
  });

  return [CANONICAL_DOMAIN, ...calculatorUrls];
}

function ensurePublicDir() {
  const publicPath = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
}

function main() {
  ensurePublicDir();
  const urls = getCalculatorUrls();
  const sitemapContent = buildSitemap(urls);

  fs.writeFileSync(OUTPUT_PATH, sitemapContent, "utf-8");
  console.log(`✅ Generated sitemap.xml with ${urls.length} URLs at ${OUTPUT_PATH}`);
}

main();
