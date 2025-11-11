"use client"

import { useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { 
  Globe,
  Briefcase,
  FileText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HowItWorksSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isVisible = useScrollAnimation(sectionRef)

  const cards = [
    {
      icon: Globe,
      title: t("how_it_works.step1.title"),
      description: t("how_it_works.step1.description"),
      iconColor: "text-blue-500"
    },
    {
      icon: Briefcase,
      title: t("how_it_works.step2.title"),
      description: t("how_it_works.step2.description"),
      iconColor: "text-purple-500"
    },
    {
      icon: FileText,
      title: t("how_it_works.step4.title"),
      description: t("how_it_works.step4.description"),
      iconColor: "text-orange-500"
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 overflow-hidden"
      id="how-it-works"
    >
      <div className="container mx-auto px-2 md:px-4 relative z-10 max-w-[95%]">
        {/* Header */}
        <div 
          className={`mb-12 max-w-3xl transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-2 bg-primary/20 text-primary hover:border-primary/50 border border-transparent" variant="outline">
            {t("how_it_works.badge")}
          </Badge>
          
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("how_it_works.title")}
          </h2>
          
          <p className="text-sm text-muted-foreground max-w-2xl">
            {t("how_it_works.description")}
          </p>
        </div>

        {/* Cards Grid */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {cards.map((card, index) => {
            const Icon = card.icon
            
            return (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border border-border/30 bg-card/50 hover:border-primary/50 transition-all duration-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="p-3 rounded-xl bg-card border border-border/50 inline-block">
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>

                {/* Coming Soon Badge */}
                {card.comingSoon && (
                  <div className="mt-4">
                    <Badge 
                      variant="outline" 
                      className="bg-primary/10 text-primary border-primary/30 hover:border-primary/50"
                    >
                      Em breve
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

