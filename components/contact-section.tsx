"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Linkedin, Github, MessageSquare, MapPin, Phone, Instagram, Send } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

export function ContactSection() {
  const { t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/in/initpedro", color: "from-blue-500 to-blue-600" },
    { icon: Github, label: "GitHub", url: "https://github.com/initpedro", color: "from-gray-700 to-gray-900" },
    { icon: MessageSquare, label: "Discord", url: "https://discord.com/users/683063659638816800", color: "from-indigo-500 to-purple-600" },
    { icon: Mail, label: "E-mail", url: "mailto:pedro16hf@gmail.com", color: "from-red-500 to-pink-600" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/initpedro", color: "from-pink-500 to-purple-600" },
    { icon: Send, label: "WhatsApp", url: "https://wa.me/5534998731732?text=Olá, Pedro! Vim pelo seu Website e gostaria de ter seu contato!", color: "from-green-500 to-emerald-600" },
  ]

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <SectionCorners />
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-background via-background to-primary/5" />

      {/* Animated blobs - Padrão em ondas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-2/3 right-1/3 w-[400px] h-[400px] bg-primary/12 rounded-full blur-3xl opacity-40" />
      
      {/* Círculos animados em ondas */}
      <div className="absolute top-1/4 left-1/5 w-28 h-28 border border-primary/20 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/5 w-24 h-24 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 border border-primary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/2 left-1/3 w-16 h-16 border border-secondary/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("contact.badge")}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">
            {t("contact.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("contact.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {t("contact.description")}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* WhatsApp CTA Section */}
          <div className="lg:col-span-2">
            <div className="relative p-8 rounded-2xl border border-border/50 backdrop-blur-sm bg-card/30 hover:border-primary/50 transition-all duration-300">
              {/* Top accent line */}
              <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-2xl bg-linear-to-r from-primary to-secondary" />

              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                {t("contact.whatsapp_title")} {t("contact.whatsapp_title2")}
              </h3>

              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                {t("contact.whatsapp_description")}
              </p>

              <a
                href="https://wa.me/5534998731732?text=Olá, Pedro! Vim pelo seu Website e gostaria de ter seu contato!"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 relative px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 overflow-hidden shadow-2xl cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                }}
              >
                <span className="relative z-10 text-white flex items-center gap-2">
                  <Send className="h-4 w-4 transition-transform" />
                  {t("contact.whatsapp")}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
            </div>
          </div>

          {/* Social Links & Contact Info Card */}
          <div className="relative p-8 rounded-2xl border border-border/50 backdrop-blur-sm bg-card/30 hover:border-primary/50 transition-all duration-300 lg:row-span-2">
            {/* Top accent line */}
            <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-2xl bg-linear-to-r from-primary to-secondary" />

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("footer.socials")}
            </h3>

            <div className="space-y-6">
              {/* Social Links */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4">{t("footer.socials")}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col items-center gap-2 group"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{social.label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/30" />

              {/* Quick Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("contact.response_time")}</p>
                  <p className="text-sm font-medium">{t("contact.response_time_value")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("contact.location")}</p>
                  <p className="text-sm font-medium">{t("contact.location_value")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("contact.availability")}</p>
                  <p className="text-sm font-medium">{t("contact.availability_value")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart Section - Performance & Growth Message */}
          <div className="lg:col-span-2 lg:row-start-2">
            <div className="relative p-8 rounded-2xl border border-border/50 backdrop-blur-sm bg-card/30 hover:border-primary/50 transition-all duration-300">
              {/* Top accent line */}
              <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-2xl bg-linear-to-r from-primary to-secondary" />

              <h3 className="text-lg font-bold mb-4 text-center">
                {t("contact.chart_title")}
              </h3>

              {/* Motivational message */}
              <p className="text-center text-muted-foreground mb-8 text-sm leading-relaxed">
                {t("contact.chart_subtitle")}
              </p>

              {/* Line chart with animation */}
              <div className="max-w-2xl mx-auto">
                <svg viewBox="0 0 400 200" className="w-full h-40">
                {/* Grid lines */}
                <line x1="40" y1="160" x2="380" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.1" />
                <line x1="40" y1="110" x2="380" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.1" />
                <line x1="40" y1="60" x2="380" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
                
                {/* Axis */}
                <line x1="40" y1="20" x2="40" y2="160" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <line x1="40" y1="160" x2="380" y2="160" stroke="currentColor" strokeWidth="2" opacity="0.3" />

                {/* Animated line */}
                <g>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(260, 90%, 60%)" />
                      <stop offset="100%" stopColor="hsl(45, 93%, 50%)" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="50,130 120,90 190,70 260,40 330,50 380,30"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0"
                    style={{
                      animation: `drawLine 2s ease-out 0.3s forwards`,
                    }}
                  />
                  
                  {/* Animated points */}
                  {[
                    { cx: 50, cy: 130, delay: 0.5 },
                    { cx: 120, cy: 90, delay: 0.7 },
                    { cx: 190, cy: 70, delay: 0.9 },
                    { cx: 260, cy: 40, delay: 1.1 },
                    { cx: 330, cy: 50, delay: 1.3 },
                    { cx: 380, cy: 30, delay: 1.5 },
                  ].map((point, i) => (
                    <circle
                      key={i}
                      cx={point.cx}
                      cy={point.cy}
                      r="5"
                      fill="hsl(260, 90%, 60%)"
                      opacity="0"
                      style={{
                        animation: `popPoint 0.5s ease-out ${point.delay}s forwards`,
                      }}
                    />
                  ))}
                </g>
              </svg>

              <style>{`
                @keyframes drawLine {
                  to {
                    opacity: 1;
                  }
                }
                
                @keyframes popPoint {
                  from {
                    opacity: 0;
                    r: 0;
                  }
                  to {
                    opacity: 1;
                    r: 5px;
                  }
                }
              `}</style>

              {/* Labels */}
              <div className="flex justify-between text-xs text-muted-foreground mt-4 px-2">
                <span>{t("contact.chart_label_today")}</span>
                <span>{t("contact.chart_label_1m")}</span>
                <span>{t("contact.chart_label_3m")}</span>
                <span>{t("contact.chart_label_6m")}</span>
                <span>{t("contact.chart_label_1y")}</span>
                <span>{t("contact.chart_label_future")}</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
