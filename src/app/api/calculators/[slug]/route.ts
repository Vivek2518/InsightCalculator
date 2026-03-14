import { loadCalculator } from "@/lib/loadCalculator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const calculator = await loadCalculator(slug);

    if (!calculator) {
      return NextResponse.json(
        { success: false, error: "Calculator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: calculator });
  } catch (error) {
    console.error("Error fetching calculator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calculator" },
      { status: 500 }
    );
  }
}