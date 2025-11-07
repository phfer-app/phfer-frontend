"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ticket, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, MessageSquare, History, Send } from "lucide-react"
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
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'visto':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'em_andamento':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'resolvido':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'fechado':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'Aberto'
      case 'visto':
        return 'Visto pelo Administrador'
      case 'em_andamento':
        return 'Em Andamento'
      case 'resolvido':
        return 'Resolvido'
      case 'fechado':
        return 'Fechado'
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
                Meus Chamados
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus chamados e solicitações de suporte
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={loadTickets}
                variant="outline"
                disabled={isLoading}
                className="px-6 py-6 text-base font-semibold border border-border/50 hover:border-primary/50 cursor-pointer"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={() => router.push("/solicitar-servicos")}
                className="px-6 py-6 text-base font-semibold bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Chamado
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar chamados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className="px-4"
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "aberto" ? "default" : "outline"}
                onClick={() => setFilterStatus("aberto")}
                className="px-4"
              >
                Abertos
              </Button>
              <Button
                variant={filterStatus === "em_andamento" ? "default" : "outline"}
                onClick={() => setFilterStatus("em_andamento")}
                className="px-4"
              >
                Em Andamento
              </Button>
              <Button
                variant={filterStatus === "resolvido" ? "default" : "outline"}
                onClick={() => setFilterStatus("resolvido")}
                className="px-4"
              >
                Resolvidos
              </Button>
            </div>
          </div>
        </div>

        {/* Chamados List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Carregando chamados...
              </h3>
            </div>
          ) : filteredChamados.length === 0 ? (
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum chamado encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                {chamados.length === 0
                  ? "Você ainda não possui chamados. Crie seu primeiro chamado!"
                  : "Nenhum chamado corresponde aos filtros selecionados."
                }
              </p>
              {chamados.length === 0 && (
                <Button
                  onClick={() => router.push("/solicitar-servicos")}
                  className="px-6 py-6 text-base font-semibold bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Chamado
                </Button>
              )}
            </div>
          ) : (
            filteredChamados.map((chamado) => (
              <div
                key={chamado.id}
                className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Ticket className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {chamado.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {chamado.descricao}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(chamado.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      <Badge className={`${getStatusColor(chamado.status)} text-xs font-medium px-2.5 py-1`}>
                        {getStatusLabel(chamado.status)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenTicket(chamado)}
                    className="shrink-0 flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog para visualizar detalhes do ticket */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedTicket?.titulo}</DialogTitle>
            <DialogDescription>
              Visualize detalhes, comentários e histórico de atualizações do ticket
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6 py-4">
              {/* Informações do ticket */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Descrição</Label>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {selectedTicket.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Status</Label>
                    <Badge className={`${getStatusColor(selectedTicket.status)} text-xs font-medium px-2.5 py-1`}>
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Prioridade</Label>
                    <Badge variant="outline" className="text-xs font-medium px-2.5 py-1">
                      {selectedTicket.prioridade === 'alta' ? 'Alta' : 
                       selectedTicket.prioridade === 'media' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Categoria</Label>
                    <Badge variant="outline" className="text-xs font-medium px-2.5 py-1">
                      {selectedTicket.categoria}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Data de Criação</Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(selectedTicket.created_at).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Histórico de Status */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-5 w-5 text-primary" />
                  <Label className="text-sm font-semibold">Histórico de Atualizações</Label>
                </div>
                {isLoadingComments ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando histórico...
                  </div>
                ) : ticketHistory.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Nenhuma atualização de status registrada
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ticketHistory.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Status alterado de <span className="text-muted-foreground">{item.old_status ? getStatusLabel(item.old_status) : 'N/A'}</span> para <span className="text-primary">{getStatusLabel(item.new_status)}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comentários */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <Label className="text-sm font-semibold">Comentários</Label>
                </div>
                
                {/* Lista de comentários */}
                {isLoadingComments ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando comentários...
                  </div>
                ) : ticketComments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {ticketComments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-foreground mb-2">{comment.comment}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {comment.user?.name || 'Usuário'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulário para adicionar comentário */}
                {selectedTicket.status === 'resolvido' || selectedTicket.status === 'fechado' ? (
                  <div className="space-y-2">
                    <div className="bg-muted/50 border border-border/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        {selectedTicket.status === 'resolvido' 
                          ? 'Este ticket foi resolvido. Não é possível adicionar novos comentários.'
                          : 'Este ticket foi fechado. Não é possível adicionar novos comentários.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Adicione um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isAddingComment}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={isAddingComment || !newComment.trim()}
                      className="w-full flex items-center gap-2 cursor-pointer"
                    >
                      {isAddingComment ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Adicionar Comentário
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTicketDialogOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

