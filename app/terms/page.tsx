"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function TermsPage() {
  const { language } = useLanguage()

  const isPt = language === "pt"

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects - Padrão linear */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-linear-to-b from-primary/15 via-primary/8 to-transparent opacity-50" />
        <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] bg-primary/12 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 right-1/5 w-[550px] h-[550px] bg-secondary/12 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/5 left-1/4 w-28 h-28 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border border-primary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 border border-secondary/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 pt-48 pb-16 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {isPt ? "Termos de Uso" : "Terms of Use"}
          </h1>
          <p className="text-muted-foreground">
            {isPt ? "Última atualização: 06/11/2025" : "Last updated: 11/06/2025"}
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. {isPt ? "Aceitação dos Termos" : "Acceptance of Terms"}</h2>
            <p>
              {isPt
                ? "Ao acessar e utilizar este website, você concorda com estes Termos de Uso. Se você não concorda com alguma parte, por favor, não utilize o site."
                : "By accessing and using this website, you agree to these Terms of Use. If you do not agree with any part, please do not use the site."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. {isPt ? "Uso do Site" : "Use of the Site"}</h2>
            <p>
              {isPt
                ? "Você se compromete a utilizar o site de forma responsável, respeitando as leis aplicáveis e os direitos de terceiros. É proibido tentar explorar vulnerabilidades ou realizar atividades que comprometam a estabilidade do serviço."
                : "You agree to use the site responsibly, respecting applicable laws and the rights of others. It is prohibited to attempt to exploit vulnerabilities or engage in activities that compromise the stability of the service."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. {isPt ? "Propriedade Intelectual" : "Intellectual Property"}</h2>
            <p>
              {isPt
                ? "Todo o conteúdo deste site, incluindo textos, imagens e código, é protegido por direitos autorais. Não é permitido reproduzir, distribuir ou modificar sem autorização."
                : "All content on this site, including text, images, and code, is protected by copyright. Reproduction, distribution, or modification without authorization is not permitted."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. {isPt ? "Limitação de Responsabilidade" : "Limitation of Liability"}</h2>
            <p>
              {isPt
                ? "Este site é fornecido 'como está'. Não garantimos disponibilidade contínua ou ausência de erros, e não nos responsabilizamos por danos decorrentes do uso."
                : "This site is provided 'as is'. We do not guarantee continuous availability or the absence of errors, and we are not responsible for damages resulting from its use."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. {isPt ? "Contato" : "Contact"}</h2>
            <p>
              {isPt
                ? "Para dúvidas sobre estes termos, utilize os canais disponíveis na seção de contato."
                : "For questions about these terms, please use the channels available in the contact section."}
            </p>
          </section>

          <div className="pt-6 flex flex-wrap gap-4">
            <Link href="/" className="text-primary hover:underline">{isPt ? "← Voltar para o início" : "← Back to home"}</Link>
            <Link href="/privacy" className="text-primary hover:underline">{isPt ? "Política de Privacidade" : "Privacy Policy"}</Link>
            <Link href="/cookies" className="text-primary hover:underline">{isPt ? "Cookies" : "Cookies"}</Link>
          </div>
        </div>
      </div>
    </main>
  )
}


