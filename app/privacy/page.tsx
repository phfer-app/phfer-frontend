"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function PrivacyPage() {
  const { language } = useLanguage()
  const isPt = language === "pt"

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          {isPt ? "Política de Privacidade" : "Privacy Policy"}
        </h1>
        <p className="text-muted-foreground">
          {isPt ? "Última atualização: 06/11/2025" : "Last updated: 11/06/2025"}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. {isPt ? "Informações Coletadas" : "Information Collected"}</h2>
          <p>
            {isPt
              ? "Podemos coletar informações básicas fornecidas por você voluntariamente, como nome e contato, quando você interage pelos canais disponibilizados (ex.: WhatsApp, e-mail ou redes sociais). Não coletamos dados sensíveis via este site."
              : "We may collect basic information provided voluntarily by you, such as name and contact, when you interact through the available channels (e.g., WhatsApp, email or social networks). We do not collect sensitive data via this site."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. {isPt ? "Uso das Informações" : "Use of Information"}</h2>
          <p>
            {isPt
              ? "Utilizamos as informações exclusivamente para retornar o seu contato e prestar os serviços solicitados. Não vendemos ou compartilhamos seus dados com terceiros para fins de marketing."
              : "We use the information exclusively to respond to your contact and provide the requested services. We do not sell or share your data with third parties for marketing purposes."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. {isPt ? "Cookies e Tecnologias" : "Cookies and Technologies"}</h2>
          <p>
            {isPt
              ? "Este site pode utilizar cookies e ferramentas de análise para melhorar a experiência do usuário e entender métricas de acesso. Você pode controlar cookies pelo seu navegador."
              : "This site may use cookies and analytics tools to improve user experience and understand access metrics. You can control cookies through your browser."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. {isPt ? "Segurança" : "Security"}</h2>
          <p>
            {isPt
              ? "Adotamos práticas razoáveis para proteger seus dados. Entretanto, nenhum método de transmissão ou armazenamento eletrônico é 100% seguro."
              : "We adopt reasonable practices to protect your data. However, no method of electronic transmission or storage is 100% secure."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. {isPt ? "Seus Direitos" : "Your Rights"}</h2>
          <p>
            {isPt
              ? "Você pode solicitar atualização ou exclusão de suas informações entrando em contato pelos canais disponibilizados na seção de contato."
              : "You may request the update or deletion of your information by contacting us through the channels available in the contact section."}
          </p>
        </section>

        <div className="pt-6 flex flex-wrap gap-4">
          <Link href="/" className="text-primary hover:underline">{isPt ? "← Voltar para o início" : "← Back to home"}</Link>
          <Link href="/terms" className="text-primary hover:underline">{isPt ? "Termos de Uso" : "Terms of Use"}</Link>
          <Link href="/cookies" className="text-primary hover:underline">{isPt ? "Cookies" : "Cookies"}</Link>
        </div>
      </div>
    </main>
  )
}


