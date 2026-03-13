"use client";

import Link from "next/link";
import { Calculator } from "@/data/calculators";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon } from "lucide-react";
import { FavoriteToggle } from "@/components/FavoriteToggle";

type CalculatorCardProps = {
  calculator: Calculator;
};

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader>
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
      <CardFooter className="mt-2 flex items-center">
        <Button asChild size="sm" className="ml-auto" variant="secondary">
          <Link href={`/calculators/${calculator.slug}`}>Open</Link>
        </Button>
        <FavoriteToggle slug={calculator.slug} className="ml-2" />
      </CardFooter>
    </Card>
  );
}
