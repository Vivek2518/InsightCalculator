"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculateIsaAirDensity,
  calculateReynoldsNumber,
  calculateSutherlandDynamicViscosity,
  ISA_MAX_ALTITUDE_METERS,
} from "@/lib/aerospaceCalculations";

type RelatedCalculator = { title: string; href: string };

type InputDef = {
  key: string;
  label: string;
  description: string;
  unit?: string;
  hint?: string;
  defaultValue?: number;
};

type FormulaDetailSection = {
  title: string;
  lines: string[];
};

type ResultDetail = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  intro: string[];
  inputDefinitions: InputDef[];
  formulaLatex: string;
  formulaExplanation: string;
  formulaDetails?: FormulaDetailSection[];
  calculationType?:
    | "genericRatio"
    | "droneRequiredThrust"
    | "droneThrustToWeightRatio"
    | "isaAirDensity"
    | "reynoldsNumber";
  resultLabel?: string;
  resultUnit?: string;
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
  if (lowerLabel.includes("viscosity") || lowerUnit === "pa.s") return "e.g. 1.789e-5";
  if (lowerLabel.includes("altitude")) return "e.g. 12000";
  if (lowerLabel.includes("velocity") || lowerUnit === "m/s") return "e.g. 250";
  if (lowerLabel.includes("density") || lowerUnit === "kg/m^3") return "e.g. 1.225";
  if (lowerLabel.includes("characteristic length")) return "e.g. 1.5";
  if (lowerLabel.includes("area") || lowerUnit === "m^2") return "e.g. 16.2";
  if (lowerLabel.includes("mass") || lowerUnit === "kg") return "e.g. 1200";
  if (lowerLabel.includes("weight") || lowerUnit === "n") return "e.g. 11772";
  if (lowerLabel.includes("thrust factor")) return "e.g. 2.5";
  if (lowerLabel.includes("efficiency")) return "e.g. 0.8";
  if (lowerLabel.includes("thrust")) return "e.g. 45";
  if (lowerLabel.includes("power") || lowerUnit === "w") return "e.g. 4500";
  if (lowerLabel.includes("current") || lowerUnit === "a") return "e.g. 22";
  if (lowerLabel.includes("voltage") || lowerUnit === "v") return "e.g. 22.2";
  if (lowerLabel.includes("time") || lowerUnit === "h") return "e.g. 1.5";

  return `e.g. ${unit ? `value in ${unit}` : "10"}`;
}

function formatDefaultValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toString();
}

function createInitialInputs(inputDefinitions: InputDef[]): Record<string, string> {
  return inputDefinitions.reduce<Record<string, string>>((acc, input) => {
    acc[input.key] =
      input.defaultValue == null ? "" : formatDefaultValue(input.defaultValue);
    return acc;
  }, {});
}

function formatResultValue(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000 || (absoluteValue > 0 && absoluteValue < 0.001)) {
    return value.toExponential(4);
  }

  return value.toFixed(4);
}

function formatResultDetailValue(value: number, unit: string, digits = 4): string {
  const absoluteValue = Math.abs(value);
  const formattedValue =
    absoluteValue >= 1_000_000 || (absoluteValue > 0 && absoluteValue < 0.001)
      ? value.toExponential(digits)
      : value.toFixed(digits);

  return `${formattedValue} ${unit}`;
}

const REYNOLDS_ADVANCED_INPUT_DEFINITIONS: InputDef[] = [
  {
    key: "altitude",
    label: "Altitude (h)",
    description: "ISA altitude above mean sea level for automatic air property estimation",
    unit: "m",
    hint: "e.g. 5000",
    defaultValue: 0,
  },
  {
    key: "velocity",
    label: "Velocity (V)",
    description: "Flow speed",
    unit: "m/s",
    hint: "e.g. 70",
  },
  {
    key: "length",
    label: "Characteristic Length (L)",
    description: "Relevant physical length, such as chord, diameter, or body length",
    unit: "m",
    hint: "e.g. 1.5",
  },
];

function mergeInputDefinitions(...groups: InputDef[][]): InputDef[] {
  const merged = new Map<string, InputDef>();

  groups.flat().forEach((input) => {
    if (!merged.has(input.key)) {
      merged.set(input.key, input);
    }
  });

  return Array.from(merged.values());
}

