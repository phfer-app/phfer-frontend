"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Send, ArrowLeft, FileText, DollarSign, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { isAuthenticated, getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { createTicket } from "@/lib/tickets"

export default function SolicitarServicosPage() {
  const [mounted, setMounted] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [prioridade, setPrioridade] = useState("media")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push("/not-found")
      return
    }
  }, [router])

  if (!mounted || !isAuthenticated()) {
    return null
  }

  const user = getUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createTicket({
        titulo,
        descricao,
        categoria,
        prioridade: prioridade as 'baixa' | 'media' | 'alta'
      })

      if (result.success) {
        toast({
          title: "Chamado criado!",
          description: result.message || "Seu chamado foi criado com sucesso. Em breve entraremos em contato.",
        })

        // Limpar formulário
        setTitulo("")
        setDescricao("")
        setCategoria("")
        setPrioridade("media")

        // Redirecionar para chamados
        setTimeout(() => {
          router.push("/chamados")
        }, 1500)
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao criar chamado",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar chamado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
            Solicitar Serviços
          </h1>
          <p className="text-muted-foreground">
            Descreva sua necessidade e entraremos em contato o mais breve possível
          </p>
        </div>

        {/* Form */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-sm font-medium">
                Título do Chamado *
              </Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Desenvolvimento de site institucional"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-sm font-medium">
                Categoria *
              </Label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg border border-border/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione uma categoria</option>
                <option value="desenvolvimento_web">Desenvolvimento Web</option>
                <option value="desenvolvimento_mobile">Desenvolvimento Mobile</option>
                <option value="design">Design</option>
                <option value="consultoria">Consultoria</option>
                <option value="manutencao">Manutenção</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium">
                Descrição Detalhada *
              </Label>
              <textarea
                id="descricao"
                placeholder="Descreva detalhadamente sua necessidade, requisitos, prazos e qualquer informação relevante..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows={8}
                className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="prioridade" className="text-sm font-medium">
                Prioridade
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prioridade"
                    value="baixa"
                    checked={prioridade === "baixa"}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Baixa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prioridade"
                    value="media"
                    checked={prioridade === "media"}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Média</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prioridade"
                    value="alta"
                    checked={prioridade === "alta"}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Alta</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Solicitação
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

