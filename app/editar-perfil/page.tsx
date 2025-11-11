"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, ArrowLeft, Save, Lock, Eye, EyeOff, LogOut, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { isAuthenticated, getUser, logout, getToken } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function EditarPerfilPage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push("/not-found")
      return
    }
    
    const user = getUser()
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [router])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const token = getToken()
      if (!token) {
        throw new Error(t("profile.token_not_found"))
      }

      console.log('🔄 Atualizando perfil...')
      console.log('  - Nome:', name)
      console.log('  - Token:', token ? `${token.substring(0, 20)}...` : 'Não encontrado')
      console.log('  - API URL:', `${API_URL}/auth/update-profile`)

      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      console.log('📥 Resposta recebida:', response.status, response.statusText)

      const result = await response.json()
      console.log('📦 Resultado:', result)

      if (response.ok && result.success) {
        // Atualizar dados do usuário no localStorage
        const user = getUser()
        if (user) {
          const updatedUser = { ...user, name: result.user?.name || name }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }

        toast({
          title: t("profile.success"),
          description: result.message || t("profile.profile_updated"),
        })
      } else {
        const errorMessage = result.error || `Erro ${response.status}: ${response.statusText}`
        console.error('❌ Erro ao atualizar perfil:', errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      toast({
        title: t("profile.error"),
        description: error.message || t("profile.error_update"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError(null)

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("profile.fill_all_fields"))
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(t("profile.password_min_length"))
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("profile.passwords_not_match"))
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError(t("profile.password_same"))
      return
    }

    setIsChangingPassword(true)
    try {
      const token = getToken()
      if (!token) {
        throw new Error(t("profile.token_not_found"))
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: t("profile.success"),
          description: t("profile.password_changed"),
        })
        // Limpar campos
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordError(null)
      } else {
        throw new Error(result.error || t("profile.error_change_password"))
      }
    } catch (error: any) {
      setPasswordError(error.message || t("profile.error_change_password"))
      toast({
        title: t("profile.error"),
        description: error.message || t("profile.error_change_password"),
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleRequestPasswordChangeEmail = async () => {
    try {
      const token = getToken()
      if (!token) {
        throw new Error(t("profile.token_not_found"))
      }

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: t("profile.email_sent"),
          description: t("profile.email_sent_message"),
        })
      } else {
        throw new Error(result.error || t("profile.error_send_email"))
      }
    } catch (error: any) {
      toast({
        title: t("profile.error"),
        description: error.message || t("profile.error_send_email"),
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: t("profile.logout_success"),
        description: t("profile.logout_message"),
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: t("profile.error"),
        description: error.message || t("profile.error_logout"),
        variant: "destructive",
      })
    }
  }

  if (!mounted || !isAuthenticated()) {
    return null
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-[95%] mx-auto px-2 md:px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="cursor-pointer hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("profile.back")}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
              {t("profile.title")}
            </h1>
          </div>
        </div>

        {/* Container único com todas as seções */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-8">
              {/* Informações do Perfil */}
              <div>
                <h2 className="text-lg font-semibold mb-6">{t("profile.profile_info")}</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("profile.name")}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("profile.name_placeholder")}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("profile.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder={t("profile.email_placeholder")}
                      className="h-11"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("profile.email_cannot_change")}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          {t("profile.saving")}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t("profile.save_changes")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Configurações */}
              <div>
                <h2 className="text-lg font-semibold mb-6">{t("profile.settings")}</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t("profile.language")}</Label>
                    <Select value={language} onValueChange={(value: "pt" | "en") => setLanguage(value)}>
                      <SelectTrigger id="language" className="h-11 cursor-pointer w-full">
                        <SelectValue placeholder={t("profile.language_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">
                          🇧🇷 Português
                        </SelectItem>
                        <SelectItem value="en" className="focus:bg-transparent! data-highlighted:bg-transparent! focus:text-primary data-highlighted:text-primary cursor-pointer">
                          🇺🇸 English
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Desconectar */}
              <div>
                <h2 className="text-lg font-semibold mb-6 text-destructive">{t("profile.account")}</h2>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="px-4 py-2 cursor-pointer text-destructive border-destructive/30 hover:border-destructive/50 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("profile.disconnect")}
                </Button>
              </div>
            </div>

            {/* Coluna Direita */}
            <div>
              {/* Alterar Senha */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{t("profile.change_password")}</h2>
                </div>
                <div className="space-y-6">
                  {passwordError && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t("profile.current_password")}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t("profile.current_password_placeholder")}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t("profile.new_password")}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("profile.new_password_placeholder")}
                        className="h-11 pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("profile.confirm_password")}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("profile.confirm_password_placeholder")}
                        className="h-11 pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                      className="px-4 py-2 cursor-pointer"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          {t("profile.changing")}
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          {t("profile.change_password_button")}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRequestPasswordChangeEmail}
                      className="px-4 py-2 cursor-pointer"
                    >
                      {t("profile.send_email_password")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

