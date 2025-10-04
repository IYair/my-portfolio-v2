import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: 0,
          message: "No file provided",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: 0,
          message: "Invalid file type. Only images are allowed.",
        },
        { status: 400 }
      );
    }

    // Check if S3 is configured
    if (!BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
      console.warn("S3 not configured, returning placeholder");
      const placeholderUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent("Imagen: " + file.name.substring(0, 20))}`;
      return NextResponse.json({
        success: 1,
        file: {
          url: placeholderUrl,
          name: file.name,
          size: file.size,
        },
      });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image with sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `blog-images/${timestamp}-${sanitizedName}`;

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: optimizedBuffer,
      ContentType: file.type,
      CacheControl: "max-age=31536000",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construct the public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: 1,
      file: {
        url,
        name: file.name,
        size: optimizedBuffer.length,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        success: 0,
        message: "Image upload failed",
      },
      { status: 500 }
    );
  }
}
