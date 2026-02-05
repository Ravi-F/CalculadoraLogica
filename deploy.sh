#!/bin/bash

# Script de Deploy para GitHub Pages
# Uso: ./deploy.sh "mensagem do commit"

echo "🚀 Iniciando deploy da Calculadora Lógica..."

# Verifica se o Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado. Instale primeiro:"
    echo "   sudo apt-get install git"
    exit 1
fi

# Verifica se está em um repositório Git
if [ ! -d .git ]; then
    echo "📦 Inicializando repositório Git..."
    git init
    echo "✅ Repositório inicializado"
fi

# Adiciona todos os arquivos
echo "📝 Adicionando arquivos..."
git add .

# Faz o commit
if [ -z "$1" ]; then
    COMMIT_MSG="Atualização: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

echo "💾 Fazendo commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Verifica se há um remote configurado
if ! git remote | grep -q origin; then
    echo ""
    echo "⚠️  Repositório remoto não configurado!"
    echo ""
    echo "Para configurar, execute:"
    echo "   git remote add origin https://github.com/SEU_USUARIO/calculadora-logica.git"
    echo ""
    echo "Substitua SEU_USUARIO pelo seu usuário do GitHub"
    echo ""
    read -p "Deseja configurar agora? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        read -p "Digite a URL do seu repositório GitHub: " REPO_URL
        git remote add origin "$REPO_URL"
        echo "✅ Repositório remoto configurado!"
    else
        echo "❌ Deploy cancelado. Configure o remote e tente novamente."
        exit 1
    fi
fi

# Faz o push
echo "⬆️  Enviando para o GitHub..."
git branch -M main 2>/dev/null || true
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy concluído com sucesso!"
    echo ""
    echo "📌 Próximos passos:"
    echo "   1. Acesse seu repositório no GitHub"
    echo "   2. Vá em Settings > Pages"
    echo "   3. Selecione 'main' branch"
    echo "   4. Salve e aguarde alguns minutos"
    echo ""
    echo "🌐 Seu site estará disponível em:"
    echo "   https://SEU_USUARIO.github.io/calculadora-logica/"
else
    echo ""
    echo "❌ Erro ao fazer push. Verifique suas credenciais do GitHub."
    echo ""
    echo "💡 Dica: Configure suas credenciais com:"
    echo "   git config --global user.name 'Seu Nome'"
    echo "   git config --global user.email 'seu@email.com'"
fi
