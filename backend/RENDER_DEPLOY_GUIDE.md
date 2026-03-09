# 🚀 Deploy do Sadeck Notes Backend no Render (SEM Migrations)

## ⚠️ IMPORTANTE: Criar o Banco Manualmente

Como você não usa migrations do Prisma, precisa criar as tabelas manualmente no PostgreSQL.

---

## 📋 Passo 1: Criar Banco PostgreSQL no Render

### 1.1. Criar o Banco
1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `sadeck-notes-db`
   - **Database**: `sadeck_notes`
   - **Region**: escolha a mais próxima (ex: Oregon)
   - **Plan**: Free
4. Clique em **"Create Database"**
5. **Aguarde** alguns minutos até o banco ficar disponível

### 1.2. Copiar Informações de Conexão
No painel do PostgreSQL, copie:
- ✅ **Internal Database URL** (para o backend)
- ✅ **External Database URL** (para acessar via psql/DBeaver)

Exemplo de Internal URL:
```
postgresql://sadeck_notes_user:senha@dpg-xxx-a.oregon-postgres.render.com/sadeck_notes
```

---

## 🗄️ Passo 2: Criar as Tabelas Manualmente

### Opção A: Via PSQL (Terminal)

```bash
# Conectar ao banco usando a External Database URL
psql postgresql://user:password@host/database

# Criar tabela users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at DATE,
  updated_at DATE
);

# Criar tabela notes
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255),
  body VARCHAR(255),
  created_at DATE,
  updated_at DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

# Verificar se as tabelas foram criadas
\dt

# Sair
\q
```

### Opção B: Via DBeaver/PgAdmin

1. Abra DBeaver ou PgAdmin
2. Crie uma nova conexão PostgreSQL
3. Use os dados da **External Database URL**:
   - Host: `dpg-xxx.oregon-postgres.render.com`
   - Port: `5432`
   - Database: `sadeck_notes`
   - Username: `sadeck_notes_user`
   - Password: (da URL)
4. Execute o SQL acima na query console

### Opção C: Via Render Web Console

1. No painel do PostgreSQL no Render
2. Vá em **"Connect"** → **"External Connection"**
3. Clique em **"PSQL Command"**
4. Execute os comandos CREATE TABLE

---

## 🐳 Passo 3: Deploy do Backend no Render

### 3.1. Criar Web Service

1. No Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório: `LucasSadeck30/sadeck-notes`
3. Configure:

**Configurações Básicas:**
- **Name**: `sadeck-notes-backend`
- **Region**: **MESMA do banco** (importante!)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Docker`
- **Dockerfile Path**: `Dockerfile` (ou `Dockerfile-backend` se renomear)

**Build Command**: (deixe vazio, o Docker cuida)
**Start Command**: (deixe vazio, o Docker cuida)

### 3.2. Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Cole a **Internal Database URL** do PostgreSQL |
| `JWT_TOKEN` | Gere uma chave secreta forte (ex: `seu-token-super-secreto-aqui-123456`) |
| `NODE_ENV` | `production` |

**⚠️ IMPORTANTE**: Use a **Internal Database URL**, não a External!

Exemplo de `DATABASE_URL`:
```
postgresql://sadeck_notes_user:senha@dpg-xxx-a.oregon-postgres.render.com/sadeck_notes
```

### 3.3. Configurações Avançadas (Opcional)

- **Health Check Path**: `/users` (ou qualquer rota que retorne 200)
- **Auto-Deploy**: Ativado (deploys automáticos no push)

### 3.4. Iniciar Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos)
3. ✅ Seu backend estará online!

---

## 🧪 Passo 4: Testar a API

### Via cURL:

```bash
# Testar endpoint de registro
curl -X POST https://sadeck-notes-backend.onrender.com/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Testar login
curl -X POST https://sadeck-notes-backend.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Via Postman/Insomnia:

1. **POST** `https://sadeck-notes-backend.onrender.com/users/register`
2. Body: JSON
```json
{
  "name": "Lucas Sadeck",
  "email": "lucas@example.com",
  "password": "senha123"
}
```

---

## 🔧 Testar Localmente com Docker (Antes de Fazer Deploy)

### 1. Preparar arquivos

```bash
cd backend

# Copiar os arquivos Docker
# Dockerfile, .dockerignore, .env.example já devem estar na pasta

# Criar .env local
cp .env.example .env
# Edite .env com suas credenciais locais
```

