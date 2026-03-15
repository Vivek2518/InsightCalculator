"use client";

import type { CalculatorConfig } from "@/lib/loadCalculator";

interface CalculatorIntroProps {
  config: CalculatorConfig;
}

export function CalculatorIntro({ config }: CalculatorIntroProps) {
  const intro = `${config.name} helps you calculate ${config.description.toLowerCase()}. Use this free online tool to get instant, accurate results for your ${config.category.toLowerCase()} planning. Simply enter your values below and click calculate.`;

  return (
    <div className="mb-6">
      <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground">
        {intro}
      </p>
    </div>
  );
}