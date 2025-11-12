"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function PrivacyPage() {
  const { language } = useLanguage()
  const isPt = language === "pt"

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects - Padrão em camadas */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/15 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-secondary/15 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-2/3 right-1/3 w-[450px] h-[450px] bg-secondary/12 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-25" />
      </div>


      <div className="container mx-auto px-4 pt-48 pb-16 relative z-10">
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
      </div>
    </main>
  )
}


