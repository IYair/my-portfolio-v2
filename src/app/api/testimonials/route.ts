import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener testimonios publicados
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        published: true,
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Error al obtener testimonios" }, { status: 500 });
  }
}

// POST - Crear nuevo testimonio con código
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, contentEn, author, handle, image, code } = body;

    // Validar campos requeridos
    if (!content || !author || !handle || !code) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Verificar que el código no esté en uso en testimonios
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { code },
    });

    if (existingTestimonial) {
      return NextResponse.json({ error: "Este código ya ha sido utilizado" }, { status: 400 });
    }

    // Verificar que exista una invitación válida
    const invite = await prisma.testimonialInvite.findUnique({
      where: { code },
    });

    if (!invite) {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    if (invite.used) {
      return NextResponse.json({ error: "Este código ya ha sido utilizado" }, { status: 400 });
    }

    // Crear el testimonio (no publicado por defecto)
    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        contentEn: contentEn || null,
        author,
        handle,
        image:
          image ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        code,
        published: false,
        featured: false,
      },
    });

    // Marcar la invitación como usada
    await prisma.testimonialInvite.update({
      where: { code },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Error al crear testimonio" }, { status: 500 });
  }
}
