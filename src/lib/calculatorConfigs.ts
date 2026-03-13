export type CalculatorField = {
  key: string;
  label: string;
  type: "number" | "percentage" | "text";
  placeholder?: string;
};

export type CalculatorExample = {
  inputs: Record<string, number>;
  output: number;
  explanation: string;
};

export type CalculatorFAQ = {
  question: string;
  answer: string;
};

export type CalculatorConfig = {
  slug: string;
  formula: string;
  fields: CalculatorField[];
  example: CalculatorExample;
  faqs: CalculatorFAQ[];
  compute: (values: Record<string, number>) => number;
};

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

const EMI = (principal: number, rate: number, tenureYears: number) => {
  const monthlyRate = rate / 100 / 12;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return principal / months;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return emi;
};

const reverseEMI = (
  emi: number,
  rate: number,
  tenureYears: number
): number => {
  const monthlyRate = rate / 100 / 12;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return emi * months;
  return (
    (emi * (Math.pow(1 + monthlyRate, months) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, months))
  );
};

const solveAnnualRate = (
  principal: number,
  emi: number,
  tenureYears: number
): number => {
  // Simple binary search to approximate annual rate
  let low = 0;
  let high = 100;
  let mid = 0;
  for (let i = 0; i < 80; i++) {
    mid = (low + high) / 2;
    const testEmi = EMI(principal, mid, tenureYears);
    if (testEmi > emi) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return mid;
};

const compound = (principal: number, rate: number, years: number, n = 12) => {
  const r = rate / 100 / n;
  const t = years * n;
  return principal * Math.pow(1 + r, t);
};

const cagr = (start: number, end: number, years: number) => {
  if (start <= 0 || years <= 0) return 0;
  return Math.pow(end / start, 1 / years) - 1;
};

const futureValueAnnuity = (
  contribution: number,
  rate: number,
  years: number,
  frequency: number
) => {
  const r = rate / 100 / frequency;
  const n = years * frequency;
  return contribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

const md = (value: number) => round(value, 2);

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  "home-loan-emi": {
    slug: "home-loan-emi",
    formula: "EMI = P * r * (1+r)^n / ((1+r)^n - 1)",
    fields: [
      { key: "principal", label: "Loan Amount (₹)", type: "number" },
      { key: "rate", label: "Annual Interest Rate (%)", type: "percentage" },
      { key: "tenure", label: "Loan Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { principal: 5000000, rate: 7.5, tenure: 20 },
      output: md(EMI(5000000, 7.5, 20)),
      explanation:
        "For a ₹50,00,000 loan at 7.5% annual interest over 20 years, the EMI is calculated using the standard EMI formula.",
    },
    faqs: [
      {
        question: "What is EMI?",
        answer:
          "EMI stands for Equated Monthly Installment–the fixed payment made every month to repay a loan.",
      },
      {
        question: "Can I adjust the loan tenure?",
        answer:
          "Yes, increasing tenure reduces monthly EMI but increases total interest paid.",
      },
    ],
    compute: ({ principal, rate, tenure }) => md(EMI(principal, rate, tenure)),
  },

  "personal-loan-emi": {
    slug: "personal-loan-emi",
    formula: "EMI = P * r * (1+r)^n / ((1+r)^n - 1)",
    fields: [
      { key: "principal", label: "Loan Amount (₹)", type: "number" },
      { key: "rate", label: "Annual Interest Rate (%)", type: "percentage" },
      { key: "tenure", label: "Loan Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { principal: 500000, rate: 14, tenure: 5 },
      output: md(EMI(500000, 14, 5)),
      explanation:
        "A personal loan of ₹5,00,000 at 14% per annum for 5 years gives an EMI based on the standard loan formula.",
    },
    faqs: [
      {
        question: "What affects my EMI?",
        answer:
          "The loan amount, interest rate, and tenure determine the monthly EMI.",
      },
      {
        question: "Can I pay off the loan early?",
        answer:
          "Early repayment may reduce interest but could include prepayment charges depending on the lender.",
      },
    ],
    compute: ({ principal, rate, tenure }) => md(EMI(principal, rate, tenure)),
  },

  "car-loan-emi": {
    slug: "car-loan-emi",
    formula: "EMI = P * r * (1+r)^n / ((1+r)^n - 1)",
    fields: [
      { key: "principal", label: "Loan Amount (₹)", type: "number" },
      { key: "rate", label: "Annual Interest Rate (%)", type: "percentage" },
      { key: "tenure", label: "Loan Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { principal: 800000, rate: 9, tenure: 5 },
      output: md(EMI(800000, 9, 5)),
      explanation:
        "Car loans are typically shorter; this example computes EMI for a 5-year term.",
    },
    faqs: [
      {
        question: "Does loan tenure affect interest?",
        answer:
          "Longer tenure lowers EMI but increases total interest paid over the loan period.",
      },
      {
        question: "What is the principal?",
        answer: "Principal is the total amount borrowed from the lender.",
      },
    ],
    compute: ({ principal, rate, tenure }) => md(EMI(principal, rate, tenure)),
  },

  "education-loan-emi": {
    slug: "education-loan-emi",
    formula: "EMI = P * r * (1+r)^n / ((1+r)^n - 1)",
    fields: [
      { key: "principal", label: "Loan Amount (₹)", type: "number" },
      { key: "rate", label: "Annual Interest Rate (%)", type: "percentage" },
      { key: "tenure", label: "Loan Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { principal: 1000000, rate: 10, tenure: 10 },
      output: md(EMI(1000000, 10, 10)),
      explanation:
        "Education loans often have longer tenures; this example shows EMI over 10 years.",
    },
    faqs: [
      {
        question: "What is a moratorium period?",
        answer:
          "It is a period during which you may not have to pay principal, but interest can still accrue.",
      },
      {
        question: "Can interest be capitalized?",
        answer:
          "Some lenders add accrued interest to the principal, which increases EMI.",
      },
    ],
    compute: ({ principal, rate, tenure }) => md(EMI(principal, rate, tenure)),
  },

  "loan-eligibility": {
    slug: "loan-eligibility",
    formula:
      "Eligible Loan = EMI Capacity * ((1+r)^n - 1) / (r * (1+r)^n) where r = monthly rate",
    fields: [
      { key: "monthlyIncome", label: "Monthly Income (₹)", type: "number" },
      { key: "monthlyObligations", label: "Monthly Obligations (₹)", type: "number" },
      { key: "rate", label: "Annual Interest Rate (%)", type: "percentage" },
      { key: "tenure", label: "Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { monthlyIncome: 80000, monthlyObligations: 15000, rate: 8, tenure: 20 },
      output: md(
        reverseEMI(
          (80000 - 15000) * 0.5,
          8,
          20
        )
      ),
      explanation:
        "Assuming 50% of disposable income can be used for EMI, this estimates maximum loan eligibility.",
    },
    faqs: [
      {
        question: "What is loan eligibility?",
        answer:
          "It is the maximum loan amount a lender may approve based on your income and obligations.",
      },
      {
        question: "Why do obligations matter?",
        answer:
          "Existing EMIs or debts reduce the amount you can pay toward a new loan.",
      },
    ],
    compute: ({ monthlyIncome, monthlyObligations, rate, tenure }) => {
      const capacity = Math.max(0, monthlyIncome - monthlyObligations) * 0.5;
      return md(reverseEMI(capacity, rate, tenure));
    },
  },

  "loan-interest-rate": {
    slug: "loan-interest-rate",
    formula: "Rate found via iterative approximation solving the EMI formula",
    fields: [
      { key: "principal", label: "Loan Amount (₹)", type: "number" },
      { key: "emi", label: "Monthly EMI (₹)", type: "number" },
      { key: "tenure", label: "Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { principal: 500000, emi: 10624, tenure: 5 },
      output: md(solveAnnualRate(500000, 10624, 5)),
      explanation:
        "Given a loan amount, EMI, and tenor, this estimates the implied annual interest rate.",
    },
    faqs: [
      {
        question: "Why estimate interest rate?",
        answer:
          "It helps compare loan offers when you know the EMI and tenure but not the rate.",
      },
      {
        question: "Is this exact?",
        answer:
          "This uses a numeric approximation and may vary slightly depending on rounding.",
      },
    ],
    compute: ({ principal, emi, tenure }) => md(solveAnnualRate(principal, emi, tenure)),
  },

  sip: {
    slug: "sip",
    formula:
      "Future Value = P * (((1 + r)^n - 1) / r) * (1 + r) where r is periodic rate",
    fields: [
      { key: "monthly", label: "Monthly SIP (₹)", type: "number" },
      { key: "rate", label: "Expected Annual Return (%)", type: "percentage" },
      { key: "tenure", label: "Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { monthly: 5000, rate: 12, tenure: 10 },
      output: md(
        (function () {
          const r = 0.12 / 12;
          const n = 10 * 12;
          return 5000 * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        })()
      ),
      explanation:
        "A monthly SIP of ₹5,000 at 12% annual return for 10 years grows through compounding.",
    },
    faqs: [
      {
        question: "What is SIP?",
        answer:
          "Systematic Investment Plan (SIP) lets you invest fixed amounts regularly into mutual funds.",
      },
      {
        question: "Why use a SIP calculator?",
        answer:
          "It helps you estimate future value based on regular investments and expected return.",
      },
    ],
    compute: ({ monthly, rate, tenure }) => {
      const r = rate / 100 / 12;
      const n = tenure * 12;
      const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      return md(futureValue);
    },
  },

  "lumpsum-investment": {
    slug: "lumpsum-investment",
    formula: "Future Value = P * (1 + r)^n",
    fields: [
      { key: "principal", label: "Investment Amount (₹)", type: "number" },
      { key: "rate", label: "Annual Return (%)", type: "percentage" },
      { key: "years", label: "Years", type: "number" },
    ],
    example: {
      inputs: { principal: 100000, rate: 12, years: 5 },
      output: md(compound(100000, 12, 5, 1)),
      explanation:
        "A single investment that grows annually at a constant rate over time.",
    },
    faqs: [
      {
        question: "Is return guaranteed?",
        answer:
          "Actual returns may vary; this calculator assumes a steady annual rate.",
      },
      {
        question: "Does it account for inflation?",
        answer: "No, it shows nominal growth without adjusting for inflation.",
      },
    ],
    compute: ({ principal, rate, years }) => md(compound(principal, rate, years, 1)),
  },

  "mutual-fund-return": {
    slug: "mutual-fund-return",
    formula: "Return (%) = ((Final - Initial) / Initial) * 100",
    fields: [
      { key: "initial", label: "Initial Investment (₹)", type: "number" },
      { key: "final", label: "Final Value (₹)", type: "number" },
    ],
    example: {
      inputs: { initial: 50000, final: 82000 },
      output: md(((82000 - 50000) / 50000) * 100),
      explanation:
        "Returns are calculated as a percentage increase from your initial investment.",
    },
    faqs: [
      {
        question: "What return does this show?",
        answer:
          "It shows the percentage gain or loss between the starting and ending values.",
      },
      {
        question: "Does it include costs?",
        answer:
          "No, this assumes the values already include any fees or charges.",
      },
    ],
    compute: ({ initial, final }) => md(((final - initial) / initial) * 100),
  },

  cagr: {
    slug: "cagr",
    formula: "CAGR = (End / Start)^(1/n) - 1",
    fields: [
      { key: "start", label: "Starting Value (₹)", type: "number" },
      { key: "end", label: "Ending Value (₹)", type: "number" },
      { key: "years", label: "Years", type: "number" },
    ],
    example: {
      inputs: { start: 50000, end: 120000, years: 5 },
      output: md(cagr(50000, 120000, 5) * 100),
      explanation:
        "CAGR is the annual growth rate that takes into account compounding.",
    },
    faqs: [
      {
        question: "Why use CAGR?",
        answer:
          "CAGR smooths out volatility to show the average annual growth rate.",
      },
      {
        question: "Is it actual return?",
        answer:
          "It is a theoretical rate and does not reflect year-to-year variation.",
      },
    ],
    compute: ({ start, end, years }) => md(cagr(start, end, years) * 100),
  },

  swp: {
    slug: "swp",
    formula:
      "Withdrawal = (PV * r) / (1 - (1 + r)^-n) where r is monthly rate",
    fields: [
      { key: "corpus", label: "Investment Corpus (₹)", type: "number" },
      { key: "rate", label: "Expected Annual Return (%)", type: "percentage" },
      { key: "years", label: "Withdrawal Period (years)", type: "number" },
    ],
    example: {
      inputs: { corpus: 1000000, rate: 8, years: 10 },
      output: md(
        (function () {
          const r = 0.08 / 12;
          const n = 10 * 12;
          return (1000000 * r) / (1 - Math.pow(1 + r, -n));
        })()
      ),
      explanation:
        "SWP lets you withdraw a fixed amount while the remainder continues to grow.",
    },
    faqs: [
      {
        question: "What is SWP?",
        answer:
          "Systematic Withdrawal Plan lets you withdraw a fixed amount periodically while keeping the rest invested.",
      },
      {
        question: "Will corpus run out?",
        answer:
          "The plan assumes withdrawals and returns are consistent; actual results may vary.",
      },
    ],
    compute: ({ corpus, rate, years }) => {
      const r = rate / 100 / 12;
      const n = years * 12;
      if (r === 0) return md(corpus / n);
      const withdrawal = (corpus * r) / (1 - Math.pow(1 + r, -n));
      return md(withdrawal);
    },
  },

  "step-up-sip": {
    slug: "step-up-sip",
    formula:
      "Future Value = Σ (monthlyContribution * (1+step)^(year-1) * ((1+r)^(remainingMonths)-1)/r )",
    fields: [
      { key: "monthly", label: "Starting Monthly SIP (₹)", type: "number" },
      { key: "rate", label: "Expected Annual Return (%)", type: "percentage" },
      { key: "step", label: "Step-Up (%) per year", type: "percentage" },
      { key: "years", label: "Tenure (years)", type: "number" },
    ],
    example: {
      inputs: { monthly: 5000, rate: 12, step: 10, years: 10 },
      output: md(
        (function () {
          const r = 0.12 / 12;
          const totalMonths = 10 * 12;
          let value = 0;
          for (let m = 0; m < totalMonths; m++) {
            const year = Math.floor(m / 12);
            const contrib = 5000 * Math.pow(1 + 0.1, year);
            value += contrib * Math.pow(1 + r, totalMonths - m);
          }
          return value;
        })()
      ),
      explanation:
        "Each year the monthly contribution increases by a fixed percentage.",
    },
    faqs: [
      {
        question: "What is step-up SIP?",
        answer:
          "It increases your monthly investment periodically to keep pace with rising income.",
      },
      {
        question: "How is it different from regular SIP?",
        answer:
          "Regular SIP keeps contributions constant while step-up SIP increases them over time.",
      },
    ],
    compute: ({ monthly, rate, step, years }) => {
      const r = rate / 100 / 12;
      const totalMonths = years * 12;
      let value = 0;
      for (let m = 0; m < totalMonths; m++) {
        const year = Math.floor(m / 12);
        const contrib = monthly * Math.pow(1 + step / 100, year);
        value += contrib * Math.pow(1 + r, totalMonths - m);
      }
      return md(value);
    },
  },

  "income-tax": {
    slug: "income-tax",
    formula: "Tax = Σ slabRate * taxableAmount",
    fields: [
      { key: "income", label: "Annual Income (₹)", type: "number" },
      { key: "regime", label: "Regime (0=New, 1=Old)", type: "number" },
    ],
    example: {
      inputs: { income: 1200000, regime: 0 },
      output: md(
        (function () {
          const income = 1200000;
          const slabs = [
            { upTo: 250000, rate: 0 },
            { upTo: 500000, rate: 0.05 },
            { upTo: 750000, rate: 0.1 },
            { upTo: 1000000, rate: 0.15 },
            { upTo: 1250000, rate: 0.2 },
            { upTo: 1500000, rate: 0.25 },
            { upTo: Infinity, rate: 0.3 },
          ];
          let remaining = income;
          let tax = 0;
          let prev = 0;
          for (const slab of slabs) {
            const amount = Math.max(0, Math.min(remaining, slab.upTo - prev));
            tax += amount * slab.rate;
            remaining -= amount;
            prev = slab.upTo;
            if (!remaining) break;
          }
          return tax;
        })()
      ),
      explanation:
        "Estimate income tax under the new regime slabs (simplified).",
    },
    faqs: [
      {
        question: "What is the difference between old and new regime?",
        answer:
          "New regime offers lower tax slabs but removes most deductions; old regime keeps deductions.",
      },
      {
        question: "Does this include cess?",
        answer: "No, this is a simplified tax estimate without cess and surcharge.",
      },
    ],
    compute: ({ income, regime }) => {
      const slabsNew = [
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 0.05 },
        { upTo: 750000, rate: 0.1 },
        { upTo: 1000000, rate: 0.15 },
        { upTo: 1250000, rate: 0.2 },
        { upTo: 1500000, rate: 0.25 },
        { upTo: Infinity, rate: 0.3 },
      ];

      const slabsOld = [
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 0.05 },
        { upTo: 1000000, rate: 0.2 },
        { upTo: Infinity, rate: 0.3 },
      ];

      const slabs = regime === 1 ? slabsOld : slabsNew;
      let remaining = income;
      let tax = 0;
      let prev = 0;

      for (const slab of slabs) {
        const amount = Math.max(0, Math.min(remaining, slab.upTo - prev));
        tax += amount * slab.rate;
        remaining -= amount;
        prev = slab.upTo;
        if (!remaining) break;
      }

      return md(tax);
    },
  },

  "gst": {
    slug: "gst",
    formula: "GST Amount = Amount * (GST Rate / 100)",
    fields: [
      { key: "amount", label: "Base Amount (₹)", type: "number" },
      { key: "rate", label: "GST Rate (%)", type: "percentage" },
    ],
    example: {
      inputs: { amount: 1000, rate: 18 },
      output: md(1000 * (18 / 100)),
      explanation:
        "For a base amount of ₹1,000 with 18% GST, the tax amount is ₹180.",
    },
    faqs: [
      {
        question: "What is GST?",
        answer:
          "GST is a value-added tax applied on the supply of goods and services.",
      },
      {
        question: "How do I calculate total amount?",
        answer:
          "Add the GST amount to the base amount to get the total invoice value.",
      },
    ],
    compute: ({ amount, rate }) => md(amount * (rate / 100)),
  },

  hra: {
    slug: "hra",
    formula: "Exemption = min(HRA received, rent - 10% salary, 50% salary)",
    fields: [
      { key: "hra", label: "HRA Received (₹)", type: "number" },
      { key: "rent", label: "Rent Paid (₹)", type: "number" },
      { key: "salary", label: "Basic Salary (₹)", type: "number" },
    ],
    example: {
      inputs: { hra: 30000, rent: 25000, salary: 80000 },
      output: md(Math.min(30000, 25000 - 0.1 * 80000, 0.5 * 80000)),
      explanation:
        "HRA exemption is the minimum of HRA received, rent paid minus 10% salary, and 50% of salary.",
    },
    faqs: [
      {
        question: "What is HRA exemption?",
        answer:
          "It is the portion of House Rent Allowance that is not taxable.",
      },
      {
        question: "Do I need rent receipts?",
        answer: "Yes, most employers require rent proofs to claim HRA exemption.",
      },
    ],
    compute: ({ hra, rent, salary }) =>
      md(Math.min(hra, rent - 0.1 * salary, 0.5 * salary)),
  },

  "capital-gains": {
    slug: "capital-gains",
    formula: "Capital Gain = Sale - Cost - Expense; Tax = Gain * Rate",
    fields: [
      { key: "sale", label: "Sale Price (₹)", type: "number" },
      { key: "cost", label: "Purchase Price (₹)", type: "number" },
      { key: "expense", label: "Expenses/Invoicing (₹)", type: "number" },
      { key: "years", label: "Holding Period (years)", type: "number" },
    ],
    example: {
      inputs: { sale: 1500000, cost: 1000000, expense: 20000, years: 3 },
      output: md(((1500000 - 1000000 - 20000) * 0.2)),
      explanation:
        "Long-term capital gains (over 2 years) are taxed at 20% (simplified example).",
    },
    faqs: [
      {
        question: "What is capital gains tax?",
        answer:
          "Tax on profit earned from selling capital assets like property or stocks.",
      },
      {
        question: "What is long-term vs short-term?",
        answer:
          "Long-term is based on holding period; rates differ from short-term.",
      },
    ],
    compute: ({ sale, cost, expense, years }) => {
      const gain = Math.max(0, sale - cost - expense);
      const rate = years >= 2 ? 0.2 : 0.15;
      return md(gain * rate);
    },
  },

  tds: {
    slug: "tds",
    formula: "TDS = Amount * (TDS Rate / 100)",
    fields: [
      { key: "amount", label: "Amount (₹)", type: "number" },
      { key: "rate", label: "TDS Rate (%)", type: "percentage" },
    ],
    example: {
      inputs: { amount: 50000, rate: 10 },
      output: md(50000 * 0.1),
      explanation: "Tax deducted at source is calculated as a fixed percentage of the payment amount.",
    },
    faqs: [
      {
        question: "What is TDS?",
        answer:
          "Tax Deducted at Source is a means of collecting tax on income at the point it is generated.",
      },
      {
        question: "Can I claim it back?",
        answer:
          "Yes, you can claim TDS refunds when filing your income tax return if excess tax is deducted.",
      },
    ],
    compute: ({ amount, rate }) => md(amount * (rate / 100)),
  },

  fd: {
    slug: "fd",
    formula: "Maturity = P * (1 + r/n)^(n*t)",
    fields: [
      { key: "principal", label: "Investment (₹)", type: "number" },
      { key: "rate", label: "Annual Interest (%)", type: "percentage" },
      { key: "years", label: "Years", type: "number" },
      { key: "frequency", label: "Compounding Frequency (per year)", type: "number", placeholder: "12" },
    ],
    example: {
      inputs: { principal: 100000, rate: 7, years: 5, frequency: 4 },
      output: md(compound(100000, 7, 5, 4)),
      explanation:
        "Fixed deposits compound periodically (e.g., quarterly) to grow the maturity amount.",
    },
    faqs: [
      {
        question: "What is compounding frequency?",
        answer:
          "It is how often interest is added to the principal (e.g., quarterly or yearly).",
      },
      {
        question: "Can I withdraw early?",
        answer: "Early withdrawal usually attracts penalties and lower rates.",
      },
    ],
    compute: ({ principal, rate, years, frequency }) =>
      md(compound(principal, rate, years, frequency || 12)),
  },

  rd: {
    slug: "rd",
    formula:
      "Maturity = P * ((1 + r/n)^(n*t) - 1) / (1 - (1 + r/n)^(-1/n))",
    fields: [
      { key: "monthly", label: "Monthly Deposit (₹)", type: "number" },
      { key: "rate", label: "Annual Interest (%)", type: "percentage" },
      { key: "years", label: "Years", type: "number" },
      { key: "frequency", label: "Compounding Frequency (per year)", type: "number", placeholder: "12" },
    ],
    example: {
      inputs: { monthly: 5000, rate: 7, years: 5, frequency: 12 },
      output: md(
        (function () {
          const p = 5000;
          const r = 0.07 / 12;
          const n = 5 * 12;
          return p * ((Math.pow(1 + r, n) - 1) / (1 - Math.pow(1 + r, -1 / 12)));
        })()
      ),
      explanation:
        "Recurring deposits accumulate monthly investments with compound interest.",
    },
    faqs: [
      {
        question: "Is the interest compounded?",
        answer:
          "Yes, RD interest is typically compounded quarterly or monthly depending on the bank.",
      },
      {
        question: "What happens if I miss a deposit?",
        answer:
          "Skipping deposits can reduce the maturity value since contributions are lower.",
      },
    ],
    compute: ({ monthly, rate, years, frequency }) => {
      const f = frequency || 12;
      const r = rate / 100 / f;
      const n = years * f;
      const maturity = monthly * ((Math.pow(1 + r, n) - 1) / (1 - Math.pow(1 + r, -1 / f)));
      return md(maturity);
    },
  },

  "compound-interest": {
    slug: "compound-interest",
    formula: "A = P * (1 + r/n)^(n*t)",
    fields: [
      { key: "principal", label: "Principal (₹)", type: "number" },
      { key: "rate", label: "Annual Interest (%)", type: "percentage" },
      { key: "years", label: "Years", type: "number" },
      { key: "frequency", label: "Compounding Frequency (per year)", type: "number", placeholder: "12" },
    ],
    example: {
      inputs: { principal: 50000, rate: 6, years: 5, frequency: 12 },
      output: md(compound(50000, 6, 5, 12)),
      explanation:
        "Compound interest grows your principal faster as interest is reinvested.",
    },
    faqs: [
      {
        question: "How does compounding work?",
        answer:
          "Interest is added to the principal, and future interest is earned on the new total.",
      },
      {
        question: "Is compounding annual?",
        answer:
          "It depends; many products compound quarterly or monthly.",
      },
    ],
    compute: ({ principal, rate, years, frequency }) =>
      md(compound(principal, rate, years, frequency || 12)),
  },

  inflation: {
    slug: "inflation",
    formula: "Future Value = Current Value * (1 + inflation)^years",
    fields: [
      { key: "amount", label: "Current Amount (₹)", type: "number" },
      { key: "rate", label: "Annual Inflation (%)", type: "percentage" },
      { key: "years", label: "Years", type: "number" },
    ],
    example: {
      inputs: { amount: 100000, rate: 6, years: 10 },
      output: md(compound(100000, 6, 10, 1)),
      explanation:
        "This shows how much money you'll need in the future to match today's purchasing power.",
    },
    faqs: [
      {
        question: "Why does inflation matter?",
        answer:
          "It reduces buying power over time, meaning you need more money to buy the same things.",
      },
      {
        question: "Does this account for investment returns?",
        answer: "No, it only models the effect of inflation on purchasing power.",
      },
    ],
    compute: ({ amount, rate, years }) => md(compound(amount, rate, years, 1)),
  },

  ppf: {
    slug: "ppf",
    formula: "Maturity = Contribution * ((1+r)^n - 1) / r * (1+r)",
    fields: [
      { key: "contribution", label: "Annual Contribution (₹)", type: "number" },
      { key: "years", label: "Years (min 15)", type: "number" },
      { key: "rate", label: "Annual Interest (%)", type: "percentage", placeholder: "7.1" },
    ],
    example: {
      inputs: { contribution: 150000, years: 15, rate: 7.1 },
      output: md(futureValueAnnuity(150000, 7.1, 15, 1)),
      explanation:
        "PPF grows your annual deposits at a fixed government interest rate.",
    },
    faqs: [
      {
        question: "Is PPF safe?",
        answer: "Yes, it is backed by the government and offers guaranteed returns.",
      },
      {
        question: "Can I withdraw early?",
        answer: "Partial withdrawals are allowed after the 5th financial year.",
      },
    ],
    compute: ({ contribution, years, rate }) =>
      md(futureValueAnnuity(contribution, rate, years, 1)),
  },

  nps: {
    slug: "nps",
    formula: "Future Value = Contribution * ((1+r)^n - 1) / r * (1+r)",
    fields: [
      { key: "contribution", label: "Annual Contribution (₹)", type: "number" },
      { key: "years", label: "Years", type: "number" },
      { key: "rate", label: "Expected Annual Return (%)", type: "percentage" },
    ],
    example: {
      inputs: { contribution: 100000, years: 20, rate: 10 },
      output: md(futureValueAnnuity(100000, 10, 20, 1)),
      explanation:
        "NPS investments grow with compounding returns over the investment period.",
    },
    faqs: [
      {
        question: "Can I withdraw before retirement?",
        answer:
          "Withdrawals are limited before retirement; most funds are locked in until retirement.",
      },
      {
        question: "What is the tax benefit?",
        answer:
          "NPS contributions can qualify for tax deductions under relevant sections.",
      },
    ],
    compute: ({ contribution, years, rate }) =>
      md(futureValueAnnuity(contribution, rate, years, 1)),
  },

  gratuity: {
    slug: "gratuity",
    formula: "Gratuity = (Last Salary * Years * 15) / 26",
    fields: [
      { key: "salary", label: "Last Drawn Monthly Salary (₹)", type: "number" },
      { key: "years", label: "Years of Service", type: "number" },
    ],
    example: {
      inputs: { salary: 60000, years: 10 },
      output: md((60000 * 10 * 15) / 26),
      explanation:
        "Gratuity is typically calculated based on last salary, years of service, and a 15/26 factor.",
    },
    faqs: [
      {
        question: "Who is eligible for gratuity?",
        answer:
          "Employees with 5+ years of continuous service are generally eligible.",
      },
      {
        question: "Is gratuity taxable?",
        answer:
          "A portion may be tax-exempt; consult tax rules for exact treatment.",
      },
    ],
    compute: ({ salary, years }) => md((salary * years * 15) / 26),
  },

  epf: {
    slug: "epf",
    formula: "EPF Balance ≈ (Employee + Employer) * years * 12 + interest",
    fields: [
      { key: "salary", label: "Monthly Salary (₹)", type: "number" },
      { key: "years", label: "Years", type: "number" },
      { key: "rate", label: "Annual Interest (%)", type: "percentage" },
    ],
    example: {
      inputs: { salary: 50000, years: 10, rate: 8.5 },
      output: md(
        (function () {
          const monthly = 50000;
          const years = 10;
          const annualRate = 8.5 / 100;
          const annualContribution = monthly * 0.12 * 12 * 2;
          const balance = annualContribution * years;
          return balance * (1 + annualRate * years * 0.5);
        })()
      ),
      explanation:
        "This gives a rough projection of EPF with employee+employer contributions and interest.",
    },
    faqs: [
      {
        question: "What is EPF?",
        answer:
          "Employee Provident Fund is a retirement savings scheme where both employer and employee contribute.",
      },
      {
        question: "How is interest calculated?",
        answer: "Interest is calculated on the yearly running balance and credited annually.",
      },
    ],
    compute: ({ salary, years, rate }) => {
      const monthly = salary;
      const annualContribution = monthly * 0.12 * 12 * 2;
      const total = annualContribution * years;
      // Rough interest projection
      return md(total * (1 + (rate / 100) * (years * 0.5)));
    },
  },

  "youtube-money": {
    slug: "youtube-money",
    formula: "Estimated Earnings = (Views / 1000) * RPM",
    fields: [
      { key: "views", label: "Monthly Views", type: "number" },
      { key: "rpm", label: "RPM (₹ per 1000 views)", type: "number" },
    ],
    example: {
      inputs: { views: 200000, rpm: 50 },
      output: md((200000 / 1000) * 50),
      explanation:
        "RPM (revenue per mille) helps estimate income from views after platform cuts.",
    },
    faqs: [
      {
        question: "What is RPM?",
        answer:
          "RPM is revenue per 1000 monetized views after YouTube’s share.",
      },
      {
        question: "Are views equal to earnings?",
        answer:
          "Not all views are monetized; RPM accounts for that by estimating average earnings.",
      },
    ],
    compute: ({ views, rpm }) => md((views / 1000) * rpm),
  },

  "instagram-engagement": {
    slug: "instagram-engagement",
    formula: "Engagement Rate (%) = (Likes + Comments + Shares) / Followers * 100",
    fields: [
      { key: "followers", label: "Followers", type: "number" },
      { key: "likes", label: "Likes", type: "number" },
      { key: "comments", label: "Comments", type: "number" },
      { key: "shares", label: "Shares", type: "number" },
    ],
    example: {
      inputs: { followers: 20000, likes: 1200, comments: 80, shares: 20 },
      output: md(((1200 + 80 + 20) / 20000) * 100),
      explanation:
        "Engagement rate measures how actively followers interact with posts.",
    },
    faqs: [
      {
        question: "What is a good engagement rate?",
        answer:
          "It varies by audience size, but 1–5% is generally considered healthy.",
      },
      {
        question: "How can I improve engagement?",
        answer:
          "Post consistently, interact with followers, and use content formats your audience likes.",
      },
    ],
    compute: ({ followers, likes, comments, shares }) =>
      md(((likes + comments + shares) / Math.max(1, followers)) * 100),
  },

  "youtube-thumbnail-ctr": {
    slug: "youtube-thumbnail-ctr",
    formula: "CTR = (Clicks / Impressions) * 100",
    fields: [
      { key: "impressions", label: "Impressions", type: "number" },
      { key: "clicks", label: "Clicks", type: "number" },
    ],
    example: {
      inputs: { impressions: 50000, clicks: 2500 },
      output: md((2500 / 50000) * 100),
      explanation:
        "Click-through rate indicates how often viewers click your thumbnail after seeing it.",
    },
    faqs: [
      {
        question: "What is a good CTR?",
        answer:
          "On YouTube, 2–10% is common; higher means your thumbnail is compelling.",
      },
      {
        question: "How can I improve CTR?",
        answer:
          "Use clear titles, bold thumbnails, and test different designs.",
      },
    ],
    compute: ({ impressions, clicks }) => md((clicks / Math.max(1, impressions)) * 100),
  },

  "influencer-earnings": {
    slug: "influencer-earnings",
    formula: "Estimated Earnings = Followers * EngagementRate * RatePerEngagement",
    fields: [
      { key: "followers", label: "Followers", type: "number" },
      { key: "engagement", label: "Engagement Rate (%)", type: "percentage" },
      { key: "rate", label: "Rate per 1% Engagement (₹)", type: "number" },
    ],
    example: {
      inputs: { followers: 50000, engagement: 3, rate: 1000 },
      output: md(50000 * (3 / 100) * 1000),
      explanation:
        "Fine-tune earnings estimates using follower count and engagement rate.",
    },
    faqs: [
      {
        question: "Is engagement more important than follower count?",
        answer:
          "Yes, brands often value active audiences over raw follower numbers.",
      },
      {
        question: "How accurate is this estimate?",
        answer:
          "It provides a rough ballpark and should be adjusted per campaign.",
      },
    ],
    compute: ({ followers, engagement, rate }) =>
      md(followers * (engagement / 100) * rate),
  },

  "affiliate-commission": {
    slug: "affiliate-commission",
    formula: "Earnings = Sales * ConversionRate * AOV * CommissionRate",
    fields: [
      { key: "sales", label: "Monthly Visitors", type: "number" },
      { key: "conversion", label: "Conversion Rate (%)", type: "percentage" },
      { key: "aov", label: "Avg Order Value (₹)", type: "number" },
      { key: "commission", label: "Commission Rate (%)", type: "percentage" },
    ],
    example: {
      inputs: { sales: 10000, conversion: 2, aov: 1500, commission: 8 },
      output: md(10000 * 0.02 * 1500 * 0.08),
      explanation:
        "Estimate affiliate earnings based on visitors, conversion, and commission rate.",
    },
    faqs: [
      {
        question: "What is AOV?",
        answer: "Average order value is the average amount customers spend per purchase.",
      },
      {
        question: "What affects commission?",
        answer:
          "Commission rates depend on partner programs and product categories.",
      },
    ],
    compute: ({ sales, conversion, aov, commission }) =>
      md(sales * (conversion / 100) * aov * (commission / 100)),
  },

  "freelance-hourly-rate": {
    slug: "freelance-hourly-rate",
    formula: "Rate = (Target + Expenses) / Billable Hours",
    fields: [
      { key: "target", label: "Annual Target Income (₹)", type: "number" },
      { key: "expenses", label: "Annual Expenses (₹)", type: "number" },
      { key: "hours", label: "Billable Hours per Week", type: "number" },
      { key: "weeks", label: "Billable Weeks per Year", type: "number" },
    ],
    example: {
      inputs: { target: 1200000, expenses: 200000, hours: 25, weeks: 48 },
      output: md((1200000 + 200000) / (25 * 48)),
      explanation:
        "This helps set an hourly rate to meet annual income targets after expenses.",
    },
    faqs: [
      {
        question: "What are billable hours?",
        answer:
          "Hours you can realistically charge clients, excluding admin and downtime.",
      },
      {
        question: "Should I include taxes?",
        answer: "Yes, include expected tax liabilities in expenses.",
      },
    ],
    compute: ({ target, expenses, hours, weeks }) =>
      md((target + expenses) / (hours * weeks)),
  },

  "startup-runway": {
    slug: "startup-runway",
    formula: "Runway (months) = Cash Balance / Monthly Burn",
    fields: [
      { key: "cash", label: "Cash Balance (₹)", type: "number" },
      { key: "burn", label: "Monthly Burn (₹)", type: "number" },
    ],
    example: {
      inputs: { cash: 2500000, burn: 200000 },
      output: md(2500000 / 200000),
      explanation: "Runway estimates how many months your startup can operate at current burn.",
    },
    faqs: [
      {
        question: "What is burn rate?",
        answer:
          "It is the amount of cash spent each month to run the business.",
      },
      {
        question: "How can I extend runway?",
        answer: "Reduce burn or increase funding / revenue.",
      },
    ],
    compute: ({ cash, burn }) => md(cash / Math.max(1, burn)),
  },

  "saas-revenue": {
    slug: "saas-revenue",
    formula: "MRR = Customers * ARPU; ARR = MRR * 12",
    fields: [
      { key: "customers", label: "Active Customers", type: "number" },
      { key: "arpu", label: "Avg Revenue per Customer (₹)", type: "number" },
    ],
    example: {
      inputs: { customers: 500, arpu: 2000 },
      output: md(500 * 2000 * 12),
      explanation:
        "Annual recurring revenue is monthly revenue times 12.",
    },
    faqs: [
      {
        question: "What is ARPU?",
        answer: "Average Revenue Per User indicates revenue generated per customer.",
      },
      {
        question: "Is churn included?",
        answer: "This is a snapshot; churn reduces customers over time.",
      },
    ],
    compute: ({ customers, arpu }) => md(customers * arpu * 12),
  },

  "break-even": {
    slug: "break-even",
    formula: "Break-even Units = Fixed Costs / (Price - Variable Cost)",
    fields: [
      { key: "fixed", label: "Fixed Costs (₹)", type: "number" },
      { key: "price", label: "Price per Unit (₹)", type: "number" },
      { key: "variable", label: "Variable Cost per Unit (₹)", type: "number" },
    ],
    example: {
      inputs: { fixed: 500000, price: 1500, variable: 700 },
      output: md(500000 / (1500 - 700)),
      explanation:
        "Break-even is the number of units needed to cover fixed costs.",
    },
    faqs: [
      {
        question: "What is break-even?",
        answer:
          "It’s the point where total revenue equals total costs.",
      },
      {
        question: "Can I reduce break-even?",
        answer:
          "Lower fixed costs or increase margin (price - variable cost) to reduce it.",
      },
    ],
    compute: ({ fixed, price, variable }) => md(fixed / Math.max(1, price - variable)),
  },

  "income-split": {
    slug: "income-split",
    formula: "Share = Total Income * Share Percentage",
    fields: [
      { key: "income", label: "Total Income (₹)", type: "number" },
      { key: "share", label: "Share (%)", type: "percentage" },
    ],
    example: {
      inputs: { income: 1000000, share: 30 },
      output: md(1000000 * 0.3),
      explanation:
        "Split income based on percentage share between collaborators.",
    },
    faqs: [
      {
        question: "What is this for?",
        answer:
          "Useful for splitting revenue, commissions, or ownership-based payouts.",
      },
      {
        question: "Can shares exceed 100%?",
        answer: "No, shares should add up to 100% across participants.",
      },
    ],
    compute: ({ income, share }) => md(income * (share / 100)),
  },
};

export function getCalculatorConfig(slug: string) {
  return calculatorConfigs[slug];
}
