import { useMemo } from "react";
import { sanitizeArticleHtml } from "@/lib/utils/sanitize";
import { NewsletterPrompt } from "./NewsletterPrompt";

/**
 * Renders sanitized article HTML with a newsletter prompt injected
 * automatically after the third top-level <p> block.
 */
export function ArticleContent({ html }: { html: string }) {
  const { before, after } = useMemo(() => splitAfterThirdParagraph(html), [
    html,
  ]);

  return (
    <div className="prose-article">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(before) }}
      />
      <NewsletterPrompt />
      {after && (
        <div
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
  // find the end of the 3rd </p>
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
