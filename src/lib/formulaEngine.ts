/**
 * Universal Formula Evaluation Engine
 * Handles different calculation types without hardcoding formulas
 */

export type ComputeParams = {
  principalKey?: string;
  rateKey?: string;
  tenureKey?: string;
  // For simple calculators that need derived outputs (e.g., annual vs monthly)
  baseKey?: string;
  multipliers?: Record<string, number>;
  [key: string]: any;
};

// Utility function to round values
const round = (value: number, decimals = 2): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

// EMI Calculation
const EMI = (principal: number, rate: number, tenureYears: number) => {
  const monthlyRate = rate / 100 / 12;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return principal / months;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return emi;
};

// Compound Interest
const compound = (principal: number, rate: number, years: number, n = 12) => {
  const r = rate / 100 / n;
  const t = years * n;
  return principal * Math.pow(1 + r, t);
};

// CAGR Calculation
const cagr = (start: number, end: number, years: number) => {
  if (start <= 0 || years <= 0) return 0;
  return Math.pow(end / start, 1 / years) - 1;
};

// Future Value Annuity (for SIP, PPF, NPS)
const futureValueAnnuity = (
  contribution: number,
  rate: number,
  years: number,
  frequency: number = 12
) => {
  const r = rate / 100 / frequency;
  const n = years * frequency;
  if (r === 0) return contribution * n;
  return contribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

// Income Tax Calculation
const incomeTax = (income: number, regime: number): number => {
  const regimeNew = [
    { upTo: 250000, rate: 0 },
    { upTo: 500000, rate: 0.05 },
    { upTo: 750000, rate: 0.1 },
    { upTo: 1000000, rate: 0.15 },
    { upTo: 1250000, rate: 0.2 },
    { upTo: 1500000, rate: 0.25 },
    { upTo: Infinity, rate: 0.3 },
  ];

  const regimeOld = [
    { upTo: 250000, rate: 0 },
    { upTo: 500000, rate: 0.05 },
    { upTo: 1000000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ];

  const slabs = regime === 1 ? regimeOld : regimeNew;
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
};

// SIP Calculation
const sipCalculation = (monthly: number, rate: number, tenure: number) => {
  const r = rate / 100 / 12;
  const n = tenure * 12;
  const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalInvested = monthly * n;
  return {
    futureValue: round(futureValue),
    totalInvested: round(totalInvested),
    gainedAmount: round(futureValue - totalInvested),
  };
};

// Step-up SIP Calculation
const stepupSipCalculation = (
  monthly: number,
  rate: number,
  step: number,
  years: number
) => {
  const r = rate / 100 / 12;
  const totalMonths = years * 12;
  let value = 0;
  let totalInvested = 0;

  for (let m = 0; m < totalMonths; m++) {
    const year = Math.floor(m / 12);
    const contrib = monthly * Math.pow(1 + step / 100, year);
    totalInvested += contrib;
    value += contrib * Math.pow(1 + r, totalMonths - m);
  }

  return {
    futureValue: round(value),
    totalInvested: round(totalInvested),
    gainedAmount: round(value - totalInvested),
  };
};

// RD Calculation
const rdCalculation = (
  monthly: number,
  rate: number,
  years: number,
  frequency: number
) => {
  const f = frequency || 12;
  const r = rate / 100 / f;
  const n = years * f;
  const totalDeposited = monthly * n;
  const maturity = monthly * ((Math.pow(1 + r, n) - 1) / (1 - Math.pow(1 + r, -1 / f)));
  return {
    maturityAmount: round(maturity),
    totalDeposited: round(totalDeposited),
    interestEarned: round(maturity - totalDeposited),
  };
};

// Loan Eligibility Calculation
const loanEligibilityCalculation = (
  monthlyIncome: number,
  monthlyObligations: number,
  rate: number,
  tenure: number
) => {
  const capacity = Math.max(0, monthlyIncome - monthlyObligations) * 0.5;
  const monthlyRate = rate / 100 / 12;
  const months = tenure * 12;

  if (monthlyRate === 0) return round(capacity * months);

  const principal =
    (capacity * (Math.pow(1 + monthlyRate, months) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, months));

  return round(principal);
};

// Reverse EMI (Loan Interest Rate)
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

// Solve Annual Rate (via binary search)
const solveAnnualRate = (
  principal: number,
  emi: number,
  tenureYears: number
): number => {
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

// SWP Calculation
const swpCalculation = (corpus: number, rate: number, years: number) => {
  const r = rate / 100 / 12;
  const n = years * 12;
  if (r === 0) return round(corpus / n);
  const monthlyWithdrawal = (corpus * r) / (1 - Math.pow(1 + r, -n));
  return {
    monthlyWithdrawal: round(monthlyWithdrawal),
    annualWithdrawal: round(monthlyWithdrawal * 12),
    totalWithdrawn: round(monthlyWithdrawal * n),
  };
};

// HRA Calculation
const hraCalculation = (hra: number, rent: number, salary: number) => {
  const exemption = Math.min(hra, rent - 0.1 * salary, 0.5 * salary);
  return {
    exemption: round(exemption),
    taxableHra: round(hra - exemption),
  };
};

// Capital Gains Calculation
const capitalGainsCalculation = (
  sale: number,
  cost: number,
  expense: number,
  years: number
) => {
  const gain = Math.max(0, sale - cost - expense);
  const rate = years >= 2 ? 0.2 : 0.15;
  const tax = gain * rate;
  return {
    gain: round(gain),
    tax: round(tax),
  };
};

// EPF Calculation
const epfCalculation = (salary: number, years: number, rate: number) => {
  const monthlyContribution = salary * 0.12 * 2; // employee + employer contribution
  const total = monthlyContribution * years * 12;
  const epfBalance = total * (1 + (rate / 100) * (years * 0.5));
  return round(epfBalance);
};

export interface CalculatorInput {
  computationType: string;
  values: Record<string, number>;
  computeParams?: ComputeParams;
}

/**
 * Main evaluation function that routes to the correct calculator
 */
export function evaluateCalculator(input: CalculatorInput): any {
  const { computationType, values } = input;

  switch (computationType) {
    case "emi": {
      const principal = values.principal || 0;
      const rate = values.rate || 0;
      const tenure = values.tenure || 0;
      const emi = EMI(principal, rate, tenure);
      const totalAmount = emi * tenure * 12;
      const totalInterest = totalAmount - principal;
      return {
        emi: round(emi),
        totalAmount: round(totalAmount),
        totalInterest: round(totalInterest),
      };
    }

    case "sip": {
      const monthly = values.monthly || 0;
      const rate = values.rate || 0;
      const tenure = values.tenure || 0;
      return sipCalculation(monthly, rate, tenure);
    }

    case "stepupSip": {
      const monthly = values.monthly || 0;
      const rate = values.rate || 0;
      const step = values.step || 0;
      const years = values.years || 0;
      return stepupSipCalculation(monthly, rate, step, years);
    }

    case "compound": {
      const principal = values.principal || 0;
      const rate = values.rate || 0;
      const years = values.years || 0;
      const frequency = values.frequency || 12;
      const amount = compound(principal, rate, years, frequency);
      return {
        amount: round(amount),
        interest: round(amount - principal),
      };
    }

    case "lumpsum": {
      const principal = values.principal || 0;
      const rate = values.rate || 0;
      const years = values.years || 0;
      const futureValue = compound(principal, rate, years, 1);
      return {
        futureValue: round(futureValue),
        gain: round(futureValue - principal),
      };
    }

    case "cagr": {
      const start = values.start || 1;
      const end = values.end || 0;
      const years = values.years || 1;
      const cagrValue = cagr(start, end, years) * 100;
      return round(cagrValue);
    }

    case "percentage": {
      const total = values.totalQuestions || 0;
      const wrong = values.wrongAnswers || 0;
      const correct = total - wrong;
      const percentage = total > 0 ? (correct / total) * 100 : 0;
      let grade = "F";
      if (percentage >= 90) grade = "A";
      else if (percentage >= 80) grade = "B";
      else if (percentage >= 70) grade = "C";
      else if (percentage >= 60) grade = "D";
      return { percentage: round(percentage, 2), grade };
    }

    case "average": {
      const numbers = input.computeParams?.numbers || [];
      let sum = 0;
      let count = 0;
      numbers.forEach((numKey: string) => {
        const num = values[numKey] || 0;
        sum += num;
        count++;
      });
      const average = count > 0 ? sum / count : 0;
      return { average: round(average, 2) };
    }

    case "overtime": {
      const wage = values.hourlyWage || 0;
      const regular = values.regularHours || 0;
      const overtime = values.overtimeHours || 0;
      const rate = values.overtimeRate || 1;
      const totalPay = regular * wage + overtime * wage * rate;
      return { totalPay: round(totalPay, 2) };
    }

    case "margin": {
      const cost = values.cost || 0;
      const price = values.sellingPrice || 0;
      const profit = price - cost;
      const marginPercent = price > 0 ? (profit / price) * 100 : 0;
      return { marginPercent: round(marginPercent, 2), profit: round(profit, 2) };
    }

    case "calorie": {
      const age = values.age || 0;
      const weight = values.weight || 0;
      const height = values.height || 0;
      const gender = input.computeParams?.genderKey ? values[input.computeParams.genderKey] : 'male';
      let bmr = 0;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      const activity = values.activity || 1.2;
      const dailyCalories = bmr * activity;
      return { dailyCalories: round(dailyCalories) };
    }

    case "dice": {
      const numDice = values.numDice || 1;
      const sides = values.sides || 6;
      const rolls = [];
      let total = 0;
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      return { rolls: rolls.join(', '), total };
    }

    case "age": {
      const birthdateStr = input.computeParams?.dateKey ? values[input.computeParams.dateKey] : '';
      if (!birthdateStr) return { years: 0, months: 0, days: 0 };
      const birthdate = new Date(birthdateStr);
      const today = new Date();
      let years = today.getFullYear() - birthdate.getFullYear();
      let months = today.getMonth() - birthdate.getMonth();
      let days = today.getDate() - birthdate.getDate();
      if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      return { years, months, days };
    }

    case "tds": {
      const amount = values.amount || 0;
      const rate = values.rate || 0;
      const tds = round((amount * rate) / 100);
      return {
        tds,
        netAmount: round(amount - tds),
      };
    }

    case "breakEven": {
      const fixed = values.fixed || 0;
      const price = values.price || 0;
      const variable = values.variable || 0;
      const denominator = price - variable;
      const units = denominator === 0 ? 0 : fixed / denominator;
      const revenue = units * price;
      return {
        breakEvenUnits: round(units),
        breakEvenRevenue: round(revenue),
      };
    }

    case "mutualFundReturn": {
      const initial = values.initial || 0;
      const final = values.final || 0;
      const gain = final - initial;
      const returnPercent = initial === 0 ? 0 : (gain / initial) * 100;
      return {
        returnPercent: round(returnPercent),
        gainAmount: round(gain),
      };
    }

    case "incomeSplit": {
      const income = values.income || 0;
      const sharePct = values.share || 0;
      const shareAmount = round((income * sharePct) / 100);
      const remainingAmount = round(income - shareAmount);
      return {
        shareAmount,
        remainingAmount,
      };
    }

    case "gst": {
      const amount = values.amount || 0;
      const rate = values.rate || 0;
      const gstAmount = amount * (rate / 100);
      return {
        gstAmount: round(gstAmount),
        totalAmount: round(amount + gstAmount),
      };
    }

    case "incomeTax": {
      const income = values.income || 0;
      const regime = values.regime || 0;
      const tax = incomeTax(income, regime);
      return {
        tax: round(tax),
        afterTax: round(income - tax),
      };
    }

    case "swp": {
      const corpus = values.corpus || 0;
      const rate = values.rate || 0;
      const years = values.years || 0;
      return swpCalculation(corpus, rate, years);
    }

    case "rd": {
      const monthly = values.monthly || 0;
      const rate = values.rate || 0;
      const years = values.years || 0;
      const frequency = values.frequency || 12;
      return rdCalculation(monthly, rate, years, frequency);
    }

    case "annuity": {
      const contribution = values.contribution || 0;
      const rate = values.rate || 0;
      const years = values.years || 0;
      const futureValue = futureValueAnnuity(contribution, rate, years, 1);
      const totalContributed = contribution * years;
      return {
        maturityAmount: round(futureValue),
        futureValue: round(futureValue),
        totalContributed: round(totalContributed),
        interestEarned: round(futureValue - totalContributed),
      };
    }

    case "loanEligibility": {
      const monthlyIncome = values.monthlyIncome || 0;
      const monthlyObligations = values.monthlyObligations || 0;
      const rate = values.rate || 0;
      const tenure = values.tenure || 0;
      return round(
        loanEligibilityCalculation(monthlyIncome, monthlyObligations, rate, tenure)
      );
    }

    case "loanRate": {
      const principal = values.principal || 0;
      const emi = values.emi || 0;
      const tenure = values.tenure || 0;
      return round(solveAnnualRate(principal, emi, tenure));
    }

    case "hra": {
      const hra = values.hra || 0;
      const rent = values.rent || 0;
      const salary = values.salary || 0;
      return hraCalculation(hra, rent, salary);
    }

    case "capitalGains": {
      const sale = values.sale || 0;
      const cost = values.cost || 0;
      const expense = values.expense || 0;
      const years = values.years || 0;
      return capitalGainsCalculation(sale, cost, expense, years);
    }

    case "inflation": {
      const amount = values.amount || 0;
      const rate = values.rate || 0;
      const years = values.years || 0;
      const futureAmount = compound(amount, rate, years, 1);
      return {
        futureAmount: round(futureAmount),
        purchasingPowerLoss: round(futureAmount - amount),
      };
    }

    case "epf": {
      const salary = values.salary || 0;
      const years = values.years || 0;
      const rate = values.rate || 0;
      return epfCalculation(salary, years, rate);
    }

    default:
      throw new Error(`Unknown computation type: ${computationType}`);
  }
}
