/**
 * Converts text with line breaks to HTML format
 * Preserves line breaks and paragraphs from textarea inputs
 */
export function formatTextToHTML(text: string): string {
  if (!text) return "";

  return (
    text
      // Replace double line breaks with paragraph breaks
      .replace(/\n\n/g, "</p><p>")
      // Replace single line breaks with <br> tags
      .replace(/\n/g, "<br>")
      // Wrap the entire text in paragraph tags
      .replace(/^/, "<p>")
      .replace(/$/, "</p>")
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, "")
      // Clean up paragraphs that only contain <br>
      .replace(/<p><br><\/p>/g, "")
  );
}

/**
 * Alternative method using CSS white-space preservation
 * More semantic and accessible approach
 */
export function getPreserveWhitespaceStyle(): React.CSSProperties {
  return {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
}
