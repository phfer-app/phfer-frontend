/**
 * Serviço de Envio de Emails
 * Gerencia o envio de emails em massa e histórico
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface EmailLog {
  id: string
  admin_id: string
  subject: string
  body: string
  recipients: string[]
  status: 'success' | 'failed' | 'partial'
  sent_count: number
  total_count: number
  error_message?: string
  sent_at: string
  created_at: string
}

export interface SendEmailResponse {
  success: boolean
  sentCount: number
  failedCount: number
  message: string
  logId?: string
  error?: string
}

export interface EmailHistoryResponse {
  success: boolean
  logs: EmailLog[]
  total: number
  error?: string
}

/**
 * Envia email em massa
 */
export async function sendBulkEmail(
  subject: string,
  body: string,
  recipients: string[]
): Promise<SendEmailResponse> {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      return {
        success: false,
        sentCount: 0,
        failedCount: recipients.length,
        message: 'Você precisa estar logado',
        error: 'Token não encontrado'
      }
    }

    const response = await fetch(`${API_URL}/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject,
        body,
        recipients
      })
    })

    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        sentCount: 0,
        failedCount: recipients.length,
        message: 'Token expirado',
        error: 'Você foi desconectado'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        sentCount: 0,
        failedCount: recipients.length,
        message: result.message || 'Erro ao enviar emails',
        error: result.error
      }
    }

    return result
  } catch (error: any) {
    console.error('Erro ao enviar emails:', error)
    return {
      success: false,
      sentCount: 0,
      failedCount: recipients.length,
      message: 'Erro ao enviar emails',
      error: error?.message || 'Erro desconhecido'
    }
  }
}

/**
 * Obtém histórico de emails enviados
 */
export async function getEmailHistory(
  limit: number = 50,
  offset: number = 0,
  adminId?: string
): Promise<EmailHistoryResponse> {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      return {
        success: false,
        logs: [],
        total: 0,
        error: 'Você precisa estar logado'
      }
    }

    let url = `${API_URL}/emails/history?limit=${limit}&offset=${offset}`
    if (adminId) {
      url += `&adminId=${adminId}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        logs: [],
        total: 0,
        error: 'Token expirado'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        logs: [],
        total: 0,
        error: result.error
      }
    }

    return result
  } catch (error: any) {
    console.error('Erro ao buscar histórico de emails:', error)
    return {
      success: false,
      logs: [],
      total: 0,
      error: error?.message || 'Erro desconhecido'
    }
  }
}

/**
 * Obtém detalhes de um email log específico
 */
export async function getEmailLog(logId: string): Promise<{ success: boolean; log?: EmailLog; error?: string }> {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/emails/${logId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    if (response.status === 401) {
      const { handleUnauthorized } = await import('@/lib/auth')
      await handleUnauthorized()
      return {
        success: false,
        error: 'Token expirado'
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error
      }
    }

    return result
  } catch (error: any) {
    console.error('Erro ao buscar email log:', error)
    return {
      success: false,
      error: error?.message || 'Erro desconhecido'
    }
  }
}