### 2. Build da imagem

```bash
docker build -t sadeck-notes-backend .
```

### 3. Rodar container

```bash
# Rodar com .env
docker run -p 3001:3001 --env-file .env sadeck-notes-backend

# Ou com variáveis inline
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_TOKEN="seu-token-secreto" \
  sadeck-notes-backend
```

### 4. Testar

```bash
curl http://localhost:3001/users
```

---

## 📝 Checklist Completo de Deploy

### Antes do Deploy:
- [ ] Código no GitHub (branch main)
- [ ] Dockerfile na pasta backend
- [ ] .dockerignore na pasta backend
- [ ] .env.example documentado
- [ ] Testado localmente com Docker

### No Render - Banco de Dados:
- [ ] PostgreSQL criado
- [ ] Tabelas criadas manualmente (users e notes)
- [ ] Internal Database URL copiada

### No Render - Backend:
- [ ] Web Service criado
- [ ] Root Directory = `backend`
- [ ] Environment = Docker
- [ ] DATABASE_URL configurada (Internal URL)
- [ ] JWT_TOKEN configurada
- [ ] Build passou sem erros
- [ ] Service está rodando (verde)

### Testes:
- [ ] Registro de usuário funcionando
- [ ] Login funcionando
- [ ] Criação de notas funcionando
- [ ] CORS configurado corretamente

---

## 🐛 Troubleshooting

### ❌ Erro: "Can't reach database server"

**Causa**: DATABASE_URL incorreta ou banco não está rodando

**Solução**:
1. Verifique se está usando a **Internal Database URL**
2. Confirme que o banco está na mesma região do backend
3. Teste a conexão via psql

### ❌ Erro: "relation 'users' does not exist"

**Causa**: Tabelas não foram criadas no banco

**Solução**:
1. Conecte ao banco via psql ou DBeaver
2. Execute os comandos CREATE TABLE
3. Verifique com `\dt` (psql) ou refresh (DBeaver)

### ❌ Erro: "Error: P1001 Can't reach database server"

**Causa**: Firewall ou URL errada

**Solução**:
1. Use sempre a Internal URL no backend
2. Verifique se removeu `?schema=public` se não for necessário
3. Confirme que as credenciais estão corretas

### ❌ Build falha no "npx prisma generate"

**Causa**: Schema do Prisma não encontrado ou inválido

**Solução**:
1. Verifique se `prisma/schema.prisma` existe na pasta backend
2. Confirme que o schema está correto
3. Teste localmente: `npx prisma generate`

### ❌ Container inicia mas cai logo depois

**Causa**: Erro de runtime (geralmente DATABASE_URL)

**Solução**:
1. Vá em **Logs** no Render
2. Procure por erros de conexão
3. Verifique todas as variáveis de ambiente

---

## 🔐 Segurança em Produção

### ✅ Boas Práticas:

1. **JWT_TOKEN**: Use uma chave forte e única
   ```bash
   # Gerar uma chave segura (Linux/Mac)
   openssl rand -base64 64
   ```

2. **DATABASE_URL**: NUNCA commite no Git
   - Use sempre variáveis de ambiente
   - Nunca exponha credenciais públicas

3. **HTTPS**: Render fornece HTTPS automaticamente

4. **Variáveis de Ambiente**: Sempre use Environment Variables do Render

---

## 📊 Monitoramento

### Logs em Tempo Real:
1. Acesse seu Web Service no Render
2. Vá em **"Logs"**
3. Veja requests, erros e status

### Métricas:
- CPU e Memória: visíveis no Dashboard
- Uptime: monitorado automaticamente
- Health Checks: configure em Settings

---

## 🌐 URLs Finais

Após deploy bem-sucedido:

- **API Backend**: `https://sadeck-notes-backend.onrender.com`
- **Registro**: `POST /users/register`
- **Login**: `POST /users/login`
- **Notas**: `GET/POST/PUT/DELETE /notes`

---

## 📞 Próximos Passos

1. ✅ Deploy do backend
2. 🔜 Configurar CORS para o frontend
3. 🔜 Deploy do frontend (Vercel/Netlify)
4. 🔜 Conectar frontend com backend
5. 🔜 Configurar domínio customizado (opcional)

**Boa sorte com o deploy! 🚀**

Qualquer dúvida, verifique os logs do Render primeiro!
