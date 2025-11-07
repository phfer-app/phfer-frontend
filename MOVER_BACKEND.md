# 🚀 Como Mover Backend para Repositório Separado

## 📋 Pré-requisitos

- ✅ Repositório do backend já criado no GitHub
- ✅ Backend funcionando localmente
- ✅ Git instalado

---

## 🎯 Método 1: Push Direto (Repositório Novo/Vazio)

Se o repositório do backend está **vazio** ou **recém-criado**:

### Passo a Passo:

```bash
# 1. Navegue até a pasta backend
cd backend

# 2. Inicialize Git (se ainda não foi feito)
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o primeiro commit
git commit -m "Initial commit: Backend do chatbot com Gemini Pro"

# 5. Adicione o remote do seu repositório do backend
git remote add origin https://github.com/sua-organizacao/phfer-backend.git
# OU se usar SSH:
# git remote add origin git@github.com:sua-organizacao/phfer-backend.git

# 6. Verifique o remote
git remote -v

# 7. Faça push para o repositório
git push -u origin main
# Se sua branch padrão for 'master', use:
# git push -u origin master
```

---

## 🎯 Método 2: Repositório Já Existe com Conteúdo

Se o repositório do backend **já tem algum conteúdo**:

### Opção A: Forçar Push (substitui tudo)

```bash
cd backend

# Se já tem git inicializado, remova o remote antigo (se houver)
git remote remove origin 2>/dev/null || true

# Adicione o novo remote
git remote add origin https://github.com/sua-organizacao/phfer-backend.git

# Force push (CUIDADO: isso substitui tudo no repositório remoto)
git push -u origin main --force
```

### Opção B: Merge com Conteúdo Existente

```bash
cd backend

# Adicione o remote
git remote add origin https://github.com/sua-organizacao/phfer-backend.git

# Faça fetch do conteúdo remoto
git fetch origin

# Faça merge (pode precisar resolver conflitos)
git merge origin/main --allow-unrelated-histories

# Resolva conflitos se houver, depois:
git add .
git commit -m "Merge: Backend do chatbot integrado"

# Faça push
git push origin main
```

---

## 📁 Estrutura do Backend para Enviar

Certifique-se de que estes arquivos estão na pasta `backend/`:

```
backend/
├── src/
│   ├── config/
│   │   └── gemini.ts
│   ├── controllers/
│   │   └── chat.controller.ts
│   ├── routes/
│   │   └── chat.routes.ts
│   ├── services/
│   │   └── knowledge.service.ts
│   └── index.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── SETUP.md
```

**⚠️ NÃO envie:**
- `node_modules/` (já está no .gitignore)
- `.env` (já está no .gitignore)
- `dist/` (já está no .gitignore)

---

## 🔧 Criar .gitignore (se não existir)

Se o `.gitignore` não existir, crie um:

```bash
cd backend
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
EOF
```

---

## 📝 Criar README.md no Backend (se não existir)

Crie um README.md profissional para o repositório:

```bash
cd backend
```

Ou use o arquivo `backend/README.md` que já criamos!

---

## ✅ Verificação Final

Após fazer push, verifique:

1. ✅ Acesse o repositório no GitHub
2. ✅ Confirme que todos os arquivos estão lá
3. ✅ Verifique se `.env` NÃO está no repositório
4. ✅ Teste clonar em outro lugar para garantir:

```bash
# Em outro diretório
git clone https://github.com/sua-organizacao/phfer-backend.git
cd phfer-backend
npm install
# Criar .env com suas chaves
npm run dev
```

---

## 🔗 Atualizar Frontend

Após mover o backend, você pode precisar atualizar:

1. **Variáveis de ambiente do frontend** (se mudar a URL)
2. **Documentação** que referencia o backend
3. **README.md** do projeto principal

---

## 🚀 Deploy do Backend

Quando for fazer deploy do backend:

### Railway:
1. Conecte o repositório `phfer-backend`
2. Configure variáveis de ambiente:
   - `GEMINI_API_KEY`
   - `PORT`
   - `FRONTEND_URL`
3. Deploy automático!

### Render:
1. Crie novo Web Service
2. Conecte `phfer-backend`
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Configure variáveis de ambiente

### Vercel (API Routes):
- Você pode usar Vercel também, mas precisa ajustar para serverless functions

---

## 📋 Checklist Completo

- [ ] Repositório do backend criado no GitHub
- [ ] Pasta `backend/` com todos os arquivos
- [ ] `.gitignore` configurado
- [ ] `README.md` criado
- [ ] Git inicializado na pasta backend
- [ ] Remote adicionado
- [ ] Push realizado com sucesso
- [ ] Verificado no GitHub
- [ ] Testado clone em outro lugar
- [ ] Variáveis de ambiente documentadas

---

## 💡 Dica Extra: Script de Setup

Você pode criar um script para facilitar:

```bash
# backend/setup.sh
#!/bin/bash
echo "🚀 Configurando backend..."

# Instalar dependências
npm install

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando .env..."
    cat > .env << EOF
PORT=3001
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=sua_chave_aqui
CHAT_MODEL=gemini-pro
NODE_ENV=development
EOF
    echo "✅ Arquivo .env criado! Configure suas chaves."
fi

echo "✅ Setup completo!"
```

---

**Pronto! Seu backend estará em um repositório separado! 🎉**

