import { FavoriteCalculators } from "@/components/FavoriteCalculators";
import { HeroSection } from "@/components/HeroSection";
import { PopularCalculators } from "@/components/PopularCalculators";
import { RecentlyVisitedCalculators } from "@/components/RecentlyVisitedCalculators";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 lg:px-8">
      <HeroSection />
      <section className="flex justify-center">
        <Button asChild size="lg">
          <Link href="/calculators">
            <Calculator className="mr-2 h-5 w-5" />
            Browse All Calculators
          </Link>
        </Button>
      </section>
      <FavoriteCalculators />
      <PopularCalculators />
      <RecentlyVisitedCalculators />
    </div>
  );
}
