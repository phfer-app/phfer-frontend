"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Send, ArrowLeft, FileText, Tag, AlertCircle, Sparkles, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    
    // Validação manual
    if (!titulo.trim() || !categoria || !descricao.trim()) {
      toast({
        title: t("services.form.validation.error") || "Erro",
        description: t("services.form.validation.required") || "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    
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
          title: t("services.success.title"),
          description: result.message || t("services.success.description"),
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
          title: t("services.form.validation.error") || "Erro",
          description: result.error || t("services.form.validation.create_error") || "Erro ao criar chamado",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("services.form.validation.error") || "Erro",
        description: error.message || t("services.form.validation.create_error") || "Erro ao criar chamado",
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

      <div className="w-full max-w-[95%] mx-auto px-2 sm:px-3 md:px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("services.back")}
          </Button>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shrink-0">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent mb-3">
            {t("services.title")}
          </h1>
              <p className="text-muted-foreground text-sm">
            {t("services.subtitle")}
          </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10 space-y-8">
            {/* Título e Categoria em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
              <div className="space-y-3 group">
                <Label htmlFor="titulo" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                {t("services.form.title")}
              </Label>
                <div className="relative">
              <Input
                id="titulo"
                type="text"
                placeholder={t("services.form.title.placeholder")}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                    className="h-12 px-4 text-sm border-2 border-border/50 bg-background/50 focus:border-primary/50 focus:bg-background transition-all duration-200 group-hover:border-primary/30"
              />
                </div>
            </div>

            {/* Categoria */}
              <div className="space-y-3 group">
                <Label htmlFor="categoria" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Tag className="h-4 w-4 text-primary" />
                {t("services.form.category")}
              </Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger 
                id="categoria"
                    className="w-full h-12 px-4 text-sm border-2 border-border/50 bg-background/50 focus:border-primary/50 focus:bg-background transition-all duration-200 group-hover:border-primary/30"
                  >
                    <SelectValue placeholder={t("services.form.category.select")} />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl border border-border/50">
                    <SelectItem value="desenvolvimento_web">{t("services.form.category.web")}</SelectItem>
                    <SelectItem value="desenvolvimento_mobile">{t("services.form.category.mobile")}</SelectItem>
                    <SelectItem value="design">{t("services.form.category.design")}</SelectItem>
                    <SelectItem value="consultoria">{t("services.form.category.consultoria")}</SelectItem>
                    <SelectItem value="manutencao">{t("services.form.category.manutencao")}</SelectItem>
                    <SelectItem value="outro">{t("services.form.category.outro")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-3 group">
              <Label htmlFor="descricao" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                {t("services.form.description")}
              </Label>
              <Textarea
                id="descricao"
                placeholder={t("services.form.description.placeholder")}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={10}
                className="min-h-[200px] text-sm border-2 border-border/50 bg-background/50 focus:border-primary/50 focus:bg-background transition-all duration-200 resize-none group-hover:border-primary/30"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {t("services.form.description.hint")}
              </p>
            </div>

            {/* Prioridade */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="h-4 w-4 text-primary" />
                {t("services.form.priority")}
              </Label>
              <RadioGroup 
                value={prioridade} 
                onValueChange={setPrioridade}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {/* Prioridade Baixa */}
                <label
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    prioridade === "baixa"
                      ? "border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/10"
                      : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <RadioGroupItem value="baixa" id="prioridade-baixa" className="mt-0.5" />
                    <Clock className={`h-5 w-5 ${prioridade === "baixa" ? "text-green-500" : "text-muted-foreground"}`} />
                    <span className={`font-semibold ${prioridade === "baixa" ? "text-green-500" : "text-foreground"}`}>
                      {t("services.form.priority.baixa")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">{t("services.form.priority.baixa.desc")}</p>
                </label>

                {/* Prioridade Média */}
                <label
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    prioridade === "media"
                      ? "border-yellow-500/50 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                      : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <RadioGroupItem value="media" id="prioridade-media" className="mt-0.5" />
                    <AlertCircle className={`h-5 w-5 ${prioridade === "media" ? "text-yellow-500" : "text-muted-foreground"}`} />
                    <span className={`font-semibold ${prioridade === "media" ? "text-yellow-500" : "text-foreground"}`}>
                      {t("services.form.priority.media")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">{t("services.form.priority.media.desc")}</p>
                </label>

                {/* Prioridade Alta */}
                <label
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    prioridade === "alta"
                      ? "border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/10"
                      : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <RadioGroupItem value="alta" id="prioridade-alta" className="mt-0.5" />
                    <Zap className={`h-5 w-5 ${prioridade === "alta" ? "text-red-500" : "text-muted-foreground"}`} />
                    <span className={`font-semibold ${prioridade === "alta" ? "text-red-500" : "text-foreground"}`}>
                      {t("services.form.priority.alta")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">{t("services.form.priority.alta.desc")}</p>
                </label>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border/50">
            <Button
              type="submit"
                disabled={isLoading || !titulo || !categoria || !descricao}
                className="w-full h-12 md:h-14 text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t("services.form.submitting")}
                </span>
              ) : (
                  <span className="flex items-center gap-3">
                    <Send className="h-5 w-5" />
                  {t("services.form.submit")}
                </span>
              )}
            </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

