"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, LogIn, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { Checkbox } from "@/components/ui/checkbox"
import { login, isAuthenticated, loginWithGoogle } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const result = await login({ email, password })
      
      if (result.success && result.token) {
        toast({
          title: t("auth.login.submit"),
          description: result.message || "Login realizado com sucesso!",
        })
        
        // Redirecionar após login bem-sucedido
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setError(result.error || "Erro ao fazer login")
        toast({
          title: "Erro",
          description: result.error || "Erro ao fazer login",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
      toast({
        title: "Erro",
        description: err.message || "Erro ao fazer login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true)
    setError(null)
    
    try {
      const result = await loginWithGoogle()
      
      if (!result.success) {
        setError(result.error || "Erro ao fazer login com Google")
        toast({
          title: "Erro",
          description: result.error || "Erro ao fazer login com Google",
          variant: "destructive",
        })
      }
      // Se sucesso, o redirecionamento será feito automaticamente pelo Supabase
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google")
      toast({
        title: "Erro",
        description: err.message || "Erro ao fazer login com Google",
        variant: "destructive",
      })
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  // Não renderizar se ainda não montou ou se está logado
  if (!mounted || isAuthenticated()) {
    return null
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-primary/12 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-24 h-24 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-primary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen relative z-10">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex flex-col items-center justify-center px-8 xl:px-16 py-12 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
          
          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative z-10 max-w-md space-y-8 text-center">
            {/* Animated Icon */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer ring animation - ping effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-4 rounded-full bg-primary/10 animate-pulse" style={{ animationDuration: '2s' }} />
                
                {/* Icon container with gradient and border */}
                <div className="relative w-36 h-36 rounded-full bg-linear-to-br from-primary/30 via-primary/15 to-secondary/20 border-4 border-primary/40 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform hover:scale-105">
                  <div className="relative animate-bounce" style={{ animationDuration: '3s', animationTimingFunction: 'ease-in-out' }}>
                    {/* Main icon */}
                    <LogIn className="w-20 h-20 text-primary" />
                    {/* Sparkles around icon */}
                    <Sparkles className="absolute -top-3 -right-3 w-7 h-7 text-primary/70 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
                    <Sparkles className="absolute -bottom-3 -left-3 w-6 h-6 text-secondary/70 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
                    <Sparkles className="absolute top-0 -left-4 w-5 h-5 text-primary/50 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
                    <Sparkles className="absolute -top-4 left-0 w-5 h-5 text-secondary/50 animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '2.3s' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                Bem-vindo de volta! 👋
              </h1>
              <p className="text-xl xl:text-2xl text-muted-foreground font-medium">
                Vamos logar?
              </p>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                Entre para continuar sua jornada conosco.
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center gap-4 pt-4">
              <div className="w-12 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-8 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-12 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center px-4 md:px-8 py-12 lg:bg-card/30 lg:backdrop-blur-sm">
          <div className="w-full max-w-md">
            {/* Mobile Title */}
            <div className="lg:hidden text-center mb-8 space-y-2">
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {t("auth.login.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.login.subtitle")}
              </p>
            </div>

            {/* Card */}
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 space-y-6">

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("auth.login.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("auth.login.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t("auth.login.remember")}
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t("auth.login.forgot")}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t("auth.login.submit")}...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("auth.login.submit")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t("auth.login.or")}
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle || isLoading}
              variant="outline"
              className="w-full h-11 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
            >
              {isLoadingGoogle ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Conectando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar com Google
                </span>
              )}
            </Button>

            {/* Sign Up Card */}
            <div className="space-y-4">
              <Link
                href="/cadastro"
                className="block group"
              >
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">
                          {t("auth.login.no_account")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("auth.login.signup")}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                ← {t("auth.login.back")}
              </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

