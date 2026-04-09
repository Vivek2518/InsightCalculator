import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AerospaceCalculatorTemplate } from "@/components/AerospaceCalculatorTemplate";
import { getAerospaceFormulaProfile } from "@/lib/aerospaceFormulaProfiles";
import {
  AEROSPACE_CATEGORIES,
  getAerospaceCategory,
  getAerospaceSubcategory,
  getAerospaceCalculator,
  getAerospaceCalculators,
  getAerospaceCalculatorPath,
  getAerospaceSubcategoryPath,
  isAerospaceCategoryKey,
  type AerospaceCategoryKey,
} from "@/lib/aerospaceTaxonomy";

type PageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
    calculator: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory, calculator } = await params;
  const categoryLower = category.toLowerCase();
  const subLower = subcategory.toLowerCase();
  const calculatorLower = calculator.toLowerCase();

  if (!isAerospaceCategoryKey(categoryLower)) {
    return {};
  }

  const categoryConfig = getAerospaceCategory(categoryLower);
  const subcategoryConfig = getAerospaceSubcategory(categoryLower, subLower);
  const calculatorConfig = getAerospaceCalculator(categoryLower, subLower, calculatorLower);

  if (!categoryConfig || !subcategoryConfig || !calculatorConfig) {
    return {};
  }

  return {
    title: `${calculatorConfig.title} Calculator | InsightCalculator`,
    description: `Use the free ${calculatorConfig.title} calculator for quick ${subcategoryConfig.title.toLowerCase()} estimates in ${categoryConfig.title.toLowerCase()}.`,
    alternates: {
      canonical: getAerospaceCalculatorPath(
        categoryLower as AerospaceCategoryKey,
        subLower,
        calculatorLower
      ),
    },
  };
}

