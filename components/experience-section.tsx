"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Download, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

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
    <section id="experience" className="py-24 relative overflow-hidden">
      <SectionCorners />
      {/* Background blur elements - Padrão assimétrico */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="absolute top-1/3 right-1/5 w-[550px] h-[550px] bg-primary/15 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/3 left-1/5 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] bg-primary/12 rounded-full blur-3xl opacity-25 -z-10"></div>
      
      {/* Círculos animados assimétricos */}
      <div className="absolute top-1/5 right-1/4 w-28 h-28 border border-primary/20 rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-1/5 left-1/4 w-24 h-24 border border-secondary/20 rounded-full animate-pulse -z-10" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-primary/15 rounded-full animate-pulse -z-10" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/2 right-1/3 w-16 h-16 border border-secondary/15 rounded-full animate-pulse -z-10" style={{ animationDelay: '0.5s' }} />

      <div className="container mx-auto px-2 md:px-4 relative max-w-[95%]">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("experience.badge")}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("experience.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("experience.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {t("experience.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-xl bg-linear-to-r from-primary to-secondary transition-all duration-300"></div>

              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                {/* Icon Container */}
                <div className="shrink-0">
                  <div className="relative w-14 h-14 rounded-lg bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 bg-linear-to-br from-primary/20 to-secondary/20 blur-lg"></div>
                    <Briefcase className="h-6 w-6 text-primary relative z-10 transition-transform duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-bold mb-1">{exp.title}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <Badge
                      className={`whitespace-nowrap ${
                        exp.status === t("exp1.status")
                          ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                          : "bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30"
                      }`}
                      variant="outline"
                    >
                      {exp.status === t("exp1.status") ? "🔵 " + t("exp1.status") : "📋 " + exp.status}
                    </Badge>
                  </div>

                  {/* Period */}
                  <p className="text-sm text-muted-foreground mb-3 font-medium">
                    <span className="inline-flex items-center gap-1">
                      📅 {exp.period}
                    </span>
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 hidden lg:block">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <ArrowRight className="h-5 w-5 text-primary" />
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
  )
}
