"use client"

import { useState, useEffect } from "react"
import { ArrowUp, MessageCircle } from "lucide-react"

export function FloatingActions() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send/?phone=5534998731732&text=Ol%C3%A1%2C+Pedro%21+Vim+pelo+seu+Website+e+gostaria+de+ter+seu+contato%21&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300"
        title="Abrir WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          title="Voltar ao topo"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
