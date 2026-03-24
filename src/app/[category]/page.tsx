import { redirect, notFound } from "next/navigation";
import { getCategoryPath } from "@/lib/calculatorCategories";

const categoryMapping: Record<string, { topCategory: string; subcategory: string; displayName: string }> = {
  atmosphere: { topCategory: "aerospace", subcategory: "atmosphere", displayName: "Atmosphere" },
  "flight-mechanics": { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "Flight Mechanics" },
  propulsion: { topCategory: "aerospace", subcategory: "propulsion", displayName: "Propulsion" },
  "orbital-mechanics": { topCategory: "aerospace", subcategory: "orbital-mechanics", displayName: "Space" },
  aerodynamics: { topCategory: "aerospace", subcategory: "atmosphere", displayName: "Aerodynamics" },
  performance: { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "Performance" },
  gnc: { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "GNC" },
  structures: { topCategory: "aerospace", subcategory: "flight-mechanics", displayName: "Structures" },
  drones: { topCategory: "drone", subcategory: "drone", displayName: "Drones" },
};

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryKey = category.toLowerCase();
  const categoryConfig = categoryMapping[categoryKey];

  if (!categoryConfig) {
    notFound();
  }

  return redirect(getCategoryPath(categoryConfig.subcategory));
}

export async function generateStaticParams() {
  return Object.keys(categoryMapping).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryKey = category.toLowerCase();
  const categoryConfig = categoryMapping[categoryKey];

  if (!categoryConfig) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryConfig.displayName} | Insight Calculator`,
    description: `Browse all ${categoryConfig.displayName} calculators`,
  };
}
