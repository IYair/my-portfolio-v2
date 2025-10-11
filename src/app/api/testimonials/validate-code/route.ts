import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "El código es requerido", valid: false },
        { status: 400 }
      );
    }

    // Verificar si el código ya existe en testimonios (ya fue usado)
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { code },
    });

    if (existingTestimonial) {
      return NextResponse.json({
        valid: false,
        message: "Este código ya ha sido utilizado",
      });
    }

    // Verificar si existe una invitación con este código
    const invite = await prisma.testimonialInvite.findUnique({
      where: { code },
    });

    if (!invite) {
      return NextResponse.json({
        valid: false,
        message: "Código inválido",
      });
    }

    if (invite.used) {
      return NextResponse.json({
        valid: false,
        message: "Este código ya ha sido utilizado",
      });
    }

    // Verificar si ha expirado (si tiene fecha de expiración)
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        message: "Este código ha expirado",
      });
    }

    // Código válido
    return NextResponse.json({
      valid: true,
      message: "Código válido",
    });
  } catch (error) {
    console.error("Error validating code:", error);
    return NextResponse.json(
      { error: "Error al validar código", valid: false },
      { status: 500 }
    );
  }
}
