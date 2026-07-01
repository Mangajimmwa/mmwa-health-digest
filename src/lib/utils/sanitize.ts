import DOMPurify from "isomorphic-dompurify";

export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe", "figure", "figcaption"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "loading",
      "referrerpolicy",
      "src",
      "srcset",
      "sizes",
      "target",
      "rel",
    ],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}
