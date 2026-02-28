import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import s3Client, { getPublicUrl } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

interface GenerateImageRequest {
  title: string;
  content?: string;
}

function buildImagePrompt(title: string, content: string): string {
  const plainText = content.replace(/<[^>]+>/g, " ").substring(0, 400);

  return `You are a world-class creative director specializing in viral tech content thumbnails. Your images consistently get 10x more clicks than average.

STEP 1 — RESEARCH: Use Google Search to find visual references for "${title}": official logos, mascots, brand colors, UI screenshots, icons, and any recognizable imagery. Extract the exact hex colors, shapes, and visual identity of this topic.

STEP 2 — GENERATE a 16:9 viral thumbnail following these PROFESSIONAL RULES:

COMPOSITION (Hollywood poster rules):
- Single dominant hero element (the technology's icon/logo abstracted dramatically) placed at visual golden ratio
- Rule of thirds: hero element off-center, creating dynamic tension
- Clear foreground / midground / background depth layers
- Generous negative space that creates breathing room and focus

LIGHTING & ATMOSPHERE:
- Cinematic dramatic lighting: strong directional light source with deep shadows
- Rim lighting / edge glow on the hero element to make it "pop" from background
- Volumetric light rays or lens flare for depth and scale
- Atmospheric particles, bokeh, or subtle fog for dimension

COLOR STRATEGY (viral color psychology):
- Deep dark background (near-black: #0a0a0f or #050510) for maximum contrast
- Dominant accent color matching the topic's real brand identity (search for it)
- Secondary complementary color for depth (split complementary or analogous)
- Strategic use of HIGH SATURATION accent on the hero element to create visual pull
- Subtle color gradient in background (not flat black)

VISUAL IMPACT RULES:
- The image must look IMMEDIATELY recognizable as being about "${title}"
- Use the REAL brand colors and visual elements found via search
- 3D or semi-3D perspective on the hero element (slight angle, depth, shadow)
- Subtle glow/bloom effect around key elements
- Micro-details: subtle grid lines, circuit patterns, or tech textures in background
${plainText ? `- Topic context to inform composition: ${plainText}` : ""}

STRICT CONSTRAINTS:
- ZERO text, letters, numbers, or readable characters anywhere
- No clichéd generic tech imagery (no random blue globes, no generic code)
- Must feel custom-designed for this SPECIFIC topic, not a template
- Photorealistic quality with painterly cinematic color grading`;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY no está configurada" }, { status: 500 });
    }

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

    const body = (await request.json()) as GenerateImageRequest;

    if (!body.title) {
      return NextResponse.json({ error: "El campo 'title' es requerido" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = buildImagePrompt(body.title, body.content ?? "");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
        tools: [{ googleSearch: {} }],
      },
    });

    // Extraer los bytes de la imagen del response
    let imageData: string | null = null;
    let mimeType = "image/png";

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType ?? "image/png";
        break;
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "El modelo no generó una imagen. Intenta con otro título o modelo." },
        { status: 500 }
      );
    }

    // Subir la imagen generada a Supabase Storage
    const extension = mimeType.split("/")[1] ?? "png";
    const fileName = `ai-cover-${uuidv4()}.${extension}`;
    const key = `portfolio/images/${fileName}`;
    const buffer = Buffer.from(imageData, "base64");

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: "max-age=31536000",
      })
    );

    const url = getPublicUrl(key);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("AI image generation error:", error);

    const message =
      error instanceof Error ? error.message : "Error desconocido al generar la imagen";

    let hint = "";
    if (message.includes("API_KEY_INVALID") || message.includes("API key not valid")) {
      hint = " — La API key es inválida.";
    } else if (message.includes("RESOURCE_EXHAUSTED") || message.includes("quota")) {
      hint = " — Cuota de la API agotada.";
    } else if (message.includes("not found") || message.includes("404")) {
      hint = " — Modelo no disponible en tu cuenta. Prueba desde Google AI Studio primero.";
    } else if (message.includes("PERMISSION_DENIED")) {
      hint = " — Permisos insuficientes para usar este modelo.";
    }

    return NextResponse.json(
      { error: `Error al generar imagen: ${message}${hint}` },
      { status: 500 }
    );
  }
}
