# 🔍 Debug - Erro 500 no Backend

## Erro Identificado:
- **Status:** 500 (Internal Server Error)
- **Endpoint:** `/api/chat`
- **Problema:** Backend está recebendo a requisição mas falhando ao processar

---

## 🔍 O que verificar:

### 1. Logs do Railway:
Acesse os logs do Railway e procure por:
- Erros relacionados ao Gemini
- Erros de autenticação
- Stack traces completos

### 2. Possíveis causas:

#### A) Modelo Gemini incorreto
- Verificar se `gemini-1.5-flash` está disponível
- Tentar `gemini-1.5-pro` ou `gemini-pro`

#### B) Chave da API inválida
- Verificar se a chave está correta
- Verificar se a chave tem permissões

#### C) Erro na chamada da API
- Verificar se há rate limits
- Verificar se há problemas de rede

---

## ✅ O que foi feito:

1. ✅ Melhorado tratamento de erros no middleware
2. ✅ Logs mais detalhados no backend
3. ✅ Frontend mostra mais informações de erro

---

## 📝 Próximos passos:

1. **Verificar logs do Railway** - Veja o erro completo
2. **Testar modelo alternativo** - Se necessário
3. **Verificar chave da API** - Se necessário

---

**Me envie os logs completos do Railway para identificar o problema! 🔍**

