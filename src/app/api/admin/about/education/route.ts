import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { institution, degree, field, startDate, endDate, order } = await request.json();

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field,
        startDate,
        endDate,
        order: order || 0,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
