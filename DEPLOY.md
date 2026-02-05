# 🚀 Guia de Deploy Gratuito - Calculadora Lógica

Este guia mostra como hospedar sua Calculadora Lógica gratuitamente na web.

## 📋 Opções de Hospedagem Gratuita

### 1. GitHub Pages (Recomendado - Mais Fácil)

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Integração com Git
- ✅ HTTPS automático
- ✅ Fácil de atualizar

**Passos:**

1. **Criar conta no GitHub** (se ainda não tiver)
   - Acesse: https://github.com
   - Crie uma conta gratuita

2. **Instalar Git** (se ainda não tiver)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install git
   
   # Verificar instalação
   git --version
   ```

3. **Criar repositório no GitHub**
   - Acesse: https://github.com/new
   - Nome do repositório: `calculadora-logica` (ou outro nome)
   - Marque como **Público** (obrigatório para GitHub Pages gratuito)
   - Clique em "Create repository"

4. **Preparar e enviar o projeto**
   ```bash
   # Navegue até a pasta do projeto
   cd /home/ravi/Documentos/Projetos/CalculadoraLogica
   
   # Inicialize o repositório Git
   git init
   
   # Adicione todos os arquivos
   git add .
   
   # Faça o primeiro commit
   git commit -m "Primeira versão da Calculadora Lógica"
   
   # Adicione o repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
   git remote add origin https://github.com/SEU_USUARIO/calculadora-logica.git
   
   # Envie para o GitHub
   git branch -M main
   git push -u origin main
   ```

5. **Ativar GitHub Pages**
   - No GitHub, vá em **Settings** (Configurações)
   - Role até **Pages** no menu lateral
   - Em **Source**, selecione **main** branch
   - Clique em **Save**
   - Aguarde alguns minutos

6. **Acessar seu site**
   - Seu site estará disponível em:
   - `https://SEU_USUARIO.github.io/calculadora-logica/`

**Para atualizar o site:**
```bash
git add .
git commit -m "Descrição da atualização"
git push
```

---

### 2. Netlify (Mais Rápido - Drag & Drop)

**Vantagens:**
- ✅ Deploy instantâneo
- ✅ HTTPS automático
- ✅ Pode fazer deploy arrastando pasta
- ✅ Domínio personalizado gratuito

**Passos:**

1. **Acesse Netlify**
   - Vá para: https://www.netlify.com
   - Crie uma conta (pode usar GitHub para login rápido)

2. **Opção A: Deploy por Drag & Drop**
   - Faça login no Netlify
   - Arraste a pasta `CalculadoraLogica` para a área de deploy
   - Pronto! Seu site estará online em segundos
   - URL será algo como: `calculadora-logica-123abc.netlify.app`

3. **Opção B: Deploy via Git**
   - Conecte seu repositório GitHub
   - Netlify detecta automaticamente e faz deploy
   - Cada push no GitHub atualiza o site automaticamente

**Vantagem:** Netlify gera uma URL personalizada automaticamente!

---

### 3. Vercel (Para Desenvolvedores)

**Vantagens:**
- ✅ Deploy muito rápido
- ✅ Integração com Git
- ✅ HTTPS automático
- ✅ Excelente para projetos React/Vue/etc

**Passos:**

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Fazer deploy**
   ```bash
   cd /home/ravi/Documentos/Projetos/CalculadoraLogica
   vercel
   ```

3. **Seguir instruções**
   - Faça login na primeira vez
   - Aceite as configurações padrão
   - Pronto! Seu site estará online

---

## 🎯 Recomendação

**Para iniciantes:** Use **Netlify** (drag & drop) - é o mais rápido!

**Para quem já usa Git:** Use **GitHub Pages** - integração perfeita!

**Para desenvolvedores:** Use **Vercel** - muito rápido e profissional!

---

## 📝 Checklist Antes do Deploy

- [ ] Todos os arquivos estão na pasta do projeto
- [ ] Testou localmente e está funcionando
- [ ] Não há erros no console do navegador
- [ ] Todos os caminhos de arquivos estão corretos (css/, js/)

---

## 🔧 Troubleshooting

**Problema: CSS/JS não carrega**
- Verifique se os caminhos estão corretos: `css/styles.css` e `js/app.js`
- Certifique-se de que os arquivos estão na estrutura correta

**Problema: GitHub Pages mostra 404**
- Verifique se o arquivo `index.html` está na raiz do repositório
- Aguarde alguns minutos após ativar o Pages

**Problema: Site não atualiza**
- Limpe o cache do navegador (Ctrl+F5)
- Aguarde alguns minutos para propagação

---

## 🌐 Domínio Personalizado (Opcional)

Todas as plataformas acima permitem usar seu próprio domínio gratuitamente:
- GitHub Pages: Configure em Settings > Pages > Custom domain
- Netlify: Configure em Domain settings
- Vercel: Configure em Project Settings > Domains

---

## 📚 Recursos Adicionais

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
