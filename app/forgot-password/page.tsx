"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
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
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSuccess(true)
        toast({
          title: t("auth.forgot.success"),
          description: result.message || t("auth.forgot.success_message"),
        })
      } else {
        setError(result.error || t("auth.forgot.error_message"))
        toast({
          title: t("auth.forgot.error"),
          description: result.error || t("auth.forgot.error_message"),
          variant: "destructive",
        })
      }
    } catch (err: any) {
      setError(err.message || t("auth.forgot.error_message"))
      toast({
        title: t("auth.forgot.error"),
        description: err.message || t("auth.forgot.error_message"),
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

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-primary/12 rounded-full blur-3xl opacity-50" />
      </div>


      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen relative z-10">
        {/* Left Side - Title & Description */}
        <div className="hidden lg:flex flex-col items-center justify-center px-8 xl:px-16 py-12">
          <div className="max-w-md space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                {t("auth.forgot.title")}
              </h1>
              <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
                {t("auth.forgot.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center px-4 md:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Title */}
            <div className="lg:hidden text-center mb-8 space-y-2">
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {t("auth.forgot.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.forgot.subtitle")}
              </p>
            </div>

            {/* Card */}
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 space-y-6">
              {isSuccess ? (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {t("auth.forgot.success")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("auth.forgot.success_message")}
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("auth.forgot.back_to_login")}
                  </Link>
                </div>
              ) : (
                <>
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
                        {t("auth.forgot.email")}
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

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          {t("auth.forgot.submit")}...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t("auth.forgot.submit")}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Back to Login */}
                  <div className="pt-4 border-t border-border/50">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("auth.forgot.back_to_login")}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

