import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiences = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      position,
      positionEn,
      company,
      description,
      descriptionEn,
      descriptionHtml,
      descriptionHtmlEn,
      startDate,
      endDate,
      order,
    } = body;

    console.log("POST /api/admin/about/experience", { body });

    // Validate required fields
    if (!position || !company) {
      return NextResponse.json({ error: "Position and company are required" }, { status: 400 });
    }

    const experience = await prisma.workExperience.create({
      data: {
        position,
        positionEn: positionEn || null,
        company,
        description: description || "",
        descriptionEn: descriptionEn || null,
        descriptionHtml: descriptionHtml || null,
        descriptionHtmlEn: descriptionHtmlEn || null,
        startDate: startDate || null,
        endDate: endDate || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error creating work experience:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
