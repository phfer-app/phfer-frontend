"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { useNavigation } from "@/components/navigation-provider"

const navLinks = [
  { route: "home" as const, labelKey: "nav.inicio" },
  { route: "about" as const, labelKey: "nav.sobre_mim" },
  { route: "career" as const, labelKey: "nav.carreira" },
  { route: "blog" as const, labelKey: "nav.blog" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { currentRoute, setCurrentRoute } = useNavigation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Verifica se está scrollado o suficiente para aplicar estilos
      setIsScrolled(currentScrollY > 20)
      
      // Mostra navbar ao scrollar para cima, esconde ao scrollar para baixo
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down e passou de 100px
        setIsVisible(false)
      }
      
      // Se estiver no topo, sempre mostra
      if (currentScrollY < 10) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, route: "home" | "about" | "career" | "blog") => {
    e.preventDefault()
    setCurrentRoute(route)
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-full opacity-0 pointer-events-none"
      } ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-background/60 backdrop-blur-md border-b border-border/30"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-14">
          {/* Logo - Left */}
          <button 
            onClick={(e) => handleNavClick(e, "home")}
            className="text-lg font-bold text-primary whitespace-nowrap shrink-0 relative group cursor-pointer"
          >
            <span className="relative z-10">init</span>
            <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"></span>
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={(e) => handleNavClick(e, link.route)}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  currentRoute === link.route
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                {t(link.labelKey)}
              </button>
            ))}
          </div>

          {/* Desktop Controls - Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 w-10 rounded-lg hover:bg-primary/10 transition-colors" 
                  title={language === "pt" ? "Português" : "English"}
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setLanguage("pt")} className="flex items-center gap-2 cursor-pointer">
                  <span className="text-lg">🇧🇷</span>
                  <span>Português</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center gap-2 cursor-pointer">
                  <span className="text-lg">🇺🇸</span>
                  <span>English</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 w-10 rounded-lg hover:bg-primary/10 transition-colors" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

                  {/* Contact Button - Highlighted */}
                  <button
                    onClick={(e) => handleNavClick(e, "home")}
                    className="px-6 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/90 cursor-pointer"
                  >
                    {t("nav.contato")}
                  </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop to close menu */}
            <div 
              className="md:hidden fixed inset-0 z-30 bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Drawer from Right */}
            <div className="md:hidden fixed right-0 top-0 h-screen w-64 z-40 bg-card border-l border-border/50 backdrop-blur-sm animate-in slide-in-from-right-64 duration-300 shadow-2xl shadow-black/20">
              <div className="flex flex-col h-full">
                {/* Close Button */}
                <div className="flex items-center justify-end p-4 border-b border-border/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-lg" 
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 py-8 space-y-3">
                  {navLinks.map((link) => (
                    <button
                      key={link.route}
                      onClick={(e) => handleNavClick(e, link.route)}
                      className={`flex items-center w-full px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 group border cursor-pointer ${
                        currentRoute === link.route
                          ? "text-primary bg-primary/20 border-primary/40"
                          : "text-primary bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{t(link.labelKey)}</span>
                    </button>
                  ))}
                  {/* Contact Link in Mobile */}
                  <button
                    onClick={(e) => handleNavClick(e, "home")}
                    className="flex items-center w-full px-6 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    {t("nav.contato")}
                  </button>
                </div>

                {/* Controls */}
                <div className="px-4 py-6 border-t border-border/30 space-y-3">
                  {/* Language Selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">{language === "pt" ? "Idioma" : "Language"}</p>
                    <button
                      onClick={() => setLanguage("pt")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        language === "pt"
                          ? "bg-primary/20 text-primary border border-primary/50"
                          : "text-muted-foreground hover:bg-muted border border-transparent"
                      }`}
                    >
                      <span className="text-lg">🇧🇷</span>
                      <span>Português</span>
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        language === "en"
                          ? "bg-primary/20 text-primary border border-primary/50"
                          : "text-muted-foreground hover:bg-muted border border-transparent"
                      }`}
                    >
                      <span className="text-lg">🇺🇸</span>
                      <span>English</span>
                    </button>
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 border border-border/30">
                    <span className="text-sm font-medium">{theme === "dark" ? "🌙 Escuro" : "☀️ Claro"}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-lg" 
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
