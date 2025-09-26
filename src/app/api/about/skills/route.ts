import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
