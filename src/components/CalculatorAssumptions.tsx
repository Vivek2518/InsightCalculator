"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatorConfig } from "@/lib/loadCalculator";

interface CalculatorAssumptionsProps {
  config: CalculatorConfig;
}

export function CalculatorAssumptions({ config }: CalculatorAssumptionsProps) {
  const hasAssumptions =
    (config.calculationNotes && config.calculationNotes.length > 0) ||
    (config.standards && config.standards.length > 0);

  if (!hasAssumptions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assumptions & Standards</CardTitle>
        <CardDescription>
          Key assumptions and standards used in this calculation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {config.calculationNotes && config.calculationNotes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Assumptions</h4>
              <ul className="space-y-2">
                {config.calculationNotes.map((note, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="rounded-full bg-primary/10 w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {config.standards && config.standards.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Standards</h4>
              <ul className="space-y-2">
                {config.standards.map((standard, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-muted-foreground">{standard}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
