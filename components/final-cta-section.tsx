"use client"

import { useLanguage } from "@/components/language-provider"

export function FinalCTASection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative w-full bg-linear-to-br from-primary/20 via-primary/15 to-secondary/20 dark:from-primary/10 dark:via-primary/8 dark:to-secondary/10 border-y border-primary/30 dark:border-primary/20 py-16 md:py-20 overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="absolute -top-40 left-10 w-72 h-72 bg-primary/20 dark:bg-white/10 rounded-full blur-3xl opacity-50 dark:opacity-30" />
      <div className="absolute -bottom-40 right-10 w-96 h-96 bg-secondary/20 dark:bg-white/10 rounded-full blur-3xl opacity-40 dark:opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Layout com apenas título e SVG decorativo */}
        <div className="flex justify-start py-16 md:py-20 px-6 md:px-8 lg:px-16 xl:px-[104px]">
          {/* Title with decorative SVG */}
          <div className="relative w-full">
            <h2 className="text-[28px] font-semibold md:text-4xl lg:text-5xl leading-[140%] tracking-[-1.92px] text-foreground">
              {t("final.title")} <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">{t("final.title2")}</span>
            </h2>
            <div className="hidden md:block absolute -bottom-6 left-0 text-primary w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="207" height="32" viewBox="0 0 207 32" fill="none">
                <path d="M6.78386 10.0373L202.192 10.7761L29.2835 20.3483L179 20.3483" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
