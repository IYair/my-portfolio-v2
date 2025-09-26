import s3Client from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    console.log("Upload request received");

    // Verificar variables de entorno
    if (
      !process.env.AWS_S3_BUCKET_NAME ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY
    ) {
      console.error("Missing AWS environment variables");
      return NextResponse.json({ error: "Configuración de AWS incompleta" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("File received:", file?.name, file?.size, file?.type);

    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten archivos de imagen" }, { status: 400 });
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo debe ser menor a 5MB" }, { status: 400 });
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `portfolio/images/${fileName}`;

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configurar comando de subida a S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "max-age=31536000", // 1 año
    });

    console.log("Uploading to S3 with key:", key);

    // Subir archivo a S3
    await s3Client.send(uploadCommand);
    console.log("File uploaded successfully to S3");

    // Construir URL pública directa
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
      process.env.AWS_REGION || "us-east-1"
    }.amazonaws.com/${key}`;

    console.log("Public URL generated:", publicUrl);

    return NextResponse.json({
      url: publicUrl,
      key: key,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Upload endpoint activo" });
}
