/**
 * Serviço de Autenticação
 * Gerencia login, cadastro e tokens
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface User {
  id: string
  email: string
  name: string
  created_at?: string
  is_admin?: boolean
  is_owner?: boolean
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
  error?: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

/**
 * Cadastra um novo usuário
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    // Log para debug
    console.log('Tentando fazer signup em:', `${API_URL}/auth/signup`)
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      // Erro de rede (backend não está rodando ou URL incorreta)
      console.error('Erro de rede ao fazer signup:', error)
      throw new Error(`Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_URL}`)
    })

    // Tentar obter a resposta JSON, mas tratar erro se não for JSON
    let result
    try {
      result = await response.json()
    } catch (error) {
      // Se não for JSON, retornar erro genérico
      return {
        success: false,
        error: `Erro ao criar conta: ${response.status} ${response.statusText}`
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || `Erro ao criar conta: ${response.status}`
      }
    }

    // Salvar token e usuário apenas se o email estiver confirmado
    if (result.token) {
      localStorage.setItem('token', result.token)
    }
    if (result.user) {
      // Garantir que is_admin e is_owner sejam salvos
      const userData = {
        ...result.user,
        is_admin: result.user.is_admin || false,
        is_owner: result.user.is_owner || false
      }
      localStorage.setItem('user', JSON.stringify(userData))
    }

    return result
  } catch (error: any) {
    console.error('Erro no signup:', error)
    
    // Mensagem de erro mais específica
    let errorMessage = 'Erro ao criar conta'
    if (error.message) {
      errorMessage = error.message
    } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
      errorMessage = `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_URL}`
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Faz login de um usuário
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao fazer login'
      }
    }

    // Salvar token e usuário
    if (result.token) {
      localStorage.setItem('token', result.token)
    }
    if (result.user) {
      // Garantir que is_admin e is_owner sejam salvos
      const userData = {
        ...result.user,
        is_admin: result.user.is_admin || false,
        is_owner: result.user.is_owner || false
      }
      localStorage.setItem('user', JSON.stringify(userData))
    }

    return result
  } catch (error: any) {
    console.error('Erro no login:', error)
    return {
      success: false,
      error: error.message || 'Erro ao fazer login'
    }
  }
}

/**
 * Verifica se o token é válido
 */
export async function verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      await handleUnauthorized()
      return { valid: false }
    }

    const result = await response.json()

    if (!response.ok || !result.success) {
      return { valid: false }
    }

    return {
      valid: true,
      user: result.user
    }
  } catch (error) {
    return { valid: false }
  }
}

/**
 * Faz logout
 */
export async function logout(): Promise<void> {
  const token = getToken()
  
  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  // Remover dados do localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * Faz logout automático e redireciona para login quando token expira
 */
export async function handleUnauthorized(): Promise<void> {
  // Remover dados do localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  // Redirecionar para login apenas se estiver no cliente
  if (typeof window !== 'undefined') {
    // Evitar redirecionamento em loop verificando se já não está na página de login
    if (window.location.pathname !== '/login' && window.location.pathname !== '/cadastro') {
      window.location.href = '/login'
    }
  }
}

/**
 * Verifica se a resposta é 401 e faz logout automático
 */
export function checkUnauthorized(response: Response): boolean {
  if (response.status === 401) {
    handleUnauthorized()
    return true
  }
  return false
}

/**
 * Obtém o token do localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

/**
 * Obtém o usuário do localStorage
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return getToken() !== null && getUser() !== null
}

/**
 * Atualiza os dados do usuário no localStorage
 * Útil para atualizar is_admin e is_owner após verificação
 */
export function updateUserData(userData: Partial<User>): void {
  if (typeof window === 'undefined') return
  
  const currentUser = getUser()
  if (currentUser) {
    const updatedUser = {
      ...currentUser,
      ...userData
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }
}

/**
 * Atualiza o status de admin do usuário no localStorage
 */
export async function refreshAdminStatus(): Promise<void> {
  if (typeof window === 'undefined') return
  
  const token = getToken()
  if (!token) return

  try {
    const { checkAdmin } = await import('@/lib/admin')
    const result = await checkAdmin()
    
    if (result.success) {
      updateUserData({
        is_admin: result.isAdmin || false,
        is_owner: result.isOwner || false
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar status de admin:', error)
  }
}

/**
 * Login com Google usando Supabase OAuth
 */
export async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await import('@/lib/supabase')
    
    // Obter a URL atual para redirecionar após o login
    // IMPORTANTE: O Supabase com PKCE precisa do código no hash, não na query string
    // Por isso, vamos redirecionar para /auth/callback que processará o código
    const redirectUrl = `${window.location.origin}/auth/callback`
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Forçar o Supabase a usar hash em vez de query string
        skipBrowserRedirect: false,
      },
    })

    if (error) {
      console.error('Erro ao iniciar login com Google:', error)
      return {
        success: false,
        error: error.message || 'Erro ao fazer login com Google'
      }
    }

    // O redirecionamento será feito automaticamente pelo Supabase
    return {
      success: true
    }
  } catch (error: any) {
    console.error('Erro no login com Google:', error)
    return {
      success: false,
      error: error.message || 'Erro ao fazer login com Google'
    }
  }
}

