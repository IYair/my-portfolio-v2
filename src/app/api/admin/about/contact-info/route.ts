import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contactInfo = await prisma.contactInfo.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, value, icon, isHeroicon, order } = await request.json();

    const contactInfo = await prisma.contactInfo.create({
      data: {
        type,
        value,
        icon,
        isHeroicon: isHeroicon || false,
        order: order || 0,
      },
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error creating contact info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
