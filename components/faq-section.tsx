"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)
  const { t } = useLanguage()
  
  const faqs = [
    {
      id: 1,
      question: t("faq1.question"),
      answer: t("faq1.answer"),
    },
    {
      id: 2,
      question: t("faq2.question"),
      answer: t("faq2.answer"),
    },
    {
      id: 3,
      question: t("faq3.question"),
      answer: t("faq3.answer"),
    },
    {
      id: 4,
      question: t("faq4.question"),
      answer: t("faq4.answer"),
    },
    {
      id: 5,
      question: t("faq5.question"),
      answer: t("faq5.answer"),
    },
    {
      id: 6,
      question: t("faq6.question"),
      answer: t("faq6.answer"),
    },
  ]

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <SectionCorners />
      {/* Background blur elements - Padrão vertical */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/15 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute top-1/4 right-1/3 w-[450px] h-[450px] bg-secondary/15 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-primary/12 rounded-full blur-3xl opacity-25 -z-10"></div>
      
      {/* Círculos animados verticais */}
      <div className="absolute top-1/3 left-1/4 w-24 h-24 border border-primary/20 rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border border-secondary/20 rounded-full animate-pulse -z-10" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-2/3 left-1/5 w-16 h-16 border border-primary/15 rounded-full animate-pulse -z-10" style={{ animationDelay: '0.5s' }} />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("faq.badge")}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">
            {t("faq.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("faq.title2")}</span> {t("faq.title3")}
          </h2>
          <p className="text-muted-foreground text-base">
            {t("faq.description")}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="group relative p-6 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 cursor-pointer"
              onClick={() => toggleFAQ(faq.id)}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-xl bg-linear-to-r from-primary to-secondary transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-left mb-0 group-hover:text-primary transition-colors duration-300">
                    {faq.question}
                  </h3>
                </div>

                <div className={`shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 ${
                  openId === faq.id ? "rotate-180 bg-primary/20" : ""
                }`}>
                  <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-300 ${
                    openId === faq.id ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openId === faq.id ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pt-4 border-t border-border/30">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
