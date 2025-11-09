"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ticket, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, MessageSquare, History, Send, TrendingUp, Calendar, Tag, ArrowRight, Sparkles, Shield, User } from "lucide-react"
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

      // Scroll para o final após carregar
      setTimeout(() => {
        const chatContainer = document.getElementById('ticket-chat-container-user')
        if (chatContainer) {
          chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 300)
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
        
        // Recarregar comentários
        const commentsResult = await getTicketComments(selectedTicket.id)
        if (commentsResult.success) {
          setTicketComments(commentsResult.comments || [])
        }
        setNewComment("")
        
        // Scroll para o final da conversa após um pequeno delay
        setTimeout(() => {
          const chatContainer = document.getElementById('ticket-chat-container-user')
          if (chatContainer) {
            chatContainer.scrollTo({
              top: chatContainer.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 150)
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
                className="group bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Ticket className="h-7 w-7 text-primary" />
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                      <Badge className={`${getStatusColor(chamado.status)} text-xs font-semibold px-3 py-1.5 border-2 flex items-center gap-1.5 h-fit whitespace-nowrap self-center sm:self-auto`}>
                        {getStatusIcon(chamado.status)}
                        {getStatusLabel(chamado.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenTicket(chamado)}
                        className="h-11 px-6 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group/btn cursor-pointer whitespace-nowrap"
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

      {/* Dialog para visualizar detalhes do ticket - Layout de Chat Moderno */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] !max-h-[98vh] !h-[98vh] flex flex-col p-0 gap-0 bg-background m-0">
          {selectedTicket && (
            <>
              {/* Header Compacto com Informações */}
              <div className="p-4 sm:p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-xl sm:text-2xl font-bold mb-3 line-clamp-2">{selectedTicket.titulo}</DialogTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Badge className={`${getStatusColor(selectedTicket.status)} text-xs font-semibold px-2.5 py-1 border-2 flex items-center gap-1.5 w-fit`}>
                          {getStatusIcon(selectedTicket.status)}
                          {getStatusLabel(selectedTicket.status)}
                        </Badge>
                        <Badge className={`${getPriorityColor(selectedTicket.prioridade)} text-xs font-semibold px-2.5 py-1 border-2 flex items-center gap-1.5 w-fit`}>
                          <AlertCircle className="h-3 w-3" />
                          {selectedTicket.prioridade === 'alta' ? t("tickets.priority.alta") : 
                           selectedTicket.prioridade === 'media' ? t("tickets.priority.media") : t("tickets.priority.baixa")}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 border-2 flex items-center gap-1.5 w-fit">
                          <Tag className="h-3 w-3" />
                          {selectedTicket.categoria}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(selectedTicket.created_at).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Área de Chat */}
              <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-muted/10 to-background overflow-hidden">
                {/* Container de Mensagens com Scroll */}
                <div 
                  id="ticket-chat-container-user"
                  className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
                  style={{ height: 'calc(98vh - 320px)', minHeight: '200px', maxHeight: 'calc(98vh - 320px)' }}
                >
                  {isLoadingComments ? (
                    <div className="flex items-center justify-center h-full min-h-[300px]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">Carregando conversa...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Mensagem Inicial - Descrição do Ticket (do Usuário) */}
                      <div className="flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[75%]">
                          <div className="bg-card rounded-xl rounded-tl-sm p-3 shadow-md border border-border/50">
                            <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                              {selectedTicket.descricao}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 px-1">
                            <span className="text-[10px] sm:text-xs font-medium text-foreground">
                              {user?.name || 'Você'}
                            </span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">·</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              {new Date(selectedTicket.created_at).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'short', 
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comentários como Mensagens de Chat */}
                      {ticketComments.map((comment, index) => {
                        // Se o comment.user_id é diferente do user atual, é um admin
                        const isAdminComment = comment.user_id !== user?.id
                        
                        return (
                          <div 
                            key={comment.id} 
                            className={`flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                              isAdminComment ? 'flex-row-reverse' : ''
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                              isAdminComment 
                                ? 'bg-primary text-primary-foreground border-primary/30' 
                                : 'bg-muted text-muted-foreground border-border/50'
                            }`}>
                              {isAdminComment ? (
                                <Shield className="h-3.5 w-3.5" />
                              ) : (
                                <User className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div className={`flex-1 min-w-0 max-w-[85%] sm:max-w-[75%] ${isAdminComment ? 'flex flex-col items-end' : ''}`}>
                              <div className={`rounded-xl p-3 shadow-md border max-w-full ${
                                isAdminComment
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm border-primary/20'
                                  : 'bg-card rounded-tl-sm border-border/50'
                              }`}>
                                <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                  isAdminComment ? 'text-primary-foreground' : 'text-foreground'
                                }`}>
                                  {comment.comment}
                                </p>
                              </div>
                              <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isAdminComment ? 'flex-row-reverse' : ''}`}>
                                <span className={`text-[10px] sm:text-xs font-medium ${
                                  isAdminComment ? 'text-primary' : 'text-foreground'
                                }`}>
                                  {isAdminComment ? (comment.user?.name || 'Administrador') : (comment.user?.name || 'Você')}
                                </span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">·</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>

                {/* Input de Comentário para Usuário */}
                <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-0 border-t border-border/50 bg-card/80 backdrop-blur-sm shrink-0">
                  {selectedTicket.status === 'resolvido' || selectedTicket.status === 'fechado' ? (
                    <div className="bg-muted/50 border-2 border-dashed border-border/50 rounded-xl p-3 text-center mb-3">
                      <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-2">
                        {selectedTicket.status === 'resolvido' ? (
                          <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        ) : (
                          <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        )}
                        {selectedTicket.status === 'resolvido' 
                          ? t("tickets.dialog.comments.resolved")
                          : t("tickets.dialog.comments.closed")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 relative">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Digite sua mensagem para o administrador..."
                          rows={2}
                          className="resize-none text-sm border-2 border-border/50 focus:border-primary/50 bg-background min-h-[60px]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                              e.preventDefault()
                              handleAddComment()
                            }
                          }}
                          disabled={isAddingComment}
                        />
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <span>Pressione</span>
                          <kbd className="px-1 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border border-border rounded">Ctrl</kbd>
                          <span>+</span>
                          <kbd className="px-1 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border border-border rounded">Enter</kbd>
                          <span>para enviar</span>
                        </p>
                      </div>
                      <Button
                        onClick={handleAddComment}
                        disabled={isAddingComment || !newComment.trim()}
                        size="lg"
                        className="h-[60px] w-[60px] p-0 shrink-0 cursor-pointer"
                      >
                        {isAddingComment ? (
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

