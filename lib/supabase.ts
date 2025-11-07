import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas no frontend!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Não persistir sessão para reset de senha
    detectSessionInUrl: false, // Processar manualmente para evitar problemas de sincronização
    flowType: 'pkce'
  }
})

