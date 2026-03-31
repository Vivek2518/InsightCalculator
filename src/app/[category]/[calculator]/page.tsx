import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CalculatorTool } from "@/components/CalculatorTool";
import { CalculatorIntro } from "@/components/CalculatorIntro";
import { CalculatorFormula } from "@/components/CalculatorFormula";
import { CalculatorAssumptions } from "@/components/CalculatorAssumptions";
import { CalculatorFAQ } from "@/components/CalculatorFAQ";
import { loadCalculator } from "@/lib/loadCalculator";
import { formatCategoryName } from "@/lib/formatCategoryName";
import { getCategoryPath } from "@/lib/calculatorCategories";

type PageProps = {
  params: Promise<{
    category: string;
    calculator: string;
  }>;
};

export default async function CalculatorPage({ params }: PageProps) {
  const { category, calculator: calculatorSlugRaw } = await params;
  
  // Extract calculator slug from the segment
  // e.g., 'air-density-calculator' -> 'air-density'
  const calculatorSlug = calculatorSlugRaw.endsWith('-calculator') 
    ? calculatorSlugRaw.slice(0, -'-calculator'.length)
    : calculatorSlugRaw;
  
  const calculator = await loadCalculator(calculatorSlug);

  if (!calculator) {
    notFound();
  }

  const backUrl = getCategoryPath(category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <Link href={backUrl} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to {formatCategoryName(category)}
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-1">{calculator.name}</h1>
        <p className="text-muted-foreground">{calculator.description}</p>
      </header>

      <div className="space-y-8">
        <CalculatorIntro config={calculator} />
        <CalculatorTool calculator={calculator} />
        <CalculatorFormula config={calculator} />
        <CalculatorAssumptions config={calculator} />
        <CalculatorFAQ config={calculator} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { calculator: calculatorSlugRaw } = await params;
  
  // Extract calculator slug from the segment
  const calculatorSlug = calculatorSlugRaw.endsWith('-calculator') 
    ? calculatorSlugRaw.slice(0, -'-calculator'.length)
    : calculatorSlugRaw;
  
  const calculator = await loadCalculator(calculatorSlug);

  if (!calculator) {
    return {
      title: "Calculator Not Found",
    };
  }

  return {
    title: `${calculator.name} | Insight Calculator`,
    description: calculator.description,
  };
}
