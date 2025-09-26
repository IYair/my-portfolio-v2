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

    const { position, company, description, startDate, endDate, order } = await request.json();

    const experience = await prisma.workExperience.create({
      data: {
        position,
        company,
        description,
        startDate,
        endDate,
        order: order || 0,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error creating work experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
