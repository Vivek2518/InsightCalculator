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

// Amortization helper (same as EMI but returns breakdown)
const amortization = (principal: number, rate: number, tenureYears: number) => {
  const monthlyPayment = EMI(principal, rate, tenureYears);
  const months = tenureYears * 12;
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;
  return {
    monthlyPayment: round(monthlyPayment),
    totalPaid: round(totalPaid),
    totalInterest: round(totalInterest),
  };
};

// Remaining balance after a given number of payments (used for prepayment)
const remainingBalance = (
  principal: number,
  rate: number,
  tenureYears: number,
  paymentsMadeYears: number
) => {
  const monthlyRate = rate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const paidMonths = paymentsMadeYears * 12;

  if (monthlyRate === 0) {
    const remainingPrincipal = Math.max(0, principal - (principal / totalMonths) * paidMonths);
    return round(remainingPrincipal);
  }

  const monthlyPayment = EMI(principal, rate, tenureYears);
  const factor = Math.pow(1 + monthlyRate, paidMonths);
  const balance = principal * factor -
    monthlyPayment * ((factor - 1) / monthlyRate);
  return round(Math.max(0, balance));
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

// Greatest common divisor (used for simplifying ratios)
const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a === 0) return b;
  if (b === 0) return a;
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Date difference helper
const dateDifference = (start: string, end: string) => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { years: 0, months: 0, days: 0, totalDays: 0 };
  }

  if (endDate < startDate) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
};

// Time duration helper
const parseTime = (value: string) => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] ? Number(match[3]) : 0;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null;
  return { hours, minutes, seconds };
};

