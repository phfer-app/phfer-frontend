"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useNavigation } from "@/components/navigation-provider"
import { SectionCorners } from "@/components/section-corners"
import { IntegratedChatbot } from "@/components/integrated-chatbot"

const rotatingWords = {
  pt: ["sistemas", "softwares"],
  en: ["systems", "softwares"],
}

/* ============================================
   BACKUP HERO SECTION - COMENTADO
   ============================================
   
export function HeroSection() {
  const { language } = useLanguage()
  const [currentWord, setCurrentWord] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const words = rotatingWords[language]
    const word = words[currentWord]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < word.length) {
            setDisplayText(word.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(word.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentWord((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWord, language])

  const scrollToContact = () => {
    const element = document.querySelector("#about")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-start relative pt-16 overflow-hidden"
    >
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-30 -z-10"></div>
      
      <div className="absolute inset-0 -z-10 opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-left leading-tight">
            <span className="block">
              {language === "pt" ? "Especialista em" : "Specialist in"}
            </span>
            <span className="block bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {language === "pt" ? "Desenvolver" : "Build"} {displayText}
              <span className="animate-pulse text-primary">|</span>
            </span>
            <span className="block">
              {language === "pt" ? "para o seu negócio!" : "for your business!"}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {language === "pt" ? (
              <>
                Grandes ideias 🕊️ ganham <em className="italic font-semibold text-foreground">asas</em> quando criadas por devs criativos e dedicados.
              </>
            ) : (
              <>
                Great ideas 🕊️ take <em className="italic font-semibold text-foreground">flight</em> when created by creative and dedicated devs.
              </>
            )}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={scrollToContact} 
              className="group rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {language === "pt" ? "Conheça meu trabalho" : "Check my work"}
              <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="group rounded-full"
              onClick={() => {
                const element = document.querySelector("#contact")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {language === "pt" ? "Entre em contato" : "Get in touch"}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">{language === "pt" ? "Desça" : "Scroll"}</span>
          <ChevronDown className="h-5 w-5 text-primary" />
        </div>
      </div>
    </section>
  )
}
*/

export function HeroSection() {
  const { language, t } = useLanguage()
  const { setCurrentRoute } = useNavigation()
  const words = rotatingWords[language]
  const [currentWord, setCurrentWord] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle waiting when word is complete
  useEffect(() => {
    const word = words[currentWord]
    if (!word || !word.length) return
    
    if (!isDeleting && displayText === word) {
      const waitTimeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(waitTimeout)
    }
  }, [displayText, isDeleting, currentWord, words])
  
  // Handle typing/deleting animation
  useEffect(() => {
    const word = words[currentWord]
    if (!word || !word.length) return
    
    // Skip if word is complete and waiting
    if (!isDeleting && displayText === word) {
      return
    }
    
    // Skip if word is empty and finished deleting
    if (isDeleting && displayText === "") {
      setIsDeleting(false)
      setCurrentWord((prev) => (prev + 1) % words.length)
      return
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Digitando
        if (displayText.length < word.length) {
          setDisplayText(word.slice(0, displayText.length + 1))
        }
      } else {
        // Deletando
        if (displayText.length > 0) {
          setDisplayText(word.slice(0, displayText.length - 1))
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWord, words])

  // Initialize and reset when language changes
  useEffect(() => {
    const newWords = rotatingWords[language]
    if (newWords && newWords[0]) {
      setDisplayText(newWords[0][0] || "")
      setCurrentWord(0)
      setIsDeleting(false)
    }
  }, [language])

  const scrollToContact = () => {
    setCurrentRoute("home")
    setTimeout(() => {
      const element = document.querySelector("#contact")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const scrollToAbout = () => {
    setCurrentRoute("about")
  }

  return (
    <section 
      id="home" 
      className="relative pt-56 pb-24 flex flex-col items-center justify-center overflow-hidden"
    >
      <SectionCorners />
      {/* Background with radial gradient - Mais intenso e espalhado */}
      <div className="absolute inset-0 bg-background">
        {/* Gradientes principais - mais intensos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-radial-gradient from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl" />
        
        {/* Gradientes adicionais - mais espalhados */}
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-primary/12 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-[550px] h-[550px] bg-secondary/15 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/5 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/5 right-1/5 w-[450px] h-[450px] bg-secondary/12 rounded-full blur-3xl" />
      </div>

      {/* Animated circles - mais intensos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-16 h-16 border border-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/4 w-20 h-20 border border-primary/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 border border-secondary/15 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main Content - Centered */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-3">
            <span className="block text-foreground">
              {language === "pt" ? (
                <>
                  Criando{" "}
                  <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent min-h-[1.2em] inline-block">
                    {displayText || rotatingWords[language][0]}
                    <span className="animate-pulse text-primary ml-2">|</span>
                  </span>{" "}
                  inovadores!
                </>
              ) : (
                <>
                  Creating{" "}
                  <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent min-h-[1.2em] inline-block">
                    {displayText || rotatingWords[language][0]}
                    <span className="animate-pulse text-primary ml-2">|</span>
                  </span>{" "}
                  innovative!
                </>
              )}
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed mx-auto mb-12">
            {language === "pt" ? (
              <>
                Grandes ideias 🕊️ ganham <em className="italic font-semibold text-foreground">asas</em> quando criadas por devs criativos e dedicados.
              </>
            ) : (
              <>
                Great ideas 🕊️ take <em className="italic font-semibold text-foreground">flight</em> when created by creative and dedicated devs.
              </>
            )}
          </p>

          {/* Action Buttons - New Design */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToContact}
              className="group relative px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg overflow-hidden transition-all duration-300 text-sm w-[200px] sm:w-[240px] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                {t("hero.button2")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={scrollToAbout}
              className="group relative px-6 py-2.5 bg-transparent border-2 border-primary/30 text-foreground font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:bg-primary/5 text-sm w-[200px] sm:w-[240px] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                {t("hero.button1")}
              </span>
            </button>
          </div>

          {/* Integrated Chatbot */}
          <div className="w-full mt-12 mb-24 px-4">
            <IntegratedChatbot />
          </div>
        </div>
      </div>

      {/* Scroll indicator - Bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {language === "pt" ? "Role para explorar" : "Scroll to explore"}
        </span>
      </div>
    </section>
  )
}