export function AerospaceCalculatorTemplate(props: Props) {
  const {
    title,
    intro,
    inputDefinitions,
    formulaLatex,
    formulaExplanation,
    formulaDetails,
    calculationType = "genericRatio",
    resultLabel = "Calculated output",
    resultUnit,
    assumptions,
    recommendations,
    faqs,
    relatedCalculators,
  } = props;

  const [reynoldsMode, setReynoldsMode] = useState<"manual" | "advanced">("manual");
  const allInputDefinitions =
    calculationType === "reynoldsNumber"
      ? mergeInputDefinitions(inputDefinitions, REYNOLDS_ADVANCED_INPUT_DEFINITIONS)
      : inputDefinitions;
  const activeInputDefinitions =
    calculationType === "reynoldsNumber" && reynoldsMode === "advanced"
      ? REYNOLDS_ADVANCED_INPUT_DEFINITIONS
      : inputDefinitions;
  const [inputs, setInputs] = useState<Record<string, string>>(() =>
    createInitialInputs(allInputDefinitions)
  );
  const [hasCalculated, setHasCalculated] = useState(false);

  const result = useMemo(() => {
    const getValue = (key: string) => {
      const value = Number(inputs[key] || 0);
      return Number.isFinite(value) ? value : 0;
    };

    let raw = 0;
    let error: string | null = null;
    let details: ResultDetail[] = [];

    switch (calculationType) {
      case "isaAirDensity": {
        const isaResult = calculateIsaAirDensity(getValue("altitude"));

        if (!isaResult) {
          error = `Enter an altitude between 0 and ${ISA_MAX_ALTITUDE_METERS.toLocaleString()} m for the ISA model.`;
          break;
        }

        raw = isaResult.density;
        break;
      }
      case "reynoldsNumber": {
        const velocity = getValue("velocity");
        const characteristicLength = getValue("length");

        if (velocity < 0) {
          error = "Velocity must be zero or greater.";
          break;
        }

        if (characteristicLength <= 0) {
          error = "Characteristic length must be greater than zero.";
          break;
        }

        if (reynoldsMode === "advanced") {
          const isaResult = calculateIsaAirDensity(getValue("altitude"));

          if (!isaResult) {
            error = `Enter an altitude between 0 and ${ISA_MAX_ALTITUDE_METERS.toLocaleString()} m for the ISA model.`;
            break;
          }

          const dynamicViscosity = calculateSutherlandDynamicViscosity(
            isaResult.temperature
          );

          if (!dynamicViscosity) {
            error = "Unable to compute dynamic viscosity from the ISA temperature.";
            break;
          }

          const reynoldsNumber = calculateReynoldsNumber({
            density: isaResult.density,
            velocity,
            characteristicLength,
            dynamicViscosity,
          });

          if (reynoldsNumber == null) {
            error = "Check that velocity and characteristic length are valid for Reynolds number.";
            break;
          }

          raw = reynoldsNumber;
          details = [
            {
              label: "Density used (ISA)",
              value: formatResultDetailValue(isaResult.density, "kg/m^3"),
            },
            {
              label: "Dynamic viscosity used (Sutherland)",
              value: formatResultDetailValue(dynamicViscosity, "Pa.s"),
            },
            {
              label: "Temperature used (ISA)",
              value: `${isaResult.temperature.toFixed(2)} K`,
            },
          ];
          break;
        }

        const density = getValue("density");
        const dynamicViscosity = getValue("dynamicViscosity");

        if (density <= 0) {
          error = "Density must be greater than zero.";
          break;
        }

        if (dynamicViscosity <= 0) {
          error = "Dynamic viscosity must be greater than zero.";
          break;
        }

        const reynoldsNumber = calculateReynoldsNumber({
          density,
          velocity,
          characteristicLength,
          dynamicViscosity,
        });

        if (reynoldsNumber == null) {
          error = "Check that density, velocity, characteristic length, and viscosity are valid.";
          break;
        }

        raw = reynoldsNumber;
        break;
      }
      case "droneRequiredThrust": {
        const efficiency = getValue("efficiency");
        if (efficiency === 0) {
          raw = 0;
          break;
        }
        raw =
          (getValue("mass") * getValue("gravity") * getValue("thrustFactor")) /
          efficiency;
        break;
      }
      case "droneThrustToWeightRatio": {
        const denominator = getValue("mass") * getValue("gravity");
        if (denominator === 0) {
          raw = 0;
          break;
        }
        raw = (getValue("totalThrust") * getValue("efficiency")) / denominator;
        break;
      }
      case "genericRatio":
      default: {
        const [first, second, third] = inputDefinitions;
        const a = first ? getValue(first.key) : 0;
        const b = second ? getValue(second.key) : 0;
        const c = third ? getValue(third.key) : 1;
        raw = (a * b) / (c === 0 ? 1 : c);
      }
    }

    return {
      raw: Number.isFinite(raw) ? raw : 0,
      error,
      details,
    };
  }, [calculationType, inputDefinitions, inputs, reynoldsMode]);

  const canCalculate = activeInputDefinitions.every(
    (input) => (inputs[input.key] ?? "") !== ""
  );
  const hasDefaultedInputs = activeInputDefinitions.some(
    (input) => input.defaultValue != null
  );
  const inputGridClassName =
    activeInputDefinitions.length >= 4
      ? "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      : activeInputDefinitions.length === 3
        ? "mt-4 grid gap-4 md:grid-cols-3"
        : activeInputDefinitions.length === 2
          ? "mt-4 grid gap-4 md:grid-cols-2"
          : "mt-4 grid gap-4";

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
        {calculationType === "reynoldsNumber" ? (
          <div className="mt-4 rounded-md border border-border bg-background p-4">
            <p className="text-sm font-medium">Calculation mode</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-md px-3 py-2 text-sm ${
                  reynoldsMode === "manual"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
                onClick={() => {
                  setReynoldsMode("manual");
                  setHasCalculated(false);
                }}
              >
                Manual rho and mu
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-2 text-sm ${
                  reynoldsMode === "advanced"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
                onClick={() => {
                  setReynoldsMode("advanced");
                  setHasCalculated(false);
                }}
              >
                Advanced altitude mode
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Advanced mode computes density from ISA and dynamic viscosity from
              Sutherland&apos;s law using altitude.
            </p>
          </div>
        ) : null}
        <div className="mt-4 rounded-md border border-border bg-background p-4">
          <p className="text-sm font-medium">Required inputs for calculation</p>
          {hasDefaultedInputs ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Default values are prefilled where applicable. You can overwrite them.
            </p>
          ) : null}
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {activeInputDefinitions.map((item) => (
              <li key={item.key}>
                <span className="font-medium text-foreground">{item.label}</span>
                {item.unit ? ` (${item.unit})` : ""} - {item.description}
              </li>
            ))}
          </ul>
        </div>
        <div className={inputGridClassName}>
          {activeInputDefinitions.map((input) => (
            <label className="text-sm" key={input.key}>
              <div className="mb-1 text-muted-foreground">{input.label}</div>
              <input
                type="number"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={inputs[input.key] ?? ""}
                onChange={(e) => setInputs((prev) => ({ ...prev, [input.key]: e.target.value }))}
                placeholder={
                  input.hint ??
                  getDefaultHint(
                    input.label ?? "value",
                    input.unit
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
          disabled={!canCalculate}
        >
          Calculate
        </button>
      </section>

      <section id="results" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Results</h2>
        {!hasCalculated ? (
          <p className="mt-3 text-sm text-muted-foreground">Results are hidden until you click Calculate.</p>
        ) : result.error ? (
          <div className="mt-3 rounded-md border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">{result.error}</p>
          </div>
        ) : (
          <div className="mt-3 rounded-md border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">{resultLabel} for {title}</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatResultValue(result.raw)}
              {resultUnit ? ` ${resultUnit}` : ""}
            </p>
            {result.details.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {result.details.map((detail) => (
                  <div key={detail.label} className="rounded-md border border-border/70 bg-card p-3">
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className="mt-1 text-sm font-medium">{detail.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>

      <section id="formula" className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Formula used for calculations</h2>
        <div className="mt-3 rounded-md border border-border bg-background p-4">
          <p className="font-mono text-base font-semibold">{formulaLatex}</p>
          {formulaDetails?.length ? (
            <div className="mt-4 space-y-4">
              {formulaDetails.map((section) => (
                <div key={section.title} className="rounded-md border border-border/70 bg-card p-4">
                  <p className="text-sm font-medium text-foreground">{section.title}</p>
                  <div className="mt-3 space-y-2">
                    {section.lines.map((line) => (
                      <p key={line} className="font-mono text-sm leading-6 text-foreground/90">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
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
