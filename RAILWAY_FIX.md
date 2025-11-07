# 🚨 Erro Railway - Configurar Variáveis de Ambiente

## ❌ Erro:
```
Error: GEMINI_API_KEY não está definida no arquivo .env
```

## ✅ Solução: Configurar Variáveis no Railway

### Passo a Passo:

1. **Acesse seu projeto no Railway**
   - Vá para: https://railway.app
   - Clique no seu projeto `phfer-backend`

2. **Vá em "Variables" ou "Variables"**
   - No menu lateral, clique em **Variables** ou **Environment Variables**

3. **Adicione as seguintes variáveis:**

   | Nome | Valor |
   |------|-------|
   | `GEMINI_API_KEY` | `AIzaSyBcDW700UcvhxxOQtFxvzmCsnq2GJte0uA` |
   | `FRONTEND_URL` | `https://sua-url-frontend.com` (ou `http://localhost:3000` para testar) |
   | `CHAT_MODEL` | `gemini-pro` |
   | `NODE_ENV` | `production` |
   | `PORT` | (deixe vazio, Railway define automaticamente) |

4. **Clique em "Add" ou "Save"** para cada variável

5. **Redeploy**
   - Railway deve fazer redeploy automaticamente
   - Ou clique em **Deploy** > **Redeploy**

---

## 📝 Variáveis Necessárias:

### Obrigatórias:
- ✅ `GEMINI_API_KEY` = `AIzaSyBcDW700UcvhxxOQtFxvzmCsnq2GJte0uA`

### Recomendadas:
- ✅ `FRONTEND_URL` = URL do seu frontend (ex: `https://phfer.vercel.app`)
- ✅ `CHAT_MODEL` = `gemini-pro`
- ✅ `NODE_ENV` = `production`

### Opcionais:
- `PORT` = Railway define automaticamente

---

## 🔍 Verificar se funcionou:

Após configurar e fazer redeploy, verifique:

1. **Logs do Railway** devem mostrar:
   ```
   🚀 Backend rodando na porta XXXX
   📡 Frontend configurado para: ...
   🌍 Ambiente: production
   ```

2. **Teste o endpoint:**
   ```
   GET https://seu-backend.railway.app/health
   ```
   Deve retornar: `{"status":"ok",...}`

---

## 💡 Dica Railway:

- Railway expõe variáveis de ambiente automaticamente
- Não precisa criar arquivo `.env` manualmente
- Variáveis são seguras e não aparecem nos logs

---

**Depois de configurar, me avise a URL do backend! 🚀**

