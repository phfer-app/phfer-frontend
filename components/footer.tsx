"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Github, Linkedin, Mail, MessageSquare, Instagram, Send } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useNavigation } from "@/components/navigation-provider"

export function Footer() {
  const { t } = useLanguage()
  const { setCurrentRoute } = useNavigation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: "home" | "about" | "career" | "blog") => {
    e.preventDefault()
    setCurrentRoute(route)
  }

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setCurrentRoute("home")
    setTimeout(() => {
      const element = document.querySelector("#contact")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  if (!mounted) {
    return null
  }
  
  return (
    <footer className="relative bg-linear-to-b from-background via-background to-card border-t border-border/50">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="container mx-auto px-4 py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">@initpedro</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground">{t("footer.links")}</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleNavClick(e, "home")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {t("nav.inicio")}
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleNavClick(e, "about")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {t("nav.sobre_mim")}
                </a>
              </li>
              <li>
                <a 
                  href="#career" 
                  onClick={(e) => handleNavClick(e, "career")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {t("nav.carreira")}
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  onClick={(e) => handleNavClick(e, "blog")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {t("nav.blog")}
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={handleContactClick}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {t("nav.contato")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.intuit.com/legal/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a href="https://www.intuit.com/privacy/statement/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Conecte-se Comigo */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground">{t("footer.socials")}</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://linkedin.com/in/initpedro"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/initpedro"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:pedro16hf@gmail.com"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://discord.com/users/683063659638816800"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                title="Discord"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/initpedro"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5534998731732?text=Olá, Pedro! Vim pelo seu Website e gostaria de ter seu contato!"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                title="WhatsApp"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
