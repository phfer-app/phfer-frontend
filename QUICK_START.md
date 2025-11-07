# 🚀 Guia Rápido de Integração do Chatbot

## ✅ Checklist de Setup

### 1. Estrutura do Projeto (Monorepo)

Você tem duas opções:

#### Opção A: Manter tudo na raiz (mais simples)
- Manter o projeto atual como está
- Criar pasta `backend/` na raiz
- Adicionar variável `NEXT_PUBLIC_API_URL` no `.env.local`

#### Opção B: Reorganizar em monorepo (recomendado para escalar)
- Criar pasta `frontend/` e mover arquivos atuais
- Criar pasta `backend/` na raiz
- Criar `package.json` raiz com workspaces

---

### 2. Setup do Backend

```bash
# 1. Criar pasta backend (se ainda não existe)
mkdir backend
cd backend

# 2. Copiar arquivos criados para a pasta backend
# (todos os arquivos em backend/ já foram criados)

# 3. Instalar dependências
npm install

# 4. Criar arquivo .env
cp .env.example .env
# Editar .env e adicionar sua chave da OpenAI

# 5. Rodar backend
npm run dev
```

**Obter chave da OpenAI:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma conta (se não tiver)
3. Crie uma nova chave
4. Cole no arquivo `.env`

---

### 3. Setup do Frontend

```bash
# 1. Adicionar variável de ambiente
# Criar/editar .env.local na raiz do projeto frontend:
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# 2. O componente chatbot.tsx já foi criado em components/

# 3. Adicionar ao layout.tsx (veja exemplo abaixo)

# 4. Rodar frontend
npm run dev
```

---

### 4. Integrar Chatbot no Layout

Edite `app/layout.tsx` e adicione o import e componente:

```typescript
// No topo, adicione:
import { Chatbot } from "@/components/chatbot"

// Dentro do return, antes do </NavigationProvider>, adicione:
<Chatbot />
```

**Exemplo completo:**

```typescript
// ... imports existentes
import { Chatbot } from "@/components/chatbot"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AudioProvider>
              <NavigationProvider>
                <Navbar />
                {children}
                <FloatingActions />
                <FloatingRadioPlayer />
                <Chatbot /> {/* 👈 Adicione aqui */}
                <CookieConsent />
                <Footer />
                <Analytics />
              </NavigationProvider>
            </AudioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

### 5. Testar

1. **Backend rodando:**
   ```bash
   cd backend
   npm run dev
   ```
   Deve mostrar: `🚀 Backend rodando na porta 3001`

2. **Frontend rodando:**
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:3000

3. **Testar chatbot:**
   - Clique no botão flutuante do chatbot (canto inferior direito)
   - Digite uma mensagem como: "Quem é o Pedro?"
   - Verifique se recebe resposta

---

## 🔧 Troubleshooting

### Erro: "OPENAI_API_KEY não está definida"
- Verifique se criou o arquivo `.env` no backend
- Verifique se a chave está correta
- Reinicie o servidor backend

### Erro: "CORS policy"
- Verifique se `FRONTEND_URL` no `.env` do backend está correto
- Deve ser: `http://localhost:3000` (sem barra no final)

### Erro: "Failed to fetch"
- Verifique se o backend está rodando
- Verifique se `NEXT_PUBLIC_API_URL` está correto no `.env.local`
- Verifique o console do navegador para mais detalhes

### Chatbot não aparece
- Verifique se importou o componente no layout
- Verifique se não há erros no console
- Verifique se o componente está dentro dos providers necessários

---

## 📝 Próximos Passos

1. ✅ Personalizar mensagens iniciais
2. ✅ Adicionar mais informações ao knowledge base
3. ✅ Melhorar UI/UX do chatbot
4. ✅ Adicionar histórico de conversas (localStorage)
5. ✅ Implementar rate limiting no backend
6. ✅ Fazer deploy

---

## 🚀 Deploy

### Backend (Railway/Render)
1. Conecte repositório
2. Configure variáveis de ambiente
3. Deploy automático

### Frontend (Vercel)
1. Conecte repositório
2. Configure `NEXT_PUBLIC_API_URL` com URL do backend
3. Deploy

---

## 💡 Dicas

- Use `gpt-3.5-turbo` para economizar (mais barato)
- Use `gpt-4` para melhor qualidade (mais caro)
- Monitore uso da API OpenAI no dashboard
- Considere implementar cache para respostas similares
- Adicione rate limiting para evitar abuso

---

**Pronto! Seu chatbot está configurado! 🎉**

