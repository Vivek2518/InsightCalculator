import { getPopularCalculators } from "@/lib/getRelatedCalculators";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const popular = await getPopularCalculators();
    return NextResponse.json(popular);
  } catch (error) {
    console.error("Error fetching popular calculators:", error);
    return NextResponse.json({ error: "Failed to fetch popular calculators" }, { status: 500 });
  }
}