export default async function AerospaceCalculatorPage({ params }: PageProps) {
  const { category, subcategory, calculator } = await params;
  const categoryLower = category.toLowerCase();
  const subLower = subcategory.toLowerCase();
  const calculatorLower = calculator.toLowerCase();

  if (!isAerospaceCategoryKey(categoryLower)) {
    notFound();
  }

  const categoryConfig = getAerospaceCategory(categoryLower);
  const subcategoryConfig = getAerospaceSubcategory(categoryLower, subLower);
  const calculatorConfig = getAerospaceCalculator(categoryLower, subLower, calculatorLower);

  if (!categoryConfig || !subcategoryConfig || !calculatorConfig) {
    notFound();
  }

  const relatedCalculators = getAerospaceCalculators(categoryLower, subLower)
    .filter((item) => item.key !== calculatorLower)
    .slice(0, 6)
    .map((item) => ({
      title: item.title,
      href: getAerospaceCalculatorPath(
        categoryLower as AerospaceCategoryKey,
        subLower,
        item.key
      ),
    }));

  const formulaProfile = getAerospaceFormulaProfile(calculatorConfig.title, {
    categoryKey: categoryLower,
    subcategoryKey: subLower,
  });
  const isReynoldsNumber = formulaProfile.calculationType === "reynoldsNumber";
  const isDynamicPressure = formulaProfile.calculationType === "dynamicPressure";
  const isAirspeedConversion =
    formulaProfile.calculationType === "airspeedConversion";

  const intro = isReynoldsNumber
    ? [
        "Reynolds Number estimates the flow regime by combining density, velocity, characteristic length, and dynamic viscosity.",
        "Choose characteristic length to match the problem geometry, such as airfoil chord, pipe diameter, or missile/UAV body length.",
        "Advanced mode can estimate density from ISA altitude and dynamic viscosity from Sutherland's law for quick atmospheric checks.",
      ]
    : isDynamicPressure
      ? [
          "Dynamic Pressure converts air density and air-relative speed into the aerodynamic loading term used in lift, drag, and air-data work.",
          "Use manual mode when local density is already known, altitude mode when you want ISA density from height, and Mach + altitude mode when flight condition is defined by compressible-flow inputs.",
          "Integrated mode computes ISA temperature, local speed of sound, velocity, density, and dynamic pressure in one engineering workflow.",
        ]
      : isAirspeedConversion
        ? [
            "Velocity Conversion (IAS/EAS/TAS) converts between common airspeed definitions using local ISA density at the selected altitude.",
            "Use IAS for cockpit-style low-speed indicated airspeed inputs, EAS for dynamic-pressure-equivalent speed, or TAS for actual air-relative flight speed.",
            "This model uses the standard EAS-TAS density-ratio relation and treats IAS as approximately equal to EAS unless a separate compressibility correction model is applied.",
          ]
    : [
        `${calculatorConfig.title} helps estimate key ${subcategoryConfig.title.toLowerCase()} values quickly.`,
        "Use it for quick design checks, what-if analysis, and early sizing decisions.",
        "For final design, always validate with higher-fidelity methods and standards.",
      ];

  const assumptions = isReynoldsNumber
    ? [
        "Use consistent SI units throughout the calculation.",
        "Advanced mode assumes standard ISA conditions up to 86 km and air viscosity from Sutherland's law.",
        "Characteristic length should represent the dominant dimension of the flow problem.",
      ]
    : isDynamicPressure
      ? [
          "Velocity is relative to the surrounding air and all inputs use SI units.",
          "Altitude-based modes assume ISA conditions up to 86 km.",
          "Mach + altitude mode assumes standard air with gamma = 1.4 and R = 287.05 J/kg.K.",
        ]
      : isAirspeedConversion
        ? [
            "Altitude is interpreted using the ISA atmosphere and local density is computed from that altitude.",
            "The EAS-TAS conversion uses the incompressible density-ratio relation with rho0 = 1.225 kg/m^3.",
            "IAS is treated as approximately equal to EAS, so compressibility and instrument corrections are not included.",
          ]
    : [
        "Inputs are in consistent units.",
        "The selected formula is a simplified engineering relation.",
        "Results are intended for preliminary analysis.",
      ];

  const recommendations = isReynoldsNumber
    ? [
        "For airfoils, use chord length; for pipes, use diameter; for missiles or UAVs, use body length.",
        "If measured density or viscosity is available, prefer manual mode over atmospheric estimates.",
        "Interpret the result alongside the geometry-specific transition criteria for your application.",
      ]
    : isDynamicPressure
      ? [
          "Use local measured density in manual mode when atmospheric conditions deviate from ISA.",
          "Use Mach + altitude mode when your flight condition is defined in terms of compressible-flow variables.",
          "For loads and performance calculations, make sure velocity is true airspeed or another air-relative speed consistent with the density used.",
        ]
      : isAirspeedConversion
        ? [
            "Use IAS input only for low-speed work where IAS approximately equals EAS.",
            "At estimated Mach above about 0.3, treat the IAS output as approximate because compressibility corrections are not included.",
            "Use the selected altitude carefully, since all EAS-TAS conversion is tied to the ISA density at that altitude.",
          ]
    : [
        "Validate boundary conditions before using outputs in design decisions.",
        "Compare multiple scenarios by varying one input at a time.",
        "Use conservative margins for safety-critical use cases.",
      ];

  const faqs = isReynoldsNumber
    ? [
        {
          question: "What characteristic length should I use?",
          answer:
            "Use the dimension that governs the flow problem: chord for an airfoil, diameter for a pipe, and body length for a missile or UAV.",
        },
        {
          question: "What does advanced altitude mode do?",
          answer:
            "It replaces manual density and viscosity inputs by computing density from ISA altitude and dynamic viscosity from Sutherland's law.",
        },
        {
          question: "Is this suitable for engineering work?",
          answer:
            "Yes for preliminary engineering analysis, provided you use the correct characteristic length and validate against measured properties when available.",
        },
      ]
    : isDynamicPressure
      ? [
          {
            question: "What velocity should I use for dynamic pressure?",
            answer:
              "Use air-relative velocity. In most aircraft workflows that means true airspeed or another speed quantity that is consistent with the density being used.",
          },
          {
            question: "What does Mach + altitude mode compute?",
            answer:
              "It computes ISA temperature from altitude, local speed of sound, velocity from Mach number, ISA density, and then dynamic pressure.",
          },
          {
            question: "Is this suitable for engineering use?",
          answer:
            "Yes for real engineering workflows such as performance checks, loads estimates, and air-data calculations, provided the ISA assumption matches the atmosphere you want to model.",
          },
        ]
      : isAirspeedConversion
        ? [
            {
              question: "How does this calculator treat IAS?",
              answer:
                "IAS is treated as approximately equal to EAS, which is appropriate for low-speed incompressible work. Instrument and compressibility corrections are not included.",
            },
            {
              question: "What atmosphere model is used?",
              answer:
                "The calculator uses ISA altitude to compute local density, then converts between EAS and TAS with the standard density-ratio relation.",
            },
            {
              question: "When should I use a more advanced model?",
              answer:
                "If the estimated Mach number is above about 0.3 or you need calibrated or compressible airspeed corrections, use a higher-fidelity air-data model instead of the IAS approximation here.",
            },
          ]
    : [
        {
          question: `What does ${calculatorConfig.title} calculate?`,
          answer: `It computes a key value in ${subcategoryConfig.title.toLowerCase()} using a standard aerospace engineering formula.`,
        },
        {
          question: "Are these results suitable for certification work?",
          answer: "Treat this as a fast estimation tool. Use detailed models and standard references for certification.",
        },
        {
          question: "Why are results hidden initially?",
          answer: "Results appear only after Calculate so inputs and outputs remain clearly separated.",
        },
      ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 lg:px-8">
      <Link
        href={getAerospaceSubcategoryPath(categoryLower as AerospaceCategoryKey, subLower)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {subcategoryConfig.title}
      </Link>

      <header>
        <h1 className="text-4xl font-bold">{calculatorConfig.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {categoryConfig.title} / {subcategoryConfig.title}
        </p>
      </header>

      <AerospaceCalculatorTemplate
        key={`${categoryLower}-${subLower}-${calculatorLower}`}
        title={calculatorConfig.title}
        intro={intro}
        inputDefinitions={formulaProfile.inputDefinitions}
        formulaLatex={formulaProfile.formulaLatex}
        formulaExplanation={formulaProfile.formulaExplanation}
        formulaDetails={formulaProfile.formulaDetails}
        calculationType={formulaProfile.calculationType}
        resultLabel={formulaProfile.resultLabel}
        resultUnit={formulaProfile.resultUnit}
        assumptions={assumptions}
        recommendations={recommendations}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      />
    </div>
  );
}

export async function generateStaticParams() {
  return AEROSPACE_CATEGORIES.flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      subcategory.calculators.map((calculatorTitle) => ({
        category: category.key,
        subcategory: subcategory.key,
        calculator: calculatorTitle
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      }))
    )
  );
}
