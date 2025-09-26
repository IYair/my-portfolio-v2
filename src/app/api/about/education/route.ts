import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
