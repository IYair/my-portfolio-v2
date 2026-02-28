import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    // Revalidate the about page for all locales
    revalidatePath("/es/about");
    revalidatePath("/en/about");

    return NextResponse.json({
      revalidated: true,
      paths: ["/es/about", "/en/about"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating about page:", error);
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
