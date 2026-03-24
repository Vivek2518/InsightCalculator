"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { evaluateCalculator } from "@/lib/formulaEngine";
import { useRecent } from "@/lib/recent";
import type { CalculatorConfig } from "@/lib/loadCalculator";

type CalculatorToolProps = {
  calculator: CalculatorConfig;
};

export function CalculatorTool({ calculator }: CalculatorToolProps) {
  const { addRecent } = useRecent();

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    calculator.fields.forEach((field) => {
      initial[field.key] = "";
    });
    return initial;
  });

  useEffect(() => {
    addRecent(calculator.slug);
  }, [addRecent, calculator.slug]);

  const [result, setResult] = useState<any>(null);

  const parsedValues = useMemo(() => {
    const parsed: Record<string, number> = {};
    for (const key in values) {
      const value = Number(values[key]);
      parsed[key] = Number.isFinite(value) ? value : 0;
    }
    return parsed;
  }, [values]);

  const canCalculate = calculator.fields.every((field) => values[field.key] !== "");

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    if (!canCalculate) return;

    try {
      const output = evaluateCalculator({
        computationType: calculator.computationType,
        values: parsedValues,
        computeParams: calculator.computeParams,
      });
      setResult(output);
    } catch (error) {
      console.error("Calculator error:", error);
      setResult({ error: "Could not compute result." });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculator</CardTitle>
          <CardDescription>
            Enter your values below to calculate instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {calculator.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  {field.label}
                </label>
                <Input
                  type="number"
                  value={values[field.key] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    handleChange(field.key, event.target.value)
                  }
                />
              </div>
            ))}
            <Button
              className="w-full"
              onClick={handleCalculate}
              disabled={!canCalculate}
            >
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {result == null ? (
            <div className="rounded-xl border border-dashed border-muted p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Press Calculate to see results.
              </p>
            </div>
          ) : typeof result === "number" ? (
            <div className="rounded-xl bg-muted/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">Result</p>
              <p className="mt-2 text-4xl font-bold text-foreground">{result}</p>
            </div>
          ) : result && typeof result === "object" ? (
            <div className="rounded-xl bg-muted/30 p-4">
              {Object.entries(result).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-border/40 py-2">
                  <span className="text-sm text-muted-foreground capitalize">{key}</span>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-red-500/10 p-4 text-red-600">Unable to compute.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