/**
 * Processa o callback do OAuth e sincroniza com o backend
 */
export async function handleOAuthCallback(): Promise<AuthResponse> {
  try {
    const { supabase } = await import('@/lib/supabase')
    
    // Processar o código OAuth da URL
    // O Supabase com detectSessionInUrl: true e flowType: 'pkce' processa automaticamente
    // Mas precisamos garantir que o código seja processado corretamente
    
    // Verificar se há código na query string
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const code = searchParams?.get('code')
    
    // Se houver código na query string, precisamos mover para o hash
    // O Supabase PKCE processa automaticamente códigos no hash, não na query string
    // O code verifier está armazenado no localStorage e só funciona com hash
    if (code && typeof window !== 'undefined') {
      // Mover o código da query string para o hash
      // O Supabase precisa do código no hash para processar com PKCE
      const newHash = `#code=${code}`
      window.location.hash = newHash
      
      // Remover o código da query string da URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('code')
      window.history.replaceState({}, '', newUrl.pathname + newUrl.search + newHash)
      
      // Aguardar um pouco para o Supabase detectar e processar o hash
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Chamar getSession() para processar a sessão
    // O Supabase vai processar automaticamente o código do hash com PKCE
    // O code verifier será recuperado automaticamente do localStorage
    const { data: sessionData, error: sessionInitError } = await supabase.auth.getSession()
    
    if (sessionInitError) {
      console.error('Erro ao inicializar sessão:', sessionInitError)
      // Se houver erro, pode ser que o code verifier não esteja disponível
      // Tentar novamente após um delay maior
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Aguardar um pouco mais para garantir que a sessão seja processada
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Verificar se há uma sessão no Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return {
        success: false,
        error: 'Não foi possível obter a sessão do Google. Por favor, tente novamente.'
      }
    }

    // Obter informações do usuário do Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        success: false,
        error: 'Não foi possível obter informações do usuário'
      }
    }

    // Sincronizar com o backend
    // Passar o token da sessão do Supabase para o backend usar
    console.log('🔄 Sincronizando com o backend...')
    console.log('  - Supabase User ID:', user.id)
    console.log('  - Email:', user.email)
    console.log('  - Name:', user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário')
    console.log('  - API URL:', API_URL)
    
    const requestBody = {
      supabase_user_id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      access_token: session.access_token, // Passar o token da sessão do Supabase
    }
    
    console.log('📤 Enviando requisição para:', `${API_URL}/auth/google/callback`)
    console.log('📦 Body:', { ...requestBody, access_token: '***' }) // Não logar o token completo
    
    const response = await fetch(`${API_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('📥 Resposta recebida:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro na resposta do servidor:', response.status, errorText)
      await supabase.auth.signOut()
      return {
        success: false,
        error: `Erro ao sincronizar com o servidor: ${response.status} ${response.statusText}`
      }
    }

    const result = await response.json()
    console.log('📦 Resultado do backend:', { ...result, token: result.token ? '***' : null })

    if (!result.success) {
      console.error('❌ Erro no resultado do backend:', result.error)
      // Fazer logout do Supabase se houver erro
      await supabase.auth.signOut()
      return {
        success: false,
        error: result.error || 'Erro ao sincronizar com o servidor'
      }
    }
    
    console.log('✅ Sincronização com o backend concluída com sucesso')

    // Limpar hash e query string da URL
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.pathname
      window.history.replaceState(null, '', cleanUrl)
    }

    // Salvar token e usuário no localStorage
    if (result.token) {
      localStorage.setItem('token', result.token)
      console.log('✅ Token salvo no localStorage')
    } else {
      console.error('❌ Token não recebido do backend')
    }
    
    if (result.user) {
      const userData = {
        ...result.user,
        is_admin: result.user.is_admin || false,
        is_owner: result.user.is_owner || false
      }
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('✅ Usuário salvo no localStorage:', userData)
    } else {
      console.error('❌ Usuário não recebido do backend')
    }

    // Verificar se os dados foram salvos corretamente
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (!savedToken || !savedUser) {
      console.error('❌ Erro ao salvar dados no localStorage')
      return {
        success: false,
        error: 'Erro ao salvar dados de autenticação'
      }
    }

    // NÃO fazer logout do Supabase imediatamente
    // O token JWT do Supabase é válido mesmo sem sessão ativa
    // Fazer logout invalidaria a sessão e o token não funcionaria mais
    // O logout será feito automaticamente quando o token expirar ou quando o usuário fizer logout manualmente
    
    console.log('✅ Login com Google concluído com sucesso')
    return result
  } catch (error: any) {
    console.error('Erro no callback OAuth:', error)
    return {
      success: false,
      error: error.message || 'Erro ao processar login com Google'
    }
  }
}

