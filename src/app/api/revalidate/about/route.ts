import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate the about page
    revalidatePath("/about");

    return NextResponse.json({
      revalidated: true,
      path: "/about",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating about page:", error);
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
