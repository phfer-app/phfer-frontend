"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function CookiesPage() {
  const { language } = useLanguage()
  const isPt = language === "pt"

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
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
    </main>
  )
}


