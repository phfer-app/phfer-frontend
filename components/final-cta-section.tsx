"use client"

import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

export function FinalCTASection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative py-32 overflow-hidden">
      <SectionCorners />
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 -z-10 bg-linear-to-br from-primary/20 via-background to-secondary/20"
      />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="final-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#final-grid)" />
        </svg>
      </div>

      {/* Floating gradient blobs */}
      <div className="absolute -top-40 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-40 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Main message */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            {t("final.title")} <br className="hidden md:block" />
            <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {t("final.title2")}
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            {t("final.description")}
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-primary/50" />
            <span className="text-primary/60">•</span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-primary/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
