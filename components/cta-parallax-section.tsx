"use client"

import { useRef } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CTAParallaxSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <SectionCorners />
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, hsl(260, 75%, 63%) 0%, hsl(67, 100%, 36%) 100%)",
        }}
      />

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating blobs */}
      <div
        className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-30"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          {/* Header with animated icon */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <span className="text-white font-semibold text-sm">{t("cta.next_level")}</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-balance">
              <span className="bg-linear-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                {t("cta.ready_to_level_up")}
              </span>{" "}
              <br className="hidden md:block" />
              <span className="bg-linear-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                {t("cta.ready_to_level_up_question")}
              </span>{" "}
              <span className="relative inline-block bg-linear-to-r from-cyan-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                {t("cta.ready_to_level_up_answer")}
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-cyan-300 to-blue-300 rounded-full"></span>
              </span>
            </h2>

          </div>

          {/* Stats Container */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-center items-center gap-0">
              {[
                { number: "+10", label: t("cta.projects") },
                { number: "100%", label: t("cta.satisfaction") },
                { number: "+2", label: t("cta.experience") },
              ].map((stat, index) => (
                <div key={index} className="flex items-center">
                  {/* Stat content */}
                  <div className="px-8 md:px-12 py-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold bg-linear-to-br from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                      {stat.number}
                    </div>
                    <div className="text-base md:text-lg text-white font-medium drop-shadow-sm">
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Vertical separator - hidden on last item */}
                  {index < 2 && (
                    <div className="hidden md:block h-16 w-px bg-white/20"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Horizontal separator below stats */}
            <div className="h-px bg-white/20 w-full"></div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5534998731732?text=Olá, Pedro! Vim pelo seu Website e gostaria de ter seu contato!"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-2xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              }}
            >
              <span className="relative z-10 text-white flex items-center gap-2">
                {t("cta.open_whatsapp")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
