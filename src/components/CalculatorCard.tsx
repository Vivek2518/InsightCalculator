"use client";

import Link from "next/link";
import { Calculator } from "@/data/calculators";
import { CalculatorConfig } from "@/lib/loadCalculator";
import { getCalculatorPathFromSlug } from "@/lib/calculatorCategories";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon } from "lucide-react";
import { FavoriteToggle } from "@/components/FavoriteToggle";

export type CalculatorCardSummary = {
  slug: string;
  name: string;
  description: string;
  path?: string;
};

type CalculatorCardProps = {
  calculator: Calculator | CalculatorConfig | CalculatorCardSummary;
};

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const calculatorPath = (calculator as any).path ?? getCalculatorPathFromSlug(calculator.slug);

  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Clickable header */}
      <Link href={calculatorPath} className="block">
        <CardHeader className="cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalculatorIcon className="h-5 w-5" />
            </span>
            <CardTitle>{calculator.name}</CardTitle>
          </div>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            {calculator.description}
          </CardDescription>
        </CardHeader>
      </Link>

      <CardFooter className="mt-2 flex items-center">
        {/* Open button */}
        <Button
          size="sm"
          className="ml-auto"
          variant="secondary"
          onClick={() => {
            window.location.href = calculatorPath;
          }}
        >
          Open
        </Button>

        {/* Favorite toggle */}
        <div className="ml-2">
          <FavoriteToggle slug={calculator.slug} />
        </div>
      </CardFooter>
    </Card>
  );
}