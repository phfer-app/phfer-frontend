"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { handleOAuthCallback } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('🔄 Iniciando processamento do callback OAuth...')
        const result = await handleOAuthCallback()
        console.log('📦 Resultado do callback:', result)

        if (result.success) {
          setStatus("success")
          toast({
            title: "Login realizado!",
            description: "Login com Google realizado com sucesso!",
          })

          // Verificar se os dados foram salvos corretamente antes de redirecionar
          const savedToken = localStorage.getItem('token')
          const savedUser = localStorage.getItem('user')
          
          console.log('🔍 Verificando dados salvos:')
          console.log('  - Token:', savedToken ? '✅ Salvo' : '❌ Não encontrado')
          console.log('  - Usuário:', savedUser ? '✅ Salvo' : '❌ Não encontrado')
          
          if (!savedToken || !savedUser) {
            console.error('❌ Erro: Dados não foram salvos corretamente!')
            setStatus("error")
            setError("Erro ao salvar dados de autenticação. Por favor, tente novamente.")
            toast({
              title: "Erro",
              description: "Erro ao salvar dados de autenticação. Por favor, tente novamente.",
              variant: "destructive",
            })
            return
          }

          // Aguardar mais tempo para garantir que o usuário possa ver o sucesso
          // e para que possamos verificar se há erros no console
          console.log('✅ Login concluído com sucesso! Redirecionando em 3 segundos...')
          setTimeout(() => {
            console.log('🔄 Redirecionando para a home...')
            // Redirecionar para a home e forçar reload para atualizar o estado
            window.location.href = "/"
          }, 3000) // Aumentado para 3 segundos
        } else {
          console.error('❌ Erro no callback:', result.error)
          setStatus("error")
          setError(result.error || "Erro ao fazer login com Google")
          toast({
            title: "Erro",
            description: result.error || "Erro ao fazer login com Google",
            variant: "destructive",
          })

          // Redirecionar para login após 5 segundos (mais tempo para ver o erro)
          setTimeout(() => {
            router.push("/login")
          }, 5000)
        }
      } catch (err: any) {
        console.error('❌ Erro ao processar callback:', err)
        console.error('  - Mensagem:', err.message)
        console.error('  - Stack:', err.stack)
        setStatus("error")
        setError(err.message || "Erro ao processar login com Google")
        toast({
          title: "Erro",
          description: err.message || "Erro ao processar login com Google",
          variant: "destructive",
        })

        // Redirecionar para login após 5 segundos (mais tempo para ver o erro)
        setTimeout(() => {
          router.push("/login")
        }, 5000)
      }
    }

    processCallback()
  }, [router, toast])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-12 relative z-10">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 text-center space-y-6">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Processando login...</h2>
                <p className="text-muted-foreground">
                  Aguarde enquanto processamos seu login com Google.
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Login realizado com sucesso!
                </h2>
                <p className="text-muted-foreground">
                  Redirecionando...
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Erro ao fazer login
                </h2>
                <p className="text-muted-foreground">
                  {error || "Ocorreu um erro ao processar seu login."}
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecionando para a página de login...
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

