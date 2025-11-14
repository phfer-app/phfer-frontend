"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Code2, Users, Rocket } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

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
      className="relative py-24 overflow-visible"
    >

      {/* Animated blobs - Padrão diagonal */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl opacity-80 dark:opacity-60"
        style={{ transform: `translateY(${offset * 0.3}px)` }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/30 dark:bg-secondary/20 rounded-full blur-3xl opacity-80 dark:opacity-60"
        style={{ transform: `translateY(${offset * -0.3}px)` }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/25 dark:bg-primary/15 rounded-full blur-3xl opacity-70 dark:opacity-50"
        style={{ transform: `translateX(${offset * 0.2}px)` }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-secondary/25 dark:bg-secondary/15 rounded-full blur-3xl opacity-70 dark:opacity-50"
        style={{ transform: `translateX(${offset * -0.2}px)` }}
      />
      

      <div className="container mx-auto px-2 md:px-4 relative z-10 max-w-[95%]">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Badge className="mb-2 bg-primary/20 text-primary hover:border-primary/50 border border-transparent" variant="outline">
            {t("about.badge")}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("about.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("about.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {t("about.description")}
          </p>
        </div>

        {/* Timeline - Modern clean design */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="space-y-6 md:space-y-8">
            {timeline.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={index}
                  className="group relative flex gap-6 md:gap-8 items-start"
                  style={{
                    transform: `translateY(${offset * (0.05 + index * 0.02)}px)`,
                  }}
                >
                  {/* Left side - Icon */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Connector line - hidden on last item */}
                    {index < timeline.length - 1 && (
                      <div className="absolute left-6 md:left-8 top-20 h-8 md:h-12 w-0.5 bg-linear-to-b from-primary/60 to-primary/30 group-hover:from-primary group-hover:to-primary/50 transition-all duration-300" />
                    )}

                    {/* Icon circle */}
                    <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br ${item.color} p-0.5 shrink-0 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 pt-1 md:pt-2">
                    {/* Year */}
                    <div className="mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs md:text-sm font-semibold border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/15 transition-all duration-300">
                        {item.year}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm p-4 md:p-5 group-hover:border-primary/40 group-hover:bg-card/60 transition-all duration-300">
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-transparent rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      {/* Title */}
                      <h3 className="text-base md:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Final message - Minimal elegant design */}
          <div className="mt-20">
            <div className="relative">
              {/* Background gradient card */}
              <div className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-0">
                  
                  {/* Left - Image section */}
                  <div className="relative h-96 md:h-full min-h-96 overflow-hidden bg-black/5">
                    {/* Image */}
                    <img
                      src="https://i.ibb.co/27J5QKcq/IMG-0419.jpg"
                      alt="Pedro - Desenvolvedor"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Right - Text section */}
                  <div className="flex flex-col justify-center px-6 md:px-8 py-8 md:py-10 space-y-6">
                    {/* Top accent */}
                    <div className="w-12 h-1 bg-linear-to-r from-primary to-secondary rounded-full" />

                    {/* Message text */}
                    <p className="text-lg md:text-xl leading-relaxed text-foreground font-light">
                      {t("about.final_message")}
                    </p>

                    {/* Bottom accent */}
                    <div className="pt-2">
                      <div className="w-8 h-0.5 bg-primary/40 rounded-full" />
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
