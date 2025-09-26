import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, value, icon, isHeroicon, order } = await request.json();
    const params = await context.params;
    const id = parseInt(params.id);

    const contactInfo = await prisma.contactInfo.update({
      where: { id },
      data: {
        type,
        value,
        icon,
        isHeroicon,
        order,
      },
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error updating contact info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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

    await prisma.contactInfo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Contact info deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
