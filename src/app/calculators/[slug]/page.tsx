import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { CalculatorTool } from "@/components/CalculatorTool";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { getCalculatorBySlug, calculators } from "@/data/calculators";
import { getCalculatorConfig } from "@/lib/calculatorConfigs";

export async function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.slug,
  }));
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) {
    return {
      title: "Calculator not found",
    };
  }

  const keywords = [
    "free online calculator",
    "financial calculator",
    calculator.name.toLowerCase(),
    calculator.category.toLowerCase(),
    "calculator tool",
    "business calculator",
    "investment calculator",
    "tax calculator",
    "loan calculator",
    "savings calculator",
  ].join(", ");

  return {
    title: `${calculator.name} — GanitaHub`,
    description: calculator.description,
    keywords,
    alternates: {
      canonical: `https://ganitahub.vercel.app/calculators/${slug}`,
    },
    openGraph: {
      title: `${calculator.name} — GanitaHub`,
      description: calculator.description,
      type: "website",
      url: `https://ganitahub.vercel.app/calculators/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${calculator.name} — GanitaHub`,
      description: calculator.description,
    },
  };
}

export default async function CalculatorPage({ params }: { params: any }) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  const config = getCalculatorConfig(slug);
  const canonicalUrl = `https://ganitahub.vercel.app/calculators/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": calculator.name,
    "description": calculator.description,
    "url": canonicalUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "creator": {
      "@type": "Organization",
      "name": "GanitaHub",
    },
    "featureList": config?.fields.map(field => field.label) || [],
  };

  const faqStructuredData = config?.faqs && config.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}
      <CalculatorLayout
        title={calculator.name}
        description={calculator.description}
        actions={<FavoriteToggle slug={calculator.slug} />}
        aside={<RelatedCalculators slug={calculator.slug} category={calculator.category} />}
      >
        <CalculatorTool calculator={calculator} />
      </CalculatorLayout>
    </>
  );
}
