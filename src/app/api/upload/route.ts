import s3Client, { getPublicUrl } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.SUPABASE_S3_BUCKET_NAME ||
      !process.env.SUPABASE_S3_ACCESS_KEY_ID ||
      !process.env.SUPABASE_S3_SECRET_ACCESS_KEY
    ) {
      return NextResponse.json(
        { error: "Configuración de Supabase Storage incompleta" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten archivos de imagen" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo debe ser menor a 5MB" }, { status: 400 });
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `portfolio/images/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "max-age=31536000",
      })
    );

    return NextResponse.json({
      url: getPublicUrl(key),
      key,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading to Supabase Storage:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Upload endpoint activo" });
}
