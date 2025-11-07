# Configuração Frontend - Backend URL

## URL do Backend:
https://phfer-backend-production.up.railway.app

## API Endpoint:
https://phfer-backend-production.up.railway.app/api

## Variável de Ambiente:

Crie ou atualize o arquivo `.env.local` na raiz do projeto frontend:

```env
NEXT_PUBLIC_API_URL=https://phfer-backend-production.up.railway.app/api
```

## Após criar o arquivo:

1. Reinicie o servidor de desenvolvimento:
   ```bash
   # Parar (Ctrl+C) e rodar novamente:
   npm run dev
   ```

2. Teste o chatbot na página inicial

## Para Produção (Vercel/Netlify):

Adicione a mesma variável no painel:
- **Nome:** `NEXT_PUBLIC_API_URL`
- **Valor:** `https://phfer-backend-production.up.railway.app/api`

---

**Backend configurado! 🚀**

