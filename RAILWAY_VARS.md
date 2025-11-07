# ✅ Variáveis Configuradas no Railway

## Variáveis Atuais:
- ✅ `CHAT_MODEL` = `gemini-pro`
- ✅ `GEMINI_API_KEY` = `AIzaSyBcDW700UcvhxxOQtFxvzmCsnq2GJte0uA`
- ✅ `NODE_ENV` = `production`

## ⚠️ Variável Faltando (opcional por enquanto):
- ⏳ `FRONTEND_URL` = (adicione quando tiver a URL do frontend)

---

## 🔍 Verificar se está funcionando:

1. **Veja os logs do Railway**
   - Deve aparecer: `🚀 Backend rodando na porta XXXX`
   - Se ainda der erro, veja a mensagem completa

2. **Teste o endpoint de health:**
   ```
   GET https://seu-backend.railway.app/health
   ```
   Deve retornar: `{"status":"ok",...}`

3. **Teste o endpoint do chat:**
   ```
   POST https://seu-backend.railway.app/api/chat
   Body: {"message": "Olá", "conversationHistory": []}
   ```

---

## 📝 Quando tiver a URL do frontend:

Adicione também no Railway:
- `FRONTEND_URL` = `https://sua-url-frontend.com`

Isso é importante para o CORS funcionar corretamente em produção.

---

**Me envie a URL do backend quando estiver funcionando! 🚀**

