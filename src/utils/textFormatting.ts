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

/**
 * Parses text and identifies list items (lines starting with bullet points)
 * Returns an array of objects with type 'text' or 'list' and content
 */
export function parseTextWithLists(
  text: string
): Array<{ type: "text" | "list"; content: string }> {
  if (!text) return [];

  const lines = text.split("\n");
  const result: Array<{ type: "text" | "list"; content: string }> = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Check if line starts with bullet point (•, -, *, or ·)
    if (trimmedLine.match(/^[•\-\*·]\s+/)) {
      // Remove the bullet character and add as list item
      const content = trimmedLine.replace(/^[•\-\*·]\s+/, "");
      result.push({ type: "list", content });
    } else if (trimmedLine) {
      // Non-empty line that's not a list item
      result.push({ type: "text", content: trimmedLine });
    }
  });

  return result;
}
