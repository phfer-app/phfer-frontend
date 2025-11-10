"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Code2, Users, Rocket } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

export function AboutSection() {
  const [offset, setOffset] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const scrollProgress = Math.max(0, 1 - rect.top / window.innerHeight)
        setOffset(scrollProgress * 30)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const timeline = [
    {
      icon: Zap,
      year: "2015",
      title: t("timeline.beginning.title"),
      description: t("timeline.beginning.description"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      year: t("timeline.habbo.year"),
      title: t("timeline.habbo.title"),
      description: t("timeline.habbo.description"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Code2,
      year: t("timeline.fullstack.year"),
      title: t("timeline.fullstack.title"),
      description: t("timeline.fullstack.description"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Rocket,
      year: t("timeline.rakha.year"),
      title: t("timeline.rakha.title"),
      description: t("timeline.rakha.description"),
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 overflow-hidden"
    >
      <SectionCorners />
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-background via-background to-primary/5" />

      {/* Animated blobs - Padrão diagonal */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60"
        style={{ transform: `translateY(${offset * 0.3}px)` }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-60"
        style={{ transform: `translateY(${offset * -0.3}px)` }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl opacity-50"
        style={{ transform: `translateX(${offset * 0.2}px)` }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-3xl opacity-50"
        style={{ transform: `translateX(${offset * -0.2}px)` }}
      />
      
      {/* Círculos animados */}
      <div className="absolute top-1/4 right-1/5 w-24 h-24 border border-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 left-1/5 w-20 h-20 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-2 md:px-4 relative z-10 max-w-[95%]">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("about.badge")}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("about.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("about.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {t("about.description")}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-linear-to-b from-transparent via-primary/50 to-transparent opacity-20 hidden md:block" />

          <div className="space-y-12 md:space-y-16">
            {timeline.map((item, index) => {
              const Icon = item.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className="relative"
                  style={{
                    transform: `translateY(${offset * (0.1 + index * 0.05)}px)`,
                  }}
                >
                  {/* Desktop: Alternating layout */}
                  <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
                    {isEven ? (
                      <>
                        {/* Left content */}
                        <div className="text-right pr-8">
                          <div className="space-y-4">
                            <div>
                              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold mb-2">
                                {item.year}
                              </span>
                              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Center dot */}
                        <div className="flex justify-center">
                          <div className={`relative w-16 h-16 rounded-full bg-linear-to-br ${item.color} p-0.5 shadow-lg`}>
                            <div className="absolute inset-0.5 rounded-full bg-card flex items-center justify-center">
                              <Icon className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Center dot */}
                        <div className="flex justify-center">
                          <div className={`relative w-16 h-16 rounded-full bg-linear-to-br ${item.color} p-0.5 shadow-lg`}>
                            <div className="absolute inset-0.5 rounded-full bg-card flex items-center justify-center">
                              <Icon className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                        </div>

                        {/* Right content */}
                        <div className="text-left pl-8">
                          <div className="space-y-4">
                            <div>
                              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold mb-2">
                                {item.year}
                              </span>
                              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                </>
              )}
                  </div>

                  {/* Mobile: Stacked layout */}
                  <div className="md:hidden">
                    <div className="flex gap-6">
                      {/* Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`relative w-14 h-14 rounded-full bg-linear-to-br ${item.color} p-0.5 shadow-lg shrink-0`}>
                          <div className="absolute inset-0.5 rounded-full bg-card flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        {index !== timeline.length - 1 && (
                          <div className="w-1 h-12 bg-primary/20 mt-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-2">
                          {item.year}
                        </span>
                        <h3 className="text-base font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>

          {/* Final message with image */}
          <div className="mt-16 p-8 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Text */}
              <div>
                <p className="text-sm md:text-base leading-relaxed text-foreground">
                  {t("about.final_message")}
                </p>
          </div>

              {/* Image */}
              <div className="flex justify-center">
                <style>{`
                  @keyframes borderGlow {
                    0% {
                      background-position: 0% 50%;
                      filter: brightness(1) drop-shadow(0 0 8px rgba(260, 75%, 63%, 0.8));
                    }
                    50% {
                      background-position: 100% 50%;
                      filter: brightness(1.3) drop-shadow(0 0 20px rgba(260, 75%, 63%, 1));
                    }
                    100% {
                      background-position: 0% 50%;
                      filter: brightness(1) drop-shadow(0 0 8px rgba(260, 75%, 63%, 0.8));
                    }
                  }
                  .border-glow {
                    background: linear-gradient(90deg, hsl(260, 75%, 63%), hsl(67, 100%, 36%), hsl(260, 75%, 63%));
                    background-size: 200% 200%;
                    animation: borderGlow 3s ease-in-out infinite;
                    box-shadow: 0 0 25px hsl(260, 75%, 63%), inset 0 0 20px hsl(260, 75%, 63%, 0.3);
                  }
                `}</style>
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  {/* Gradient border with flowing animation */}
                  <div className="border-glow absolute inset-0 rounded-2xl p-0.5">
                    {/* Image container */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-card">
                      <img
                        src="https://i.ibb.co/27J5QKcq/IMG-0419.jpg"
                alt="Pedro - Desenvolvedor"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
