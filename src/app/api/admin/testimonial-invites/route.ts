import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// GET - Obtener todas las invitaciones
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const invites = await prisma.testimonialInvite.findMany({
      orderBy: [{ used: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json({ error: "Error al obtener invitaciones" }, { status: 500 });
  }
}

// POST - Crear nueva invitación
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, sendEmail } = body;

    if (!email) {
      return NextResponse.json({ error: "El email es requerido" }, { status: 400 });
    }

    // Generar código único
    const code = crypto.randomBytes(8).toString("hex").toUpperCase();

    // Crear invitación
    const invite = await prisma.testimonialInvite.create({
      data: {
        code,
        email,
        name: name || null,
        sent: false,
      },
    });

    // Obtener el dominio del sitio
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const inviteLink = `${siteUrl}/es/testimonial?code=${code}`;

    // Enviar email si se solicita y Resend está configurado
    if (sendEmail && resend) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: email,
          subject: "Invitación para enviar tu testimonio",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                  .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
                  .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Invitación para Testimonio</h1>
                  </div>
                  <div class="content">
                    <p>Hola${name ? ` ${name}` : ""},</p>
                    
                    <p>Me encantaría que compartieras tu experiencia trabajando conmigo. Tu testimonio será muy valioso para mi portfolio profesional.</p>
                    
                    <p>Para enviar tu testimonio, por favor haz clic en el siguiente enlace:</p>
                    
                    <p style="text-align: center;">
                      <a href="${inviteLink}" class="button">Enviar mi Testimonio</a>
                    </p>
                    
                    <p>Al final del formulario se te pedirá el siguiente código de acceso:</p>
                    
                    <div class="code-box">
                      <div class="code">${code}</div>
                    </div>
                    
                    <p><strong>Importante:</strong> Este código es de un solo uso y personal.</p>
                    
                    <p>Si tienes alguna pregunta, no dudes en contactarme.</p>
                    
                    <p>¡Muchas gracias!</p>
                  </div>
                  <div class="footer">
                    <p>Este es un correo automático. Por favor no responder a este mensaje.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        // Marcar como enviado
        await prisma.testimonialInvite.update({
          where: { id: invite.id },
          data: { sent: true },
        });

        return NextResponse.json({ ...invite, sent: true, link: inviteLink });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return NextResponse.json(
          {
            ...invite,
            link: inviteLink,
            error: "Invitación creada pero el email no pudo ser enviado",
          },
          { status: 201 }
        );
      }
    }

    return NextResponse.json({ ...invite, link: inviteLink }, { status: 201 });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json({ error: "Error al crear invitación" }, { status: 500 });
  }
}
