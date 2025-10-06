import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/deepl";

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLang, sourceLang } = await request.json();

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json({ error: "texts array is required" }, { status: 400 });
    }

    if (!targetLang) {
      return NextResponse.json({ error: "targetLang is required" }, { status: 400 });
    }

    // Translate all texts
    const translations = await Promise.all(
      texts.map(async text => {
        if (!text || text.trim() === "") {
          return "";
        }
        const result = await translateText(text, targetLang, sourceLang);
        return result.text;
      })
    );

    return NextResponse.json({
      translations,
      success: true,
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      {
        error: "Error translating text",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
