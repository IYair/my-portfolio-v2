import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client, { getPublicUrl } from "@/lib/s3";
import sharp from "sharp";

const BUCKET_NAME = process.env.SUPABASE_S3_BUCKET_NAME || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ success: 0, message: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: 0, message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (!BUCKET_NAME || !process.env.SUPABASE_S3_ACCESS_KEY_ID) {
      const placeholderUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent("Imagen: " + file.name.substring(0, 20))}`;
      return NextResponse.json({
        success: 1,
        file: { url: placeholderUrl, name: file.name, size: file.size },
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `blog-images/${timestamp}-${sanitizedName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: optimizedBuffer,
        ContentType: "image/jpeg",
        CacheControl: "max-age=31536000",
      })
    );

    return NextResponse.json({
      success: 1,
      file: {
        url: getPublicUrl(key),
        name: file.name,
        size: optimizedBuffer.length,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ success: 0, message: "Image upload failed" }, { status: 500 });
  }
}
