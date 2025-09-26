import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { institution, degree, field, startDate, endDate, order } = await request.json();
    const id = parseInt(params.id);

    const education = await prisma.education.update({
      where: { id },
      data: {
        institution,
        degree,
        field,
        startDate,
        endDate,
        order,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
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

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
