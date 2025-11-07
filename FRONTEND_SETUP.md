# Configuração do Frontend - Chatbot Integrado

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Se o backend estiver em outro servidor, ajuste a URL:

```
NEXT_PUBLIC_API_URL=https://seu-backend.com/api
```

## Componentes Criados

- `components/integrated-chatbot.tsx` - Chatbot integrado na hero section
- `components/hero-section.tsx` - Atualizado com o chatbot abaixo dos botões

## Estrutura

O chatbot está integrado diretamente na hero section, abaixo dos botões de ação.

O nome do chatbot é **PedroBot** 🤖

## Funcionalidades

- ✅ Chat integrado na página (não flutuante)
- ✅ Suporte a múltiplos idiomas (PT/EN)
- ✅ Histórico de conversa
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Design responsivo

