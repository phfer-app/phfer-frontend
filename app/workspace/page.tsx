"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ticket, Folder, ArrowRight, Briefcase, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { isAuthenticated } from "@/lib/auth"
import { getWorkspaces, getMyWorkspacePermissions, type Workspace } from "@/lib/workspace-permissions"
import { useToast } from "@/hooks/use-toast"

export default function WorkspacePage() {
  const [mounted, setMounted] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push("/not-found")
      return
    }
    loadWorkspaces()
  }, [router])

  const loadWorkspaces = async () => {
    setIsLoading(true)
    try {
      // Carregar permissões e workspaces disponíveis do backend
      const result = await getMyWorkspacePermissions()
      
      if (result.success) {
        // O backend já filtra os workspaces baseado nas permissões do usuário
        // Workspaces não-padrão só aparecem se o usuário tiver permissão
        // Workspace padrão sempre aparece
        if (result.workspaces && result.workspaces.length > 0) {
          setWorkspaces(result.workspaces)
          setUserPermissions(result.userPermissions || [])
        } else {
          // Se não retornou workspaces, usar workspace padrão como fallback
          // Isso pode acontecer se o banco ainda não foi configurado
          const defaultWorkspaces: Workspace[] = [
            {
              id: 'default-chamados',
              name: 'Meus Chamados',
              slug: 'chamados',
              description: 'Visualize e gerencie todos os seus chamados e tickets',
              is_default: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
          setWorkspaces(defaultWorkspaces)
          setUserPermissions(['default-chamados'])
        }
      } else {
        // Se falhar, usar workspace padrão como fallback
        setWorkspaces([
          {
            id: 'default-chamados',
            name: 'Meus Chamados',
            slug: 'chamados',
            description: 'Visualize e gerencie todos os seus chamados e tickets',
            is_default: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        setUserPermissions(['default-chamados'])
      }
    } catch (error: any) {
      console.error('Erro ao carregar workspaces:', error)
      // Em caso de erro, usar workspaces padrão
      setWorkspaces([
        {
          id: 'default-chamados',
          name: 'Meus Chamados',
          slug: 'chamados',
          description: 'Visualize e gerencie todos os seus chamados e tickets',
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      setUserPermissions(['default-chamados'])
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || !isAuthenticated()) {
    return null
  }

  // Mapear workspaces para cards
  const workspaceCardsMap: Record<string, any> = {
    'chamados': {
      id: "chamados",
      title: t("workspace.meus_chamados") || "Meus Chamados",
      description: t("workspace.meus_chamados_desc") || "Visualize e gerencie todos os seus chamados e tickets",
      icon: Ticket,
      href: "/chamados",
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-500",
      hoverColor: "hover:border-blue-500/50"
    },
    'pasta-pessoal': {
      id: "pasta-pessoal",
      title: t("workspace.pasta_pessoal") || "Pasta Pessoal",
      description: t("workspace.pasta_pessoal_desc") || "Acesse seus arquivos e documentos pessoais",
      icon: Folder,
      href: "/workspace/pasta-pessoal",
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-500",
      hoverColor: "hover:border-purple-500/50"
    }
  }

  // Os workspaces já vêm filtrados do backend, então podemos usá-los diretamente
  const availableWorkspaces = workspaces

  // Mapear workspaces para cards
  const workspaceCards = availableWorkspaces
    .map(workspace => {
      // Buscar card pelo slug
      const card = workspaceCardsMap[workspace.slug]
      if (card) {
        return {
          ...card,
          workspaceId: workspace.id
        }
      }
      // Se não encontrar pelo slug, criar card genérico
      return {
        id: workspace.id,
        title: workspace.name,
        description: workspace.description || '',
        icon: Folder,
        href: `/workspace/${workspace.slug}`,
        color: "from-primary/20 to-primary/10",
        borderColor: "border-primary/30",
        iconColor: "text-primary",
        hoverColor: "hover:border-primary/50",
        workspaceId: workspace.id
      }
    })
    .filter(Boolean)

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                {t("workspace.title") || "Meu Workspace"}
              </h1>
            </div>
            <Button
              onClick={loadWorkspaces}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t("workspace.update")}</span>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm md:text-base ml-14">
            {t("workspace.subtitle") || "Gerencie suas ferramentas e recursos em um só lugar"}
          </p>
        </div>

        {/* Workspace Cards */}
        {isLoading ? (
          <div className="flex items-center justify-start py-12 pl-0">
            <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : workspaceCards.length === 0 ? (
          <div className="text-left py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">{t("workspace.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-start">
            {workspaceCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.id}
                  onClick={() => router.push(card.href)}
                  className="group relative bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl p-6 md:p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] flex flex-col w-full"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                        <Icon className={`h-6 w-6 ${card.iconColor}`} />
                      </div>
                      <ArrowRight className={`h-5 w-5 ${card.iconColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0`} />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1">
                      {card.description}
                    </p>
                  </div>

                  {/* Hover gradient effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

