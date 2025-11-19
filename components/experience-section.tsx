"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Download, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function ExperienceSection() {
  const { t } = useLanguage()
  
  const experiences = [
    {
      title: t("exp1.title"),
      company: t("exp1.company"),
      period: t("exp1.period"),
      description: t("exp1.description"),
      status: t("exp1.status"),
    },
    {
      title: t("exp2.title"),
      company: t("exp2.company"),
      period: t("exp2.period"),
      description: t("exp2.description"),
      status: t("exp2.status"),
    },
    {
      title: t("exp3.title"),
      company: t("exp3.company"),
      period: t("exp3.period"),
      description: t("exp3.description"),
      status: t("exp3.status"),
    },
  ]
  
  return (
    <>
      <section id="experience" className="py-24 relative overflow-visible">
      {/* Background blur elements - Padrão assimétrico */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl opacity-60 dark:opacity-40 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/30 dark:bg-secondary/20 rounded-full blur-3xl opacity-60 dark:opacity-40 -z-10"></div>
      <div className="absolute top-1/3 right-1/5 w-[550px] h-[550px] bg-primary/25 dark:bg-primary/15 rounded-full blur-3xl opacity-50 dark:opacity-30 -z-10"></div>
      <div className="absolute bottom-1/3 left-1/5 w-[500px] h-[500px] bg-secondary/25 dark:bg-secondary/15 rounded-full blur-3xl opacity-50 dark:opacity-30 -z-10"></div>
      <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] bg-primary/22 dark:bg-primary/12 rounded-full blur-3xl opacity-45 dark:opacity-25 -z-10"></div>
      

      <div className="container mx-auto px-2 md:px-4 relative max-w-[95%]">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Badge className="mb-2 bg-primary/20 text-primary hover:border-primary/50 border border-transparent" variant="outline">
            {t("experience.badge")}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("experience.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("experience.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {t("experience.description")}
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative flex gap-6 md:gap-8 items-start"
            >
              {/* Left side - Icon */}
              <div className="flex flex-col items-center shrink-0">
                {/* Connector line - hidden on last item */}
                {index < experiences.length - 1 && (
                  <div className="absolute left-6 md:left-8 top-20 h-8 md:h-12 w-0.5 bg-linear-to-b from-primary/60 to-primary/30 group-hover:from-primary group-hover:to-primary/50 transition-all duration-300" />
                )}

                {/* Icon circle */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-primary/40 to-secondary/40 p-0.5 shrink-0 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex-1 pt-1 md:pt-2">
                {/* Header with title, company and status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-primary font-semibold text-xs md:text-sm">
                      {exp.company}
                    </p>
                  </div>
                  <Badge
                    className={`shrink-0 text-xs font-medium transition-all duration-300 ${
                      exp.status === t("exp1.status")
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/30 group-hover:border-emerald-500/50"
                        : "bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30 group-hover:bg-slate-500/30 group-hover:border-slate-500/50"
                    }`}
                    variant="outline"
                  >
                    {exp.status === t("exp1.status") ? "🔵 " + t("exp1.status") : "📋 " + exp.status}
                  </Badge>
                </div>

                {/* Period */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium mb-3 group-hover:text-foreground/70 transition-colors">
                  <span className="text-base">📅</span>
                  <span>{exp.period}</span>
                </div>

                {/* Card */}
                <div className="rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm p-4 md:p-5 group-hover:border-primary/40 group-hover:bg-card/60 transition-all duration-300">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-transparent rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {exp.description}
                  </p>

                  {/* Bottom accent on hover */}
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary text-xs font-medium">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      Carreira
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="https://drive.google.com/drive/folders/1uxyglnsnpw3eLQLCb_xpqVoffd-lLT3I"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 relative px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 overflow-hidden shadow-2xl cursor-pointer active:scale-95"
            style={{
              background: "linear-gradient(135deg, hsl(260, 75%, 60%) 0%, hsl(67, 100%, 45%) 100%)",
            }}
          >
            <Download className="h-4 w-4 group-hover:animate-bounce" />
            <span className="relative z-10 text-white">{t("experience.resume")}</span>
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
        </div>
      </div>
    </section>

    {/* Stats Section - Full Width */}
    <section className="relative overflow-visible bg-linear-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decoration - Right side */}
      <div className="absolute right-0 top-0 hidden lg:block opacity-30 pointer-events-none" style={{ transform: "translate(50%, -50%)" }}>
        <svg width="1180" height="819" viewBox="0 0 1180 819" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_2980_381)" style={{ mixBlendMode: "multiply" }}>
            <path d="M772.069 858.527H712.076L682.397 391.707L369.773 -118.82L1127.74 -118.82L808.175 391.707L772.069 858.527Z" fill="currentColor" className="text-foreground/20" fillOpacity="0.5"></path>
          </g>
          <defs>
            <filter id="filter0_f_2980_381" x="150.627" y="-337.966" width="1196.26" height="1415.64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
              <feGaussianBlur stdDeviation="109.573" result="effect1_foregroundBlur_2980_381"></feGaussianBlur>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-between items-center py-[100px] px-6 md:px-8 lg:px-16 xl:px-[104px] relative transition-all duration-500 opacity-100 translate-y-0">
        {/* Title Section */}
        <div className="relative">
          <h2 className="text-[32px] font-semibold md:text-5xl flex flex-col leading-[120%] tracking-[-1.92px] text-foreground">
            Trajetória profissional
            <span className="text-primary">em evolução.</span>
          </h2>
          <div className="hidden md:block absolute -bottom-8 -left-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="207" height="32" viewBox="0 0 207 32" fill="none">
              <path d="M6.78386 10.0373L202.192 10.7761L29.2835 20.3483L179 20.3483" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4">
          {/* Stat 1 */}
          <div className="w-[190px] space-y-5 md:text-right">
            <p className="text-[36px] md:text-[64px] font-semibold leading-[45px] tracking-[-2.56px] text-foreground">
              <span className="hidden md:inline text-primary leading-[45px]">+</span> 2
            </p>
            <p className="font-semibold leading-[11px] text-foreground">Anos de Experiência</p>
          </div>

          {/* Stat 2 */}
          <div className="w-[190px] space-y-5 md:text-right">
            <p className="text-[36px] md:text-[64px] font-semibold leading-[45px] tracking-[-2.56px] text-foreground">
              <span className="text-primary">+</span>10
            </p>
            <p className="font-semibold leading-[11px] text-foreground">Projetos</p>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
