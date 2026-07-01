import { createFileRoute } from "@tanstack/react-router";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/admin/articles/$id/edit")({
  component: EditArticle,
});

function EditArticle() {
  const { id } = Route.useParams();
  return (
    <div>
      <p className="label-eyebrow">Edit article</p>
      <h1 className="mt-2 mb-6 font-display font-bold text-2xl">Edit story</h1>
      <ArticleEditor articleId={id} />
    </div>
  );
}
