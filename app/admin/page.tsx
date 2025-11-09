"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Users, Ticket, Plus, X, RefreshCw, Search, Calendar, User, Mail, Clock, AlertCircle, Eye, CheckCircle, MessageSquare, History, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { isAuthenticated, getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { checkAdmin, getAdmins, addAdmin, removeAdmin, getUsers, getTickets, updateTicket, type Admin, type User, type Ticket } from "@/lib/admin"
import { getTicketComments, getTicketStatusHistory, type TicketComment, type TicketStatusHistory } from "@/lib/tickets"
import { Badge } from "@/components/ui/badge"

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<User[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [isRemovingAdmin, setIsRemovingAdmin] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [ticketStatus, setTicketStatus] = useState<string>("")
  const [ticketPriority, setTicketPriority] = useState<string>("")
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false)
  const [ticketComments, setTicketComments] = useState<TicketComment[]>([])
  const [ticketHistory, setTicketHistory] = useState<TicketStatusHistory[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    if (!isAuthenticated()) {
      router.push("/not-found")
      return
    }

    const result = await checkAdmin()
    
    if (!result.success || !result.isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      })
      router.push("/not-found")
      return
    }

    setIsAdmin(true)
    setIsOwner(result.isOwner || false)
    setIsLoading(false)
    loadData()
  }

  const loadData = async () => {
    await Promise.all([
      loadUsers(),
      loadTickets(),
      loadAdmins()
    ])
  }

  const loadUsers = async () => {
    const result = await getUsers()
    if (result.success && result.users) {
      setUsers(result.users)
    }
  }

  const loadTickets = async () => {
    try {
      const result = await getTickets()
      if (result.success && result.tickets) {
        console.log('Tickets carregados:', result.tickets.length)
        setTickets(result.tickets)
      } else {
        console.error('Erro ao carregar tickets:', result.error)
        toast({
          title: "Erro",
          description: result.error || "Erro ao carregar tickets",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Erro ao carregar tickets:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar tickets",
        variant: "destructive",
      })
    }
  }

  const loadAdmins = async () => {
    const result = await getAdmins()
    if (result.success && result.admins) {
      setAdmins(result.admins)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Erro",
        description: "Digite o e-mail do usuário",
        variant: "destructive",
      })
      return
    }

    // Encontrar usuário pelo email
    const user = users.find(u => u.email.toLowerCase() === newAdminEmail.toLowerCase().trim())
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado",
        variant: "destructive",
      })
      return
    }

    setIsAddingAdmin(true)
    const result = await addAdmin(user.id)
    
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Administrador adicionado com sucesso!",
      })
      setNewAdminEmail("")
      loadAdmins()
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao adicionar administrador",
        variant: "destructive",
      })
    }
    
    setIsAddingAdmin(false)
  }

  const handleRemoveAdmin = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este administrador?")) {
      return
    }

    const result = await removeAdmin(userId)
    
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Administrador removido com sucesso!",
      })
      loadAdmins()
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao remover administrador",
        variant: "destructive",
      })
    }
  }

  if (!mounted || isLoading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </main>
    )
  }

  if (!isAdmin) {
    return null
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTickets = tickets.filter(ticket =>
    ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    setTicketStatus(ticket.status)
    setTicketPriority(ticket.prioridade)
    setIsTicketDialogOpen(true)
    setIsLoadingComments(true)
    setTicketComments([])
    setTicketHistory([])
    
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

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return

    setIsUpdatingTicket(true)
    try {
      const result = await updateTicket(selectedTicket.id, {
        status: ticketStatus,
        prioridade: ticketPriority
      })

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Ticket atualizado com sucesso!",
        })
        // Recarregar histórico após atualizar
        if (selectedTicket) {
          const historyResult = await getTicketStatusHistory(selectedTicket.id)
          if (historyResult.success) {
            setTicketHistory(historyResult.history || [])
          }
        }
        loadTickets()
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao atualizar ticket",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar ticket",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingTicket(false)
    }
  }

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'media':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'baixa':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {t("admin.title")}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {t("admin.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6 h-auto">
            <TabsTrigger value="users" className="flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
              <Users className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{t("admin.tabs.usuarios")}</span>
              <span className="sm:hidden">{t("admin.tabs.usuarios_short")}</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
              <Ticket className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{t("admin.tabs.tickets")}</span>
              <span className="sm:hidden">{t("admin.tabs.tickets_short")}</span>
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="admins" className="flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{t("admin.tabs.administradores")}</span>
                <span className="sm:hidden">{t("admin.tabs.administradores_short")}</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("admin.users.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={loadUsers}
                variant="outline"
                className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                {t("admin.users.update")}
              </Button>
            </div>

            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
              {/* Desktop: Tabela */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.users.table.name")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.users.table.email")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.users.table.email_verified")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.users.table.created_at")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user.email_verified ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-500 font-medium">Verificado</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm text-red-500 font-medium">Não Verificado</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Cards */}
              <div className="md:hidden p-4 space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhum usuário encontrado
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Nome</p>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">E-mail</p>
                        <p className="text-sm text-foreground break-all">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email Verificado</p>
                        <div className="flex items-center gap-2">
                          {user.email_verified ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-500 font-medium">Verificado</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-500 font-medium">Não Verificado</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Data de Cadastro</p>
                        <p className="text-sm text-foreground">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("admin.tickets.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={loadTickets}
                variant="outline"
                className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                {t("admin.tickets.update")}
              </Button>
            </div>

            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12 text-center">
                  <Ticket className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm md:text-base text-muted-foreground">Nenhum ticket encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {/* Conteúdo principal */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                            <h3 className="text-base md:text-lg font-semibold text-foreground flex-1 group-hover:text-primary transition-colors">
                              {ticket.titulo}
                            </h3>
                            <div className="flex gap-2 shrink-0">
                              <Badge className={`${getStatusColor(ticket.status)} text-xs font-medium px-2.5 py-1`}>
                                {getStatusLabel(ticket.status)}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Descrição */}
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {ticket.descricao}
                          </p>

                          {/* Badges de prioridade e categoria */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className={`${getPriorityColor(ticket.prioridade)} text-xs font-medium px-2.5 py-1 flex items-center gap-1.5`}>
                              <AlertCircle className="h-3 w-3" />
                              {ticket.prioridade === 'alta' ? 'Alta' : 
                               ticket.prioridade === 'media' ? 'Média' : 'Baixa'}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium px-2.5 py-1">
                              {ticket.categoria}
                            </Badge>
                          </div>

                          {/* Footer com informações do usuário e data */}
                          <div className="pt-4 border-t border-border/50 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4 shrink-0" />
                              <span className="font-medium text-foreground truncate">{ticket.user?.name || 'Usuário'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4 shrink-0" />
                              <span className="truncate">{ticket.user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 shrink-0" />
                              <span className="text-xs md:text-sm">Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            {ticket.updated_at !== ticket.created_at && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span className="text-xs md:text-sm">Atualizado em {new Date(ticket.updated_at).toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Botão Abrir Ticket */}
                        <div className="shrink-0 w-full md:w-auto">
                          <Button
                            onClick={() => handleOpenTicket(ticket)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                            {t("admin.tickets.open")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Admins Tab */}
          {isOwner && (
            <TabsContent value="admins" className="space-y-4">
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 md:p-6 mb-4">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">{t("admin.admins.add_title")}</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="E-mail do usuário"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddAdmin}
                    disabled={isAddingAdmin}
                    className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    {t("admin.admins.add_button")}
                  </Button>
                </div>
              </div>

              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                {/* Desktop: Tabela */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.admins.table.email")}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.admins.table.type")}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.admins.table.date")}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t("admin.admins.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                            Nenhum administrador encontrado
                          </td>
                        </tr>
                      ) : (
                        admins.map((admin) => {
                          const adminUser = users.find(u => u.id === admin.user_id)
                          return (
                            <tr key={admin.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-foreground">
                                {adminUser?.email || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                <Badge className={admin.is_owner ? 'bg-primary/10 text-primary border-primary/20' : ''}>
                                  {admin.is_owner ? 'Dono' : 'Administrador'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {!admin.is_owner && (
                                  <Button
                                    onClick={() => handleRemoveAdmin(admin.user_id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {admins.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Nenhum administrador encontrado
                    </div>
                  ) : (
                    admins.map((admin) => {
                      const adminUser = users.find(u => u.id === admin.user_id)
                      return (
                        <div key={admin.id} className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">E-mail</p>
                            <p className="text-sm font-medium text-foreground break-all">{adminUser?.email || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                            <Badge className={admin.is_owner ? 'bg-primary/10 text-primary border-primary/20' : ''}>
                              {admin.is_owner ? 'Dono' : 'Administrador'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Data</p>
                            <p className="text-sm text-foreground">
                              {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {!admin.is_owner && (
                            <div>
                              <Button
                                onClick={() => handleRemoveAdmin(admin.user_id)}
                                variant="ghost"
                                size="sm"
                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Remover Administrador
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Dialog para visualizar e gerenciar ticket */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/50 shrink-0">
            <DialogTitle className="text-lg sm:text-2xl font-bold line-clamp-2">{selectedTicket?.titulo}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base mt-1">
              Gerencie o status e prioridade deste ticket
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Descrição completa */}
              <div>
                <Label className="text-xs sm:text-sm font-semibold mb-2 block">Descrição</Label>
                <p className="text-xs sm:text-sm text-muted-foreground bg-muted/50 p-3 sm:p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.descricao}
                </p>
              </div>

              {/* Informações do usuário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold mb-2 block">Usuário</Label>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{selectedTicket.user?.name || 'Usuário'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-semibold mb-2 block">E-mail</Label>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <span className="truncate break-all">{selectedTicket.user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Status e Prioridade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="status" className="text-xs sm:text-sm font-semibold mb-2 block">
                    Status
                  </Label>
                  <Select value={ticketStatus} onValueChange={setTicketStatus}>
                    <SelectTrigger id="status" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="visto">Visto pelo Administrador</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prioridade" className="text-xs sm:text-sm font-semibold mb-2 block">
                    Prioridade
                  </Label>
                  <Select value={ticketPriority} onValueChange={setTicketPriority}>
                    <SelectTrigger id="prioridade" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border/50">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold mb-2 block">Categoria</Label>
                  <Badge variant="outline" className="text-xs sm:text-sm">{selectedTicket.categoria}</Badge>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-semibold mb-2 block">Data de Criação</Label>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
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

              {/* Histórico de Status */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <Label className="text-xs sm:text-sm font-semibold">Histórico de Atualizações</Label>
                </div>
                {isLoadingComments ? (
                  <div className="text-center py-4 sm:py-6 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">Carregando histórico...</span>
                    </div>
                  </div>
                ) : ticketHistory.length === 0 ? (
                  <div className="text-center py-4 sm:py-6 text-muted-foreground text-xs sm:text-sm bg-muted/30 rounded-lg border border-dashed border-border/50">
                    Nenhuma atualização de status registrada
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto pr-1 sm:pr-2">
                    {ticketHistory.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium leading-relaxed">
                            Status alterado de <span className="text-muted-foreground">{item.old_status ? getStatusLabel(item.old_status) : 'N/A'}</span> para <span className="text-primary">{getStatusLabel(item.new_status)}</span>
                            {item.user && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground ml-1 sm:ml-2">
                                por {item.user.name}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short', 
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
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <Label className="text-xs sm:text-sm font-semibold">Comentários do Usuário</Label>
                </div>
                
                {/* Lista de comentários */}
                {isLoadingComments ? (
                  <div className="text-center py-4 sm:py-6 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">Carregando comentários...</span>
                    </div>
                  </div>
                ) : ticketComments.length === 0 ? (
                  <div className="text-center py-4 sm:py-6 text-muted-foreground text-xs sm:text-sm bg-muted/30 rounded-lg border border-dashed border-border/50">
                    Nenhum comentário ainda
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-1 sm:pr-2">
                    {ticketComments.map((comment) => (
                      <div key={comment.id} className="p-2 sm:p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs sm:text-sm text-foreground mb-2 leading-relaxed whitespace-pre-wrap break-words">{comment.comment}</p>
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
                          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                            {comment.user?.name || 'Usuário'}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                            {new Date(comment.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short', 
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
              </div>
            </div>
          )}

          <DialogFooter className="p-4 sm:p-6 border-t border-border/50 shrink-0 gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsTicketDialogOpen(false)}
              disabled={isUpdatingTicket}
              className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateTicket}
              disabled={isUpdatingTicket}
              className="flex items-center gap-2 w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
            >
              {isUpdatingTicket ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

