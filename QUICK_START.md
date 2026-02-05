# ⚡ Deploy Rápido - 5 Minutos

## 🎯 Opção Mais Rápida: Netlify (Drag & Drop)

### Passo a Passo:

1. **Acesse:** https://www.netlify.com
2. **Crie conta** (pode usar GitHub para login rápido)
3. **Arraste a pasta** `CalculadoraLogica` para a área de deploy
4. **Pronto!** Seu site está online em segundos! 🎉

**URL será:** `calculadora-logica-123abc.netlify.app`

---

## 🔧 Opção com Git: GitHub Pages

### Pré-requisitos:
- Conta no GitHub: https://github.com
- Git instalado: `sudo apt-get install git`

### Comandos Rápidos:

```bash
# 1. Navegue até a pasta
cd /home/ravi/Documentos/Projetos/CalculadoraLogica

# 2. Inicialize Git (se ainda não fez)
git init
git add .
git commit -m "Primeira versão"

# 3. Crie repositório no GitHub (via site)
#    https://github.com/new
#    Nome: calculadora-logica
#    Público: Sim

# 4. Conecte ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/calculadora-logica.git
git branch -M main
git push -u origin main

# 5. Ative GitHub Pages
#    No GitHub: Settings > Pages > Source: main > Save

# 6. Acesse seu site (aguarde 2-3 minutos)
#    https://SEU_USUARIO.github.io/calculadora-logica/
```

### Ou use o script automático:

```bash
./deploy.sh "Minha primeira versão"
```

---

## 📱 Comparação Rápida

| Plataforma | Tempo | Dificuldade | Melhor Para |
|-----------|-------|-------------|-------------|
| **Netlify** | 1 min | ⭐ Muito Fácil | Iniciantes |
| **GitHub Pages** | 5 min | ⭐⭐ Fácil | Quem usa Git |
| **Vercel** | 3 min | ⭐⭐ Fácil | Desenvolvedores |

---

## 🆘 Precisa de Ajuda?

Consulte o arquivo `DEPLOY.md` para instruções detalhadas!
