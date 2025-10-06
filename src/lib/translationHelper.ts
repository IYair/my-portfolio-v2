import { translateBatch, translateText } from "./deepl";

export interface TranslatableContent {
  es: string;
  en?: string;
}

/**
 * Auto-translate content from Spanish to English
 * If content is provided in Spanish only, it will be translated to English
 * @param content - The content object with es and optional en fields
 * @returns Content with both es and en translations
 */
export async function autoTranslate(content: TranslatableContent): Promise<TranslatableContent> {
  // If English translation already exists, return as is
  if (content.en && content.en.trim().length > 0) {
    return content;
  }

  // If Spanish content exists, translate to English
  if (content.es && content.es.trim().length > 0) {
    const result = await translateText(content.es, "en", "es");
    return {
      es: content.es,
      en: result.text,
    };
  }

  // Return original if no valid content
  return content;
}

/**
 * Auto-translate multiple content objects
 * @param contents - Array of content objects to translate
 * @returns Array of translated content objects
 */
export async function autoTranslateMultiple(
  contents: TranslatableContent[]
): Promise<TranslatableContent[]> {
  // Separate contents that need translation
  const needsTranslation = contents.filter(c => !c.en || c.en.trim().length === 0);
  const alreadyTranslated = contents.filter(c => c.en && c.en.trim().length > 0);

  if (needsTranslation.length === 0) {
    return contents;
  }

  // Extract Spanish texts to translate
  const textsToTranslate = needsTranslation.map(c => c.es).filter(text => text?.trim());

  if (textsToTranslate.length === 0) {
    return contents;
  }

  // Translate in batch
  const translations = await translateBatch(textsToTranslate, "en", "es");

  // Merge translations back
  let translationIndex = 0;
  const translated = needsTranslation.map(content => {
    if (content.es?.trim()) {
      return {
        es: content.es,
        en: translations[translationIndex++]?.text || content.es,
      };
    }
    return content;
  });

  // Combine already translated and newly translated
  return [...alreadyTranslated, ...translated];
}

/**
 * Prepare translatable fields for database storage
 * Automatically translates if only Spanish is provided
 */
export async function prepareTranslatableField(
  value: string | TranslatableContent
): Promise<TranslatableContent> {
  // If it's a string, assume it's Spanish and translate
  if (typeof value === "string") {
    return autoTranslate({ es: value });
  }

  // If it's already an object, auto-translate if needed
  return autoTranslate(value);
}
