import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { CalculatorEngine } from "@/components/CalculatorEngine";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { CalculatorIntro } from "@/components/CalculatorIntro";
import { loadCalculator } from "@/lib/loadCalculator";
import { getPopularCalculators } from "@/lib/getRelatedCalculators";
import type { CalculatorConfig } from "@/lib/loadCalculator";
import {
  generateIntro,
  generateFormulaExplanation,
  generateExample,
  generateFaqSections,
  formatFaqForSchema,
} from "@/lib/seoTemplates";

const CANONICAL_DOMAIN = "https://www.insightcalculator.com";

function buildMetaDescription(config: CalculatorConfig): string {
  const base = config.description.trim();
  const cta = "Try it now for instant results!";
  const maxLen = 155;

  const full = `${base} ${cta}`.trim();
  if (full.length <= maxLen) return full;

  const truncated = full.slice(0, maxLen).replace(/\s+$/, "");
  return `${truncated}…`;
}

export async function generateStaticParams() {
  const popular = await getPopularCalculators(10);
  return popular.map((calculator) => ({
    slug: calculator.slug,
  }));
}

export const revalidate = 60; // ISR: regenerate pages every 60 seconds

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const { slug } = await params;
  const config = await loadCalculator(slug);
  
  if (!config) {
    return {
      title: "Calculator not found",
    };
  }

  const canonicalUrl = `${CANONICAL_DOMAIN}/calculators/${slug}`;
  const keywords = [
    "free online calculator",
    "financial calculator",
    config.name.toLowerCase(),
    config.category.toLowerCase(),
    "calculator tool",
    "business calculator",
    "investment calculator",
    "tax calculator",
    "loan calculator",
    "savings calculator",
  ].join(", ");

  const description = buildMetaDescription(config);

  return {
    title: `${config.name} – Free Online Calculator | Insight Calculator`,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${config.name} – Free Online Calculator | Insight Calculator`,
      description,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} – Free Online Calculator | Insight Calculator`,
      description,
    },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const config = await loadCalculator(slug);

  if (!config) {
    notFound();
  }

  const canonicalUrl = `${CANONICAL_DOMAIN}/calculators/${slug}`;

  // Generate SEO content from calculator metadata
  const intro = generateIntro(config);
  const formulaExplanation = generateFormulaExplanation(config);
  const example = generateExample(config);
  const faqs = generateFaqSections(config);

  // Enhanced structured data with additional fields
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.name,
    "description": config.description,
    "url": canonicalUrl,
    "applicationCategory": "FinanceApplication",
    "applicationSubCategory": config.category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "creator": {
      "@type": "Organization",
      "name": "InsightCalculator",
      "url": CANONICAL_DOMAIN,
    },
    "featureList": config.fields.map((field) => field.label),
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/UseAction",
      "userInteractionCount": 1,
    },
  };

  // FAQ structured data
  const faqStructuredData = formatFaqForSchema(faqs);

  // SoftwareApplication structured data
  const softwareAppData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": config.name,
    "description": config.description,
    "applicationCategory": "Calculator",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <CalculatorLayout
        title={config.name}
        description={config.description}
        actions={<FavoriteToggle slug={slug} />}
        aside={<RelatedCalculators slug={slug} category={config.category} />}
      >
        <CalculatorIntro config={config} />
        <CalculatorEngine config={config} />
      </CalculatorLayout>
    </>
  );
}
