import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET - Obtener un testimonio específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json({ error: "Error al obtener testimonio" }, { status: 500 });
  }
}

// PUT - Actualizar testimonio
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { content, contentEn, author, handle, image, published, featured, order } = body;

    // Si se marca como destacado, desmarcar otros destacados
    if (featured) {
      await prisma.testimonial.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(params.id) },
      data: {
        content,
        contentEn,
        author,
        handle,
        image,
        published,
        featured,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Error al actualizar testimonio" }, { status: 500 });
  }
}

// DELETE - Eliminar testimonio
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Testimonio eliminado" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Error al eliminar testimonio" }, { status: 500 });
  }
}
