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

  const intro = [
    `${calculatorConfig.title} helps estimate key ${subcategoryConfig.title.toLowerCase()} values quickly.`,
    "Use it for quick design checks, what-if analysis, and early sizing decisions.",
    "For final design, always validate with higher-fidelity methods and standards.",
  ];

  const assumptions = [
    "Inputs are in consistent units.",
    "The selected formula is a simplified engineering relation.",
    "Results are intended for preliminary analysis.",
  ];

  const recommendations = [
    "Validate boundary conditions before using outputs in design decisions.",
    "Compare multiple scenarios by varying one input at a time.",
    "Use conservative margins for safety-critical use cases.",
  ];

  const faqs = [
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

  const formulaProfile = getAerospaceFormulaProfile(calculatorConfig.title, {
    categoryKey: categoryLower,
    subcategoryKey: subLower,
  });

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
