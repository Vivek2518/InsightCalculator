"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RelatedCalculator = { title: string; href: string };

type InputDef = {
  key: "input1" | "input2" | "input3";
  label: string;
  description: string;
  unit?: string;
  hint?: string;
};

type Props = {
  title: string;
  intro: string[];
  inputDefinitions: InputDef[];
  formulaLatex: string;
  formulaExplanation: string;
  assumptions: string[];
  recommendations: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedCalculators: RelatedCalculator[];
};

function getDefaultHint(label: string, unit?: string): string {
  const lowerLabel = label.toLowerCase();
  const lowerUnit = (unit || "").toLowerCase();

  if (lowerLabel.includes("pressure") || lowerUnit === "pa") return "e.g. 101325";
  if (lowerLabel.includes("temperature") || lowerUnit === "k") return "e.g. 288.15";
  if (lowerLabel.includes("gas constant")) return "e.g. 287.05";
  if (lowerLabel.includes("velocity") || lowerUnit === "m/s") return "e.g. 250";
  if (lowerLabel.includes("density") || lowerUnit === "kg/m^3") return "e.g. 1.225";
  if (lowerLabel.includes("area") || lowerUnit === "m^2") return "e.g. 16.2";
  if (lowerLabel.includes("mass") || lowerUnit === "kg") return "e.g. 1200";
  if (lowerLabel.includes("weight") || lowerUnit === "n") return "e.g. 11772";
  if (lowerLabel.includes("power") || lowerUnit === "w") return "e.g. 4500";
  if (lowerLabel.includes("current") || lowerUnit === "a") return "e.g. 22";
  if (lowerLabel.includes("voltage") || lowerUnit === "v") return "e.g. 22.2";
  if (lowerLabel.includes("time") || lowerUnit === "h") return "e.g. 1.5";

  return `e.g. ${unit ? `value in ${unit}` : "10"}`;
}

export function AerospaceCalculatorTemplate(props: Props) {
  const {
    title,
    intro,
    inputDefinitions,
    formulaLatex,
    formulaExplanation,
    assumptions,
    recommendations,
    faqs,
    relatedCalculators,
  } = props;

  const [inputs, setInputs] = useState({ input1: "", input2: "", input3: "" });
  const [hasCalculated, setHasCalculated] = useState(false);

  const result = useMemo(() => {
    const a = Number(inputs.input1 || 0);
    const b = Number(inputs.input2 || 0);
    const c = Number(inputs.input3 || 1);
    const raw = (a * b) / (c === 0 ? 1 : c);
    return Number.isFinite(raw) ? raw : 0;
  }, [inputs.input1, inputs.input2, inputs.input3]);

  return (
    <div className="space-y-8">
      <section id="toc" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Table of Contents</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <a href="#about" className="text-muted-foreground hover:text-foreground">About this calculator</a>
          <a href="#inputs" className="text-muted-foreground hover:text-foreground">Inputs</a>
          <a href="#results" className="text-muted-foreground hover:text-foreground">Results</a>
          <a href="#formula" className="text-muted-foreground hover:text-foreground">Formula used</a>
          <a href="#assumptions" className="text-muted-foreground hover:text-foreground">Assumptions</a>
          <a href="#recommendations" className="text-muted-foreground hover:text-foreground">Recommendations</a>
          <a href="#faqs" className="text-muted-foreground hover:text-foreground">FAQs</a>
          <a href="#related" className="text-muted-foreground hover:text-foreground">Related calculators</a>
        </div>
      </section>

      <section id="about" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">About this calculator</h2>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {intro.map((line) => <p key={line}>{line}</p>)}
        </div>
      </section>

      <section id="inputs" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the required values used in the formula for {title}.
        </p>
        <div className="mt-4 rounded-md border border-border bg-background p-4">
          <p className="text-sm font-medium">Required inputs for calculation</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {inputDefinitions.map((item) => (
              <li key={item.key}>
                <span className="font-medium text-foreground">{item.label}</span>
                {item.unit ? ` (${item.unit})` : ""} - {item.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(["input1", "input2", "input3"] as const).map((key, i) => (
            <label className="text-sm" key={key}>
              <div className="mb-1 text-muted-foreground">{inputDefinitions[i]?.label ?? key}</div>
              <input
                type="number"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={inputs[key]}
                onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={
                  inputDefinitions[i]?.hint ??
                  getDefaultHint(
                    inputDefinitions[i]?.label ?? "value",
                    inputDefinitions[i]?.unit
                  )
                }
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          onClick={() => setHasCalculated(true)}
        >
          Calculate
        </button>
      </section>

      <section id="results" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Results</h2>
        {!hasCalculated ? (
          <p className="mt-3 text-sm text-muted-foreground">Results are hidden until you click Calculate.</p>
        ) : (
          <div className="mt-3 rounded-md border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Calculated output for {title}</p>
            <p className="mt-1 text-2xl font-semibold">{result.toFixed(4)}</p>
          </div>
        )}
      </section>

      <section id="formula" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Formula used for calculations</h2>
        <div className="mt-3 rounded-md border border-border bg-background p-4">
          <p className="font-mono text-sm">{formulaLatex}</p>
          <p className="mt-2 text-sm text-muted-foreground">{formulaExplanation}</p>
        </div>
      </section>

      <section id="assumptions" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Assumptions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {assumptions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="recommendations" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {recommendations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="faqs" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">FAQs</h2>
        <div className="mt-3 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-md border border-border bg-background p-4">
              <summary className="cursor-pointer text-sm font-medium">{faq.question}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="related" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Related calculators</h2>
        <div className="mt-3 grid gap-2">
          {relatedCalculators.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md border border-border bg-background px-4 py-3 text-sm hover:border-primary">
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

