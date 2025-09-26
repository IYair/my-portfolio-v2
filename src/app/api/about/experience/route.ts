import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
