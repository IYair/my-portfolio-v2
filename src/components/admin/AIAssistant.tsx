"use client";

import { useState } from "react";
import {
  SparklesIcon,
  XMarkIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  TagIcon,
  LightBulbIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import apiClient from "@/lib/api-client";
import { AVAILABLE_MODELS, type GeminiModelId } from "@/lib/ai-models";

type AITab = "draft" | "improve" | "excerpt" | "tags" | "titles" | "cover";

interface AIAssistantProps {
  title: string;
  content: string;
  availableTags: string[];
  onApplyContent: (content: string) => void;
  onApplyExcerpt: (excerpt: string) => void;
  onApplyTags: (tags: string[]) => void;
  onApplyTitle: (title: string) => void;
  onApplyCoverImage: (url: string) => void;
}

interface TabConfig {
  id: AITab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "draft",
    label: "Borrador",
    icon: <DocumentTextIcon className="h-4 w-4" />,
    description: "Genera un post completo desde un tema",
  },
  {
    id: "improve",
    label: "Mejorar",
    icon: <PencilSquareIcon className="h-4 w-4" />,
    description: "Mejora el contenido actual del editor",
  },
  {
    id: "excerpt",
    label: "Extracto",
    icon: <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />,
    description: "Genera un extracto SEO-friendly",
  },
  {
    id: "tags",
    label: "Tags",
    icon: <TagIcon className="h-4 w-4" />,
    description: "Sugiere tags relevantes para el post",
  },
  {
    id: "titles",
    label: "Títulos",
    icon: <LightBulbIcon className="h-4 w-4" />,
    description: "Genera 5 alternativas de título",
  },
  {
    id: "cover",
    label: "Portada",
    icon: <PhotoIcon className="h-4 w-4" />,
    description: "Genera imagen de portada con IA (Nano Banana Pro)",
  },
];