const timeDuration = (start: string, end: string) => {
  const startTime = parseTime(start);
  const endTime = parseTime(end);
  if (!startTime || !endTime) {
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }

  const startTotal = startTime.hours * 60 + startTime.minutes + startTime.seconds / 60;
  const endTotal = endTime.hours * 60 + endTime.minutes + endTime.seconds / 60;
  let diffMinutes = endTotal - startTotal;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // assume next day

  const hours = Math.floor(diffMinutes / 60);
  const minutes = Math.round(diffMinutes % 60);
  return { hours, minutes, totalMinutes: Math.round(diffMinutes) };
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

    case "amortization": {
      const principal = values.principal || 0;
      const rate = values.rate || 0;
      const tenure = values.tenure || 0;
      return amortization(principal, rate, tenure);
    }

    case "creditCardEmi": {
      const amount = values.amount || 0;
      const rate = values.rate || 0;
      const months = values.tenure || 0;
      const emi = EMI(amount, rate, months / 12);
      const totalPaid = emi * months;
      const totalInterest = totalPaid - amount;
      return {
        emi: round(emi),
        totalPaid: round(totalPaid),
        totalInterest: round(totalInterest),
      };
    }

    case "prepayment": {
      const principal = values.principal || 0;
      const rate = values.rate || 0;
      const tenure = values.tenure || 0;
      const paidYears = values.paidYears || 0;
      const prepayment = values.prepayment || 0;

      const monthlyEmi = EMI(principal, rate, tenure);
      const remaining = remainingBalance(principal, rate, tenure, paidYears);
      const afterPrepayment = Math.max(0, remaining - prepayment);

      return {
        monthlyEmi: round(monthlyEmi),
        remainingBalance: round(remaining),
        afterPrepayment: round(afterPrepayment),
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

    case "stockReturn": {
      const initial = values.initial || 0;
      const final = values.final || 0;
      const returnPct = initial > 0 ? ((final - initial) / initial) * 100 : 0;
      return { returnPct: round(returnPct, 2) };
    }

    case "dividendYield": {
      const dividend = values.dividend || 0;
      const price = values.price || 0;
      const yieldPct = price > 0 ? (dividend / price) * 100 : 0;
      return { yieldPct: round(yieldPct, 2) };
    }

    case "retirementCorpus": {
      const annualExpenses = values.annualExpenses || 0;
      const withdrawalRate = values.withdrawalRate || 0;
      const corpus = withdrawalRate > 0 ? annualExpenses / (withdrawalRate / 100) : 0;
      return { corpus: round(corpus) };
    }

    case "inflationAdjustedReturn": {
      const nominal = values.nominal || 0;
      const inflation = values.inflation || 0;
      const real = (1 + nominal / 100) / (1 + inflation / 100) - 1;
      return { realReturn: round(real * 100, 2) };
    }

    case "portfolioReturn": {
      const returns = input.computeParams?.returns || [];
      const weights = input.computeParams?.weights || [];
      let total = 0;
      let weightSum = 0;
      for (let i = 0; i < returns.length; i++) {
        const rKey = returns[i];
        const wKey = weights[i];
        const r = values[rKey] || 0;
        const w = values[wKey] || 0;
        total += (r * w) / 100;
        weightSum += w;
      }
      const portfolio = weightSum > 0 ? (total / (weightSum / 100)) : 0;
      return { portfolioReturn: round(portfolio, 2) };
    }

    case "percentageOf": {
      const part = values[input.computeParams?.partKey || "part"] || 0;
      const whole = values[input.computeParams?.wholeKey || "whole"] || 0;
      const percentage = whole !== 0 ? (part / whole) * 100 : 0;
      return { percentage: round(percentage, 2) };
    }

    case "discount": {
      const price = values[input.computeParams?.priceKey || "price"] || 0;
      const discount = values[input.computeParams?.discountKey || "discountPercent"] || 0;
      const discountAmount = round((price * discount) / 100, 2);
      const finalPrice = round(price - discountAmount, 2);
      return { discountAmount, finalPrice };
    }

    case "dateDifference": {
      const start = String(values[input.computeParams?.startKey || "startDate"] || "");
      const end = String(values[input.computeParams?.endKey || "endDate"] || "");
      return dateDifference(start, end);
    }

    case "timeDuration": {
      const start = String(values[input.computeParams?.startKey || "startTime"] || "");
      const end = String(values[input.computeParams?.endKey || "endTime"] || "");
      return timeDuration(start, end);
    }

    case "ratio": {
      const a = values[input.computeParams?.aKey || "valueA"] || 0;
      const b = values[input.computeParams?.bKey || "valueB"] || 0;
      const common = gcd(a, b);
      const simplifiedA = common === 0 ? 0 : a / common;
      const simplifiedB = common === 0 ? 0 : b / common;
      return {
        ratio: `${a}:${b}`,
        simplifiedRatio: `${simplifiedA}:${simplifiedB}`,
      };
    }

    case "overtime": {
      const wage = values.hourlyWage || 0;
      const regular = values.regularHours || 0;
      const overtime = values.overtimeHours || 0;
      const rate = values.overtimeRate || 1;
      const totalPay = regular * wage + overtime * wage * rate;
      return { totalPay: round(totalPay, 2) };
    }

    case "salaryHike": {
      const currentSalary = values.currentSalary || 0;
      const hikePercent = values.hikePercent || 0;
      const newSalary = currentSalary * (1 + hikePercent / 100);
      return {
        newSalary: round(newSalary),
        increment: round(newSalary - currentSalary),
      };
    }

    case "takeHomeSalary": {
      const gross = values.grossSalary || 0;
      const taxRate = values.taxRate || 0;
      const deductions = values.deductions || 0;
      const net = gross - (gross * (taxRate / 100)) - deductions;
      return { takeHome: round(net) };
    }

    case "inHandSalary": {
      const basic = values.basicSalary || 0;
      const hra = values.hra || 0;
      const other = values.otherAllowances || 0;
      const deductions = values.deductions || 0;
      const inHand = basic + hra + other - deductions;
      return { inHand: round(inHand) };
    }

    case "hourlyToSalary": {
      const hourly = values.hourlyWage || 0;
      const hoursPerWeek = values.hoursPerWeek || 0;
      const weeksPerYear = values.weeksPerYear || 0;
      const annual = hourly * hoursPerWeek * weeksPerYear;
      return { annualSalary: round(annual) };
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

    case "bmi": {
      const weight = values.weight || 0;
      const height = values.height || 0;
      const bmi = height > 0 ? weight / ((height / 100) ** 2) : 0;
      const classification = input.computeParams?.classification || 'adult';
      let category = '';
      if (classification === 'adult' || classification === 'men' || classification === 'women') {
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
      } else if (classification === 'geriatric') {
        if (bmi < 22) category = 'Underweight (<22)';
        else if (bmi <= 27) category = 'Healthy (22-27)';
        else category = 'Overweight (>27)';
      } else if (classification === 'kids') {
        category = 'Use pediatric growth charts for full evaluation';
      } else if (classification === 'teens') {
        category = 'Use age/gender growth charts for interpretation';
      }
      return {
        bmi: round(bmi, 2),
        category,
      };
    }

    case "bmiWeightLoss": {
      const weight = values.weight || 0;
      const height = values.height || 0;
      const targetBMI = values.targetBMI || 0;
      const bmi = height > 0 ? weight / ((height / 100) ** 2) : 0;
      const targetWeight = targetBMI * ((height / 100) ** 2);
      const change = weight - targetWeight;
      const direction = change > 0 ? "Lose" : change < 0 ? "Gain" : "Maintain";

      return {
        bmi: round(bmi, 2),
        targetWeight: round(targetWeight, 2),
        weightToLose: round(Math.abs(change), 2),
        direction,
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

    // Aerospace / Flight Mechanics Calculations
    case "machNumber": {
      const speed = values.speed || 0;
      const speedOfSound = values.speedOfSound || 0;
      const mach = speedOfSound > 0 ? speed / speedOfSound : 0;
      return { mach: round(mach, 2) };
    }

    case "speedOfSound": {
      const temperature = values.temperature || 0;
      const T = temperature + 273.15;
      const gamma = 1.4;
      const R = 287.058;
      const speed = T > 0 ? Math.sqrt(gamma * R * T) : 0;
      return { speedOfSound: round(speed, 2) };
    }

    case "airDensity": {
      const pressure = values.pressure || 0;
      const temperature = values.temperature || 0;
      const T = temperature + 273.15;
      const R = 287.058;
      const density = T > 0 ? pressure / (R * T) : 0;
      return { density: round(density, 4) };
    }

    case "pressureAtAltitude": {
      const altitude = values.altitude || 0;
      const P0 = 101325;
      const T0 = 288.15;
      const L = 0.0065;
      const g = 9.80665;
      const R = 287.058;
      const term = 1 - (L * altitude) / T0;
      const pressure = term > 0 ? P0 * Math.pow(term, g / (R * L)) : 0;
      return { pressure: round(pressure, 2) };
    }

    case "temperatureAtAltitude": {
      const altitude = values.altitude || 0;
      const T0 = 15;
      const L = 0.0065;
      const temp = T0 - L * altitude;
      return { temperature: round(temp, 2) };
    }

    case "liftForce": {
      const rho = values.airDensity || 0;
      const v = values.velocity || 0;
      const S = values.wingArea || 0;
      const Cl = values.liftCoefficient || 0;
      const lift = 0.5 * rho * v * v * S * Cl;
      return { lift: round(lift, 2) };
    }

    case "dragForce": {
      const rho = values.airDensity || 0;
      const v = values.velocity || 0;
      const S = values.wingArea || 0;
      const Cd = values.dragCoefficient || 0;
      const drag = 0.5 * rho * v * v * S * Cd;
      return { drag: round(drag, 2) };
    }

    case "liftToDragRatio": {
      const lift = values.lift || 0;
      const drag = values.drag || 0;
      const ratio = drag > 0 ? lift / drag : 0;
      return { liftToDragRatio: round(ratio, 2) };
    }

    case "stallSpeed": {
      const weight = values.weight || 0;
      const rho = values.airDensity || 0;
      const S = values.wingArea || 0;
      const ClMax = values.clMax || 0;
      const stall = rho > 0 && S > 0 && ClMax > 0 ? Math.sqrt((2 * weight) / (rho * S * ClMax)) : 0;
      return { stallSpeed: round(stall, 2) };
    }

    case "wingLoading": {
      const weight = values.weight || 0;
      const S = values.wingArea || 0;
      const loading = S > 0 ? weight / S : 0;
      return { wingLoading: round(loading, 2) };
    }

    case "glideRatio": {
      const lift = values.lift || 0;
      const drag = values.drag || 0;
      const ratio = drag > 0 ? lift / drag : 0;
      return { glideRatio: round(ratio, 2) };
    }

    case "thrust": {
      const massFlow = values.massFlowRate || 0;
      const exhaustVelocity = values.exhaustVelocity || 0;
      const thrust = massFlow * exhaustVelocity;
      return { thrust: round(thrust, 2) };
    }

    case "thrustToWeight": {
      const thrust = values.thrust || 0;
      const mass = values.mass || 0;
      const g0 = 9.80665;
      const ratio = mass > 0 ? thrust / (mass * g0) : 0;
      return { thrustToWeight: round(ratio, 2) };
    }

    case "fuelConsumption": {
      const thrust = values.thrust || 0;
      const isp = values.isp || 0;
      const g0 = 9.80665;
      const mdot = isp > 0 ? thrust / (isp * g0) : 0;
      return { massFlowRate: round(mdot, 4) };
    }

    case "specificImpulse": {
      const thrust = values.thrust || 0;
      const massFlow = values.massFlowRate || 0;
      const g0 = 9.80665;
      const isp = massFlow > 0 ? thrust / (massFlow * g0) : 0;
      return { specificImpulse: round(isp, 2) };
    }

    case "escapeVelocity": {
      const mass = values.mass || 0;
      const radius = values.radius || 0;
      const G = 6.6743e-11;
      const vel = mass > 0 && radius > 0 ? Math.sqrt((2 * G * mass) / radius) : 0;
      return { escapeVelocity: round(vel, 2) };
    }

    case "orbitalVelocity": {
      const mass = values.mass || 0;
      const radius = values.radius || 0;
      const G = 6.6743e-11;
      const vel = mass > 0 && radius > 0 ? Math.sqrt((G * mass) / radius) : 0;
      return { orbitalVelocity: round(vel, 2) };
    }

    case "orbitalPeriod": {
      const mass = values.mass || 0;
      const radius = values.radius || 0;
      const G = 6.6743e-11;
      const period = mass > 0 && radius > 0 ? 2 * Math.PI * Math.sqrt((radius ** 3) / (G * mass)) : 0;
      return { orbitalPeriod: round(period, 2) };
    }

    case "circularOrbitSpeed": {
      const mass = values.mass || 0;
      const bodyRadius = values.radius || 0;
      const altitude = values.altitude || 0;
      const G = 6.6743e-11;
      const r = bodyRadius + altitude;
      const vel = mass > 0 && r > 0 ? Math.sqrt((G * mass) / r) : 0;
      return { orbitalSpeed: round(vel, 2) };
    }

    // Drone Calculators
    case "droneFlightTime": {
      // Input parameters
      const batteryCapacity_mAh = values.batteryCapacity || 5000; // mAh
      const batteryVoltage = values.batteryVoltage || 11.55; // V
      const systemEfficiency_percent = values.systemEfficiency || 85; // %
      const usableDischargeFraction = values.usableDischargeFraction || 0.8; // 0-1
      const powerModeVal = String(values.powerMode || "direct"); // "direct" or "weight"
      const averagePower = values.averagePower || 0; // W (if direct mode)
      const droneWeight = values.droneWeight || 0; // kg (if weight mode)
      const powerPerKg = values.powerPerKg || 150; // W/kg (default)
      const flightProfileVal = String(values.flightProfile || "normal"); // "light", "normal", "aggressive"

      // Convert units
      const C = batteryCapacity_mAh / 1000; // Ah
      const V = batteryVoltage; // V
      const eta = systemEfficiency_percent / 100; // dimensionless
      const D = usableDischargeFraction; // dimensionless

      // Calculate power consumption
      let P = averagePower; // W
      if (powerModeVal === "weight" && droneWeight > 0) {
        P = droneWeight * powerPerKg; // W = kg × W/kg
      }

      // Handle edge case where power is zero
      if (P <= 0) {
        P = 1; // Prevent division by zero
      }

      // Calculate usable energy: Wh = C (Ah) × V (V) × η × D
      const usableEnergy_Wh = C * V * eta * D;

      // Calculate ideal flight time: hours = Energy / Power
      const idealFlightTime_hours = usableEnergy_Wh / P;
      const idealFlightTimeMin = idealFlightTime_hours * 60;

      // Apply real-world correction based on flight profile
      const profileMultipliers: Record<string, number> = {
        light: 0.75, // Hovering/gentle flight
        normal: 0.6, // Mixed/normal flight
        aggressive: 0.35, // High-speed/racing
      };
      const profileMultiplier =
        profileMultipliers[flightProfileVal] || profileMultipliers["normal"];
      const realWorldFlightTimeMin = idealFlightTimeMin * profileMultiplier;

      return {
        calculatedPower: round(P, 0),
        usableEnergy: round(usableEnergy_Wh, 2),
        idealFlightTimeMin: round(idealFlightTimeMin, 2),
        realWorldFlightTimeMin: round(realWorldFlightTimeMin, 2),
        profileMultiplier: round(profileMultiplier, 2),
      };
    }

    case "batteryCapacityConverter": {
      const capacity = values.capacity || 0;
      const unit = values.unit || "mAh";
      const voltage = values.voltage || 3.7;
      let mAh, Wh;
      if (unit === "mAh") {
        mAh = capacity;
        Wh = (capacity * voltage) / 1000;
      } else {
        Wh = capacity;
        mAh = (capacity * 1000) / voltage;
      }
      return { mAh: round(mAh, 0), Wh: round(Wh, 2) };
    }

    case "powerConsumption": {
      const voltage = values.batteryVoltage || 12;
      const current = values.currentDraw || 0;
      const power = voltage * current;
      return { power: round(power, 0) };
    }

    case "motorEfficiency": {
      const inputPower = values.inputPower || 1;
      const outputPower = values.outputPower || 0;
      const efficiency = (outputPower / inputPower) * 100;
      const powerLoss = inputPower - outputPower;
      return { 
        efficiency: round(efficiency, 2), 
        powerLoss: round(powerLoss, 2) 
      };
    }

    case "energyDensity": {
      const energy = values.energy || 0; // Wh
      const weight = values.weight || 0.001; // kg
      const density = weight > 0 ? energy / weight : 0;
      return { energyDensity: round(density, 2) };
    }

    case "hoverPower": {
      const droneMass = values.droneMass || 1; // kg
      const numRotors = values.numRotors || 4;
      const rotorDiameter = values.rotorDiameter || 15; // inches
      const g = 9.81; // m/s²
      const rotor_m = rotorDiameter * 0.0254; // convert inches to meters
      const rotorArea = Math.PI * (rotor_m / 2) ** 2;
      const rho = 1.225; // kg/m³ air density
      const efficiency = 0.85;
      const hoverThrust = (droneMass * g) / numRotors;
      const totalHoverPower = (hoverThrust ** 2) / (2 * rho * rotorArea * numRotors * efficiency);
      const powerPerRotor = totalHoverPower / numRotors;
      return { 
        hoverThrust: round(hoverThrust, 3), 
        totalHoverPower: round(totalHoverPower, 2),
        powerPerRotor: round(powerPerRotor, 2)
      };
    }

    case "batteryDischargeRate": {
      const currentDraw = values.currentDraw || 0; // Amps
      const batteryCapacity = values.batteryCapacity || 1000; // mAh
      const cRating = values.cRating || 75;
      const capacity_A = batteryCapacity / 1000; // Convert mAh to Ah
      const dischargeRate = capacity_A > 0 ? currentDraw / capacity_A : 0;
      const isSafe = dischargeRate <= cRating ? "Yes, Safe" : "No, Unsafe";
      const safetyMargin = cRating - dischargeRate;
      return { 
        dischargeRate: round(dischargeRate, 1), 
        isSafe,
        safetyMargin: round(Math.max(safetyMargin, 0), 1)
      };
    }

    default:
      throw new Error(`Unknown computation type: ${computationType}`);
  }
}
