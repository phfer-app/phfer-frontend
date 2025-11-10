"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  LayoutDashboard, 
  MessageSquare,
  FileText, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HowItWorksSection() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isVisible = useScrollAnimation(sectionRef)

  const steps = [
    {
      icon: Globe,
      title: t("how_it_works.step1.title"),
      description: t("how_it_works.step1.description"),
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-500"
    },
    {
      icon: Briefcase,
      title: t("how_it_works.step2.title"),
      description: t("how_it_works.step2.description"),
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-500"
    },
    {
      icon: FileText,
      title: t("how_it_works.step4.title"),
      description: t("how_it_works.step4.description"),
      color: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-500"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [steps.length])

  const handleRequestWorkspace = () => {
    router.push("/solicitar-servicos")
  }

  const handleViewChamados = () => {
    router.push("/chamados")
  }

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 overflow-hidden"
      id="how-it-works"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent rounded-full blur-3xl opacity-60 animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              {t("how_it_works.badge")}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("how_it_works.title")}
          </h2>
          
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            {t("how_it_works.description")}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Left Side - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              
              return (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
                    isActive
                      ? `${step.borderColor} bg-gradient-to-br ${step.color} shadow-xl`
                      : "border-border/30 bg-card/50 hover:border-border/50 hover:bg-card/70"
                  } ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} border ${step.borderColor} transition-transform duration-300 ${isActive ? "rotate-6" : ""}`}>
                      <Icon className={`h-6 w-6 ${step.iconColor} transition-all duration-300 ${isActive ? "animate-pulse" : ""}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm md:text-base text-muted-foreground transition-all duration-300 ${
                        isActive ? "text-muted-foreground" : "text-muted-foreground/70"
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="h-5 w-5 text-primary animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-b-2xl animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Right Side - Visual Explanation */}
          <div 
            className={`relative transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="sticky top-24">
              <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-2xl animate-pulse delay-1000" />
                
                {/* Main Visual */}
                <div className="relative z-10 space-y-8">
                  {/* Portfolio Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-xl animate-pulse" />
                      <div className="relative p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/30">
                        <LayoutDashboard className="h-16 w-16 text-primary animate-bounce" />
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{t("how_it_works.feature1")}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{t("how_it_works.feature2")}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{t("how_it_works.feature3")}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleRequestWorkspace}
                      className="flex-1 group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                    >
                      {t("how_it_works.cta1")}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button
                      onClick={handleViewChamados}
                      variant="outline"
                      className="flex-1 group border-primary/30 hover:border-primary hover:bg-primary/5 cursor-pointer"
                    >
                      {t("how_it_works.cta2")}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("how_it_works.info1.title")}</h4>
                <p className="text-sm text-muted-foreground">{t("how_it_works.info1.description")}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("how_it_works.info2.title")}</h4>
                <p className="text-sm text-muted-foreground">{t("how_it_works.info2.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

