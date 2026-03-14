"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { evaluateCalculator } from "@/lib/formulaEngine";
import type { CalculatorConfig } from "@/lib/loadCalculator";
import { useRecent } from "@/lib/recent";

interface CalculatorEngineProps {
  config: CalculatorConfig;
  addToRecent?: (slug: string) => void;
}

export function CalculatorEngine({ config, addToRecent }: CalculatorEngineProps) {
  const { addRecent } = useRecent();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    config.fields.forEach((field) => {
      initial[field.key] = "";
    });
    return initial;
  });

  const [result, setResult] = useState<any>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Add to recently viewed
  useEffect(() => {
    // Use the hook first, fallback to prop if provided
    if (addRecent) {
      addRecent(config.slug);
    } else if (addToRecent) {
      addToRecent(config.slug);
    }
  }, [config.slug, addToRecent, addRecent]);

  // Parse string values to numbers
  const parsedValues = useMemo(() => {
    const parsed: Record<string, number> = {};
    for (const key in values) {
      const value = Number(values[key]);
      parsed[key] = Number.isFinite(value) ? value : 0;
    }
    return parsed;
  }, [values]);

  // Check if all required fields are filled
  const isComplete = useMemo(() => {
    return config.fields.every((field) => values[field.key] !== "");
  }, [values, config.fields]);

  // Handle calculation
  const handleCalculate = () => {
    if (!isComplete) return;

    try {
      const calculationResult = evaluateCalculator({
        computationType: config.computationType,
        values: parsedValues,
        computeParams: config.computeParams,
      });

      setResult(calculationResult);
      setHasCalculated(true);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult(null);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Reset result when inputs change
    if (hasCalculated) {
      setResult(null);
      setHasCalculated(false);
    }
  };

  // Format output value based on format type
  const formatValue = (value: any, format: string): string => {
    if (typeof value !== "number") return String(value);

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(2)}%`;
      case "number":
      default:
        return Number.isInteger(value)
          ? value.toLocaleString("en-IN")
          : value.toFixed(2);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inputs Card */}
      <Card>
        <CardHeader>
          <CardTitle>Calculator Inputs</CardTitle>
          <CardDescription>
            Enter your values and click Calculate to see results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {field.label}
                </label>
                {field.type === "select" && field.options ? (
                  <select
                    value={values[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select an option</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type="number"
                    placeholder={field.placeholder || field.label}
                    value={values[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    inputMode="decimal"
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!isComplete}
            size="lg"
            className="w-full mt-6"
          >
            Calculate
          </Button>
        </CardContent>
      </Card>

      {/* Results Card */}
      {hasCalculated && result !== null && (
        <Card className="border-green-500 bg-gradient-to-br from-green-900 to-green-950">
          <CardHeader>
            <CardTitle className="text-green-50">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {config.outputs.map((output) => {
                const value = Array.isArray(result)
                  ? result[0]
                  : result[output.key];

                return (
                  <div
                    key={output.key}
                    className="flex justify-between items-center p-4 bg-green-800/40 rounded border border-green-700"
                  >
                    <span className="text-sm font-medium text-green-100">
                      {output.label}
                    </span>
                    <span className="text-lg font-bold text-green-300">
                      {formatValue(value, output.format)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formula Used</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-mono text-sm text-muted-foreground">{config.formula}</p>
          {config.formulaDescription && (
            <p className="text-sm text-muted-foreground">{config.formulaDescription}</p>
          )}
        </CardContent>
      </Card>

      {/* Example Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-background p-3 rounded border">
            <p className="text-sm font-medium mb-2">Input:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              {Object.entries(config.example.inputs).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-background p-3 rounded border">
            <p className="text-sm font-medium mb-2">Output:</p>
            <div className="text-sm text-foreground space-y-1">
              {Object.entries(config.example.outputs).map(([key, value]) => {
                const outputConfig = config.outputs.find((o) => o.key === key);
                const format = outputConfig?.format || "number";
                return (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span className="font-mono">
                      {formatValue(value, format)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            {config.example.explanation}
          </p>
        </CardContent>
      </Card>

      {/* FAQs */}
      {config.faqs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {config.faqs.map((faq, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {idx + 1}. {faq.question}
                  </p>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
