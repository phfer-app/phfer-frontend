"use client"

import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

type Testimonial = {
  name: string
  role: string
  company: string
  content: string
  avatar: string
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  
  const originalTestimonials = [
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

  // Triple the testimonials for smooth loop
  const testimonials = [...originalTestimonials, ...originalTestimonials, ...originalTestimonials]
  
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <SectionCorners />
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-background via-background to-primary/5" />

      {/* Animated blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("testimonials.badge")}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">
            {t("testimonials.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("testimonials.title2")}</span> {t("testimonials.title3")}
          </h2>
          <p className="text-muted-foreground text-base">
            {t("testimonials.description")}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient fade on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <style>{`
            @keyframes scroll-testimonials {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-66.666%);
              }
            }
            
            .testimonials-scroll {
              animation: scroll-testimonials 24s linear infinite;
              display: flex;
              gap: 2rem;
            }
            
            .testimonials-scroll:hover {
              animation-play-state: paused;
            }
            
            @media (max-width: 768px) {
              .testimonials-scroll {
                animation: scroll-testimonials 16s linear infinite;
              }
            }
          `}</style>

          <div className="testimonials-scroll">
            {/* All testimonials repeated for smooth infinite loop */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`testimonial-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative p-8 rounded-2xl border border-border/50 backdrop-blur-sm bg-card/30 hover:border-primary/50 transition-all duration-300 group min-w-[400px] md:min-w-[450px]">
      {/* Top accent line */}
      <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-2xl bg-linear-to-r from-primary to-secondary" />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>

      {/* Divider */}
      <div className="h-px bg-border/30 mb-6" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="text-3xl">{testimonial.avatar}</div>
        <div>
          <h3 className="font-bold text-foreground">{testimonial.name}</h3>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          <p className="text-xs text-primary font-medium">{testimonial.company}</p>
        </div>
      </div>
    </div>
  )
}
