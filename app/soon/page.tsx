"use client"

import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

export default function SoonPage() {
  const { language } = useLanguage()
  const isPt = language === "pt"

  return (
    <main className="container mx-auto px-4 py-24">
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
    </main>
  )
}


