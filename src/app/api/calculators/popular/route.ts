import { getPopularCalculators } from "@/lib/getRelatedCalculators";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const popular = await getPopularCalculators();
    return NextResponse.json({ success: true, data: popular });
  } catch (error) {
    console.error("Error fetching popular calculators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular calculators" },
      { status: 500 }
    );
  }
}