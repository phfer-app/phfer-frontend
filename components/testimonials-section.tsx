"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type Testimonial = {
  name: string
  username: string
  content: string
  avatar: string
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(sectionRef)
  
  const testimonials: Testimonial[] = [
    {
      name: "Victor Hugo",
      username: "@victorhugo",
      content: t("testimonial1.content"),
      avatar: "👨‍💻",
    },
    {
      name: "Júlia Reis",
      username: "@juliareis",
      content: t("testimonial4.content"),
      avatar: "👩‍💻",
    },
    {
      name: "Miguel Eustáquio",
      username: "@migueleustaquio",
      content: t("testimonial2.content"),
      avatar: "👨‍💼",
    },
    {
      name: "Luís Miguel",
      username: "@luismiguel",
      content: t("testimonial3.content"),
      avatar: "👨‍💻",
    },
    {
      name: "Amanda Luiza",
      username: "@amandaluiza",
      content: t("testimonial5.content"),
      avatar: "👩‍⚕️",
    },
  ]

  // Duplicate testimonials multiple times for seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]
  
  return (
    <section ref={sectionRef} id="testimonials" className="py-24 relative overflow-visible">
      {/* Animated blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-70 dark:opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 dark:bg-secondary/10 rounded-full blur-3xl opacity-70 dark:opacity-50" />

  <div className="container mx-auto px-0 relative z-10 max-w-[95%]">
        {/* Header */}
        <div className={`mb-12 max-w-3xl transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <Badge className="mb-2 bg-primary/20 text-primary hover:border-primary/50 border border-transparent" variant="outline">
            {t("testimonials.badge")}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("testimonials.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("testimonials.title2")}</span> {t("testimonials.title3")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("testimonials.description")}
          </p>
        </div>

        {/* Marquee Container */}
        <div className="flex-auto w-full overflow-hidden rounded-lg py-8 relative">
          {/* First Marquee Row - Left to Right */}
          <div className="group/marquee">
            <div className="relative flex overflow-x-hidden py-3">
              <div 
                className="flex gap-6 whitespace-nowrap"
                style={{
                  animation: 'marquee 30s linear infinite',
                  willChange: 'transform'
                } as React.CSSProperties}
              >
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div key={`marquee-1-${index}`} className="shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Marquee Row - Right to Left */}
          <div className="group/marquee">
            <div className="relative flex overflow-x-hidden py-3">
              <div 
                className="flex gap-6 whitespace-nowrap"
                style={{
                  animation: 'marquee 30s linear infinite reverse',
                  willChange: 'transform'
                } as React.CSSProperties}
              >
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div key={`marquee-2-${index}`} className="shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.2)] dark:hover:shadow-[0px_0px_12px_0px_rgba(255,255,255,0.1)] transition-all duration-300 flex-1 block h-full bg-card border border-border/50 w-[80vw] md:w-[560px] pl-6 pr-8 pt-6 pb-10 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-3">
        <div className="flex justify-between md:gap-3 w-full">
          <div className="flex md:items-center flex-col md:flex-row gap-5">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl">
              {testimonial.avatar}
            </div>
            <div className="flex flex-col text-left md:order-0 order-2">
              <span className="text-foreground font-semibold text-lg leading-tight tracking-tight">
                {testimonial.name}
              </span>
              <span className="text-muted-foreground font-medium text-base leading-tight tracking-tight">
                {testimonial.username}
              </span>
            </div>
          </div>
          <div className="shrink-0">
            {/* WhatsApp Icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="27" 
              height="27" 
              viewBox="0 0 24 24" 
              fill="none"
              className="text-primary"
            >
              <path 
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" 
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-left text-muted-foreground font-medium text-lg leading-[180%] tracking-wide mt-4 wrap-break-word whitespace-normal line-clamp-3">
        {testimonial.content}
      </p>
    </div>
  )
}
