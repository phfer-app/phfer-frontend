/**
 * Serviço de Administração
 * Gerencia funcionalidades administrativas
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface Admin {
  id: string
  user_id: string
  is_owner: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  email_verified?: boolean
  created_at: string
  updated_at?: string
}

export interface Ticket {
  id: string
  user_id: string
  titulo: string
  descricao: string
  categoria: string
  prioridade: 'baixa' | 'media' | 'alta'
  status: 'aberto' | 'visto' | 'em_andamento' | 'resolvido' | 'fechado'
  created_at: string
  updated_at: string
  user?: {
    email: string
    name: string
  }
}

export interface AdminResponse {
  success: boolean
  isAdmin?: boolean
  isOwner?: boolean
  admins?: Admin[]
  users?: User[]
  tickets?: Ticket[]
  message?: string
  error?: string
}

/**
 * Verifica se o usuário é administrador
 */
export async function checkAdmin(): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        isAdmin: false,
        isOwner: false,
        error: 'Você precisa estar logado'
      }
    }

    let response
    try {
      response = await fetch(`${API_URL}/admin/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (fetchError: any) {
      // Erro de rede (backend não está rodando ou URL incorreta)
      console.error('Erro de rede ao verificar admin:', fetchError)
      return {
        success: false,
        isAdmin: false,
        isOwner: false,
        error: `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_URL}`
      }
    }

    // Se for 401, o token pode estar inválido ou expirado
    if (response.status === 401) {
      // Não é um erro crítico, apenas retorna false
      return {
        success: false,
        isAdmin: false,
        isOwner: false,
        error: 'Token inválido ou expirado'
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro ao verificar permissões' }))
      return {
        success: false,
        isAdmin: false,
        isOwner: false,
        error: errorData.error || 'Erro ao verificar permissões'
      }
    }

    const result = await response.json()

    return {
      success: true,
      isAdmin: result.isAdmin || false,
      isOwner: result.isOwner || false
    }
  } catch (error: any) {
    console.error('Erro no checkAdmin:', error)
    
    // Se for erro de rede, verificar se o backend está rodando
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      return {
        success: false,
        isAdmin: false,
        isOwner: false,
        error: `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_URL}`
      }
    }
    
    return {
      success: false,
      isAdmin: false,
      isOwner: false,
      error: error.message || 'Erro ao verificar permissões'
    }
  }
}

/**
 * Busca todos os administradores
 */
export async function getAdmins(): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/admins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao buscar administradores'
      }
    }

    return {
      success: true,
      admins: result.admins || []
    }
  } catch (error: any) {
    console.error('Erro no getAdmins:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar administradores'
    }
  }
}

/**
 * Adiciona um novo administrador
 */
export async function addAdmin(userId: string): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/admins/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao adicionar administrador'
      }
    }

    return {
      success: true,
      message: result.message || 'Administrador adicionado com sucesso!',
      admin: result.admin
    }
  } catch (error: any) {
    console.error('Erro no addAdmin:', error)
    return {
      success: false,
      error: error.message || 'Erro ao adicionar administrador'
    }
  }
}

/**
 * Remove um administrador
 */
export async function removeAdmin(userId: string): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/admins/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao remover administrador'
      }
    }

    return {
      success: true,
      message: result.message || 'Administrador removido com sucesso!'
    }
  } catch (error: any) {
    console.error('Erro no removeAdmin:', error)
    return {
      success: false,
      error: error.message || 'Erro ao remover administrador'
    }
  }
}

/**
 * Busca todos os usuários
 */
export async function getUsers(): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao buscar usuários'
      }
    }

    return {
      success: true,
      users: result.users || []
    }
  } catch (error: any) {
    console.error('Erro no getUsers:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar usuários'
    }
  }
}

/**
 * Busca todos os tickets
 */
export async function getTickets(): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Erro na resposta do servidor:', result)
      return {
        success: false,
        error: result.error || 'Erro ao buscar tickets'
      }
    }

    console.log('Tickets recebidos do servidor:', result.tickets?.length || 0)

    return {
      success: true,
      tickets: result.tickets || []
    }
  } catch (error: any) {
    console.error('Erro no getTickets:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar tickets'
    }
  }
}

/**
 * Atualiza um ticket (apenas para administradores)
 */
export async function updateTicket(ticketId: string, data: { status?: string; prioridade?: string }): Promise<AdminResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao atualizar ticket'
      }
    }

    return {
      success: true,
      message: result.message || 'Ticket atualizado com sucesso!',
      ticket: result.ticket
    }
  } catch (error: any) {
    console.error('Erro no updateTicket:', error)
    return {
      success: false,
      error: error.message || 'Erro ao atualizar ticket'
    }
  }
}

