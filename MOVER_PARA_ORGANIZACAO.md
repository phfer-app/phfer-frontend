# 📦 Como Mover Projeto para Organização no GitHub

## 🚀 Método 1: Transferir Repositório (Recomendado)

### Passo a Passo:

1. **Acesse seu repositório no GitHub**
   - Vá para: `https://github.com/seu-usuario/phfer`

2. **Vá em Settings**
   - Clique na aba **Settings** do repositório

3. **Role até "Danger Zone"**
   - Vá até a seção **Danger Zone** (no final da página)

4. **Clique em "Transfer ownership"**
   - Clique no botão **Transfer ownership**

5. **Digite o nome da organização**
   - Digite o nome exato da sua organização
   - Exemplo: `sua-organizacao`

6. **Confirme a transferência**
   - Digite o nome completo do repositório para confirmar
   - Exemplo: `initpedro/phfer`

7. **Pronto!**
   - O repositório será transferido para a organização
   - A URL mudará para: `https://github.com/sua-organizacao/phfer`

---

## ⚠️ O que acontece após a transferência:

### ✅ Mantém:
- Todo o histórico de commits
- Todas as branches
- Todas as issues e pull requests
- Todas as configurações (exceto algumas específicas)

### 🔄 Precisa atualizar:
- **URL do repositório remoto** no seu Git local
- **Webhooks** (se houver)
- **Deploy automático** (Vercel, Netlify, etc.)
- **CI/CD** (GitHub Actions, etc.)

---

## 🔧 Atualizar Git Local Após Transferência

Após transferir, atualize o remote no seu computador:

```bash
# Ver remote atual
git remote -v

# Atualizar para a nova URL da organização
git remote set-url origin https://github.com/sua-organizacao/phfer.git

# Ou se usar SSH:
git remote set-url origin git@github.com:sua-organizacao/phfer.git

# Verificar se atualizou
git remote -v
```

---

## 📝 Atualizar Deploy (Vercel/Netlify)

### Vercel:
1. Vá para o dashboard do Vercel
2. Acesse o projeto
3. Vá em **Settings** > **Git**
4. Clique em **Disconnect**
5. Reconecte com a nova URL da organização

### Netlify:
1. Vá para o dashboard do Netlify
2. Acesse o site
3. Vá em **Site settings** > **Build & deploy** > **Continuous Deployment**
4. Clique em **Link to Git provider**
5. Reconecte com a nova URL da organização

---

## 🎯 Método 2: Criar Novo Repo na Organização (Alternativa)

Se preferir manter o repo original e criar um novo na organização:

```bash
# 1. Criar novo repositório na organização pelo GitHub
# (via interface web)

# 2. Adicionar remote da organização
git remote add org https://github.com/sua-organizacao/phfer.git

# 3. Fazer push para a organização
git push org main

# 4. (Opcional) Remover remote antigo
git remote remove origin

# 5. Renomear remote da org para origin
git remote rename org origin
```

---

## 🔐 Permissões na Organização

Certifique-se de que você tem:
- ✅ Permissão para criar repositórios na organização
- ✅ Permissão para transferir repositórios (se for owner/admin)

---

## 📋 Checklist Pós-Transferência

- [ ] Repositório transferido com sucesso
- [ ] Git remote atualizado localmente
- [ ] Deploy reconectado (Vercel/Netlify)
- [ ] CI/CD atualizado (se houver)
- [ ] Webhooks atualizados (se houver)
- [ ] Documentação atualizada com nova URL
- [ ] README.md atualizado (se necessário)

---

## 💡 Dica Extra

Se você quiser manter o repositório original também (fork):
- Após transferir, você pode fazer um fork do repositório da organização
- Assim terá uma cópia pessoal também

---

**Pronto! Seu projeto estará na organização! 🎉**

