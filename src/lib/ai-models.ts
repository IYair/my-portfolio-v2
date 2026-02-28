export const AVAILABLE_MODELS = [
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    description: "Mejor relación precio-rendimiento",
  },
  {
    id: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    description: "Ultra rápido, menor costo",
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    description: "Más capaz, razonamiento profundo",
  },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", description: "Equilibrado (anterior gen)" },
] as const;

export type GeminiModelId = (typeof AVAILABLE_MODELS)[number]["id"];

export const DEFAULT_MODEL: GeminiModelId = "gemini-2.5-flash";
