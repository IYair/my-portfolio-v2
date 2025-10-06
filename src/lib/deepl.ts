import * as deepl from "deepl-node";

// Initialize DeepL translator
let translator: deepl.Translator | null = null;

function getTranslator(): deepl.Translator | null {
  if (!translator) {
    const authKey = process.env.DEEPL_API_KEY;
    if (!authKey) {
      console.warn("⚠️  DEEPL_API_KEY is not set - translation will be skipped");
      return null;
    }
    try {
      translator = new deepl.Translator(authKey);
    } catch (error) {
      console.error("Error initializing DeepL translator:", error);
      return null;
    }
  }
  return translator;
}

export interface TranslationResult {
  text: string;
  detectedSourceLang?: string;
}

/**
 * Translate text using DeepL API
 * @param text - Text to translate
 * @param targetLang - Target language (e.g., 'en', 'es')
 * @param sourceLang - Source language (optional, will be auto-detected if not provided)
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: "en" | "es",
  sourceLang?: "en" | "es"
): Promise<TranslationResult> {
  try {
    const deeplTranslator = getTranslator();

    // If translator is not available, return original text
    if (!deeplTranslator) {
      console.warn("DeepL translator not available - returning original text");
      return { text };
    }

    // Map language codes to DeepL format
    const targetLangCode = targetLang === "en" ? "en-US" : "es";
    const sourceLangCode = sourceLang === "en" ? "en" : sourceLang === "es" ? "es" : undefined;

    const result = await deeplTranslator.translateText(
      text,
      sourceLangCode || null,
      targetLangCode as deepl.TargetLanguageCode
    );

    return {
      text: result.text,
      detectedSourceLang: result.detectedSourceLang,
    };
  } catch (error) {
    console.error("DeepL translation error:", error);
    // Return original text if translation fails
    return {
      text,
    };
  }
}

/**
 * Translate multiple texts in batch
 * @param texts - Array of texts to translate
 * @param targetLang - Target language
 * @param sourceLang - Source language (optional)
 * @returns Array of translated texts
 */
export async function translateBatch(
  texts: string[],
  targetLang: "en" | "es",
  sourceLang?: "en" | "es"
): Promise<TranslationResult[]> {
  try {
    const deeplTranslator = getTranslator();

    // If translator is not available, return original texts
    if (!deeplTranslator) {
      console.warn("DeepL translator not available - returning original texts");
      return texts.map(text => ({ text }));
    }

    const targetLangCode = targetLang === "en" ? "en-US" : "es";
    const sourceLangCode = sourceLang === "en" ? "en" : sourceLang === "es" ? "es" : undefined;

    const results = await deeplTranslator.translateText(
      texts,
      sourceLangCode || null,
      targetLangCode as deepl.TargetLanguageCode
    );

    // DeepL always returns an array when given an array input
    if (Array.isArray(results)) {
      return results.map(result => ({
        text: result.text,
        detectedSourceLang: result.detectedSourceLang,
      }));
    }

    // This shouldn't happen with array input, but handle it just in case
    return [
      {
        text: (results as deepl.TextResult).text,
        detectedSourceLang: (results as deepl.TextResult).detectedSourceLang,
      },
    ];
  } catch (error) {
    console.error("DeepL batch translation error:", error);
    // Return original texts if translation fails
    return texts.map(text => ({ text }));
  }
}

/**
 * Check DeepL API usage
 * @returns Usage information
 */
export async function getUsage(): Promise<deepl.Usage | null> {
  try {
    const deeplTranslator = getTranslator();
    if (!deeplTranslator) {
      return null;
    }
    return await deeplTranslator.getUsage();
  } catch (error) {
    console.error("DeepL usage check error:", error);
    return null;
  }
}
