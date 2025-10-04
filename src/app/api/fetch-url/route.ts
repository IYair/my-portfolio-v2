import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ success: 0, message: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ success: 0, message: "Invalid URL" }, { status: 400 });
    }

    // Try to fetch real metadata from the URL
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Link Preview Bot)",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch URL");
      }

      const html = await response.text();

      // Simple meta tag extraction
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descriptionMatch =
        html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i) ||
        html.match(
          /<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i
        );
      const imageMatch = html.match(
        /<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i
      );

      const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
      const description = descriptionMatch ? descriptionMatch[1].trim() : "";
      const imageUrl = imageMatch ? imageMatch[1].trim() : "";

      return NextResponse.json({
        success: 1,
        meta: {
          title,
          description,
          image: imageUrl ? { url: imageUrl } : undefined,
          url,
        },
      });
    } catch (fetchError) {
      console.error("Error fetching URL content:", fetchError);

      // Fallback to basic info
      const hostname = new URL(url).hostname;
      return NextResponse.json({
        success: 1,
        meta: {
          title: hostname,
          description: `Enlace a ${hostname}`,
          url,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.json(
      {
        success: 0,
        message: "Failed to fetch URL metadata",
      },
      { status: 500 }
    );
  }
}
