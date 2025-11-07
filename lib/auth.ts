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

