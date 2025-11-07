# ✅ Frontend Configurado!

## ✅ Arquivo `.env.local` criado:
```
NEXT_PUBLIC_API_URL=https://phfer-backend-production.up.railway.app/api
```

## 🔗 URLs Configuradas:

- **Backend:** `https://phfer-backend-production.up.railway.app`
- **API:** `https://phfer-backend-production.up.railway.app/api`
- **Health Check:** `https://phfer-backend-production.up.railway.app/health`

---

## 📝 Próximos Passos:

### 1. Reiniciar o servidor de desenvolvimento:
```bash
# Parar o servidor (Ctrl+C) se estiver rodando
# Depois rodar novamente:
npm run dev
```

### 2. Testar o chatbot:
- Acesse: `http://localhost:3000`
- O chatbot deve estar na hero section
- Envie uma mensagem de teste

### 3. Para Produção (Vercel/Netlify):
Quando fizer deploy do frontend, adicione a variável:
- **Nome:** `NEXT_PUBLIC_API_URL`
- **Valor:** `https://phfer-backend-production.up.railway.app/api`

---

## ⚠️ Importante - Configurar CORS no Backend:

No Railway, adicione também a variável `FRONTEND_URL`:
- **Nome:** `FRONTEND_URL`
- **Valor:** `https://sua-url-frontend.com` (quando tiver)

Por enquanto, o backend aceita requisições de `http://localhost:3000` (padrão).

---

**Tudo configurado! Teste e me avise se está funcionando! 🚀**

