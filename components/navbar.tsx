"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Languages, Palette, ChevronDown, User, LogOut, Ticket, Briefcase, Shield, Folder, LayoutDashboard, Edit } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { useNavigation } from "@/components/navigation-provider"
import { getUser, isAuthenticated, logout, refreshAdminStatus, updateUserData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { checkAdmin } from "@/lib/admin"
import { getMyWorkspacePermissions, type Workspace } from "@/lib/workspace-permissions"

const navLinks = [
  { route: "home" as const, labelKey: "nav.inicio" },
  { route: "about" as const, labelKey: "nav.sobre_mim" },
  { route: "career" as const, labelKey: "nav.carreira" },
  { route: "blog" as const, labelKey: "nav.blog" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false)
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(false)
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false)
  const [isThemeExpanded, setIsThemeExpanded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false)
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { currentRoute, setCurrentRoute } = useNavigation()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([])
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Verifica se está scrollado o suficiente para aplicar estilos
      setIsScrolled(currentScrollY > 20)
      
      // Mostra navbar ao scrollar para cima, esconde ao scrollar para baixo
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down e passou de 100px
        setIsVisible(false)
      }
      
      // Se estiver no topo, sempre mostra
      if (currentScrollY < 10) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Carregar workspaces do usuário
  useEffect(() => {
    const loadUserWorkspaces = async () => {
      // Só carregar se estiver autenticado
      if (!isLoggedIn || !isAuthenticated()) {
        setUserWorkspaces([])
        return
      }

      setIsLoadingWorkspaces(true)
      try {
        const result = await getMyWorkspacePermissions()
        if (result.success && result.workspaces) {
          // O backend já retorna apenas os workspaces que o usuário tem permissão
          // Ordenar: workspace padrão primeiro, depois os outros por nome
          const sortedWorkspaces = result.workspaces.sort((a, b) => {
            if (a.is_default && !b.is_default) return -1
            if (!a.is_default && b.is_default) return 1
            return a.name.localeCompare(b.name)
          })
          setUserWorkspaces(sortedWorkspaces)
        } else {
          setUserWorkspaces([])
        }
      } catch (error) {
        console.error('Erro ao carregar workspaces:', error)
        setUserWorkspaces([])
      } finally {
        setIsLoadingWorkspaces(false)
      }
    }

    loadUserWorkspaces()
    
    // Recarregar workspaces periodicamente (quando permissões podem mudar)
    // Apenas se estiver logado
    let interval: NodeJS.Timeout | null = null
    if (isLoggedIn) {
      interval = setInterval(loadUserWorkspaces, 30000) // A cada 30 segundos
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoggedIn])

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      if (authenticated) {
        const user = getUser()
        const token = localStorage.getItem('token')
        setUserEmail(user?.email || null)
        setUserName(user?.name || null)
        
        // Verificar se é admin apenas se tiver token
        if (token) {
          try {
            const adminResult = await checkAdmin()
            if (adminResult.success) {
              const isAdminUser = adminResult.isAdmin || false
              setIsAdmin(isAdminUser)
              
              // Atualizar localStorage com os dados de admin
              updateUserData({
                is_admin: isAdminUser,
                is_owner: adminResult.isOwner || false
              })
            } else {
              // Se não for admin ou erro, definir como false
              // Mas não atualizar localStorage se for erro de rede
              if (adminResult.error && !adminResult.error.includes('conectar ao servidor')) {
                setIsAdmin(false)
                updateUserData({
                  is_admin: false,
                  is_owner: false
                })
              } else {
                // Se for erro de rede, usar dados do localStorage se existirem
                setIsAdmin(user?.is_admin || false)
              }
            }
          } catch (error) {
            // Em caso de erro, usar dados do localStorage se existirem
            console.error('Erro ao verificar admin:', error)
            setIsAdmin(user?.is_admin || false)
          }
        } else {
          // Se não tiver token, usar dados do localStorage
          setIsAdmin(user?.is_admin || false)
        }
      } else {
        setUserEmail(null)
        setUserName(null)
        setIsAdmin(false)
        setUserWorkspaces([])
      }
    }

    checkAuth()

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Verificar periodicamente (para mudanças na mesma aba)
    const interval = setInterval(checkAuth, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>, route: "home" | "about" | "career" | "blog") => {
    e.preventDefault()
    
    // Se for home, garantir scroll para o topo e remover foco
    if (route === "home") {
      // Remove foco de qualquer elemento ativo
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      
      // Scroll para o topo imediatamente
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    
    if (pathname !== "/") {
      router.push("/")
      // aguarda a navegação para garantir render da home
      setTimeout(() => {
        setCurrentRoute(route)
        // Se for home, garantir scroll novamente após navegação
        if (route === "home") {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }
          }, 100)
        }
      }, 50)
    } else {
      setCurrentRoute(route)
    }
    setIsOpen(false)
  }

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const go = () => {
      setCurrentRoute("home")
      setIsOpen(false)
      setTimeout(() => {
        const element = document.querySelector("#contact")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 150)
    }
    if (pathname !== "/") {
      router.push("/")
      setTimeout(go, 50)
    } else {
      go()
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsLoggedIn(false)
      setUserEmail(null)
      setUserName(null)
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/")
      setIsOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer logout",
        variant: "destructive",
      })
    }
  }

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full transition-all duration-300 ${
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-full opacity-0 pointer-events-none"
      } ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-background/60 backdrop-blur-md border-b border-border/30"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between h-14 md:h-12">
          {/* Logo - Left */}
          <button 
            onClick={(e) => handleNavClick(e, "home")}
            className="text-sm font-bold text-primary whitespace-nowrap shrink-0 relative group cursor-pointer"
          >
            <span className="relative z-10">init</span>
            <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"></span>
          </button>

          {/* Desktop Controls - Right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Navigation Items - Right side */}
            {isLoggedIn ? (
              <>
                {/* Rota atual com Dropdown quando logado */}
                <div 
                  className="relative inline-flex items-center group"
                >
                  <button
                    onClick={(e) => {
                      const currentLink = navLinks.find(l => l.route === currentRoute)
                      if (currentLink) {
                        handleNavClick(e, currentLink.route)
                      }
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-all duration-200 cursor-pointer h-8 ${
                      currentRoute === "home" || currentRoute === "about" || currentRoute === "career" || currentRoute === "blog"
                        ? "text-primary bg-primary/10 border border-primary/50"
                        : "text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent"
                    }`}
                  >
                    {t(navLinks.find(l => l.route === currentRoute)?.labelKey || "nav.inicio")}
                  </button>
                  <DropdownMenu 
                    modal={false}
                    open={isPagesDropdownOpen}
                    onOpenChange={setIsPagesDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`h-8 w-6 p-0 rounded-r-lg rounded-l-none border-l transition-all duration-200 flex items-center justify-center ${
                          currentRoute === "home" || currentRoute === "about" || currentRoute === "career" || currentRoute === "blog"
                            ? "bg-primary/10 border-l border-primary/50 border-r border-primary/50 border-t border-primary/50 border-b border-primary/50 text-primary"
                            : "border-l border-border/30 hover:border-primary/30 border border-transparent text-muted-foreground hover:text-primary"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setIsPagesDropdownOpen(true)}
                        onMouseLeave={() => setIsPagesDropdownOpen(false)}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      sideOffset={0}
                      collisionPadding={8} 
                      className="w-52 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl p-1.5 -mt-1"
                      onMouseEnter={() => setIsPagesDropdownOpen(true)}
                      onMouseLeave={() => setIsPagesDropdownOpen(false)}
                    >
                      {navLinks
                        .filter(link => link.route !== currentRoute)
                        .map((link) => (
                          <DropdownMenuItem 
                            key={link.route}
                            onClick={(e) => handleNavClick(e, link.route)}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent hover:border-primary/30 border border-transparent focus:border-primary/30 text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 rounded-lg m-0.5 text-sm"
                          >
                            <span className="font-medium">{t(link.labelKey)}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* Meu Workspace */}
                <div 
                  className="relative inline-flex items-center group"
                >
                  <button
                    onClick={() => router.push("/workspace")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-all duration-200 cursor-pointer flex items-center gap-2 h-8 ${
                      pathname === "/workspace" || pathname.startsWith("/workspace") || pathname === "/chamados"
                        ? "text-primary bg-primary/10 border border-primary/50"
                        : "text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent"
                    }`}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    {t("nav.meu_workspace") || "Meu Workspace"}
                  </button>
                  <DropdownMenu 
                    modal={false}
                    open={isWorkspaceDropdownOpen}
                    onOpenChange={setIsWorkspaceDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`h-8 w-6 p-0 rounded-r-lg rounded-l-none border-l transition-all duration-200 flex items-center justify-center ${
                          pathname === "/workspace" || pathname.startsWith("/workspace") || pathname === "/chamados"
                            ? "bg-primary/10 border-l border-primary/50 border-r border-primary/50 border-t border-primary/50 border-b border-primary/50 text-primary"
                            : "border-l border-border/30 hover:border-primary/30 border border-transparent text-muted-foreground hover:text-primary"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setIsWorkspaceDropdownOpen(true)}
                        onMouseLeave={() => setIsWorkspaceDropdownOpen(false)}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      sideOffset={0}
                      collisionPadding={8} 
                      className="w-56 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl p-1.5 -mt-1"
                      onMouseEnter={() => setIsWorkspaceDropdownOpen(true)}
                      onMouseLeave={() => setIsWorkspaceDropdownOpen(false)}
                    >
                      {isLoadingWorkspaces ? (
                        <div className="px-2.5 py-1.5 text-sm text-muted-foreground text-center">
                          {t("workspace.loading")}
                        </div>
                      ) : userWorkspaces.length === 0 ? (
                        <div className="px-2.5 py-1.5 text-sm text-muted-foreground text-center">
                          {t("workspace.empty")}
                        </div>
                      ) : (
                        userWorkspaces.map((workspace) => {
                          // Determinar ícone e rota baseado no slug
                          const getWorkspaceIcon = (slug: string) => {
                            if (slug === 'chamados') return Ticket
                            if (slug === 'pasta-pessoal') return Folder
                            return Folder
                          }
                          
                          const getWorkspaceRoute = (slug: string) => {
                            if (slug === 'chamados') return '/chamados'
                            return `/workspace/${slug}`
                          }
                          
                          // Traduzir nome do workspace baseado no slug
                          const getWorkspaceName = (slug: string, name: string) => {
                            if (slug === 'chamados') return t("workspace.meus_chamados")
                            if (slug === 'pasta-pessoal') return t("workspace.pasta_pessoal")
                            // Para workspaces customizados, usar o nome do banco
                            return name
                          }
                          
                          const Icon = getWorkspaceIcon(workspace.slug)
                          const route = getWorkspaceRoute(workspace.slug)
                          const translatedName = getWorkspaceName(workspace.slug, workspace.name)
                          
                          return (
                            <DropdownMenuItem 
                              key={workspace.id}
                              onClick={() => router.push(route)}
                              className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent hover:border-primary/30 border border-transparent focus:border-primary/30 text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 rounded-lg m-0.5 text-sm"
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="font-medium">{translatedName}</span>
                            </DropdownMenuItem>
                          )
                        })
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* Solicitar Serviços */}
                <button
                  onClick={() => router.push("/solicitar-servicos")}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent flex items-center gap-2 h-8"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  {t("nav.solicitar_servicos")}
                </button>

                {/* Language Dropdown */}
                <DropdownMenu 
                  modal={false} 
                  open={isLanguageDropdownOpen}
                  onOpenChange={setIsLanguageDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2.5 rounded-lg hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5" 
                      title={language === "pt" ? "Português" : "English"}
                    >
                      <Languages className="h-4 w-4 cursor-pointer" />
                      <ChevronDown className="h-3 w-3 cursor-pointer opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={0}
                    collisionPadding={8} 
                    className="w-48 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl -mt-1"
                  >
                      <DropdownMenuItem 
                        onClick={() => setLanguage("pt")} 
                        className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                      >
                        <span className="text-xl">🇧🇷</span>
                        <div className="flex flex-col">
                          <span className="font-medium">Português</span>
                          <span className="text-xs text-muted-foreground">Portuguese</span>
                        </div>
                        {language === "pt" && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setLanguage("en")} 
                        className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                      >
                        <span className="text-xl">🇺🇸</span>
                        <div className="flex flex-col">
                          <span className="font-medium">English</span>
                          <span className="text-xs text-muted-foreground">Inglês</span>
                        </div>
                        {language === "en" && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Links normais quando não logado
              navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={(e) => handleNavClick(e, link.route)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer h-8 ${
                    currentRoute === link.route
                      ? "text-primary bg-primary/10 border border-primary/50"
                      : "text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent"
                  }`}
                >
                  {t(link.labelKey)}
                </button>
              ))
            )}

            {/* Language Dropdown - When not logged in */}
            {!isLoggedIn && (
              <DropdownMenu 
                modal={false} 
                open={isLanguageDropdownOpen}
                onOpenChange={setIsLanguageDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2.5 rounded-lg hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5" 
                    title={language === "pt" ? "Português" : "English"}
                  >
                    <Languages className="h-4 w-4 cursor-pointer" />
                    <ChevronDown className="h-3 w-3 cursor-pointer opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  collisionPadding={8} 
                  className="w-48 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl"
                >
                    <DropdownMenuItem 
                      onClick={() => setLanguage("pt")} 
                      className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                    >
                      <span className="text-xl">🇧🇷</span>
                      <div className="flex flex-col">
                        <span className="font-medium">Português</span>
                        <span className="text-xs text-muted-foreground">Portuguese</span>
                      </div>
                      {language === "pt" && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLanguage("en")} 
                      className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                    >
                      <span className="text-xl">🇺🇸</span>
                      <div className="flex flex-col">
                        <span className="font-medium">English</span>
                        <span className="text-xs text-muted-foreground">Inglês</span>
                      </div>
                      {language === "en" && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Theme Toggle - Dropdown */}
            <DropdownMenu 
              modal={false}
              open={isThemeDropdownOpen}
              onOpenChange={setIsThemeDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2.5 rounded-lg hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5" 
                    title={theme === "dark" ? "Tema escuro" : theme === "light" ? "Tema claro" : "Tema do sistema"}
                  >
                    <Palette className="h-4 w-4 cursor-pointer" />
                    <ChevronDown className="h-3 w-3 cursor-pointer opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={0}
                  collisionPadding={8} 
                  className="w-48 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl -mt-1"
                >
                  <DropdownMenuItem 
                    onClick={() => setTheme("light")} 
                    className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-500/30 flex items-center justify-center">
                      <span className="text-xs">☀️</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Claro</span>
                      <span className="text-xs text-muted-foreground">Light</span>
                    </div>
                    {theme === "light" && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTheme("dark")} 
                    className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600/30 flex items-center justify-center">
                      <span className="text-xs">🌙</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Escuro</span>
                      <span className="text-xs text-muted-foreground">Dark</span>
                    </div>
                    {theme === "dark" && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTheme("system")} 
                    className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-linear-to-br from-yellow-400 to-slate-700 border border-border/30 flex items-center justify-center">
                      <span className="text-xs">💻</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Sistema</span>
                      <span className="text-xs text-muted-foreground">System</span>
                    </div>
                    {theme === "system" && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            {/* Auth Buttons or User Dropdown */}
            {isLoggedIn && userEmail ? (
              <DropdownMenu 
                modal={false}
                open={isUserDropdownOpen}
                onOpenChange={setIsUserDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 rounded-lg hover:text-primary hover:border-primary/50 transition-colors cursor-pointer flex items-center gap-2 border border-border/50" 
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium max-w-[120px] truncate">{userEmail}</span>
                    <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={0}
                  collisionPadding={8} 
                  className="w-56 bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl p-1.5 -mt-1"
                >
                    <div className="px-2 py-1.5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {userName && (
                            <p className="text-sm font-semibold text-foreground truncate mb-0.5">{userName}</p>
                          )}
                          <p className="text-xs font-medium truncate">{userEmail}</p>
                          <p className="text-xs text-muted-foreground">{t("nav.usuario_logado")}</p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        router.push("/editar-perfil")
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>{t("nav.editar_perfil") || "Editar perfil"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        router.push("/workspace")
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      <span>{t("nav.meu_workspace")}</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            router.push("/admin")
                          }}
                          className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent focus:border-primary/30 border border-transparent text-muted-foreground hover:text-primary focus:text-primary transition-colors rounded-lg m-0.5 text-sm"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          <span>{t("nav.painel_administrativo")}</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer focus:bg-transparent hover:bg-transparent hover:border-destructive/30 border border-transparent focus:border-destructive/30 text-destructive hover:text-destructive focus:text-destructive transition-colors rounded-lg m-0.5 text-sm"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{t("nav.desconectar")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <>
                {/* Login Button */}
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 border border-border/50 hover:border-primary/50 cursor-pointer h-8"
                >
                  {t("nav.login")}
                </button>

                {/* Cadastre-se Button - Highlighted */}
                <button
                  onClick={() => router.push("/cadastro")}
                  className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/70 hover:border-primary/50 border border-primary cursor-pointer h-8"
                >
                  {t("nav.cadastre_se")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-lg hover:text-foreground transition-all duration-300 group cursor-pointer" 
              onClick={() => {
                setIsOpen(!isOpen)
                if (isOpen) {
                  setIsMobileMenuExpanded(false)
                  setIsWorkspaceExpanded(false)
                  setIsLanguageExpanded(false)
                  setIsThemeExpanded(false)
                }
              }}
            >
              <div className="relative w-5 h-5">
                <Menu 
                  className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                    isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 group-hover:scale-110"
                  }`}
                />
                <X 
                  className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                    isOpen ? "opacity-100 scale-100 group-hover:scale-110" : "opacity-0 scale-0"
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop to close menu */}
            <div 
              className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => {
                setIsOpen(false)
                setIsMobileMenuExpanded(false)
                setIsWorkspaceExpanded(false)
                setIsLanguageExpanded(false)
                setIsThemeExpanded(false)
              }}
            />
            
            {/* Menu Drawer from Right - Modernizado */}
            <div className="md:hidden fixed right-0 top-0 h-screen w-[280px] z-40 bg-linear-to-b from-background via-background to-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl shadow-black/40 animate-in slide-in-from-right duration-300">
              <div className="flex flex-col h-full">
                {/* Close Button */}
                <div className="flex items-center justify-end p-4 border-b border-border/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-lg h-9 w-9 hover:text-foreground cursor-pointer" 
                    onClick={() => {
                      setIsOpen(false)
                      setIsMobileMenuExpanded(false)
                      setIsWorkspaceExpanded(false)
                      setIsLanguageExpanded(false)
                      setIsThemeExpanded(false)
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                  {isLoggedIn ? (
                    <>
                      {/* Rota atual com Dropdown quando logado */}
                      <div className="space-y-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsMobileMenuExpanded(!isMobileMenuExpanded)
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 text-primary border-primary/50 bg-transparent cursor-pointer"
                        >
                          <span>{t(navLinks.find(l => l.route === currentRoute)?.labelKey || "nav.inicio")}</span>
                          <ChevronDown 
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isMobileMenuExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        {/* Expanded Menu Items */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                            isMobileMenuExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          {navLinks
                            .filter(link => link.route !== currentRoute)
                            .map((link) => (
                              <button
                                key={link.route}
                                onClick={(e) => {
                                  handleNavClick(e, link.route)
                                  setIsOpen(false)
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 group border-2 cursor-pointer text-foreground border-transparent hover:border-border/30 hover:text-primary"
                              >
                                <span className="group-hover:translate-x-1 transition-transform">{t(link.labelKey)}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                      
                      {/* Meu Workspace */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsOpen(false)
                              router.push("/workspace")
                            }}
                            className={`flex-1 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                              pathname === "/workspace" || pathname.startsWith("/workspace") || pathname === "/chamados"
                                ? "text-primary border-primary/50 bg-primary/10"
                                : "text-foreground border-border/30 hover:border-primary/30 bg-transparent"
                            }`}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>{t("nav.meu_workspace") || "Meu Workspace"}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsWorkspaceExpanded(!isWorkspaceExpanded)
                            }}
                            className={`px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                              pathname === "/workspace" || pathname.startsWith("/workspace") || pathname === "/chamados"
                                ? "text-primary border-primary/50 bg-primary/10"
                                : "text-foreground border-border/30 hover:border-primary/30 bg-transparent"
                            }`}
                          >
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform duration-300 ${
                                isWorkspaceExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                        
                        {/* Expanded Workspace Items */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                            isWorkspaceExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          {isLoadingWorkspaces ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                              {t("workspace.loading")}
                            </div>
                          ) : userWorkspaces.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                              {t("workspace.empty")}
                            </div>
                          ) : (
                            userWorkspaces.map((workspace) => {
                              // Determinar ícone e rota baseado no slug
                              const getWorkspaceIcon = (slug: string) => {
                                if (slug === 'chamados') return Ticket
                                if (slug === 'pasta-pessoal') return Folder
                                return Folder
                              }
                              
                              const getWorkspaceRoute = (slug: string) => {
                                if (slug === 'chamados') return '/chamados'
                                return `/workspace/${slug}`
                              }
                              
                              // Traduzir nome do workspace baseado no slug
                              const getWorkspaceName = (slug: string, name: string) => {
                                if (slug === 'chamados') return t("workspace.meus_chamados")
                                if (slug === 'pasta-pessoal') return t("workspace.pasta_pessoal")
                                // Para workspaces customizados, usar o nome do banco
                                return name
                              }
                              
                              const Icon = getWorkspaceIcon(workspace.slug)
                              const route = getWorkspaceRoute(workspace.slug)
                              const translatedName = getWorkspaceName(workspace.slug, workspace.name)
                              
                              return (
                                <button
                                  key={workspace.id}
                                  onClick={() => {
                                    setIsOpen(false)
                                    router.push(route)
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 group border-2 cursor-pointer text-foreground border-transparent hover:border-border/30 hover:text-primary"
                                >
                                  <Icon className="h-4 w-4" />
                                  <span className="group-hover:translate-x-1 transition-transform">{translatedName}</span>
                                </button>
                              )
                            })
                          )}
                        </div>
                      </div>
                      
                      {/* Solicitar Serviços */}
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          router.push("/solicitar-servicos")
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer text-foreground border-border/30 hover:border-primary/30 bg-transparent"
                      >
                        <Briefcase className="h-4 w-4" />
                        {t("nav.solicitar_servicos")}
                      </button>
                    </>
                  ) : (
                    // Links normais quando não logado
                    <div className="space-y-1.5">
                      {currentRoute === "home" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsMobileMenuExpanded(!isMobileMenuExpanded)
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 text-primary border-primary/50 bg-transparent cursor-pointer"
                        >
                          <span>{t("nav.inicio")}</span>
                          <ChevronDown 
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isMobileMenuExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <>
                          {/* Mostra o botão selecionado no topo */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsMobileMenuExpanded(!isMobileMenuExpanded)
                            }}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 text-primary border-primary/50 bg-transparent cursor-pointer"
                          >
                            <span>{t(navLinks.find(l => l.route === currentRoute)?.labelKey || "nav.inicio")}</span>
                            <ChevronDown 
                              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                isMobileMenuExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </>
                      )}
                      
                      {/* Expanded Menu Items */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                          isMobileMenuExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {navLinks.filter(link => link.route !== currentRoute).map((link) => (
                          <button
                            key={link.route}
                            onClick={(e) => handleNavClick(e, link.route)}
                            className="flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 group border-2 cursor-pointer text-foreground border-transparent hover:border-border/30 hover:text-primary"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">{t(link.labelKey)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auth Buttons or User Info */}
                  <div className="space-y-1.5 pt-2">
                    {isLoggedIn && userEmail ? (
                      <>
                        <div className="px-3 py-3 rounded-lg border-2 border-border/30 bg-muted/20">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {userName && (
                                <p className="text-sm font-semibold text-foreground truncate mb-0.5">{userName}</p>
                              )}
                              <p className="text-xs font-medium text-foreground truncate">{userEmail}</p>
                              <p className="text-xs text-muted-foreground">{t("nav.usuario_logado")}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsOpen(false)
                              router.push("/editar-perfil")
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer text-foreground border-border/30 hover:border-primary/30 bg-transparent"
                          >
                            <Edit className="h-4 w-4" />
                            {t("nav.editar_perfil") || "Editar perfil"}
                          </button>
                        </div>
                        {/* Painel Administrativo - Separado para melhor visibilidade */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setIsOpen(false)
                              router.push("/admin")
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer text-primary border-primary/50 bg-primary/10"
                          >
                            <Shield className="h-4 w-4" />
                            {t("nav.painel_administrativo")}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleLogout()
                          }}
                          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer text-destructive border-destructive/30 hover:border-destructive/50 bg-transparent"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("nav.desconectar")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            router.push("/login")
                          }}
                          className="flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 border-2 cursor-pointer text-foreground border-border/30 hover:border-primary/30 bg-transparent h-8"
                        >
                          {t("nav.login")}
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            router.push("/cadastro")
                          }}
                          className="flex items-center justify-center w-full px-3 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/70 hover:border-primary/50 border border-primary cursor-pointer h-8"
                        >
                          {t("nav.cadastre_se")}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Controls com Dropdowns */}
                <div className="px-4 pt-3 pb-4 border-t border-border/30 space-y-2 bg-background/50">
                  {/* Language Dropdown */}
                  <div className="space-y-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsLanguageExpanded(!isLanguageExpanded)
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-border/30 hover:border-primary/40 bg-transparent cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">{language === "pt" ? "Português" : "English"}</span>
                          <span className="text-[10px] text-muted-foreground">{language === "pt" ? "Language" : "Idioma"}</span>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          isLanguageExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Expanded Language Options */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                        isLanguageExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setLanguage("pt")
                          setIsLanguageExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          language === "pt"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <span className="text-base mr-2">🇧🇷</span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Português</span>
                          <span className="text-[10px] text-muted-foreground">Portuguese</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("en")
                          setIsLanguageExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          language === "en"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <span className="text-base mr-2">🇺🇸</span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">English</span>
                          <span className="text-[10px] text-muted-foreground">Inglês</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Theme Dropdown */}
                  <div className="space-y-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsThemeExpanded(!isThemeExpanded)
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-border/30 hover:border-primary/40 bg-transparent cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">
                            {theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Sistema"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{language === "pt" ? "Theme" : "Tema"}</span>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          isThemeExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Expanded Theme Options */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 space-y-1.5 pl-3 ${
                        isThemeExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setTheme("light")
                          setIsThemeExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          theme === "light"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-500/30 flex items-center justify-center mr-2">
                          <span className="text-[10px]">☀️</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Claro</span>
                          <span className="text-[10px] text-muted-foreground">Light</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTheme("dark")
                          setIsThemeExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          theme === "dark"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600/30 flex items-center justify-center mr-2">
                          <span className="text-[10px]">🌙</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Escuro</span>
                          <span className="text-[10px] text-muted-foreground">Dark</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTheme("system")
                          setIsThemeExpanded(false)
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded-lg transition-all duration-200 border-2 cursor-pointer ${
                          theme === "system"
                            ? "text-primary border-primary/50 bg-transparent"
                            : "text-foreground border-transparent hover:border-border/30 hover:text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-linear-to-br from-yellow-400 to-slate-700 border border-border/30 flex items-center justify-center mr-2">
                          <span className="text-[10px]">💻</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">Sistema</span>
                          <span className="text-[10px] text-muted-foreground">System</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
