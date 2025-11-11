"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

export function ParallaxSection() {
  const { t } = useLanguage()

  return (
    <section
      className="relative py-32 overflow-hidden"
    >
      <SectionCorners />
      {/* Animated gradient background - Dark with accent colors */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, hsl(0, 0%, 12%) 0%, hsl(260, 75%, 35%) 50%, hsl(0, 0%, 15%) 100%)",
        }}
      />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="animated-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="white" />
              <path d="M 50 0 L 100 0 M 50 100 L 100 100" stroke="white" strokeWidth="0.5" />
              <path d="M 0 50 L 0 100 M 100 50 L 100 100" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#animated-grid)" />
        </svg>
      </div>

      {/* Floating gradient blobs */}
      <div
        className="absolute -top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-40"
      />
      <div
        className="absolute top-40 -right-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-40"
      />
      <div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <Badge className="bg-primary/20 text-primary hover:border-primary/50 border-primary/50 backdrop-blur-sm" variant="outline">
              {t("parallax.badge")}
            </Badge>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white text-balance">
            {t("parallax.title")} <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{t("parallax.title2")}</span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 mb-10 leading-relaxed">
            {t("parallax.description")}
          </p>

          {/* Feature highlights */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-center items-center gap-0">
              {[
                { title: t("parallax.feature1"), desc: t("parallax.feature1_desc") },
                { title: t("parallax.feature2"), desc: t("parallax.feature2_desc") },
                { title: t("parallax.feature3"), desc: t("parallax.feature3_desc") },
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  {/* Feature content */}
                  <div className="px-8 md:px-12 py-6 text-center">
                    <h3 className="text-base md:text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm md:text-base text-gray-300">{feature.desc}</p>
                  </div>
                  
                  {/* Vertical separator - hidden on last item */}
                  {index < 2 && (
                    <div className="hidden md:block h-16 w-px bg-white/20"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Horizontal separator below features */}
            <div className="h-px bg-white/20 w-full"></div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/5534998731732?text=Olá, Pedro! Vim pelo seu Website e gostaria de ter seu contato!"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-2xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              }}
            >
              <span className="relative z-10 text-white flex items-center gap-2">
                {t("parallax.button")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
