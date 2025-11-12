"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects - mais sutis e profissionais */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-radial-gradient from-primary/20 via-primary/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-secondary/15 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 left-1/4 w-[650px] h-[650px] bg-primary/10 rounded-full blur-3xl opacity-40" />
      </div>



      {/* Content - layout mais profissional com ícone à esquerda */}
      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Icon - à esquerda */}
          <div className="shrink-0">
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-linear-to-br from-primary/15 via-primary/8 to-secondary/8 flex items-center justify-center backdrop-blur-md border border-primary/20 shadow-xl shadow-primary/10">
                <AlertTriangle className="h-14 w-14 md:h-18 md:w-18 text-primary" />
              </div>
            </div>
          </div>

          {/* Content - à direita */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-5">
              <h1 className="text-6xl md:text-7xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                Página não encontrada
              </h2>
              <div className="space-y-3">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Estamos tentando resolver isso. Talvez não deveria aparecer isso, ou você não deveria estar acessando essa página!
                </p>
                <p className="text-sm md:text-base text-muted-foreground/80 italic">
                  A página que você está procurando não existe, foi movida ou você não tem permissão para acessá-la.
                </p>
              </div>
            </div>

            {/* Actions - mais profissionais */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-4">
              <Button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-8 py-6 text-base font-medium bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              >
                <Home className="h-5 w-5 mr-2" />
                Voltar para o início
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-base font-medium border border-border/50 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm bg-background/30"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

