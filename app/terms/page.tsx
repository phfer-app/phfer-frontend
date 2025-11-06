"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function TermsPage() {
  const { language } = useLanguage()

  const isPt = language === "pt"

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
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
    </main>
  )
}


