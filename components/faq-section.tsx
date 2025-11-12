"use client"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(sectionRef)
  
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
    <section ref={sectionRef} id="faq" className="py-16 md:py-24 lg:py-[120px] relative overflow-visible">
      {/* Background blur elements - Padrão vertical */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl opacity-60 dark:opacity-40 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/30 dark:bg-secondary/20 rounded-full blur-3xl opacity-60 dark:opacity-40 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/25 dark:bg-primary/15 rounded-full blur-3xl opacity-50 dark:opacity-30 -z-10"></div>
      <div className="absolute top-1/4 right-1/3 w-[450px] h-[450px] bg-secondary/25 dark:bg-secondary/15 rounded-full blur-3xl opacity-50 dark:opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-primary/22 dark:bg-primary/12 rounded-full blur-3xl opacity-45 dark:opacity-25 -z-10"></div>
      

<div className="container mx-auto px-0 relative max-w-[95%]">


        {/* Grid Layout - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
          {/* Left Column - Title and Description */}
          <div className={`px-4 md:px-8 lg:px-0 space-y-6 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <Badge className="mb-2 bg-primary/20 text-primary hover:border-primary/50 border border-transparent" variant="outline">
              {t("faq.badge")}
            </Badge>
            <h2 className="text-2xl font-bold mb-2 text-balance">
              {t("faq.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("faq.title2")}</span> {t("faq.title3")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("faq.description")}
            </p>
          </div>

          {/* Right Column - FAQ Items */}
          <div className={`md:px-8 lg:px-0 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style={{ transitionDelay: "200ms" }}>
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`border-t last:border-b md:border-x border-border/50 hover:bg-muted/30 dark:hover:bg-muted/10 overflow-hidden transition-colors ${
                    index === 0 ? 'md:rounded-t-lg' : ''
                  } ${index === faqs.length - 1 ? 'md:rounded-b-lg' : ''}`}
                >
                  {/* Question */}
                  <div 
                    className="p-6 flex items-center gap-4 cursor-pointer transition-colors"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className={`shrink-0 transition-transform duration-300 ${
                      openId === faq.id ? 'rotate-45' : 'rotate-0'
                    }`}>
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-base leading-[140%] tracking-tight font-semibold text-foreground flex-1">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Answer */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      openId === faq.id 
                        ? 'grid-rows-[1fr] opacity-100' 
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-16 pr-4 pt-3 pb-6">
                        <p className="text-sm font-medium leading-[180%] tracking-wide text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
