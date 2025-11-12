"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { Checkbox } from "@/components/ui/checkbox"
import { signup, isAuthenticated, loginWithGoogle } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
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
    
    if (password !== confirmPassword) {
      setError(t("auth.signup.passwords_not_match_error"))
      toast({
        title: t("auth.signup.error"),
        description: t("auth.signup.passwords_not_match_error"),
        variant: "destructive",
      })
      return
    }

    if (!acceptedTerms) {
      setError(t("auth.signup.terms_required_error"))
      toast({
        title: t("auth.signup.error"),
        description: t("auth.signup.terms_required_error"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signup({ name, email, password })
      
      if (result.success) {
        // Se não tiver token, significa que o email não foi confirmado
        if (!result.token) {
          toast({
            title: t("auth.signup.account_created"),
            description: result.message || t("auth.signup.account_created_email"),
          })
        } else {
          toast({
            title: t("auth.signup.account_created"),
            description: result.message || t("auth.signup.account_created_success"),
          })
        }
        
        // Redirecionar para login após cadastro bem-sucedido
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.error || t("auth.signup.create_error"))
        toast({
          title: t("auth.signup.error"),
          description: result.error || t("auth.signup.create_error"),
          variant: "destructive",
        })
      }
    } catch (err: any) {
      setError(err.message || t("auth.signup.create_error"))
      toast({
        title: t("auth.signup.error"),
        description: err.message || t("auth.signup.create_error"),
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
        setError(result.error || t("auth.signup.google_error"))
        toast({
          title: t("auth.signup.error"),
          description: result.error || t("auth.signup.google_error"),
          variant: "destructive",
        })
      }
      // Se sucesso, o redirecionamento será feito automaticamente pelo Supabase
    } catch (err: any) {
      setError(err.message || t("auth.signup.google_error"))
      toast({
        title: t("auth.signup.error"),
        description: err.message || t("auth.signup.google_error"),
        variant: "destructive",
      })
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 1, label: t("auth.signup.password_strength.weak") }
    if (password.length < 8) return { strength: 2, label: t("auth.signup.password_strength.medium") }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: t("auth.signup.password_strength.strong") }
    }
    return { strength: 2, label: t("auth.signup.password_strength.medium") }
  }

  const strength = passwordStrength()

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


      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen relative z-10">
        {/* Left Side - Image Background */}
        <div className="hidden lg:block relative overflow-hidden">
          <img 
            src="https://i.ibb.co/s9gxLhPj/cadastro-banner.jpg" 
            alt="Cadastro Banner" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center px-4 md:px-8 py-12" style={{ backgroundColor: '#141414' }}>
          <div className="w-full max-w-md space-y-6">

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {t("auth.signup.title")}
              </h1>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle || isLoading}
              variant="outline"
              className="w-full h-11 border-2 border-border/50 hover:border-primary/50 transition-all cursor-pointer"
            >
              {isLoadingGoogle ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  {t("auth.signup.connecting")}
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
                  {t("auth.signup.continue_google")}
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-muted-foreground" style={{ backgroundColor: '#141414' }}>
                  {t("auth.signup.or")}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t("auth.signup.name")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("auth.signup.email")}
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
                  {t("auth.signup.password")}
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
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1.5">
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength.strength >= 1
                            ? strength.strength === 1
                              ? "bg-destructive"
                              : strength.strength === 2
                              ? "bg-secondary"
                              : "bg-secondary"
                            : "bg-muted"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength.strength >= 2
                            ? strength.strength === 2
                              ? "bg-secondary"
                              : "bg-secondary"
                            : "bg-muted"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          strength.strength >= 3 ? "bg-secondary" : "bg-muted"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {strength.label && `${t("auth.signup.password_strength.label")}${strength.label}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t("auth.signup.confirm_password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-destructive">
                    {t("auth.signup.passwords_not_match")}
                  </p>
                )}
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <p className="text-xs text-secondary flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {t("auth.signup.passwords_match")}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-1 cursor-pointer"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal cursor-pointer leading-relaxed"
                >
                  {t("auth.signup.terms")}{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline"
                  >
                    {t("auth.signup.terms_link")}
                  </Link>{" "}
                  {t("auth.signup.and")}{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    {t("auth.signup.privacy_link")}
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-linear-to-r from-primary to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 cursor-pointer"
                disabled={isLoading || !acceptedTerms}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t("auth.signup.submit")}...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("auth.signup.submit")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Login Card */}
              <Link
                href="/login"
                className="block group"
              >
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:border-primary/50 border border-transparent">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">
                          {t("auth.signup.has_account")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("auth.signup.login")}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

