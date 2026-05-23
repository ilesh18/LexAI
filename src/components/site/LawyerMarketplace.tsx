import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal, BadgeCheck, Sparkles, Check } from "lucide-react";

export function LawyerMarketplace() {
  const cards = [
    {
      title: "Specialisation, location & language filters",
      description: "Find the right legal expert based on practice area, preferred language, and nearby availability.",
      icon: SlidersHorizontal,
      mockup: (
        <div className="mt-6 space-y-3 p-4 bg-[#FAF9F6] rounded-lg border border-border/60 font-sans text-xs">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/40">
            <span className="font-medium tracking-wide text-primary/80">Filter Advocates</span>
            <SlidersHorizontal size={12} className="text-accent" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-accent/10 border border-accent/20 text-[10px] text-accent font-medium">§ Labour Law</span>
              <span className="px-2 py-1 rounded bg-primary/5 border border-primary/10 text-[10px] text-primary font-medium">📍 Delhi NCR</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-primary/5 border border-primary/10 text-[10px] text-primary/75 font-medium">🗣️ Hindi + Hinglish</span>
              <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available Today
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Fixed-fee consultations from ₹299",
      description: "Transparent pricing with affordable consultations — no hidden charges or surprise billing.",
      icon: BadgeCheck,
      mockup: (
        <div className="mt-6 space-y-3 p-4 bg-[#FAF9F6] rounded-lg border border-border/60 font-sans text-xs">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/40">
            <span className="font-medium tracking-wide text-primary/80">Consultation Plan</span>
            <span className="text-[10px] uppercase font-bold text-accent">Fixed Rates</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white p-2 rounded border border-border/40 shadow-xs">
              <span className="text-muted-foreground font-light">15-min Intro Call</span>
              <span className="text-primary font-semibold num-mono">₹299</span>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded border border-border/40 shadow-xs">
              <span className="text-muted-foreground font-light">30-min Legal Review</span>
              <span className="text-primary font-semibold num-mono">₹599</span>
            </div>
            <div className="flex gap-2 items-center text-[10px] text-muted-foreground px-1 pt-1">
              <Check size={10} className="text-emerald-600 shrink-0" />
              <span>No hidden charges, pay only what you see</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "ApnaNyaya handles the brief",
      description: "Case details are automatically summarized before the consultation so the lawyer is fully prepared.",
      icon: Sparkles,
      mockup: (
        <div className="mt-6 space-y-3 p-4 bg-[#FAF9F6] rounded-lg border border-border/60 font-sans text-xs">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/40">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">Case Brief Generator</span>
            </div>
            <span className="text-[9px] text-muted-foreground">Auto-compiled</span>
          </div>
          <div className="space-y-2 text-left">
            <div className="p-2 rounded bg-white border border-border/40 shadow-xs space-y-1">
              <div className="text-[10px] text-accent font-medium">Issue Summary</div>
              <p className="text-[10px] text-primary/85 leading-normal line-clamp-2">
                Employer delayed wages for 60 days. Statutory notice under Payment of Wages Act Sec. 15 required.
              </p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-muted-foreground px-1 pt-1">
              <span>Brief PDF size: 1.2 KB</span>
              <span className="text-emerald-600">✓ Sent to lawyer</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#FAF8F5] text-primary py-24 overflow-hidden border-y border-border/60 my-12">
      {/* Light subtle warm gradient bg */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#f4f2eb] to-transparent pointer-events-none" />

      {/* Glowing accent effects (extremely soft, elegant warm light transitions) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-accent/2 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-primary/2 blur-[150px] pointer-events-none" />

      {/* Faint Scales of Justice watermark in background */}
      <div className="absolute right-10 bottom-10 w-[450px] h-[450px] text-accent/[0.025] pointer-events-none select-none">
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth={0.35}>
          <path d="M12 3v17M12 5l-8 3M12 5l8 3M4 8v5M20 8v5M4 13c0 2.2 1.8 4 4 4s4-1.8 4-4M12 13c0 2.2 1.8 4 4 4s4-1.8 4-4M10 21h4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Subtitle & Badge */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.24em] text-accent mb-6 font-semibold"
            >
              <span className="w-8 h-[1.5px] bg-accent" />
              TRUSTED LEGAL NETWORK
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.05]"
            >
              Verified Lawyer <br />
              <em className="italic text-accent">Marketplace</em>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed font-light max-w-lg"
            >
              When you need a human, connect with a verified, specialised lawyer near you — transparent pricing, no surprises.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10"
            >
              <a
                href="https://vakilsearch.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 border border-primary text-primary text-sm font-semibold rounded-xs shadow-xs hover:bg-primary hover:text-white transition-all duration-300"
              >
                Browse verified network
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <p className="mt-3 text-xs text-muted-foreground/80 font-light">
                Over 500+ advocates certified across High Courts & District Forums.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Stacked Cards */}
          <div className="lg:col-span-7 space-y-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: idx * 0.1,
                    }
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{
                    y: -4,
                    borderColor: "var(--color-accent)",
                    boxShadow: "0 12px 24px -10px rgba(34, 43, 69, 0.08)"
                  }}
                  className="relative flex flex-col md:flex-row justify-between gap-6 p-8 bg-white border border-border/80 rounded-xl transition-all duration-300 hover:border-accent/40 shadow-xs shadow-primary/5 text-left group"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-accent/5 border border-accent/15 text-accent rounded-lg group-hover:bg-accent group-hover:text-white group-hover:border-transparent transition-all duration-300">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">0{idx + 1}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-primary tracking-tight mb-2 font-serif">
                      {card.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {card.description}
                    </p>
                  </div>

                  <div className="w-full md:w-64 shrink-0">
                    {card.mockup}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
