import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    const params = await context.params;
    const id = parseInt(params.id);

    console.log("PUT /api/admin/about/experience/" + id, { body });

    // Validate required fields
    if (!position || !company) {
      return NextResponse.json({ error: "Position and company are required" }, { status: 400 });
    }

    const experience = await prisma.workExperience.update({
      where: { id },
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
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const id = parseInt(params.id);

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Work experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
