"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatorConfig } from "@/lib/loadCalculator";

interface CalculatorFormulaProps {
  config: CalculatorConfig;
}

export function CalculatorFormula({ config }: CalculatorFormulaProps) {
  if (!config.formula && !config.formulaDescription) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formula</CardTitle>
        {config.formulaDescription && (
          <CardDescription>{config.formulaDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <code className="text-sm font-mono">{config.formula}</code>
          </div>
          {config.concept && (
            <div>
              <p className="text-sm text-muted-foreground">{config.concept}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
