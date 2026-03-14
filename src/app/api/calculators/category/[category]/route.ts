import { getCalculatorsByCategory } from "@/lib/loadCalculator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const calculators = await getCalculatorsByCategory(category);

    return NextResponse.json({ success: true, data: calculators });
  } catch (error) {
    console.error("Error fetching calculators by category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calculators by category" },
      { status: 500 }
    );
  }
}