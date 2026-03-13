"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCalculatorConfig } from "@/lib/calculatorConfigs";
import { Calculator } from "@/data/calculators";
import { useRecent } from "@/lib/recent";

type CalculatorToolProps = {
  calculator: Calculator;
};

export function CalculatorTool({ calculator }: CalculatorToolProps) {
  const config = getCalculatorConfig(calculator.slug);
  const { addRecent } = useRecent();

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    config?.fields.forEach((field) => {
      initial[field.key] = "";
    });
    return initial;
  });

  useEffect(() => {
    addRecent(calculator.slug);
  }, [addRecent, calculator.slug]);

  const parsedValues = useMemo(() => {
    const parsed: Record<string, number> = {};
    for (const key in values) {
      const value = Number(values[key]);
      parsed[key] = Number.isFinite(value) ? value : 0;
    }
    return parsed;
  }, [values]);

  const result = useMemo(() => {
    if (!config) return null;
    const hasAll = config.fields.every((field) => values[field.key] !== "");
    if (!hasAll) return null;
    return config.compute(parsedValues);
  }, [config, parsedValues, values]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            We are working on this calculator. Check back soon for updates.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>
            Enter values below and click calculate to see results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {config.fields.map((field) => (
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
              onClick={() => {
                // no-op: results update automatically
              }}
              className="w-full"
            >
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Your output will appear below once all required inputs are provided.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-xl bg-muted/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">Result</p>
              <p className="mt-1 text-3xl font-semibold text-foreground">
                {result != null ? result : "Enter values to see the result"}
              </p>
            </div>
            {config.formula && (
              <div>
                <h4 className="text-sm font-semibold">Formula</h4>
                <p className="text-sm text-muted-foreground">{config.formula}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example</CardTitle>
          <CardDescription>{config.example.explanation}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(config.example.inputs).map(([key, value]) => (
                <div key={key} className="rounded-xl bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  <p className="text-lg font-medium">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Expected result</p>
              <p className="mt-1 text-xl font-semibold">{config.example.output}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
          <CardDescription>
            Common questions about this calculator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.faqs.map((faq) => (
              <div key={faq.question} className="space-y-1">
                <p className="text-sm font-semibold">{faq.question}</p>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
