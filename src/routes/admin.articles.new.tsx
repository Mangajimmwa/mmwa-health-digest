import { createFileRoute } from "@tanstack/react-router";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/admin/articles/new")({
  component: NewArticle,
});

function NewArticle() {
  return (
    <div>
      <p className="label-eyebrow">New article</p>
      <h1 className="mt-2 mb-6 font-display font-bold text-2xl">Write a story</h1>
      <ArticleEditor />
    </div>
  );
}
