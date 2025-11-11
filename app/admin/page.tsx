"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Shield, Users, Ticket as TicketIcon, Plus, X, RefreshCw, Search, Calendar, User as UserIcon, Mail, Clock, AlertCircle, Eye, CheckCircle, MessageSquare, History, CheckCircle2, XCircle, Lock, Save, Edit, Trash2, FolderPlus, Send, Filter, Settings, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { isAuthenticated, getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { checkAdmin, getAdmins, addAdmin, removeAdmin, getUsers, getTickets, updateTicket, type Admin, type User, type Ticket } from "@/lib/admin"
import { getTicketComments, getTicketStatusHistory, addTicketComment, type TicketComment, type TicketStatusHistory } from "@/lib/tickets"
import { getWorkspaces, getUserWorkspacePermissions, updateUserWorkspacePermissions, createWorkspace, updateWorkspace, deleteWorkspace, initializeWorkspaces, type Workspace } from "@/lib/workspace-permissions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

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
  const [newComment, setNewComment] = useState("")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [showTicketControls, setShowTicketControls] = useState(false) // Para mobile
  const currentUser = getUser()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({})
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<Record<string, string[]>>({})
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false)
  const [isSavingPermissions, setIsSavingPermissions] = useState(false)
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<string | null>(null)
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false)
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [workspaceForm, setWorkspaceForm] = useState({ name: "", slug: "", description: "" })
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false)
  const [deleteWorkspaceDialogOpen, setDeleteWorkspaceDialogOpen] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null)
  const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false)
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null)
  const [adminToRemoveName, setAdminToRemoveName] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterDateFrom, setFilterDateFrom] = useState<string>("")
  const [filterDateTo, setFilterDateTo] = useState<string>("")
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    checkAdminAccess()
  }, [])

  // Ref para rastrear o número de comentários anterior
  const previousCommentsCountRef = useRef(0)

  // Polling para atualizar comentários e status quando o modal estiver aberto
  useEffect(() => {
    if (!isTicketDialogOpen || !selectedTicket) {
      previousCommentsCountRef.current = 0
      return
    }

    // Inicializar contador quando o modal abre
    previousCommentsCountRef.current = ticketComments.length

    const pollInterval = setInterval(async () => {
      try {
        // Atualizar comentários
        const commentsResult = await getTicketComments(selectedTicket.id)
        if (commentsResult.success && commentsResult.comments) {
          const newCommentsCount = commentsResult.comments.length
          const hasNewComments = newCommentsCount > previousCommentsCountRef.current
          
          setTicketComments(commentsResult.comments)
          previousCommentsCountRef.current = newCommentsCount
          
          // Scroll automático apenas se houver novos comentários
          if (hasNewComments) {
            setTimeout(() => {
              const chatContainer = document.getElementById('ticket-chat-container')
              if (chatContainer) {
                const wasScrolledToBottom = 
                  chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100
                
                if (wasScrolledToBottom) {
                  chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: 'smooth'
                  })
                }
              }
            }, 100)
          }
        }

        // Atualizar status do ticket
        const ticketResult = await getTickets()
        if (ticketResult.success && ticketResult.tickets) {
          const updatedTicket = ticketResult.tickets.find(t => t.id === selectedTicket.id)
          if (updatedTicket) {
            // Atualizar ticket na lista
            setTickets(prevTickets => 
              prevTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t)
            )
            
            // Atualizar ticket selecionado e status se mudou
            setSelectedTicket((prev: Ticket | null) => {
              if (!prev) return prev
              if (updatedTicket.status !== prev.status) {
                setTicketStatus(updatedTicket.status)
                return updatedTicket
              }
              return updatedTicket
            })
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar ticket:', error)
      }
    }, 3000) // Verificar a cada 3 segundos

    return () => clearInterval(pollInterval)
  }, [isTicketDialogOpen, selectedTicket?.id])

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
      loadAdmins(),
      loadWorkspaces()
    ])
  }

  const loadUsers = async () => {
    const result = await getUsers()
    if (result.success && result.users) {
      setUsers(result.users)
      // Inicializar permissões vazias para cada usuário
      const permissionsMap: Record<string, string[]> = {}
      result.users.forEach(user => {
        permissionsMap[user.id] = []
      })
      setUserPermissions(permissionsMap)
      setSelectedUserPermissions(permissionsMap)
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

  const loadWorkspaces = async () => {
    setIsLoadingWorkspaces(true)
    try {
      const result = await getWorkspaces()
      if (result.success && result.workspaces) {
        setWorkspaces(result.workspaces)
        // Inicializar permissões vazias para cada usuário
        const permissionsMap: Record<string, string[]> = {}
        users.forEach(user => {
          permissionsMap[user.id] = []
        })
        setUserPermissions(permissionsMap)
        setSelectedUserPermissions(permissionsMap)
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao carregar workspaces",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar workspaces",
        variant: "destructive",
      })
    } finally {
      setIsLoadingWorkspaces(false)
    }
  }

  const loadUserPermissions = async (userId: string) => {
    try {
      const result = await getUserWorkspacePermissions(userId)
      if (result.success && result.userPermissions) {
        setUserPermissions(prev => ({
          ...prev,
          [userId]: result.userPermissions || []
        }))
        setSelectedUserPermissions(prev => ({
          ...prev,
          [userId]: result.userPermissions || []
        }))
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar permissões do usuário",
        variant: "destructive",
      })
    }
  }

  const handleSelectUserForPermissions = async (userId: string) => {
    setSelectedUserForPermissions(userId)
    // Carregar permissões do usuário se ainda não foram carregadas
    if (!userPermissions[userId] || userPermissions[userId].length === 0) {
      await loadUserPermissions(userId)
    }
  }

  const handleToggleWorkspacePermission = (userId: string, workspaceId: string) => {
    setSelectedUserPermissions(prev => {
      const current = prev[userId] || []
      const workspace = workspaces.find(w => w.id === workspaceId)
      
      // Se for o workspace padrão, não permitir remover
      if (workspace?.is_default && current.includes(workspaceId)) {
        toast({
          title: "Aviso",
          description: "Não é possível remover a permissão do workspace padrão (Meus Chamados)",
          variant: "default",
        })
        return prev
      }

      const updated = current.includes(workspaceId)
        ? current.filter(id => id !== workspaceId)
        : [...current, workspaceId]
      
      return {
        ...prev,
        [userId]: updated
      }
    })
  }

  const handleSavePermissions = async () => {
    if (!selectedUserForPermissions) return

    setIsSavingPermissions(true)
    try {
      const workspaceIds = selectedUserPermissions[selectedUserForPermissions] || []
      const result = await updateUserWorkspacePermissions(selectedUserForPermissions, workspaceIds)

      if (result.success) {
        toast({
          title: t("admin.permissions.toast.success"),
          description: t("admin.permissions.toast.permissions_updated"),
        })
        // Atualizar permissões salvas
        setUserPermissions(prev => ({
          ...prev,
          [selectedUserForPermissions]: workspaceIds
        }))
      } else {
        toast({
          title: t("admin.permissions.toast.error"),
          description: result.error || t("admin.permissions.toast.error_update_permissions"),
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("admin.permissions.toast.error"),
        description: error.message || t("admin.permissions.toast.error_update_permissions"),
        variant: "destructive",
      })
    } finally {
      setIsSavingPermissions(false)
    }
  }

  const handleCreateWorkspace = async () => {
    if (!workspaceForm.name.trim() || !workspaceForm.slug.trim()) {
      toast({
        title: t("admin.permissions.toast.error"),
        description: t("admin.permissions.toast.name_slug_required"),
        variant: "destructive",
      })
      return
    }

    setIsCreatingWorkspace(true)
    try {
      const result = await createWorkspace(
        workspaceForm.name.trim(),
        workspaceForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        workspaceForm.description.trim() || null
      )

      if (result.success) {
        toast({
          title: t("admin.permissions.toast.success"),
          description: t("admin.permissions.toast.workspace_created"),
        })
        setWorkspaceForm({ name: "", slug: "", description: "" })
        setIsWorkspaceDialogOpen(false)
        loadWorkspaces()
      } else {
        toast({
          title: t("admin.permissions.toast.error"),
          description: result.error || t("admin.permissions.toast.error_create"),
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("admin.permissions.toast.error"),
        description: error.message || t("admin.permissions.toast.error_create"),
        variant: "destructive",
      })
    } finally {
      setIsCreatingWorkspace(false)
    }
  }

  const handleEditWorkspace = async () => {
    if (!selectedWorkspace || !workspaceForm.name.trim() || !workspaceForm.slug.trim()) {
      toast({
        title: t("admin.permissions.toast.error"),
        description: t("admin.permissions.toast.name_slug_required"),
        variant: "destructive",
      })
      return
    }

    setIsEditingWorkspace(true)
    try {
      const result = await updateWorkspace(
        selectedWorkspace.id,
        workspaceForm.name.trim(),
        workspaceForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        workspaceForm.description.trim() || null
      )

      if (result.success) {
        toast({
          title: t("admin.permissions.toast.success"),
          description: t("admin.permissions.toast.workspace_updated"),
        })
        setWorkspaceForm({ name: "", slug: "", description: "" })
        setSelectedWorkspace(null)
        setIsWorkspaceDialogOpen(false)
        loadWorkspaces()
      } else {
        toast({
          title: t("admin.permissions.toast.error"),
          description: result.error || t("admin.permissions.toast.error_update"),
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("admin.permissions.toast.error"),
        description: error.message || t("admin.permissions.toast.error_update"),
        variant: "destructive",
      })
    } finally {
      setIsEditingWorkspace(false)
    }
  }

  const handleOpenDeleteWorkspaceDialog = (workspaceId: string) => {
    setWorkspaceToDelete(workspaceId)
    setDeleteWorkspaceDialogOpen(true)
  }

  const handleConfirmDeleteWorkspace = async () => {
    if (!workspaceToDelete) return

    const workspaceId = workspaceToDelete
    setIsDeletingWorkspace(true)
    
    // Fechar o modal primeiro antes de executar a ação
    setDeleteWorkspaceDialogOpen(false)
    
    // Pequeno delay para garantir que o portal foi desmontado
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const result = await deleteWorkspace(workspaceId)

      if (result.success) {
        toast({
          title: t("admin.permissions.toast.success"),
          description: t("admin.permissions.toast.workspace_deleted"),
        })
        loadWorkspaces()
        // Limpar permissões se o workspace foi deletado
        setUserPermissions(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(userId => {
            updated[userId] = updated[userId].filter(id => id !== workspaceId)
          })
          return updated
        })
        setSelectedUserPermissions(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(userId => {
            updated[userId] = updated[userId].filter(id => id !== workspaceId)
          })
          return updated
        })
      } else {
        toast({
          title: t("admin.permissions.toast.error"),
          description: result.error || t("admin.permissions.toast.error_delete"),
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("admin.permissions.toast.error"),
        description: error.message || t("admin.permissions.toast.error_delete"),
        variant: "destructive",
      })
    } finally {
      setIsDeletingWorkspace(false)
      setWorkspaceToDelete(null)
    }
  }

  const handleOpenCreateWorkspaceDialog = () => {
    setSelectedWorkspace(null)
    setWorkspaceForm({ name: "", slug: "", description: "" })
    setIsWorkspaceDialogOpen(true)
  }

  const handleOpenEditWorkspaceDialog = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setWorkspaceForm({
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description || ""
    })
    setIsWorkspaceDialogOpen(true)
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

  const handleOpenRemoveAdminDialog = (userId: string, userName: string) => {
    setAdminToRemove(userId)
    setAdminToRemoveName(userName)
    setRemoveAdminDialogOpen(true)
  }

  const handleConfirmRemoveAdmin = async () => {
    if (!adminToRemove) return

    const userId = adminToRemove
    const userName = adminToRemoveName
    setIsRemovingAdmin(true)
    
    // Fechar o modal primeiro antes de executar a ação
    setRemoveAdminDialogOpen(false)
    
    // Pequeno delay para garantir que o portal foi desmontado
    await new Promise(resolve => setTimeout(resolve, 100))

    const result = await removeAdmin(userId)
    
    if (result.success) {
      toast({
        title: t("admin.admins.toast.success") || "Sucesso",
        description: t("admin.admins.toast.admin_removed") || "Administrador removido com sucesso!",
      })
      loadAdmins()
    } else {
      toast({
        title: t("admin.admins.toast.error") || "Erro",
        description: result.error || t("admin.admins.toast.error_remove") || "Erro ao remover administrador",
        variant: "destructive",
      })
    }
    
    setIsRemovingAdmin(false)
    setAdminToRemove(null)
    setAdminToRemoveName("")
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

  const filteredTickets = tickets.filter(ticket => {
    // Filtro de busca por texto
    const matchesSearch = searchTerm === "" || 
      ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro de status
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    
    // Filtro de prioridade
    const matchesPriority = filterPriority === "all" || ticket.prioridade === filterPriority
    
    // Filtro de data de abertura
    let matchesDate = true
    if (filterDateFrom || filterDateTo) {
      const ticketDate = new Date(ticket.created_at)
      ticketDate.setHours(0, 0, 0, 0)
      
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom)
        fromDate.setHours(0, 0, 0, 0)
        if (ticketDate < fromDate) {
          matchesDate = false
        }
      }
      
      if (filterDateTo) {
        const toDate = new Date(filterDateTo)
        toDate.setHours(23, 59, 59, 999)
        if (ticketDate > toDate) {
          matchesDate = false
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate
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
    setTicketStatus(ticket.status)
    setTicketPriority(ticket.prioridade)
    setShowTicketControls(false) // Resetar para oculto no mobile
    setIsTicketDialogOpen(true)
    setIsLoadingComments(true)
    setTicketComments([])
    setTicketHistory([])
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

      // Scroll para o final após carregar (aumentar delay para garantir renderização)
      setTimeout(() => {
        const chatContainer = document.getElementById('ticket-chat-container')
        if (chatContainer) {
          // Forçar scroll após um pequeno delay adicional
          setTimeout(() => {
            chatContainer.scrollTo({
              top: chatContainer.scrollHeight,
              behavior: 'auto'
            })
          }, 100)
        }
      }, 400)
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
        
        // Recarregar comentários imediatamente
        const commentsResult = await getTicketComments(selectedTicket.id)
        if (commentsResult.success) {
          setTicketComments(commentsResult.comments || [])
        }
        setNewComment("")
        
        // Scroll para o final da conversa após um pequeno delay
        setTimeout(() => {
          const chatContainer = document.getElementById('ticket-chat-container')
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
        
        // Atualizar ticket na lista imediatamente
        setTickets((prevTickets: Ticket[]) => 
          prevTickets.map((t: Ticket) => 
            t.id === selectedTicket.id 
              ? { 
                  ...t, 
                  status: ticketStatus as Ticket['status'], 
                  prioridade: ticketPriority as Ticket['prioridade'], 
                  updated_at: new Date().toISOString() 
                } as Ticket
              : t
          )
        )
        
        // Atualizar ticket selecionado
        setSelectedTicket((prev: Ticket | null) => {
          if (!prev) return null
          return {
            ...prev,
            status: ticketStatus as Ticket['status'],
            prioridade: ticketPriority as Ticket['prioridade'],
            updated_at: new Date().toISOString()
          } as Ticket
        })
        
        // Recarregar histórico após atualizar
        if (selectedTicket) {
          const historyResult = await getTicketStatusHistory(selectedTicket.id)
          if (historyResult.success) {
            setTicketHistory(historyResult.history || [])
          }
        }
        
        // Recarregar lista completa (polling vai manter atualizado)
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

      <div className="w-full max-w-[95%] mx-auto px-2 sm:px-3 md:px-4 py-6 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {t("admin.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("admin.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 md:mb-6 h-auto">
            <TabsTrigger value="users" className="flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
              <Users className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{t("admin.tabs.usuarios")}</span>
              <span className="sm:hidden">{t("admin.tabs.usuarios_short")}</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
              <TicketIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{t("admin.tabs.tickets")}</span>
              <span className="sm:hidden">{t("admin.tabs.tickets_short")}</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
              <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{t("admin.tabs.permissions")}</span>
              <span className="sm:hidden">{t("admin.tabs.permissions_short")}</span>
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
                        <tr key={user.id} className="border-t border-border/50 hover:border-primary/30 border border-transparent transition-colors">
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
            {/* Barra de busca e atualizar */}
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

            {/* Filtros */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 mb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Filtros</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Filtro de Status */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-status" className="text-xs font-medium">Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger id="filter-status" className="h-9 text-xs cursor-pointer">
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Todos os status</SelectItem>
                        <SelectItem value="aberto" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Aberto</SelectItem>
                        <SelectItem value="visto" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Visto</SelectItem>
                        <SelectItem value="em_andamento" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Em Andamento</SelectItem>
                        <SelectItem value="resolvido" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Resolvido</SelectItem>
                        <SelectItem value="fechado" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro de Prioridade */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-priority" className="text-xs font-medium">Prioridade</Label>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger id="filter-priority" className="h-9 text-xs cursor-pointer">
                        <SelectValue placeholder="Todas as prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Todas as prioridades</SelectItem>
                        <SelectItem value="baixa" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Baixa</SelectItem>
                        <SelectItem value="media" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Média</SelectItem>
                        <SelectItem value="alta" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro de Data Inicial */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-date-from" className="text-xs font-medium">Data de Abertura (De)</Label>
                    <Input
                      id="filter-date-from"
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  {/* Filtro de Data Final */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-date-to" className="text-xs font-medium">Data de Abertura (Até)</Label>
                    <Input
                      id="filter-date-to"
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Botão para limpar filtros */}
                {(filterStatus !== "all" || filterPriority !== "all" || filterDateFrom || filterDateTo) && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setFilterStatus("all")
                        setFilterPriority("all")
                        setFilterDateFrom("")
                        setFilterDateTo("")
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12 text-center">
                  <TicketIcon className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Nenhum ticket encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/30 transition-all group cursor-default"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {/* Conteúdo principal */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-foreground flex-1 group-hover:text-primary transition-colors">
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
                              <UserIcon className="h-4 w-4 shrink-0" />
                              <span className="font-medium text-foreground truncate">{ticket.user?.name || 'Usuário'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4 shrink-0" />
                              <span className="truncate">{ticket.user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 shrink-0" />
                              <span className="text-sm">Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR', { 
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
                                <span className="text-sm">Atualizado em {new Date(ticket.updated_at).toLocaleDateString('pt-BR', { 
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
                            className="w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer hover:border-primary hover:text-primary transition-all"
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

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("admin.permissions.search_user")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={loadWorkspaces}
                variant="outline"
                disabled={isLoadingWorkspaces}
                className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingWorkspaces ? 'animate-spin' : ''}`} />
                {t("admin.permissions.update")}
              </Button>
              <Button
                onClick={handleOpenCreateWorkspaceDialog}
                className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <FolderPlus className="h-4 w-4" />
                {t("admin.permissions.new_workspace")}
              </Button>
            </div>

            {/* Gerenciamento de Workspaces */}
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 md:p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t("admin.permissions.workspaces_available")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.permissions.workspaces_description")}</p>
                </div>
              </div>
              <div className="space-y-2">
                {workspaces.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("admin.permissions.no_workspaces")}
                  </div>
                ) : (
                  workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 border border-transparent transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{workspace.name}</p>
                          {workspace.is_default && (
                            <Badge variant="outline" className="text-xs">
                              {t("admin.permissions.default")}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {workspace.slug}
                          </Badge>
                        </div>
                        {workspace.description && (
                          <p className="text-sm text-muted-foreground truncate">{workspace.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        {!workspace.is_default && (
                          <>
                            <Button
                              onClick={() => handleOpenEditWorkspaceDialog(workspace)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-primary cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenDeleteWorkspaceDialog(workspace.id)}
                              variant="ghost"
                              size="sm"
                              disabled={isDeletingWorkspace}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Lista de usuários */}
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-lg font-semibold text-foreground">{t("admin.permissions.users")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.permissions.select_user")}</p>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      {t("admin.permissions.no_users")}
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectUserForPermissions(user.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedUserForPermissions === user.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{user.name}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                            {selectedUserForPermissions === user.id && (
                              <CheckCircle className="h-5 w-5 text-primary shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gerenciamento de permissões */}
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-lg font-semibold text-foreground">{t("admin.permissions.workspace_permissions")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUserForPermissions
                      ? t("admin.permissions.select_workspaces")
                      : t("admin.permissions.select_user_to_start")}
                  </p>
                </div>
                <div className="p-4">
                  {!selectedUserForPermissions ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{t("admin.permissions.select_user_to_manage")}</p>
                    </div>
                  ) : isLoadingWorkspaces ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workspaces.map((workspace) => {
                        const isSelected = (selectedUserPermissions[selectedUserForPermissions] || []).includes(workspace.id)
                        const isDefault = workspace.is_default
                        return (
                          <div
                            key={workspace.id}
                            className={`p-4 rounded-lg border-2 ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border/50 bg-muted/30'
                            } ${isDefault ? 'opacity-100' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggleWorkspacePermission(selectedUserForPermissions, workspace.id)}
                                disabled={isDefault}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-foreground">{workspace.name}</p>
                                  {isDefault && (
                                    <Badge variant="outline" className="text-xs">
                                      {t("admin.permissions.default")}
                                    </Badge>
                                  )}
                                </div>
                                {workspace.description && (
                                  <p className="text-sm text-muted-foreground">{workspace.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <Button
                        onClick={handleSavePermissions}
                        disabled={isSavingPermissions || JSON.stringify(userPermissions[selectedUserForPermissions]) === JSON.stringify(selectedUserPermissions[selectedUserForPermissions])}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        {isSavingPermissions ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            {t("admin.permissions.saving")}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            {t("admin.permissions.save_permissions")}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Admins Tab */}
          {isOwner && (
            <TabsContent value="admins" className="space-y-4">
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 md:p-6 mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("admin.admins.add_title")}</h3>
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
                            <tr key={admin.id} className="border-t border-border/50 hover:border-primary/30 border border-transparent transition-colors">
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
                                    onClick={() => handleOpenRemoveAdminDialog(admin.user_id, adminUser?.email || adminUser?.name || 'este administrador')}
                                    variant="ghost"
                                    size="sm"
                                    disabled={isRemovingAdmin}
                                    className="text-destructive hover:text-destructive hover:border-destructive/30 border border-transparent cursor-pointer"
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
                                onClick={() => handleOpenRemoveAdminDialog(admin.user_id, adminUser?.email || adminUser?.name || 'este administrador')}
                                variant="ghost"
                                size="sm"
                                disabled={isRemovingAdmin}
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

      {/* Dialog para visualizar e gerenciar ticket - Layout de Chat Moderno */}
      <Dialog open={isTicketDialogOpen} onOpenChange={(open) => {
        setIsTicketDialogOpen(open)
        if (!open) {
          setShowTicketControls(false) // Resetar quando fechar
        }
      }}>
        <DialogContent className="!max-w-[100vw] !w-[100vw] !max-h-[100vh] !h-[100vh] !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none md:!max-w-[95vw] md:!w-[95vw] md:!max-h-[98vh] md:!h-[98vh] md:!top-[50%] md:!left-[50%] md:!translate-x-[-50%] md:!translate-y-[-50%] md:!rounded-lg flex flex-col p-0 gap-0 bg-background m-0">
          {selectedTicket && (
            <>
              {/* Header Compacto com Informações e Controles */}
              <div className="p-4 sm:p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0 relative">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-2xl font-bold mb-3 line-clamp-2">{selectedTicket.titulo}</DialogTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <UserIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{selectedTicket.user?.name || 'Usuário'}</span>
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate max-w-[200px]">{selectedTicket.user?.email || 'N/A'}</span>
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <Badge variant="outline" className="text-xs">{selectedTicket.categoria}</Badge>
                        <span className="text-muted-foreground">·</span>
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
                  {/* Botão para mostrar/ocultar controles no mobile - Posicionado abaixo do botão de fechar */}
                  <div className="md:hidden absolute top-16 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTicketControls(!showTicketControls)}
                      className="h-8 w-8 p-0 cursor-pointer hover:text-primary"
                    >
                      {showTicketControls ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {/* Controles de Status, Prioridade e Salvar - Ocultos no mobile por padrão */}
                  <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-border/30 transition-all duration-300 ${
                    showTicketControls ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  } md:!max-h-none md:!opacity-100`}>
                    <div className="flex items-center gap-2 flex-1">
                      <Label htmlFor="status" className="text-xs font-semibold whitespace-nowrap min-w-[60px]">Status:</Label>
                      <Select value={ticketStatus} onValueChange={setTicketStatus}>
                        <SelectTrigger id="status" className="h-9 flex-1 text-xs cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberto" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Aberto</SelectItem>
                          <SelectItem value="visto" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Visto</SelectItem>
                          <SelectItem value="em_andamento" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Em Andamento</SelectItem>
                          <SelectItem value="resolvido" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Resolvido</SelectItem>
                          <SelectItem value="fechado" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Fechado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Label htmlFor="prioridade" className="text-xs font-semibold whitespace-nowrap min-w-[80px]">Prioridade:</Label>
                      <Select value={ticketPriority} onValueChange={setTicketPriority}>
                        <SelectTrigger id="prioridade" className="h-9 flex-1 text-xs cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Baixa</SelectItem>
                          <SelectItem value="media" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Média</SelectItem>
                          <SelectItem value="alta" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleUpdateTicket}
                      disabled={isUpdatingTicket}
                      size="sm"
                      className="h-9 text-xs shrink-0 sm:min-w-[100px] cursor-pointer"
                    >
                      {isUpdatingTicket ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Salvando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Salvar
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Área de Chat */}
              <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-muted/10 to-background overflow-hidden">
                {/* Container de Mensagens com Scroll */}
                <div 
                  id="ticket-chat-container"
                  className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 pb-4"
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
                          <UserIcon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[75%]">
                          <div className="bg-card rounded-xl rounded-tl-sm p-3 shadow-md border border-border/50">
                            <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                              {selectedTicket.descricao}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 px-1">
                            <span className="text-[10px] sm:text-xs font-medium text-foreground">
                              {selectedTicket.user?.name || 'Usuário'}
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
                        const isAdminComment = comment.user_id !== selectedTicket.user_id
                        
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
                                <UserIcon className="h-3.5 w-3.5" />
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
                                  {isAdminComment ? (comment.user?.name || 'Administrador') : (comment.user?.name || 'Usuário')}
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

                {/* Input de Comentário para Admin */}
                <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4 border-t border-border/50 bg-card/80 backdrop-blur-sm shrink-0 mt-auto">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 relative">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Digite sua resposta ao usuário..."
                        rows={2}
                        className="resize-none text-sm border-2 border-border/50 focus:border-primary/50 bg-background min-h-[60px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault()
                            handleAddComment()
                          }
                        }}
                        disabled={isAddingComment || selectedTicket.status === 'resolvido' || selectedTicket.status === 'fechado'}
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
                      disabled={isAddingComment || !newComment.trim() || selectedTicket.status === 'resolvido' || selectedTicket.status === 'fechado'}
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
                  {(selectedTicket.status === 'resolvido' || selectedTicket.status === 'fechado') && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 mb-0 flex items-center gap-1.5">
                      <AlertCircle className="h-3 w-3" />
                      Não é possível adicionar comentários em tickets {selectedTicket.status === 'resolvido' ? 'resolvidos' : 'fechados'}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para criar/editar workspace */}
      <Dialog open={isWorkspaceDialogOpen} onOpenChange={setIsWorkspaceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedWorkspace ? t("admin.permissions.edit_workspace") : t("admin.permissions.create_workspace")}
            </DialogTitle>
            <DialogDescription>
              {selectedWorkspace
                ? t("admin.permissions.update_workspace_info")
                : t("admin.permissions.create_workspace_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="workspace-name">{t("admin.permissions.workspace_name")}</Label>
              <Input
                id="workspace-name"
                placeholder={t("admin.permissions.workspace_name_placeholder")}
                value={workspaceForm.name}
                onChange={(e) => setWorkspaceForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="workspace-slug">{t("admin.permissions.workspace_slug")}</Label>
              <Input
                id="workspace-slug"
                placeholder={t("admin.permissions.workspace_slug_placeholder")}
                value={workspaceForm.slug}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
                  setWorkspaceForm(prev => ({ ...prev, slug }))
                }}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.permissions.workspace_slug_hint")}
              </p>
            </div>

            <div>
              <Label htmlFor="workspace-description">{t("admin.permissions.workspace_description")}</Label>
              <Textarea
                id="workspace-description"
                placeholder={t("admin.permissions.workspace_description_placeholder")}
                value={workspaceForm.description}
                onChange={(e) => setWorkspaceForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2 min-h-[100px]"
              />
            </div>

            {selectedWorkspace && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {t("admin.permissions.workspace_edit_warning")}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsWorkspaceDialogOpen(false)
                setWorkspaceForm({ name: "", slug: "", description: "" })
                setSelectedWorkspace(null)
              }}
              disabled={isCreatingWorkspace || isEditingWorkspace}
              className="cursor-pointer"
            >
              {t("admin.permissions.cancel")}
            </Button>
            <Button
              onClick={selectedWorkspace ? handleEditWorkspace : handleCreateWorkspace}
              disabled={isCreatingWorkspace || isEditingWorkspace || !workspaceForm.name.trim() || !workspaceForm.slug.trim()}
              className="cursor-pointer"
            >
              {isCreatingWorkspace || isEditingWorkspace ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {selectedWorkspace ? t("admin.permissions.saving") : t("admin.permissions.creating")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {selectedWorkspace ? t("admin.permissions.save_changes") : t("admin.permissions.create_workspace_button")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para deletar workspace */}
      {deleteWorkspaceDialogOpen && workspaceToDelete && (
        <AlertDialog 
          open={deleteWorkspaceDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              if (!isDeletingWorkspace) {
                setDeleteWorkspaceDialogOpen(false)
                // Delay para garantir que o portal foi desmontado antes de limpar o estado
                setTimeout(() => {
                  setWorkspaceToDelete(null)
                }, 200)
              }
            }
          }}
        >
          <AlertDialogContent className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                {t("admin.permissions.dialog.delete_workspace.title") || "Deletar Workspace"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground pt-2">
                {t("admin.permissions.dialog.delete_workspace.description") || "Tem certeza que deseja deletar este workspace? Todas as permissões associadas serão removidas. Esta ação não pode ser desfeita."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel 
                disabled={isDeletingWorkspace}
                onClick={() => {
                  setDeleteWorkspaceDialogOpen(false)
                  setTimeout(() => {
                    setWorkspaceToDelete(null)
                  }, 200)
                }}
              >
                {t("admin.permissions.cancel") || "Cancelar"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleConfirmDeleteWorkspace()
                }}
                disabled={isDeletingWorkspace}
                className="bg-destructive text-destructive-foreground hover:border-destructive/80 border border-destructive"
              >
                {isDeletingWorkspace ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                    {t("admin.permissions.dialog.delete_workspace.deleting") || "Deletando..."}
                  </span>
                ) : (
                  t("admin.permissions.dialog.delete_workspace.confirm") || "Deletar"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Dialog de confirmação para remover admin */}
      {removeAdminDialogOpen && adminToRemove && (
        <AlertDialog 
          open={removeAdminDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              if (!isRemovingAdmin) {
                setRemoveAdminDialogOpen(false)
                // Delay para garantir que o portal foi desmontado antes de limpar o estado
                setTimeout(() => {
                  setAdminToRemove(null)
                  setAdminToRemoveName("")
                }, 200)
              }
            }
          }}
        >
          <AlertDialogContent className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                {t("admin.admins.dialog.remove.title") || "Remover Administrador"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground pt-2">
                {(t("admin.admins.dialog.remove.description") || `Tem certeza que deseja remover {name} como administrador? Esta ação não pode ser desfeita.`).replace("{name}", adminToRemoveName)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel 
                disabled={isRemovingAdmin}
                onClick={() => {
                  setRemoveAdminDialogOpen(false)
                  setTimeout(() => {
                    setAdminToRemove(null)
                    setAdminToRemoveName("")
                  }, 200)
                }}
              >
                {t("admin.permissions.cancel") || "Cancelar"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleConfirmRemoveAdmin()
                }}
                disabled={isRemovingAdmin}
                className="bg-destructive text-destructive-foreground hover:border-destructive/80 border border-destructive"
              >
                {isRemovingAdmin ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                    {t("admin.admins.dialog.remove.removing") || "Removendo..."}
                  </span>
                ) : (
                  t("admin.admins.dialog.remove.confirm") || "Remover"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  )
}

