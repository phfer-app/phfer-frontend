# 🤖 Guia Completo: Chatbot de Suporte com Back-end

## 📋 Índice
1. [Estrutura Recomendada](#estrutura-recomendada)
2. [Passo a Passo](#passo-a-passo)
3. [Configuração do Back-end](#configuração-do-back-end)
4. [Integração com Front-end](#integração-com-front-end)
5. [Deploy](#deploy)

---

## 🏗️ Estrutura Recomendada

### Opção 1: Monorepo (Recomendado)
```
phfer/
├── frontend/          # Seu projeto Next.js atual
│   ├── app/
│   ├── components/
│   └── ...
├── backend/           # Novo projeto Node.js/Express
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json       # Root package.json (workspaces)
└── README.md
```

### Opção 2: Repositórios Separados
- `phfer-frontend` (repositório atual)
- `phfer-backend` (novo repositório)

**Recomendação:** Use **Monorepo** para facilitar desenvolvimento e deploy conjunto.

---

## 🚀 Passo a Passo

### **Passo 1: Reorganizar Estrutura do Projeto**

#### 1.1. Criar estrutura de monorepo

```bash
# Na raiz do projeto atual
mkdir backend
mkdir frontend

# Mover arquivos do frontend para a pasta frontend
# (manter apenas backend/ e frontend/ na raiz)
```

#### 1.2. Criar package.json raiz (workspaces)

Crie um `package.json` na raiz com:

```json
{
  "name": "phfer-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=frontend\" \"npm run dev --workspace=backend\"",
    "build": "npm run build --workspace=frontend && npm run build --workspace=backend",
    "install:all": "npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

### **Passo 2: Configurar Back-end**

#### 2.1. Criar projeto Node.js/Express no backend

```bash
cd backend
npm init -y
npm install express cors dotenv axios
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
```

#### 2.2. Estrutura de pastas do backend

```
backend/
├── src/
│   ├── config/
│   │   └── openai.ts          # Configuração OpenAI
│   ├── controllers/
│   │   └── chat.controller.ts # Lógica do chatbot
│   ├── routes/
│   │   └── chat.routes.ts     # Rotas da API
│   ├── services/
│   │   └── knowledge.service.ts # Serviço com conhecimento sobre você
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   └── index.ts               # Entry point
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

#### 2.3. Criar tsconfig.json do backend

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 2.4. Criar package.json do backend

```json
{
  "name": "phfer-backend",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "openai": "^4.20.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

---

### **Passo 3: Implementar Back-end**

#### 3.1. Criar serviço de conhecimento (`src/services/knowledge.service.ts`)

Este arquivo contém todas as informações sobre você que o chatbot usará:

```typescript
export const knowledgeBase = `
Você é um assistente virtual de suporte do portfólio de Pedro, um desenvolvedor de software.

INFORMAÇÕES SOBRE O PEDRO:

Nome: Pedro
Idade: 20 anos
Profissão: Desenvolvedor de Software Júnior na Rakha Tecnologia
Formação: Formação Full-Stack da Rocketseat, cursando Sistemas de Informação

HISTÓRIA:
- 2015-2023: Experiência em comunidades virtuais (Habbo Hotel) - desenvolvimento de sistemas em BBCode, liderança e comunicação
- 2023+: Formação Full-Stack e cursando Sistemas de Informação
- Atualmente: Desenvolvedor de Software Júnior na Rakha Tecnologia

ESPECIALIDADES:
- Desenvolvimento Web Moderno: React, Next.js, TypeScript
- Backend Robusto: Node.js, Express, Bancos de Dados
- Design Responsivo: Tailwind CSS, Acessibilidade
- Performance: Otimização, SEO, UX
- DevOps: Docker, Deploy, CI/CD

TECNOLOGIAS:
Frontend: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS
Backend: Node.js, Express, C#, .NET, Python
Bancos de Dados: PostgreSQL, MySQL, MongoDB
Ferramentas: Git, Docker, Figma

PROJETOS:
1. Portfólio Pessoal - Construído com React, Next.js, TypeScript, Tailwind
2. Loja Virtual Mimo - JavaScript, HTML, CSS, Tailwind, Sass
3. Jogo de Xadrez - Desenvolvido em C# para terminal

CONTATO:
- WhatsApp: Disponível no site
- LinkedIn: @initpedro
- GitHub: @initpedro
- Email: pedro16hf@gmail.com
- Discord: Disponível no site

MISSÃO: "Transformando ideias em soluções digitais inovadoras com foco em experiência do usuário e resultados mensuráveis."

INSTRUÇÕES:
- Seja amigável e profissional
- Responda perguntas sobre Pedro, suas habilidades, projetos e experiência
- Se não souber algo específico, seja honesto e sugira entrar em contato diretamente
- Responda sempre em português brasileiro, a menos que o usuário peça em inglês
- Mantenha respostas concisas mas informativas
`;

export function getKnowledgeBase(): string {
  return knowledgeBase;
}
```

#### 3.2. Configurar OpenAI (`src/config/openai.ts`)

```typescript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const CHAT_MODEL = 'gpt-3.5-turbo'; // ou 'gpt-4' para melhor qualidade
```

#### 3.3. Criar controller (`src/controllers/chat.controller.ts`)

```typescript
import { Request, Response } from 'express';
import { openai, CHAT_MODEL } from '../config/openai';
import { getKnowledgeBase } from '../services/knowledge.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function chatController(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Mensagem é obrigatória' 
      });
    }

    // Construir histórico de conversa
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: getKnowledgeBase()
      },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      'Desculpe, não consegui processar sua mensagem.';

    res.json({
      response: assistantMessage,
      conversationId: req.body.conversationId || Date.now().toString()
    });

  } catch (error: any) {
    console.error('Erro no chat:', error);
    res.status(500).json({ 
      error: 'Erro ao processar mensagem',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

#### 3.4. Criar rotas (`src/routes/chat.routes.ts`)

```typescript
import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = Router();

router.post('/chat', chatController);

export default router;
```

#### 3.5. Criar entry point (`src/index.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
```

#### 3.6. Criar `.env.example` no backend

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sua_chave_aqui
NODE_ENV=development
```

#### 3.7. Criar `.gitignore` no backend

```
node_modules/
dist/
.env
*.log
.DS_Store
```

---

### **Passo 4: Configurar Front-end**

#### 4.1. Criar componente de Chatbot (`components/chatbot.tsx`)

```typescript
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, X, Bot, User } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o assistente virtual do Pedro. Como posso ajudar você hoje?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Suporte</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
```

#### 4.2. Adicionar variável de ambiente no frontend

Crie/atualize `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 4.3. Adicionar componente no layout ou página principal

No `app/layout.tsx` ou onde preferir:

```typescript
import { Chatbot } from "@/components/chatbot"

// ... no return:
<Chatbot />
```

---

### **Passo 5: Configurar Variáveis de Ambiente**

#### 5.1. Obter chave da OpenAI

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Copie a chave

#### 5.2. Criar arquivo `.env` no backend

```bash
cd backend
cp .env.example .env
# Edite o .env e adicione sua chave da OpenAI
```

---

### **Passo 6: Testar Localmente**

#### 6.1. Rodar backend

```bash
cd backend
npm install
npm run dev
```

#### 6.2. Rodar frontend

```bash
cd frontend
npm install
npm run dev
```

#### 6.3. Testar

1. Acesse http://localhost:3000
2. Clique no botão do chatbot
3. Envie uma mensagem de teste

---

## 🚀 Deploy

### Opção 1: Vercel (Frontend) + Railway/Render (Backend)

#### Backend:
1. **Railway** (recomendado): https://railway.app
   - Conecte seu repositório
   - Selecione a pasta `backend`
   - Configure variáveis de ambiente
   - Deploy automático

2. **Render**: https://render.com
   - Crie novo Web Service
   - Conecte repositório
   - Build: `cd backend && npm install && npm run build`
   - Start: `npm start`
   - Configure variáveis de ambiente

#### Frontend:
1. **Vercel**: https://vercel.com
   - Conecte repositório
   - Selecione pasta `frontend`
   - Configure `NEXT_PUBLIC_API_URL` com URL do backend
   - Deploy

### Opção 2: Tudo na Vercel (API Routes)

Você também pode criar API Routes no Next.js (sem backend separado):

```
frontend/app/api/chat/route.ts
```

---

## 📝 Próximos Passos

1. ✅ Adicionar histórico de conversas (localStorage)
2. ✅ Melhorar UI do chatbot
3. ✅ Adicionar suporte a múltiplos idiomas
4. ✅ Implementar rate limiting
5. ✅ Adicionar analytics
6. ✅ Melhorar conhecimento base com mais informações

---

## 🔒 Segurança

- ✅ Nunca exponha chaves de API no frontend
- ✅ Use variáveis de ambiente
- ✅ Implemente rate limiting
- ✅ Valide inputs no backend
- ✅ Use HTTPS em produção

---

## 💡 Alternativas à OpenAI

- **Google Gemini** (gratuito até certo limite)
- **Anthropic Claude**
- **Ollama** (local, gratuito)
- **Hugging Face** (modelos open-source)

---

## 📚 Recursos Úteis

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Express.js Docs](https://expressjs.com/)

---

**Pronto! Agora você tem um chatbot funcional integrado ao seu portfólio! 🎉**

