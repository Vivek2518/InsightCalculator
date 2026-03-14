import { getRelatedCalculators } from "@/lib/getRelatedCalculators";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    if (!slug || !category) {
      return NextResponse.json(
        { success: false, error: "Missing slug or category" },
        { status: 400 }
      );
    }

    const related = await getRelatedCalculators(slug, category, 4);
    return NextResponse.json({ success: true, data: related });
  } catch (error) {
    console.error("Error fetching related calculators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch related calculators" },
      { status: 500 }
    );
  }
}