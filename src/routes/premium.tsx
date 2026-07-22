{/* Luxury Hero Banner */}
        <section
          className="relative overflow-hidden border-b border-border/80 py-20 lg:py-28 text-center"
          style={{
            background: "radial-gradient(ellipse at top center, #3A2600 0%, #170E00 50%, #0A0A0A 100%)",
          }}
        >
          {/* Ambient Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gold/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 lg:px-6 relative z-10">
            <span 
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-6 shadow-md"
              style={{ background: "rgba(245, 166, 35, 0.12)", border: "1px solid rgba(245, 166, 35, 0.35)" }}
            >
              <Crown className="w-3.5 h-3.5 text-gold" />
              Joseph Mmwa Media Group
            </span>

            {/* BOLD HIGH-IMPACT HEADLINE */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-foreground tracking-tight leading-[1.08] uppercase drop-shadow-md">
              ACCESS THE <br />
              <span className="text-gold">MMWA NEWSROOM</span>
            </h1>

            <p className="mt-5 text-lg sm:text-2xl font-display text-gold/90 italic font-semibold max-w-2xl mx-auto">
              100% Ad-Free. Reader-Funded. Uncompromised Health Truth.
            </p>

            <p className="mt-5 text-sm sm:text-base text-text-body font-serif max-w-3xl mx-auto leading-relaxed opacity-90">
              No sponsored fluff, no pop-up ads, and zero corporate influence. Step inside the global desk at Joseph Mmwa Media Group for direct access to unvarnished medical investigations, real-time outbreak tracking, peer-reviewed scientific breakdowns, and exclusive briefing intelligence.
            </p>

            {/* Micro Trust Indicators */}
            <div className="mt-10 pt-8 border-t border-gold/15 grid grid-cols-3 gap-2 max-w-lg mx-auto text-center font-mono">
              <div>
                <span className="block text-gold font-extrabold text-lg sm:text-2xl">0%</span>
                <span className="text-text-mute uppercase text-[9px] sm:text-[10px] tracking-wider">Ads &amp; Clutter</span>
              </div>
              <div className="border-x border-border/60 px-2">
                <span className="block text-gold font-extrabold text-lg sm:text-2xl">100%</span>
                <span className="text-text-mute uppercase text-[9px] sm:text-[10px] tracking-wider">Reader-Funded</span>
              </div>
              <div>
                <span className="block text-gold font-extrabold text-lg sm:text-2xl">Daily</span>
                <span className="text-text-mute uppercase text-[9px] sm:text-[10px] tracking-wider">Expert Insights</span>
              </div>
            </div>
          </div>
        </section>
