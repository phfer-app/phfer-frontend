/**
 * Serviço de Permissões de Workspace
 * Gerencia permissões de acesso a workspaces
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface Workspace {
  id: string
  name: string
  slug: string
  description: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface WorkspacePermissionsResponse {
  success: boolean
  workspaces?: Workspace[]
  permissions?: string[]
  userPermissions?: string[]
  message?: string
  error?: string
}

/**
 * Busca todos os workspaces disponíveis (requer admin)
 */
export async function getWorkspaces(): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/workspaces`, {
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
        error: result.error || 'Erro ao buscar workspaces'
      }
    }

    return {
      success: true,
      workspaces: result.workspaces || []
    }
  } catch (error: any) {
    console.error('Erro no getWorkspaces:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar workspaces'
    }
  }
}

/**
 * Busca permissões de workspace de um usuário específico (requer admin)
 */
export async function getUserWorkspacePermissions(userId: string): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/workspaces/permissions/${userId}`, {
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
        error: result.error || 'Erro ao buscar permissões do usuário'
      }
    }

    return {
      success: true,
      userPermissions: result.permissions || []
    }
  } catch (error: any) {
    console.error('Erro no getUserWorkspacePermissions:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar permissões do usuário'
    }
  }
}

/**
 * Atualiza permissões de workspace de um usuário (requer admin)
 */
export async function updateUserWorkspacePermissions(
  userId: string,
  workspaceIds: string[]
): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const payload = { userId, workspaceIds }
    console.log('📤 Enviando atualização de permissões:', {
      userId,
      workspaceIdsCount: workspaceIds.length,
      workspaceIds
    })

    const response = await fetch(`${API_URL}/admin/workspaces/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    
    console.log('📥 Resposta recebida:', response.status, response.statusText)

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
        error: result.error || 'Erro ao atualizar permissões'
      }
    }

    return {
      success: true,
      message: result.message || 'Permissões atualizadas com sucesso!',
      userPermissions: result.permissions || []
    }
  } catch (error: any) {
    console.error('Erro no updateUserWorkspacePermissions:', error)
    return {
      success: false,
      error: error.message || 'Erro ao atualizar permissões'
    }
  }
}

/**
 * Busca permissões de workspace do usuário logado
 */
export async function getMyWorkspacePermissions(): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/workspace/permissions`, {
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
        error: result.error || 'Erro ao buscar suas permissões'
      }
    }

    return {
      success: true,
      userPermissions: result.permissions || [],
      workspaces: result.workspaces || []
    }
  } catch (error: any) {
    console.error('Erro no getMyWorkspacePermissions:', error)
    return {
      success: false,
      error: error.message || 'Erro ao buscar suas permissões'
    }
  }
}

/**
 * Cria um novo workspace (requer admin)
 */
export async function createWorkspace(
  name: string,
  slug: string,
  description?: string | null
): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, slug, description: description || null }),
    })

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
        error: result.error || 'Erro ao criar workspace'
      }
    }

    return {
      success: true,
      message: result.message || 'Workspace criado com sucesso!',
      workspaces: result.workspace ? [result.workspace] : []
    }
  } catch (error: any) {
    console.error('Erro no createWorkspace:', error)
    return {
      success: false,
      error: error.message || 'Erro ao criar workspace'
    }
  }
}

/**
 * Atualiza um workspace existente (requer admin)
 */
export async function updateWorkspace(
  workspaceId: string,
  name: string,
  slug: string,
  description?: string | null
): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/workspaces/${workspaceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, slug, description: description || null }),
    })

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
        error: result.error || 'Erro ao atualizar workspace'
      }
    }

    return {
      success: true,
      message: result.message || 'Workspace atualizado com sucesso!',
      workspaces: result.workspace ? [result.workspace] : []
    }
  } catch (error: any) {
    console.error('Erro no updateWorkspace:', error)
    return {
      success: false,
      error: error.message || 'Erro ao atualizar workspace'
    }
  }
}

/**
 * Deleta um workspace (requer admin)
 */
export async function deleteWorkspace(workspaceId: string): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

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
        error: result.error || 'Erro ao deletar workspace'
      }
    }

    return {
      success: true,
      message: result.message || 'Workspace deletado com sucesso!'
    }
  } catch (error: any) {
    console.error('Erro no deleteWorkspace:', error)
    return {
      success: false,
      error: error.message || 'Erro ao deletar workspace'
    }
  }
}

/**
 * Inicializa workspaces padrão (requer owner)
 */
export async function initializeWorkspaces(): Promise<WorkspacePermissionsResponse> {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado'
      }
    }

    const response = await fetch(`${API_URL}/admin/workspaces/initialize`, {
      method: 'POST',
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
        error: result.error || 'Erro ao inicializar workspaces'
      }
    }

    return {
      success: true,
      message: result.message || 'Workspaces inicializados com sucesso!'
    }
  } catch (error: any) {
    console.error('Erro no initializeWorkspaces:', error)
    return {
      success: false,
      error: error.message || 'Erro ao inicializar workspaces'
    }
  }
}

