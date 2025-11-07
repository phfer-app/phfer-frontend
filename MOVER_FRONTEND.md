# 🚀 Mover Frontend para Organização

## ✅ O que já foi feito:
- ✅ Pasta `backend/` removida do projeto frontend
- ✅ Backend está em repositório separado: `phfer-app/phfer-backend`

---

## 📋 Passo a Passo para Mover Frontend:

### 1. Verificar se há mudanças não commitadas:
```bash
git status
```

### 2. Se houver mudanças, fazer commit:
```bash
git add .
git commit -m "chore: remover pasta backend local e finalizar integração"
```

### 3. Transferir repositório para organização:

**Via GitHub Web:**
1. Acesse: `https://github.com/seu-usuario/phfer`
2. Vá em **Settings** → **Danger Zone**
3. Clique em **Transfer ownership**
4. Digite: `phfer-app`
5. Confirme digitando o nome completo: `seu-usuario/phfer`
6. Clique em **I understand, transfer this repository**

**Via Git (se preferir):**
```bash
# Verificar remote atual
git remote -v

# Atualizar para a organização (após transferir)
git remote set-url origin git@github.com:phfer-app/phfer.git

# Verificar
git remote -v
```

---

## 🔄 Após Transferir:

### 1. Atualizar Deploy (Vercel/Netlify):
- Reconecte o repositório com a nova URL da organização
- Configure variáveis de ambiente novamente:
  - `NEXT_PUBLIC_API_URL=https://phfer-backend-production.up.railway.app/api`

### 2. Atualizar Git Local:
```bash
git remote set-url origin git@github.com:phfer-app/phfer.git
git fetch origin
```

---

## 📝 Checklist Final:

- [ ] Pasta backend removida ✅
- [ ] Mudanças commitadas
- [ ] Repositório transferido para organização
- [ ] Remote atualizado localmente
- [ ] Deploy reconectado
- [ ] Variáveis de ambiente configuradas no deploy

---

## 🎯 URLs Finais:

- **Backend:** `https://phfer-backend-production.up.railway.app`
- **Frontend:** (será atualizado após deploy)

---

**Boa sorte com o layout! 🎨**

