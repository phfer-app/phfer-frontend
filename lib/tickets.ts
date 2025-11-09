/**
 * Serviço de Chamados (Tickets)
 * Gerencia criação e busca de chamados
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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
}

export interface TicketComment {
  id: string
  ticket_id: string
  user_id: string
  comment: string
  created_at: string
  user?: {
    name: string
    email: string
  }
}

export interface TicketStatusHistory {
  id: string
  ticket_id: string
  old_status: string
  new_status: string
  changed_by: string
  created_at: string
  user?: {
    name: string
    email: string
  }
}

export interface CreateTicketData {
  titulo: string
  descricao: string
  categoria: string
  prioridade: 'baixa' | 'media' | 'alta'
}

export interface TicketResponse {
  success: boolean
  message?: string
  ticket?: Ticket
  tickets?: Ticket[]
  error?: string
}

/**
 * Cria um novo chamado
 */
export async function createTicket(data: CreateTicketData): Promise<TicketResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para criar um chamado'
      }
    }

    const response = await fetch(`${API_URL}/tickets/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado. Você foi desconectado.'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao criar chamado'
      }
    }

    return {
      success: true,
      message: result.message || 'Chamado criado com sucesso!',
      ticket: result.ticket
    }
  } catch (error: any) {
    console.error('Erro no createTicket:', error)
    return {
      success: false,
      error: error.message || 'Erro ao criar chamado'
    }
  }
}

/**
 * Busca chamados do usuário logado
 */
export async function getUserTickets(): Promise<TicketResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para ver seus chamados'
      }
    }

    const response = await fetch(`${API_URL}/tickets/my-tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado. Você foi desconectado.'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao buscar chamados'
      }
    }

    return {
      success: true,
      tickets: result.tickets || []
    }
  } catch (error: any) {
    console.error('Erro no getUserTickets:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar chamados'
    }
  }
}

/**
 * Busca um chamado específico por ID
 */
export async function getTicketById(ticketId: string): Promise<TicketResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para ver o chamado'
      }
    }

    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado. Você foi desconectado.'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao buscar chamado'
      }
    }

    return {
      success: true,
      ticket: result.ticket
    }
  } catch (error: any) {
    console.error('Erro no getTicketById:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar chamado'
    }
  }
}

/**
 * Adiciona um comentário a um ticket
 */
export async function addTicketComment(ticketId: string, comment: string): Promise<TicketResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para adicionar um comentário'
      }
    }

    const response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado. Você foi desconectado.'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao adicionar comentário'
      }
    }

    return {
      success: true,
      message: result.message || 'Comentário adicionado com sucesso!'
    }
  } catch (error: any) {
    console.error('Erro no addTicketComment:', error)
    return {
      success: false,
      error: error.message || 'Erro ao adicionar comentário'
    }
  }
}

/**
 * Busca comentários de um ticket
 */
export async function getTicketComments(ticketId: string): Promise<{ success: boolean; comments?: TicketComment[]; error?: string }> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para ver os comentários'
      }
    }

    const response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado. Você foi desconectado.'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao buscar comentários'
      }
    }

    return {
      success: true,
      comments: result.comments || []
    }
  } catch (error: any) {
    console.error('Erro no getTicketComments:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar comentários'
    }
  }
}

/**
 * Busca histórico de status de um ticket
 */
export async function getTicketStatusHistory(ticketId: string): Promise<{ success: boolean; history?: TicketStatusHistory[]; error?: string }> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para ver o histórico'
      }
    }

    const response = await fetch(`${API_URL}/tickets/${ticketId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Se for 401, o token expirou - fazer logout automático
    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado. Você foi desconectado.'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erro ao buscar histórico'
      }
    }

    return {
      success: true,
      history: result.history || []
    }
  } catch (error: any) {
    console.error('Erro no getTicketStatusHistory:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar histórico'
    }
  }
}

