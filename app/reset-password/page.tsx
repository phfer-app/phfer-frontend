"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  // Verificar se o usuário já está logado
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated()) {
      router.push("/not-found")
    }
  }, [mounted, router])

  // Verificar se há token no hash da URL (Supabase envia o token no hash)
  useEffect(() => {
    if (mounted) {
      // Lazy import do Supabase para evitar problemas de pré-renderização
      import("@/lib/supabase").then(({ supabase }) => {
        // O Supabase envia o token no hash: #access_token=...&type=recovery
        const hash = window.location.hash
        const hasAccessToken = hash.includes('access_token=')
        const isRecoveryType = hash.includes('type=recovery')
        
        if (hasAccessToken && isRecoveryType) {
          setHasToken(true)
          
          // Processar o hash manualmente para criar a sessão
          // Isso evita problemas de sincronização de tempo
          supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
              console.warn('Aviso ao processar sessão:', error.message)
              // Mesmo com erro, tentamos continuar se houver hash
              if (hash) {
                setHasToken(true)
              }
            } else if (data.session) {
              setHasToken(true)
            }
          })
        } else {
          setError("Token de recuperação não encontrado. Por favor, solicite um novo link de recuperação.")
          setHasToken(false)
        }
      })
    }
  }, [mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validações
    if (!password || !confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (!hasToken) {
      setError("Token de recuperação inválido. Por favor, solicite um novo link.")
      return
    }

    setIsLoading(true)

    try {
      // Lazy import do Supabase
      const { supabase } = await import("@/lib/supabase")
      
      // O Supabase gerencia o reset de senha através do token no hash
      // Processar o hash manualmente para criar a sessão
      const hash = window.location.hash
      
      // Extrair parâmetros do hash
      const accessTokenMatch = hash.match(/access_token=([^&]+)/)
      const refreshTokenMatch = hash.match(/refresh_token=([^&]+)/)
      const expiresAtMatch = hash.match(/expires_at=([^&]+)/)
      
      const accessToken = accessTokenMatch ? decodeURIComponent(accessTokenMatch[1]) : null
      const refreshToken = refreshTokenMatch ? decodeURIComponent(refreshTokenMatch[1]) : null
      const expiresAt = expiresAtMatch ? parseInt(expiresAtMatch[1]) : null
      
      if (!accessToken) {
        throw new Error("Token de recuperação não encontrado. Por favor, solicite um novo link.")
      }

      // Criar sessão manualmente usando o token do hash
      // Isso evita problemas de sincronização de tempo
      // Ignoramos erros de sincronização de tempo e tentamos criar a sessão
      let session = null
      let sessionError = null
      
      try {
        const result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        })
        session = result.data.session
        sessionError = result.error
        
        // Se houver erro relacionado a sincronização de tempo, ignoramos
        if (sessionError && (sessionError.message?.includes('future') || sessionError.message?.includes('clock'))) {
          console.warn('Aviso de sincronização de tempo ignorado:', sessionError.message)
          sessionError = null
          // Tentamos obter a sessão novamente
          const retry = await supabase.auth.getSession()
          session = retry.data.session
        }
      } catch (err: any) {
        console.warn('Erro ao criar sessão:', err.message)
        // Mesmo com erro, tentamos atualizar a senha diretamente
      }
      
      if (sessionError && !sessionError.message?.includes('future') && !sessionError.message?.includes('clock')) {
        console.warn('Erro ao criar sessão:', sessionError.message)
      }

      // Atualizar a senha usando o Supabase
      // O Supabase usa a sessão atual (criada pelo token no hash) para autenticar
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        console.error('Erro ao redefinir senha:', updateError)
        throw new Error(
          updateError.message === 'Invalid token' || updateError.message === 'JWT expired'
            ? 'Token inválido ou expirado. Por favor, solicite um novo link de recuperação.'
            : updateError.message || 'Erro ao redefinir senha'
        )
      }

      if (!updateData.user) {
        throw new Error('Erro ao redefinir senha')
      }

      // Fazer logout para limpar a sessão temporária
      await supabase.auth.signOut()

      setIsSuccess(true)
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi redefinida com sucesso. Você pode fazer login agora.",
      })
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha. Tente novamente.")
      toast({
        title: "Erro ao redefinir senha",
        description: err.message || "Erro ao redefinir senha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Não renderizar se ainda não montou
  if (!mounted) {
    return null
  }

  // Verificar se está logado apenas APÓS montar no cliente
  if (isAuthenticated()) {
    return null
  }

  if (isSuccess) {
    return (
      <main className="relative min-h-screen flex overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        </div>

        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Senha redefinida!</h1>
                <p className="text-muted-foreground">
                  Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      </div>

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Redefinir Senha</h1>
              <p className="text-muted-foreground">
                Digite sua nova senha abaixo
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || !hasToken}
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading || !hasToken}
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !hasToken}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Redefinindo...</span>
                  </>
                ) : (
                  <>
                    Redefinir Senha
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Voltar para login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

