"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl opacity-15" />
      </div>

      {/* Content - Split Layout */}
      <div className="relative z-10 w-full h-screen flex">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 md:py-0 md:px-0 md:bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="https://i.ibb.co/15gTHYb/Sem-t-tulo.jpg"
              alt="404 Error"
              className="w-full h-full object-cover md:object-contain"
            />
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center px-8 py-12 bg-linear-to-br from-card/80 via-background to-card/50 backdrop-blur-sm">
          <div className="max-w-md space-y-6 text-center md:text-left">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Página não encontrada
              </h2>
            </div>

            {/* Message */}
            <div className="space-y-4">
              <p className="text-base text-gray-300 leading-relaxed font-medium">
                Estamos tentando resolver isso.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                A página que você está procurando não existe, foi movida ou você não tem permissão para acessá-la.
              </p>
            </div>

            {/* Button - Card Style */}
            <div className="pt-4">
              <button
                onClick={() => router.push("/")}
                className="block group w-full"
              >
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground">
                        Página não encontrada?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Retorne para a página principal
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only message and button */}
        <div className="absolute inset-0 md:hidden flex flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Página não encontrada
            </h2>
          </div>

          <div className="space-y-3">
            <p className="text-base text-gray-300 leading-relaxed font-medium">
              Estamos tentando resolver isso.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              A página que você está procurando não existe.
            </p>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="px-8 py-6 text-base font-semibold bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-2xl shadow-primary/40 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg flex items-center gap-2"
          >
            Retornar
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </main>
  )
}

