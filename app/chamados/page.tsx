"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ticket, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, MessageSquare, History, Send, TrendingUp, Calendar, Tag, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { isAuthenticated, getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { getUserTickets, getTicketById, addTicketComment, getTicketComments, getTicketStatusHistory, type Ticket, type TicketComment, type TicketStatusHistory } from "@/lib/tickets"

export default function ChamadosPage() {
  const [mounted, setMounted] = useState(false)
  const [chamados, setChamados] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [ticketComments, setTicketComments] = useState<TicketComment[]>([])
  const [ticketHistory, setTicketHistory] = useState<TicketStatusHistory[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push("/not-found")
      return
    }
    
    loadTickets()
  }, [router])

  const loadTickets = async () => {
    setIsLoading(true)
    try {
      const result = await getUserTickets()
      
      if (result.success && result.tickets) {
        setChamados(result.tickets)
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao carregar chamados",
          variant: "destructive",
        })
        setChamados([])
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar chamados",
        variant: "destructive",
      })
      setChamados([])
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || !isAuthenticated()) {
    return null
  }

  const user = getUser()

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || chamado.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
      case 'visto':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
      case 'em_andamento':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      case 'resolvido':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      case 'fechado':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
      case 'media':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
      case 'baixa':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="h-4 w-4" />
      case 'visto':
        return <Eye className="h-4 w-4" />
      case 'em_andamento':
        return <TrendingUp className="h-4 w-4" />
      case 'resolvido':
        return <CheckCircle className="h-4 w-4" />
      case 'fechado':
        return <XCircle className="h-4 w-4" />
      default:
        return <Ticket className="h-4 w-4" />
    }
  }

  // Estatísticas
  const stats = {
    total: chamados.length,
    aberto: chamados.filter(c => c.status === 'aberto').length,
    em_andamento: chamados.filter(c => c.status === 'em_andamento').length,
    resolvido: chamados.filter(c => c.status === 'resolvido').length,
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberto':
        return t("tickets.status.aberto")
      case 'visto':
        return t("tickets.status.visto")
      case 'em_andamento':
        return t("tickets.status.em_andamento")
      case 'resolvido':
        return t("tickets.status.resolvido")
      case 'fechado':
        return t("tickets.status.fechado")
      default:
        return status
    }
  }

  const handleOpenTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsTicketDialogOpen(true)
    setIsLoadingComments(true)
    setNewComment("")
    
    try {
      // Carregar comentários e histórico em paralelo
      const [commentsResult, historyResult] = await Promise.all([
        getTicketComments(ticket.id),
        getTicketStatusHistory(ticket.id)
      ])

      if (commentsResult.success) {
        setTicketComments(commentsResult.comments || [])
      }

      if (historyResult.success) {
        setTicketHistory(historyResult.history || [])
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes do ticket",
        variant: "destructive",
      })
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return

    setIsAddingComment(true)
    try {
      const result = await addTicketComment(selectedTicket.id, newComment.trim())

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Comentário adicionado com sucesso!",
        })
        setNewComment("")
        
        // Recarregar comentários
        const commentsResult = await getTicketComments(selectedTicket.id)
        if (commentsResult.success) {
          setTicketComments(commentsResult.comments || [])
        }
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao adicionar comentário",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar comentário",
        variant: "destructive",
      })
    } finally {
      setIsAddingComment(false)
    }
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  {t("tickets.title")}
                </h1>
              </div>
              <p className="text-muted-foreground text-sm md:text-base ml-14">
                {t("tickets.subtitle")}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={loadTickets}
                variant="outline"
                disabled={isLoading}
                className="px-5 h-11 border-2 hover:bg-accent/50 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {t("tickets.update")}
              </Button>
              <Button
                onClick={() => router.push("/solicitar-servicos")}
                className="px-6 h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("tickets.new")}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {!isLoading && chamados.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</span>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Abertos</span>
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.aberto}</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-amber-500/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Em Andamento</span>
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.em_andamento}</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Resolvidos</span>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolvido}</p>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("tickets.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: t("tickets.filter.all"), icon: Filter },
                { value: "aberto", label: t("tickets.filter.aberto"), icon: AlertCircle },
                { value: "em_andamento", label: t("tickets.filter.em_andamento"), icon: TrendingUp },
                { value: "resolvido", label: t("tickets.filter.resolvido"), icon: CheckCircle },
              ].map((filter) => {
                const Icon = filter.icon
                return (
                  <Button
                    key={filter.value}
                    variant={filterStatus === filter.value ? "default" : "outline"}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`h-9 px-4 border-2 transition-all duration-200 ${
                      filterStatus === filter.value
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "hover:bg-accent/50 hover:border-primary/30"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 mr-2" />
                    {filter.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Chamados List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl shadow-xl p-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6">
                  <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("tickets.loading")}
                </h3>
                <p className="text-sm text-muted-foreground">Carregando seus chamados...</p>
              </div>
            </div>
          ) : filteredChamados.length === 0 ? (
            <div className="bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl shadow-xl p-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6">
                  <Ticket className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("tickets.empty")}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {chamados.length === 0
                    ? t("tickets.empty.description")
                    : t("tickets.empty.filtered")
                  }
                </p>
                {chamados.length === 0 && (
                  <Button
                    onClick={() => router.push("/solicitar-servicos")}
                    className="px-8 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {t("tickets.create_first")}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredChamados.map((chamado, index) => (
              <div
                key={chamado.id}
                className="group bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Ticket className="h-7 w-7 text-primary" />
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <Badge className={`${getStatusColor(chamado.status)} text-xs font-semibold px-2.5 py-1 border-2 flex items-center gap-1.5`}>
                              {getStatusIcon(chamado.status)}
                              {getStatusLabel(chamado.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                            {chamado.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                            {chamado.descricao}
                          </p>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(chamado.created_at).toLocaleDateString("pt-BR", {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <Badge className={`${getPriorityColor(chamado.prioridade)} text-xs font-medium px-2.5 py-1 border flex items-center gap-1.5`}>
                              <AlertCircle className="h-3 w-3" />
                              {chamado.prioridade === 'alta' ? t("tickets.priority.alta") : 
                               chamado.prioridade === 'media' ? t("tickets.priority.media") : t("tickets.priority.baixa")}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium px-2.5 py-1 border flex items-center gap-1.5">
                              <Tag className="h-3 w-3" />
                              {chamado.categoria}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex items-center lg:items-start">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenTicket(chamado)}
                        className="h-11 px-6 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group/btn"
                      >
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          {t("tickets.view_details")}
                        </span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Hover gradient effect */}
                <div className="h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog para visualizar detalhes do ticket */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="space-y-3 p-4 sm:p-6 border-b border-border/50 shrink-0">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 line-clamp-2">{selectedTicket?.titulo}</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  {t("tickets.dialog.title")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedTicket && (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Informações do ticket */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border/50 rounded-xl p-4 sm:p-6">
                  <Label className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-foreground flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    {t("tickets.dialog.description")}
                  </Label>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl p-3 sm:p-4">
                    <Label className="text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 block text-muted-foreground uppercase tracking-wide">
                      {t("tickets.dialog.status")}
                    </Label>
                    <Badge className={`${getStatusColor(selectedTicket.status)} text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 flex items-center gap-1.5 sm:gap-2 w-fit`}>
                      <span className="scale-75 sm:scale-100">{getStatusIcon(selectedTicket.status)}</span>
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                  </div>
                  <div className="bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl p-3 sm:p-4">
                    <Label className="text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 block text-muted-foreground uppercase tracking-wide">
                      {t("tickets.dialog.priority")}
                    </Label>
                    <Badge className={`${getPriorityColor(selectedTicket.prioridade)} text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 flex items-center gap-1.5 sm:gap-2 w-fit`}>
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {selectedTicket.prioridade === 'alta' ? t("tickets.priority.alta") : 
                       selectedTicket.prioridade === 'media' ? t("tickets.priority.media") : t("tickets.priority.baixa")}
                    </Badge>
                  </div>
                  <div className="bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl p-3 sm:p-4">
                    <Label className="text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 block text-muted-foreground uppercase tracking-wide">
                      {t("tickets.dialog.category")}
                    </Label>
                    <Badge variant="outline" className="text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 flex items-center gap-1.5 sm:gap-2 w-fit">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                      {selectedTicket.categoria}
                    </Badge>
                  </div>
                  <div className="bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl p-3 sm:p-4">
                    <Label className="text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 block text-muted-foreground uppercase tracking-wide">
                      {t("tickets.dialog.created_at")}
                    </Label>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                      <span className="break-words">{new Date(selectedTicket.created_at).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Histórico de Status */}
              <div className="pt-4 sm:pt-6 border-t-2 border-border/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <Label className="text-sm sm:text-base font-bold">{t("tickets.dialog.history")}</Label>
                </div>
                {isLoadingComments ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed border-border/50">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">{t("tickets.dialog.history.loading")}</span>
                    </div>
                  </div>
                ) : ticketHistory.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm bg-muted/30 rounded-xl border-2 border-dashed border-border/50">
                    {t("tickets.dialog.history.empty")}
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {ticketHistory.map((item, idx) => (
                      <div key={item.id} className="relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl hover:border-primary/30 transition-all duration-200">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center">
                            <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          {idx < ticketHistory.length - 1 && (
                            <div className="absolute top-8 sm:top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 sm:h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-foreground mb-1 sm:mb-2 leading-relaxed">
                            {t("tickets.dialog.history.changed")} <span className="text-muted-foreground">{item.old_status ? getStatusLabel(item.old_status) : 'N/A'}</span> {t("tickets.dialog.history.to")} <span className="text-primary font-bold">{getStatusLabel(item.new_status)}</span>
                          </p>
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comentários */}
              <div className="pt-4 sm:pt-6 border-t-2 border-border/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <Label className="text-sm sm:text-base font-bold">{t("tickets.dialog.comments")}</Label>
                </div>
                
                {/* Lista de comentários */}
                {isLoadingComments ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed border-border/50">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">{t("tickets.dialog.comments.loading")}</span>
                    </div>
                  </div>
                ) : ticketComments.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm bg-muted/30 rounded-xl border-2 border-dashed border-border/50 mb-4 sm:mb-6">
                    {t("tickets.dialog.comments.empty")}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
                    {ticketComments.map((comment) => (
                      <div key={comment.id} className="p-3 sm:p-4 bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl hover:border-primary/30 transition-all duration-200">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{comment.comment}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-border/30 gap-2">
                          <span className="text-[10px] sm:text-xs font-medium text-foreground truncate">
                            {comment.user?.name || t("nav.usuario_logado")}
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="whitespace-nowrap">{new Date(comment.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulário para adicionar comentário */}
                {selectedTicket.status === 'resolvido' || selectedTicket.status === 'fechado' ? (
                  <div className="bg-muted/50 border-2 border-dashed border-border/50 rounded-xl p-4 sm:p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-2">
                      {selectedTicket.status === 'resolvido' ? (
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                      {selectedTicket.status === 'resolvido' 
                        ? t("tickets.dialog.comments.resolved")
                        : t("tickets.dialog.comments.closed")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-xl p-3 sm:p-4">
                    <Textarea
                      placeholder={t("tickets.dialog.comments.placeholder")}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm border-2 focus:border-primary/50 transition-all duration-200 resize-none"
                      disabled={isAddingComment}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={isAddingComment || !newComment.trim()}
                      className="w-full h-9 sm:h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                      {isAddingComment ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 animate-spin" />
                          {t("tickets.dialog.comments.adding")}
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                          {t("tickets.dialog.comments.add")}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="p-4 sm:p-6 border-t border-border/50 shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsTicketDialogOpen(false)}
              className="w-full sm:w-auto h-9 sm:h-11 px-4 sm:px-6 border-2 hover:bg-accent/50 transition-all duration-200 text-xs sm:text-sm"
            >
              {t("tickets.dialog.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

