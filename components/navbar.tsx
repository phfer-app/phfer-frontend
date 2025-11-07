"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Languages, Palette, ChevronDown } from "lucide-react"
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
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false)
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false)
  const [isThemeExpanded, setIsThemeExpanded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { currentRoute, setCurrentRoute } = useNavigation()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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
    
    // Se for home, garantir scroll para o topo e remover foco
    if (route === "home") {
      // Remove foco de qualquer elemento ativo
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      
      // Scroll para o topo imediatamente
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    
    if (pathname !== "/") {
      router.push("/")
      // aguarda a navegação para garantir render da home
      setTimeout(() => {
        setCurrentRoute(route)
        // Se for home, garantir scroll novamente após navegação
        if (route === "home") {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }
          }, 100)
        }
      }, 50)
    } else {
      setCurrentRoute(route)
    }
    setIsOpen(false)
  }

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const go = () => {
      setCurrentRoute("home")
      setIsOpen(false)
      setTimeout(() => {
        const element = document.querySelector("#contact")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 150)
    }
    if (pathname !== "/") {
      router.push("/")
      setTimeout(go, 50)
    } else {
      go()
    }
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
                    : "text-muted-foreground hover:text-primary hover:bg-muted/80"
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
                  className="h-10 px-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer flex items-center gap-2" 
                  title={language === "pt" ? "Português" : "English"}
                >
                  <Languages className="h-5 w-5 cursor-pointer" />
                  <ChevronDown className="h-3 w-3 cursor-pointer opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl">
                <DropdownMenuItem 
                  onClick={() => setLanguage("pt")} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors rounded-lg m-1"
                >
                  <span className="text-xl">🇧🇷</span>
                  <div className="flex flex-col">
                    <span className="font-medium">Português</span>
                    <span className="text-xs text-muted-foreground">Portuguese</span>
                  </div>
                  {language === "pt" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors rounded-lg m-1"
                >
                  <span className="text-xl">🇺🇸</span>
                  <div className="flex flex-col">
                    <span className="font-medium">English</span>
                    <span className="text-xs text-muted-foreground">Inglês</span>
                  </div>
                  {language === "en" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle - Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 px-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer flex items-center gap-2" 
                  title={theme === "dark" ? "Tema escuro" : theme === "light" ? "Tema claro" : "Tema do sistema"}
                >
                  <Palette className="h-5 w-5 cursor-pointer" />
                  <ChevronDown className="h-3 w-3 cursor-pointer opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl">
                <DropdownMenuItem 
                  onClick={() => setTheme("light")} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors rounded-lg m-1"
                >
                  <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-500/30 flex items-center justify-center">
                    <span className="text-xs">☀️</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Claro</span>
                    <span className="text-xs text-muted-foreground">Light</span>
                  </div>
                  {theme === "light" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("dark")} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors rounded-lg m-1"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600/30 flex items-center justify-center">
                    <span className="text-xs">🌙</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Escuro</span>
                    <span className="text-xs text-muted-foreground">Dark</span>
                  </div>
                  {theme === "dark" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("system")} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors rounded-lg m-1"
                >
                  <div className="w-5 h-5 rounded-full bg-linear-to-br from-yellow-400 to-slate-700 border border-border/30 flex items-center justify-center">
                    <span className="text-xs">💻</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Sistema</span>
                    <span className="text-xs text-muted-foreground">System</span>
                  </div>
                  {theme === "system" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Button */}
            <button
              onClick={() => router.push("/soon")}
              className="px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-primary/10 border border-border/50 hover:border-primary/50 cursor-pointer"
            >
              {t("nav.login")}
            </button>

            {/* Cadastre-se Button - Highlighted */}
            <button
              onClick={() => router.push("/soon")}
              className="px-6 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/90 cursor-pointer"
            >
              {t("nav.cadastre_se")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-lg hover:bg-transparent! hover:text-foreground! active:bg-transparent! transition-all duration-300 group cursor-pointer" 
              onClick={() => {
                setIsOpen(!isOpen)
                if (isOpen) {
                  setIsMobileMenuExpanded(false)
                  setIsLanguageExpanded(false)
                  setIsThemeExpanded(false)
                }
              }}
            >
              <div className="relative w-5 h-5">
                <Menu 
                  className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                    isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 group-hover:scale-110"
                  }`}
                />
                <X 
                  className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                    isOpen ? "opacity-100 scale-100 group-hover:scale-110" : "opacity-0 scale-0"
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop to close menu */}
            <div 
              className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => {
                setIsOpen(false)
                setIsMobileMenuExpanded(false)
                setIsLanguageExpanded(false)
                setIsThemeExpanded(false)
              }}
            />
            
            {/* Menu Drawer from Right - Modernizado */}
            <div className="md:hidden fixed right-0 top-0 h-screen w-[280px] z-40 bg-linear-to-b from-background via-background to-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl shadow-black/40 animate-in slide-in-from-right duration-300">
              <div className="flex flex-col h-full">
                {/* Close Button */}
                <div className="flex items-center justify-end p-4 border-b border-border/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-lg h-9 w-9 hover:bg-transparent! hover:text-foreground! active:bg-transparent! cursor-pointer" 
                    onClick={() => {
                      setIsOpen(false)
                      setIsMobileMenuExpanded(false)
                      setIsLanguageExpanded(false)
                      setIsThemeExpanded(false)
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                  {/* Botão Principal - Mostra o item selecionado ou Início */}
                  <div className="space-y-1.5">
                    {currentRoute === "home" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMobileMenuExpanded(!isMobileMenuExpanded)
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 text-primary border-primary/50 bg-transparent hover:bg-primary/5 cursor-pointer"
                      >
                        <span>{t("nav.inicio")}</span>
                        <ChevronDown 
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${
                            isMobileMenuExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <>
                        {/* Mostra o botão selecionado no topo */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsMobileMenuExpanded(!isMobileMenuExpanded)
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 text-primary border-primary/50 bg-transparent hover:bg-primary/5 cursor-pointer"
                        >
                          <span>{t(navLinks.find(l => l.route === currentRoute)?.labelKey || "nav.inicio")}</span>
                          <ChevronDown 
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isMobileMenuExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </>
                    )}
                    
                    {/* Expanded Menu Items */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                        isMobileMenuExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {navLinks.filter(link => link.route !== currentRoute).map((link) => (
                        <button
                          key={link.route}
                          onClick={(e) => handleNavClick(e, link.route)}
                          className="flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 group border-2 cursor-pointer text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">{t(link.labelKey)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Login and Cadastre-se Buttons */}
                  <div className="space-y-1.5 pt-2">
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        router.push("/soon")
                      }}
                      className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer text-foreground border-border/30 hover:border-primary/30 bg-transparent hover:bg-muted/30"
                    >
                      {t("nav.login")}
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        router.push("/soon")
                      }}
                      className="flex items-center justify-center w-full px-3 py-2 text-sm font-semibold bg-linear-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary rounded-lg transition-all duration-200 cursor-pointer shadow-md shadow-primary/20"
                    >
                      {t("nav.cadastre_se")}
                    </button>
                  </div>
                </div>

                {/* Controls com Dropdowns */}
                <div className="px-4 pt-3 pb-4 border-t border-border/30 space-y-2 bg-background/50">
                  {/* Language Dropdown */}
                  <div className="space-y-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsLanguageExpanded(!isLanguageExpanded)
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-border/30 hover:border-primary/40 bg-transparent hover:bg-muted/30 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">{language === "pt" ? "Português" : "English"}</span>
                          <span className="text-[10px] text-muted-foreground">{language === "pt" ? "Language" : "Idioma"}</span>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          isLanguageExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Expanded Language Options */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                        isLanguageExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setLanguage("pt")
                          setIsLanguageExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          language === "pt"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <span className="text-base mr-2">🇧🇷</span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Português</span>
                          <span className="text-[10px] text-muted-foreground">Portuguese</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("en")
                          setIsLanguageExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          language === "en"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <span className="text-base mr-2">🇺🇸</span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">English</span>
                          <span className="text-[10px] text-muted-foreground">Inglês</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Theme Dropdown */}
                  <div className="space-y-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsThemeExpanded(!isThemeExpanded)
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-border/30 hover:border-primary/40 bg-transparent hover:bg-muted/30 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">
                            {theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Sistema"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{language === "pt" ? "Theme" : "Tema"}</span>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          isThemeExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Expanded Theme Options */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                        isThemeExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setTheme("light")
                          setIsThemeExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          theme === "light"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-500/30 flex items-center justify-center mr-2">
                          <span className="text-[10px]">☀️</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Claro</span>
                          <span className="text-[10px] text-muted-foreground">Light</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTheme("dark")
                          setIsThemeExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          theme === "dark"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600/30 flex items-center justify-center mr-2">
                          <span className="text-[10px]">🌙</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Escuro</span>
                          <span className="text-[10px] text-muted-foreground">Dark</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTheme("system")
                          setIsThemeExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          theme === "system"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-linear-to-br from-yellow-400 to-slate-700 border border-border/30 flex items-center justify-center mr-2">
                          <span className="text-[10px]">💻</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Sistema</span>
                          <span className="text-[10px] text-muted-foreground">System</span>
                        </div>
                      </button>
                    </div>
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
