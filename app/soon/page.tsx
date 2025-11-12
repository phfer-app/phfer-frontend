"use client"

import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

export default function SoonPage() {
  const { language } = useLanguage()
  const isPt = language === "pt"

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects - Padrão centralizado simples */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-primary/12 rounded-full blur-3xl opacity-50" />
      </div>


      <div className="container mx-auto px-4 pt-48 pb-24 relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {isPt ? "Em construção" : "Under construction"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isPt
              ? "Em breve essa funcionalidade estará no ar!"
              : "This feature will be live soon!"}
          </p>
          <div className="pt-2">
            <Link href="/" className="text-primary hover:underline">
              {isPt ? "← Voltar para o início" : "← Back to home"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}


