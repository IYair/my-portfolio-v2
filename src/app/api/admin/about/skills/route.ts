import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, icon, category, order } = await request.json();

    const skill = await prisma.skill.create({
      data: {
        name,
        icon,
        category,
        order: order || 0,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
