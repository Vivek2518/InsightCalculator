import { searchCalculators } from "@/lib/getRelatedCalculators";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Missing query" },
        { status: 400 }
      );
    }

    const results = await searchCalculators(query, limit);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error searching calculators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search calculators" },
      { status: 500 }
    );
  }
}