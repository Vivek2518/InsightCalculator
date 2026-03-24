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
    slug: string[];
  }>;
};

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Extract calculator slug from the last segment of the path
  // e.g., from ['aerospace', 'atmosphere', 'air-density-calculator'] -> 'air-density'
  const lastSegment = slug[slug.length - 1];
  const calculatorSlug = lastSegment.endsWith('-calculator') 
    ? lastSegment.slice(0, -'-calculator'.length)
    : lastSegment;
  
  const calculator = await loadCalculator(calculatorSlug);

  if (!calculator) {
    notFound();
  }

  const backCategory = calculator.subcategory || calculator.category;
  const backUrl = getCategoryPath(backCategory);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <Link href={backUrl} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to {formatCategoryName(backCategory)}
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
  const { slug } = await params;
  
  // Extract calculator slug from the last segment
  const lastSegment = slug[slug.length - 1];
  const calculatorSlug = lastSegment.endsWith('-calculator') 
    ? lastSegment.slice(0, -'-calculator'.length)
    : lastSegment;
  
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