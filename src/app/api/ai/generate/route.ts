import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AVAILABLE_MODELS, type GeminiModelId } from "@/lib/ai-models";

export const dynamic = "force-dynamic";

type AIAction =
  | "generate_draft"
  | "improve_content"
  | "generate_excerpt"
  | "suggest_tags"
  | "suggest_titles";

interface GenerateRequest {
  action: AIAction;
  title?: string;
  content?: string;
  topic?: string;
  availableTags?: string[];
  model?: GeminiModelId;
}

function buildPrompt(body: GenerateRequest): string {
  const topic = body.topic || body.title || "";
  const contentSnippet = body.content?.substring(0, 2000) ?? "";

  switch (body.action) {
    case "generate_draft":
      return `Eres un experto escritor técnico de blogs de programación y tecnología.

Genera un post de blog completo y bien estructurado en español sobre: "${topic}"

INSTRUCCIONES ESTRICTAS:
- Responde ÚNICA y EXCLUSIVAMENTE con el HTML del cuerpo del post
- NO incluyas <!DOCTYPE>, <html>, <body>, <head>, ni el título h1
- Usa estas etiquetas: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <code>, <pre><code class="language-javascript">
- Estructura: introducción (1-2 párrafos), 3-5 secciones con <h2>, conclusión
- Longitud objetivo: 800-1200 palabras
- Tono: profesional pero accesible, con ejemplos prácticos
- Incluye bloques de código cuando sea relevante al tema
- Usa <strong> para destacar conceptos clave`;

    case "improve_content":
      return `Eres un editor experto de contenido técnico en español.

Mejora el siguiente contenido HTML de un post de blog:

CONTENIDO ACTUAL:
${contentSnippet}

INSTRUCCIONES:
- Corrige gramática y ortografía en español
- Mejora la claridad y fluidez de las oraciones
- Mantén EXACTAMENTE el mismo formato HTML y estructura de etiquetas
- No cambies el tema ni el mensaje principal
- Responde ÚNICA y EXCLUSIVAMENTE con el HTML mejorado, sin explicaciones ni comentarios`;

    case "generate_excerpt":
      return `Genera un extracto breve y atractivo para un post de blog.

TÍTULO: ${body.title}
CONTENIDO (inicio):
${contentSnippet.substring(0, 800)}

INSTRUCCIONES:
- El extracto debe tener entre 100 y 155 caracteres
- Debe resumir el valor del post y motivar a leerlo
- Escrito en español, primera persona o tercera persona
- NO uses comillas al inicio o final
- Responde ÚNICAMENTE con el texto del extracto, sin explicaciones`;

    case "suggest_tags":
      return `Analiza el siguiente post y selecciona los tags más relevantes.

TÍTULO: ${body.title}
CONTENIDO:
${contentSnippet.substring(0, 600)}

TAGS DISPONIBLES (elige SOLO de esta lista exacta):
${body.availableTags?.join(", ")}

INSTRUCCIONES:
- Selecciona entre 3 y 5 tags de la lista disponible
- Elige los más representativos del contenido
- Responde ÚNICAMENTE con los tags separados por coma
- Ejemplo de respuesta correcta: React, TypeScript, Frontend`;

    case "suggest_titles":
      return `Genera 5 títulos alternativos para un post de blog sobre: "${topic}"

INSTRUCCIONES:
- Cada título máximo 70 caracteres
- Variedad: un título con número, uno con pregunta, uno directo, dos creativos
- Optimizados para SEO y que generen curiosidad
- En español
- Responde ÚNICAMENTE con los 5 títulos, uno por línea, sin numeración, sin guiones al inicio, sin explicaciones`;

    default:
      throw new Error(`Acción no soportada: ${body.action}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no está configurada en las variables de entorno" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as GenerateRequest;

    if (!body.action) {
      return NextResponse.json({ error: "El campo 'action' es requerido" }, { status: 400 });
    }

    const validModelIds = AVAILABLE_MODELS.map(m => m.id) as string[];
    const modelId =
      body.model && validModelIds.includes(body.model) ? body.model : "gemini-2.5-flash";
    const isLongTask = body.action === "generate_draft" || body.action === "improve_content";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        temperature: isLongTask ? 0.7 : 0.4,
        maxOutputTokens: isLongTask ? 4096 : 512,
      },
    });

    const prompt = buildPrompt(body);
    const geminiResult = await model.generateContent(prompt);
    const text = geminiResult.response.text().trim();

    return NextResponse.json({ result: text, action: body.action });
  } catch (error) {
    console.error("AI generation error:", error);

    // Surface the specific Gemini error message to the client for easier debugging
    const message =
      error instanceof Error ? error.message : "Error desconocido al generar contenido con IA";

    // Common error hints
    let hint = "";
    if (message.includes("API_KEY_INVALID") || message.includes("API key not valid")) {
      hint = " — La API key es inválida. Verifica que sea correcta en Google AI Studio.";
    } else if (message.includes("PERMISSION_DENIED")) {
      hint = " — Permisos insuficientes. La key puede estar deshabilitada.";
    } else if (message.includes("RESOURCE_EXHAUSTED") || message.includes("quota")) {
      hint = " — Cuota de la API agotada. Espera o revisa tu plan.";
    } else if (message.includes("not found") || message.includes("404")) {
      hint = " — Modelo no encontrado. Prueba con gemini-1.5-flash.";
    }

    return NextResponse.json({ error: `Error de IA: ${message}${hint}` }, { status: 500 });
  }
}
