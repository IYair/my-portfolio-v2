import s3Client from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "No se proporcionó la clave del archivo" },
        { status: 400 }
      );
    }

    // Generar nueva URL pre-firmada
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 días (máximo permitido por S3)
    });

    return NextResponse.json({
      url: signedUrl,
      key: key,
    });
  } catch (error) {
    console.error("Error regenerating URL:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
