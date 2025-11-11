"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type Testimonial = {
  name: string
  role: string
  company: string
  content: string
  avatar: string
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(sectionRef)
  
  const testimonials = [
    {
      name: "Victor Hugo",
      role: t("testimonial1.role"),
      company: t("testimonial1.company"),
      content: t("testimonial1.content"),
      avatar: "👨‍💻",
    },
    {
      name: "Júlia Reis",
      role: t("testimonial4.role"),
      company: t("testimonial4.company"),
      content: t("testimonial4.content"),
      avatar: "👩‍💻",
    },
    {
      name: "Miguel Eustáquio",
      role: t("testimonial2.role"),
      company: t("testimonial2.company"),
      content: t("testimonial2.content"),
      avatar: "👨‍💼",
    },
    {
      name: "Luís Miguel",
      role: t("testimonial3.role"),
      company: t("testimonial3.company"),
      content: t("testimonial3.content"),
      avatar: "👨‍💻",
    },
    {
      name: "Amanda Luiza",
      role: t("testimonial5.role"),
      company: t("testimonial5.company"),
      content: t("testimonial5.content"),
      avatar: "👩‍⚕️",
    },
  ]

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    resetInterval()
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    resetInterval()
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    resetInterval()
  }

  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Change every 4 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testimonials.length])
  
  return (
    <section ref={sectionRef} id="testimonials" className="py-24 relative overflow-hidden">
      <SectionCorners />
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-background via-background to-primary/5" />

      {/* Animated blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-2 md:px-4 relative z-10 max-w-[95%]">
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

        {/* Carousel Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-lg bg-primary/10 hover:border-primary/50 border border-transparent text-primary transition-all duration-300 cursor-pointer"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted hover:border-primary/50 border border-transparent"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-lg bg-primary/10 hover:border-primary/50 border border-transparent text-primary transition-all duration-300 cursor-pointer"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Testimonial Card */}
          <div className="transition-all duration-300">
            <TestimonialCard testimonial={testimonials[currentIndex]} />
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative p-6 rounded-xl border border-border/50 backdrop-blur-sm bg-card/30 hover:border-primary/50 transition-all duration-300 group">
      {/* Top accent line */}
      <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-xl bg-linear-to-r from-primary to-secondary" />

      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-primary text-primary" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{testimonial.content}"</p>

      {/* Divider */}
      <div className="h-px bg-border/30 mb-4" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="text-2xl">{testimonial.avatar}</div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{testimonial.name}</h3>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          <p className="text-xs text-primary font-medium">{testimonial.company}</p>
        </div>
      </div>
    </div>
  )
}
