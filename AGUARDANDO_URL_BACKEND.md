# 🚀 Configuração Frontend - Aguardando URL do Backend

## ⏳ Quando você tiver a URL do backend:

### 1. Criar arquivo `.env.local` na raiz do projeto frontend:

```env
NEXT_PUBLIC_API_URL=https://sua-url-backend.com/api
```

**Exemplo:**
- Se backend for Railway: `NEXT_PUBLIC_API_URL=https://phfer-backend.railway.app/api`
- Se backend for Render: `NEXT_PUBLIC_API_URL=https://phfer-backend.onrender.com/api`
- Se backend for outro: `NEXT_PUBLIC_API_URL=https://seu-dominio.com/api`

### 2. Reiniciar o servidor de desenvolvimento:

```bash
# Parar o servidor (Ctrl+C)
# Depois rodar novamente:
npm run dev
```

### 3. Para produção (Vercel/Netlify):

Adicione a variável de ambiente no painel:
- **Nome:** `NEXT_PUBLIC_API_URL`
- **Valor:** `https://sua-url-backend.com/api`

---

## ✅ Checklist Backend para Deploy:

Certifique-se de configurar estas variáveis no seu serviço de deploy:

- [ ] `PORT` (geralmente automático, mas pode definir)
- [ ] `FRONTEND_URL` = URL do seu frontend em produção
- [ ] `GEMINI_API_KEY` = `AIzaSyBcDW700UcvhxxOQtFxvzmCsnq2GJte0uA`
- [ ] `CHAT_MODEL` = `gemini-pro`
- [ ] `NODE_ENV` = `production`

---

## 🔗 Onde a URL será usada:

A URL do backend será usada em:
- `components/integrated-chatbot.tsx` (linha 10)
- Variável: `NEXT_PUBLIC_API_URL`

---

**Quando tiver a URL, me avise que eu atualizo tudo! 🎯**

