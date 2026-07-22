function ArticleBodyWithMidBanner({ body }: { body: string }) {
  const navigate = useNavigate();

  // If body is short or missing, render normally without splitting
  if (!body || body.length < 500) {
    return <div dangerouslySetInnerHTML={{ __html: body }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />;
  }

  // Split content by paragraphs (<p> or double line breaks)
  const paragraphs = body.split(/(?<=<\/p>|\n\n)/gi);
  const midpoint = Math.floor(paragraphs.length / 2);

  const firstHalf = paragraphs.slice(0, midpoint).join("");
  const secondHalf = paragraphs.slice(midpoint).join("");

  return (
    <>
      {/* First Half of Article */}
      <div dangerouslySetInnerHTML={{ __html: firstHalf }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />

      {/* 🎯 SUBTLE INLINE MID-ARTICLE BANNER */}
      <div className="my-8 my-10 p-4 sm:p-5 rounded-xl border border-gold/20 bg-surface-1/90 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-all hover:border-gold/40">
        <div className="flex items-center gap-3.5 text-left">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-foreground leading-tight">
              Join thousands of readers of Joseph Mmwa
            </p>
            <p className="text-xs text-text-mute font-sans mt-0.5">
              Get verified health updates & editorial reporting directly in your feed.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/auth" })}
          className="w-full sm:w-auto shrink-0 bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-bold px-5 py-2.5 rounded-full text-xs transition-transform transform hover:scale-[1.02] cursor-pointer shadow-sm text-center"
        >
          Create Account
        </button>
      </div>

      {/* Second Half of Article */}
      <div dangerouslySetInnerHTML={{ __html: secondHalf }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />
    </>
  );
}
