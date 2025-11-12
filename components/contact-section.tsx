"use client"

import type React from "react"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function ContactSection() {
  const { language, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(sectionRef)

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 overflow-visible">
      {/* Background blur elements - Padrão do site */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl opacity-80 dark:opacity-60 -z-10" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/30 dark:bg-secondary/20 rounded-full blur-3xl opacity-80 dark:opacity-60 -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/25 dark:bg-primary/15 rounded-full blur-3xl opacity-70 dark:opacity-50 -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-secondary/25 dark:bg-secondary/15 rounded-full blur-3xl opacity-70 dark:opacity-50 -z-10" />
      <div className="absolute top-2/3 right-1/3 w-[400px] h-[400px] bg-primary/22 dark:bg-primary/12 rounded-full blur-3xl opacity-60 dark:opacity-40 -z-10" />

      {/* Stripe removed as requested - espaço superior limpo */}

      {/* Main Section - apenas conteúdo central */}
      <div className="container mx-auto px-2 md:px-4 max-w-[95%]">
        {/* Main Content - usando gradiente do tema */}
        <div className="bg-linear-to-br from-primary/20 via-primary/15 to-secondary/20 dark:from-primary/10 dark:via-primary/8 dark:to-secondary/10 border border-primary/30 dark:border-primary/20 rounded-lg flex flex-col lg:flex-row backdrop-blur-sm overflow-hidden">
          {/* Text Content */}
          <div className="px-6 py-16 md:px-8 lg:px-16 lg:py-20 xl:px-20 lg:flex-1 relative z-10">
            <div className={`transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
                <div className="mb-6 max-w-3xl">
                  <Badge className="mb-2 bg-primary/20 text-primary hover:border-primary/50 border border-transparent" variant="outline">
                    {t("contact.badge")}
                  </Badge>

                  {/* Título reduzido para combinar com as outras seções */}
                  <h2 className="text-2xl font-bold mb-2 text-balance">
                    {t("contact.cta_title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent" />
                  </h2>

                  {/* Nova descrição bilíngue mais concisa e alinhada com o estilo do site */}
                  <p className="text-muted-foreground max-w-2xl text-sm">
                    {language === "pt"
                      ? "Quer transformar sua ideia em um produto? Envie uma mensagem pelo WhatsApp e vamos conversar sobre os próximos passos."
                      : "Want to turn your idea into a product? Send a message on WhatsApp and let's discuss the next steps."}
                  </p>
                </div>
              <a
                href="https://wa.me/5534998731732?text=Olá, Pedro! Vim pelo seu Website e gostaria de ter seu contato!"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground mt-4"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("contact.cta_button")}
                  <ArrowRight className="size-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
            </div>
          </div>

          {/* Imagem decorativa removida a pedido; conteúdo de texto agora ocupa totalmente o espaço */}
        </div>
      </div>
    </section>
  )
}
