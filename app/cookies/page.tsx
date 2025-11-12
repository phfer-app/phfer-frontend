"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function CookiesPage() {
  const { language } = useLanguage()
  const isPt = language === "pt"

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects - Padrão circular */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-radial-gradient from-primary/18 via-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-secondary/15 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-secondary/12 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30" />
      </div>


      <div className="container mx-auto px-4 pt-48 pb-16 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">{isPt ? "Cookies" : "Cookies"}</h1>
          <p className="text-muted-foreground">{isPt ? "Última atualização: 06/11/2025" : "Last updated: 11/06/2025"}</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{isPt ? "O que são cookies?" : "What are cookies?"}</h2>
            <p>
              {isPt
                ? "Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam a lembrar suas preferências e melhorar sua experiência de navegação."
                : "Cookies are small text files stored on your device when you visit a website. They help remember your preferences and improve your browsing experience."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{isPt ? "Como usamos cookies" : "How we use cookies"}</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>{isPt ? "Cookies essenciais para funcionamento do site (ex.: preferências de tema e idioma)." : "Essential cookies for site functionality (e.g., theme and language preferences)."}</li>
              <li>{isPt ? "Cookies de desempenho para métricas de acesso e melhoria de experiência." : "Performance cookies for access metrics and experience improvement."}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{isPt ? "Gerenciamento de cookies" : "Managing cookies"}</h2>
            <p>
              {isPt
                ? "Você pode gerenciar e excluir cookies nas configurações do seu navegador. Se desativar alguns cookies, partes do site podem não funcionar corretamente."
                : "You can manage and delete cookies in your browser settings. If you disable some cookies, parts of the site may not function properly."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{isPt ? "Consentimento" : "Consent"}</h2>
            <p>
              {isPt
                ? "Ao continuar navegando após ver o aviso de cookies, você concorda com o uso de cookies conforme descrito nesta página."
                : "By continuing to browse after seeing the cookie notice, you agree to the use of cookies as described on this page."}
            </p>
          </section>

          <div className="pt-6 flex flex-wrap gap-4">
            <Link href="/" className="text-primary hover:underline">{isPt ? "← Voltar para o início" : "← Back to home"}</Link>
            <Link href="/privacy" className="text-primary hover:underline">{isPt ? "Política de Privacidade" : "Privacy Policy"}</Link>
            <Link href="/terms" className="text-primary hover:underline">{isPt ? "Termos de Uso" : "Terms of Use"}</Link>
          </div>
        </div>
      </div>
    </main>
  )
}


