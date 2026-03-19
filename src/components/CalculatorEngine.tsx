"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    const fieldMap: Record<string, typeof config.fields[number]> = {};
    config.fields.forEach((field) => {
      fieldMap[field.key] = field;
    });

    const parsed: Record<string, any> = {};
    for (const key in values) {
      const rawValue = values[key];
      const field = fieldMap[key];

      if (!field) {
        parsed[key] = rawValue;
        continue;
      }

      if (field.type === "number" || field.type === "percentage") {
        const num = Number(rawValue);
        parsed[key] = Number.isFinite(num) ? num : 0;
      } else if (field.type === "select") {
        const num = Number(rawValue);
        parsed[key] = Number.isFinite(num) ? num : rawValue;
      } else {
        // text/date and any other non-numeric types should remain strings
        parsed[key] = rawValue;
      }
    }

    return parsed;
  }, [values, config.fields]);

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
      case "text":
        return String(value);
      case "number":
      default:
        return Number.isInteger(value)
          ? value.toLocaleString("en-IN")
          : value.toFixed(2);
    }
  };

  const effectiveConcept = config.concept || config.introduction || config.description;
  const guideSteps = config.guideSteps || [
    "Enter your values into the fields above.",
    "Click Calculate.",
    "Review the results and compare with your expectations.",
    "Adjust inputs if you want to test different scenarios.",
  ];

  const standards = config.standards || config.calculationNotes || [];

  return (
    <div className="space-y-10">
      {/* Table of Contents */}
      <nav className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
        <p className="text-sm font-semibold text-foreground">Table of Contents</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>
            <a href="#calculator" className="text-primary hover:underline">
              Calculator
            </a>
          </li>
          <li>
            <a href="#guide" className="text-primary hover:underline">
              Quick Guide
            </a>
          </li>
          <li>
            <a href="#concept" className="text-primary hover:underline">
              What is {config.name}?
            </a>
          </li>
          <li>
            <a href="#formula" className="text-primary hover:underline">
              Formula
            </a>
          </li>
          <li>
            <a href="#standards" className="text-primary hover:underline">
              Key Standards
            </a>
          </li>
          <li>
            <a href="#faq" className="text-primary hover:underline">
              FAQ
            </a>
          </li>
        </ul>
      </nav>

      <section id="calculator" className="space-y-6">
        <h2 className="text-2xl font-semibold">Calculator</h2>
        <p className="text-sm text-muted-foreground">
          Enter your values below and get instant results.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Inputs & Outputs</CardTitle>
            <CardDescription>
              What you enter vs what you get back.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-foreground">Inputs</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {config.fields.map((field) => (
                  <li key={field.key}>• {field.label}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Outputs</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {config.outputs.map((output) => (
                  <li key={output.key}>• {output.label}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

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
                    <Select
                      value={values[field.key]}
                      onValueChange={(value) => handleInputChange(field.key, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "text" || field.type === "date" ? (
                    <Input
                      type={field.type === "date" ? "date" : "text"}
                      placeholder={field.placeholder || field.label}
                      value={values[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full"
                    />
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
                  const value = (() => {
                    if (result === null || result === undefined) return null;

                    // If the calculation produced a single scalar value and the UI expects
                    // just one output, use that scalar directly.
                    if (typeof result === "number" || typeof result === "string") {
                      if (config.outputs.length === 1) return result;
                      return null;
                    }

                    if (Array.isArray(result)) {
                      return result[0];
                    }

                    return (result as any)[output.key];
                  })();

                  const displayLabel = (() => {
                    if (
                      config.computationType === "bmiWeightLoss" &&
                      output.key === "weightToLose" &&
                      result?.direction
                    ) {
                      return result.direction === "Gain"
                        ? "Weight to Gain (kg)"
                        : result.direction === "Lose"
                        ? "Weight to Lose (kg)"
                        : "Weight change (kg)";
                    }
                    return output.label;
                  })();

                  return (
                    <div
                      key={output.key}
                      className="flex justify-between items-center p-4 bg-green-800/40 rounded border border-green-700"
                    >
                      <span className="text-sm font-medium text-green-100">
                        {displayLabel}
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
      </section>

      <section id="guide" className="space-y-6">
        <h2 className="text-2xl font-semibold">Quick Guide</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="steps">
            <AccordionTrigger>How to use</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {guideSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="concept">
            <AccordionTrigger>What is {config.name}?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{effectiveConcept}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="formula">
            <AccordionTrigger>Formula</AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="benchmarks">
            <AccordionTrigger>Keywords and Benchmarks</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Standards & Benchmarks</h3>
                {standards.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {standards.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific benchmarks available for this tool.</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq">
            <AccordionTrigger>FAQ</AccordionTrigger>
            <AccordionContent>
              {config.faqs.length > 0 ? (
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
              ) : (
                <p className="text-sm text-muted-foreground">No FAQs available for this calculator.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
