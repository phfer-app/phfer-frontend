"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

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
    if (isAuthenticated()) {
      router.push("/not-found")
    }
  }, [router])

  // Verificar se há token no hash da URL (Supabase envia o token no hash)
  useEffect(() => {
    if (mounted) {
      // O Supabase envia o token no hash: #access_token=...&type=recovery
      const hash = window.location.hash
      const hasAccessToken = hash.includes('access_token=')
      const isRecoveryType = hash.includes('type=recovery')
      
      if (hasAccessToken && isRecoveryType) {
        setHasToken(true)
        // O Supabase processa automaticamente o hash quando detectSessionInUrl está true
        // Não precisamos extrair o token manualmente
      } else {
        setError("Token de recuperação não encontrado. Por favor, solicite um novo link de recuperação.")
        setHasToken(false)
      }
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
      // O Supabase gerencia o reset de senha através do token no hash
      // Quando o usuário acessa o link, o Supabase processa automaticamente o hash
      // e cria uma sessão temporária. Podemos usar updateUser para atualizar a senha.
      
      // Verificar se há uma sessão válida (criada pelo token no hash)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error("Token inválido ou expirado. Por favor, solicite um novo link de recuperação.")
      }

      // Atualizar a senha usando o Supabase
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

  // Não renderizar se ainda não montou ou se está logado
  if (!mounted || isAuthenticated()) {
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
                disabled={isLoading || !token}
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