export default function AIAssistant({
  title,
  content,
  availableTags,
  onApplyContent,
  onApplyExcerpt,
  onApplyTags,
  onApplyTitle,
  onApplyCoverImage,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AITab>("draft");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>("gemini-2.5-flash");
  const [results, setResults] = useState<Partial<Record<AITab, string>>>({});
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedSuggestedTags, setSelectedSuggestedTags] = useState<string[]>([]);
  const [copiedTab, setCopiedTab] = useState<AITab | null>(null);
  const [generatedCoverUrl, setGeneratedCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const { success, error } = useToast();

  const callAI = async (action: string): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await apiClient.post<{ result: string }>("/api/ai/generate", {
        action,
        title,
        content,
        availableTags,
        topic: topic || title,
        model: selectedModel,
      });
      return response.data.result;
    } catch (err: unknown) {
      const apiError = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      error(
        "Error de IA",
        apiError || "No se pudo generar el contenido. Verifica que GEMINI_API_KEY esté configurada."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!topic && !title) {
      error("Tema requerido", "Escribe un tema o agrega un título al post primero");
      return;
    }
    const result = await callAI("generate_draft");
    if (result) setResults(prev => ({ ...prev, draft: result }));
  };

  const handleImprove = async () => {
    if (!content || content === "<p></p>" || content.trim() === "") {
      error("Editor vacío", "El editor debe tener contenido para poder mejorarlo");
      return;
    }
    const result = await callAI("improve_content");
    if (result) setResults(prev => ({ ...prev, improve: result }));
  };

  const handleGenerateExcerpt = async () => {
    if (!content || content === "<p></p>") {
      error("Editor vacío", "El editor debe tener contenido para generar el extracto");
      return;
    }
    const result = await callAI("generate_excerpt");
    if (result) setResults(prev => ({ ...prev, excerpt: result }));
  };

  const handleSuggestTags = async () => {
    const result = await callAI("suggest_tags");
    if (result) {
      const parsed = result
        .split(",")
        .map(t => t.trim())
        .filter(t => availableTags.includes(t));
      setSuggestedTags(parsed);
      setSelectedSuggestedTags(parsed);
      setResults(prev => ({ ...prev, tags: result }));
    }
  };

  const handleGenerateCover = async () => {
    if (!title) {
      error("Título requerido", "Agrega un título al post primero para generar la portada");
      return;
    }
    setCoverLoading(true);
    try {
      const response = await apiClient.post<{ url: string }>("/api/ai/generate-image", {
        title,
        content,
      });
      setGeneratedCoverUrl(response.data.url);
    } catch (err: unknown) {
      const apiError = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      error("Error al generar imagen", apiError || "No se pudo generar la imagen de portada.");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleSuggestTitles = async () => {
    if (!topic && !title) {
      error("Tema requerido", "Escribe un tema o agrega un título al post primero");
      return;
    }
    const result = await callAI("suggest_titles");
    if (result) setResults(prev => ({ ...prev, titles: result }));
  };

  const handleCopy = async (text: string, tab: AITab) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const toggleSuggestedTag = (tag: string) => {
    setSelectedSuggestedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const titlesList = results.titles
    ? results.titles.split("\n").filter(t => t.trim().length > 0)
    : [];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-8 bottom-8 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
        title="Asistente de IA"
      >
        <SparklesIcon className="h-5 w-5" />
        <span>Asistente IA</span>
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-40 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-white" />
              <h2 className="text-base font-semibold text-white">Asistente de IA</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Model selector */}
          <div className="mt-3">
            <select
              value={selectedModel}
              onChange={e => {
                setSelectedModel(e.target.value as GeminiModelId);
                setResults({});
              }}
              disabled={loading}
              className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:outline-none disabled:opacity-60"
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id} className="bg-indigo-700 text-white">
                  {m.label} — {m.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {/* Context info */}
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <span className="font-medium">Contexto: </span>
            {title ? (
              <span className="truncate">
                {title.substring(0, 60)}
                {title.length > 60 ? "..." : ""}
              </span>
            ) : (
              <span className="italic">Sin título</span>
            )}
            {content && content !== "<p></p>" && (
              <span className="ml-2 text-green-600 dark:text-green-400">· Con contenido</span>
            )}
          </div>

          {/* ── DRAFT TAB ── */}
          {activeTab === "draft" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tema del post
                </label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={
                    title || "ej: Cómo implementar autenticación con NextAuth en Next.js 15"
                  }
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Deja vacío para usar el título del post
                </p>
              </div>
              <Button
                onClick={handleGenerateDraft}
                variant="primary"
                loading={loading}
                icon={<SparklesIcon className="h-4 w-4" />}
                className="w-full"
              >
                {loading ? "Generando..." : "Generar borrador completo"}
              </Button>
              {results.draft && (
                <ResultCard
                  label="Borrador generado"
                  preview={results.draft.replace(/<[^>]+>/g, " ").substring(0, 200) + "..."}
                  onApply={() => {
                    onApplyContent(results.draft!);
                    success("Contenido aplicado", "El borrador fue insertado en el editor");
                  }}
                  onCopy={() => handleCopy(results.draft!, "draft")}
                  copied={copiedTab === "draft"}
                  applyLabel="Aplicar al editor"
                />
              )}
            </div>
          )}

          {/* ── IMPROVE TAB ── */}
          {activeTab === "improve" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                Mejorará el contenido actual del editor: gramática, claridad y fluidez, manteniendo
                la estructura.
              </div>
              <Button
                onClick={handleImprove}
                variant="primary"
                loading={loading}
                icon={<PencilSquareIcon className="h-4 w-4" />}
                className="w-full"
                disabled={!content || content === "<p></p>"}
              >
                {loading ? "Mejorando..." : "Mejorar contenido"}
              </Button>
              {results.improve && (
                <ResultCard
                  label="Contenido mejorado"
                  preview={results.improve.replace(/<[^>]+>/g, " ").substring(0, 200) + "..."}
                  onApply={() => {
                    onApplyContent(results.improve!);
                    success(
                      "Contenido aplicado",
                      "El contenido mejorado fue insertado en el editor"
                    );
                  }}
                  onCopy={() => handleCopy(results.improve!, "improve")}
                  copied={copiedTab === "improve"}
                  applyLabel="Reemplazar en editor"
                />
              )}
            </div>
          )}

          {/* ── EXCERPT TAB ── */}
          {activeTab === "excerpt" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Genera un extracto corto y atractivo basado en el título y contenido actual del
                post.
              </p>
              <Button
                onClick={handleGenerateExcerpt}
                variant="primary"
                loading={loading}
                icon={<ChatBubbleBottomCenterTextIcon className="h-4 w-4" />}
                className="w-full"
                disabled={!content || content === "<p></p>"}
              >
                {loading ? "Generando..." : "Generar extracto"}
              </Button>
              {results.excerpt && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-800 dark:text-gray-200">{results.excerpt}</p>
                    <p className="mt-2 text-right text-xs text-gray-400">
                      {results.excerpt.length} / 160
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        onApplyExcerpt(results.excerpt!);
                        success(
                          "Extracto aplicado",
                          "El extracto fue copiado al campo correspondiente"
                        );
                      }}
                      variant="primary"
                      size="sm"
                      icon={<CheckIcon className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Aplicar extracto
                    </Button>
                    <Button
                      onClick={() => handleCopy(results.excerpt!, "excerpt")}
                      variant="ghost"
                      size="sm"
                      icon={
                        copiedTab === "excerpt" ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        )
                      }
                    >
                      {copiedTab === "excerpt" ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAGS TAB ── */}
          {activeTab === "tags" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analiza el título y contenido para sugerir los tags más relevantes de tu lista.
              </p>
              <Button
                onClick={handleSuggestTags}
                variant="primary"
                loading={loading}
                icon={<TagIcon className="h-4 w-4" />}
                className="w-full"
              >
                {loading ? "Analizando..." : "Sugerir tags"}
              </Button>
              {suggestedTags.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Selecciona los tags a aplicar:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleSuggestedTag(tag)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          selectedSuggestedTags.includes(tag)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {selectedSuggestedTags.includes(tag) && (
                          <CheckIcon className="mr-1 inline-block h-3 w-3" />
                        )}
                        {tag}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={() => {
                      onApplyTags(selectedSuggestedTags);
                      success(
                        "Tags aplicados",
                        `${selectedSuggestedTags.length} tags aplicados al post`
                      );
                    }}
                    variant="primary"
                    size="sm"
                    disabled={selectedSuggestedTags.length === 0}
                    icon={<CheckIcon className="h-4 w-4" />}
                    className="w-full"
                  >
                    Aplicar {selectedSuggestedTags.length} tags seleccionados
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── COVER TAB ── */}
          {activeTab === "cover" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-800 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-300">
                <p className="font-medium">Nano Banana 2 · Google Search Grounding</p>
                <p className="mt-1 opacity-80">
                  Busca referencias visuales reales del tema en la web y genera una portada
                  contextualizada.
                </p>
              </div>
              <Button
                onClick={handleGenerateCover}
                variant="primary"
                loading={coverLoading}
                icon={<PhotoIcon className="h-4 w-4" />}
                className="w-full"
                disabled={!title}
              >
                {coverLoading ? "Generando imagen..." : "Generar imagen de portada"}
              </Button>
              {!title && (
                <p className="text-center text-xs text-amber-600 dark:text-amber-400">
                  Agrega un título al post para poder generar la portada
                </p>
              )}
              {generatedCoverUrl && (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedCoverUrl}
                      alt="Imagen de portada generada"
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        onApplyCoverImage(generatedCoverUrl);
                        success(
                          "Portada aplicada",
                          "La imagen fue establecida como portada del post"
                        );
                      }}
                      variant="primary"
                      size="sm"
                      icon={<CheckIcon className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Usar como portada
                    </Button>
                    <Button
                      onClick={handleGenerateCover}
                      variant="ghost"
                      size="sm"
                      loading={coverLoading}
                      icon={<ArrowPathIcon className="h-4 w-4" />}
                    >
                      Regenerar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TITLES TAB ── */}
          {activeTab === "titles" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tema o título actual
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={title || "ej: React Server Components"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <Button
                onClick={handleSuggestTitles}
                variant="primary"
                loading={loading}
                icon={<LightBulbIcon className="h-4 w-4" />}
                className="w-full"
              >
                {loading ? "Generando..." : "Generar 5 títulos"}
              </Button>
              {titlesList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Haz clic en un título para aplicarlo:
                  </p>
                  {titlesList.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onApplyTitle(t.trim());
                        success("Título aplicado", "El título fue actualizado");
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20"
                    >
                      {t.trim()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-700">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Impulsado por{" "}
            {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.label ?? "Google Gemini"}
          </p>
        </div>
      </div>
    </>
  );
}

// ── Sub-component: ResultCard ──
interface ResultCardProps {
  label: string;
  preview: string;
  applyLabel: string;
  onApply: () => void;
  onCopy: () => void;
  copied: boolean;
}

function ResultCard({ label, preview, applyLabel, onApply, onCopy, copied }: ResultCardProps) {
  return (
    <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/10">
      <div className="flex items-center gap-2">
        <CheckIcon className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
        <span className="text-xs font-medium text-green-700 dark:text-green-400">{label}</span>
      </div>
      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{preview}</p>
      <div className="flex gap-2">
        <Button
          onClick={onApply}
          variant="primary"
          size="sm"
          icon={<ArrowPathIcon className="h-4 w-4" />}
          className="flex-1"
        >
          {applyLabel}
        </Button>
        <Button
          onClick={onCopy}
          variant="ghost"
          size="sm"
          icon={
            copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )
          }
        >
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
