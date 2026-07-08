import { useMemo } from "react";
import { sanitizeArticleHtml } from "@/lib/utils/sanitize";
import { NewsletterPrompt } from "./NewsletterPrompt";

/**
 * Renders sanitized article HTML or raw text with a newsletter prompt injected
 * automatically after the third top-level block/paragraph.
 */
export function ArticleContent({ html }: { html: string }) {
  // 🔄 FIX: If the text is raw text with line breaks, convert them to standard paragraph tags first
  const formattedHtml = useMemo(() => {
    if (!html) return "";
    // If it already contains HTML tags, return it as-is
    if (/<p>|<\/p>|<br\s*\/?>/i.test(html)) return html;
    
    // Otherwise, split by line breaks and wrap chunks in proper <p> elements
    return html
      .split(/\n\s*\n/)
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, "<br />")}</p>` : "")
      .join("");
  }, [html]);

  const { before, after } = useMemo(() => splitAfterThirdParagraph(formattedHtml), [
    formattedHtml,
  ]);

  return (
    <div className="prose-article text-zinc-300 font-sans leading-relaxed space-y-4">
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(before) }}
      />
      <NewsletterPrompt />
      {after && (
        <div
          className="prose prose-invert max-w-none mt-4"
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(after) }}
        />
      )}
    </div>
  );
}

function splitAfterThirdParagraph(html: string): {
  before: string;
  after: string;
} {
  const re = /<\/p>/gi;
  let match: RegExpExecArray | null;
  let count = 0;
  let cutAt = -1;
  while ((match = re.exec(html)) !== null) {
    count++;
    if (count === 3) {
      cutAt = match.index + match[0].length;
      break;
    }
  }
  if (cutAt < 0) return { before: html, after: "" };
  return { before: html.slice(0, cutAt), after: html.slice(cutAt) };
}
