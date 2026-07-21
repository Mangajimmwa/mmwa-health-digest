{/* Footer Note - Premium Styled Block */}
        <footer className="mt-20 pt-8 border-t border-border">
          <div 
            className="relative overflow-hidden rounded-2xl p-8 sm:p-12 border shadow-2xl transition-all duration-300"
            style={{ 
              background: "radial-gradient(ellipse at top left, #3D2800 0%, #251800 45%, #0A0A0A 100%)", 
              borderColor: "rgba(245, 166, 35, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(245, 166, 35, 0.1)"
            }}
          >
            {/* Background Ambient Glow & Micro-Grid Pattern */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Accent Eyebrow Badge */}
            <span 
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-5 shadow-sm" 
              style={{ 
                background: "radial-gradient(circle, rgba(245, 166, 35, 0.25) 0%, rgba(245, 166, 35, 0.08) 100%)", 
                border: "1px solid rgba(245, 166, 35, 0.6)" 
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Global Health Bureau
            </span>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight leading-none">
              Joseph Mmwa <span className="text-gold bg-gradient-to-r from-gold via-amber-300 to-amber-500 bg-clip-text text-transparent">Media Group</span>
            </h3>

            <p className="mt-2.5 text-base font-serif italic text-gold/90 font-medium tracking-wide flex items-center gap-2">
              <span className="h-px w-6 bg-gold/40 inline-block" />
              If it's health, it's here.
            </p>

            <p className="mt-5 text-sm sm:text-base text-text-body font-serif max-w-3xl leading-relaxed text-zinc-300">
              Committed to delivering verified, evidence-based journalism, outbreak analysis, and authoritative reporting across global medicine, public health, and healthcare policy.
            </p>

            {/* Footer Bottom Bar */}
            <div className="mt-8 pt-5 border-t border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-text-mute">
              <span className="text-zinc-400">© 2026 Joseph Mmwa Media Group. All rights reserved.</span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-1 h-1 rounded-full bg-gold/60" />
                <span className="text-gold/90 font-sans font-bold uppercase tracking-widest text-[10px] bg-gold/10 px-2.5 py-1 rounded border border-gold/20">
                  Truth • Rigor • Public Interest
                </span>
              </div>
            </div>
          </div>
        </footer>
