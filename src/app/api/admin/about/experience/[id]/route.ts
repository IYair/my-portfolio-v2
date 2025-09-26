import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { position, company, description, startDate, endDate, order } = await request.json();
    const id = parseInt(params.id);

    const experience = await prisma.workExperience.update({
      where: { id },
      data: {
        position,
        company,
        description,
        startDate,
        endDate,
        order,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
