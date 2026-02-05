# Calculadora Lógica - IBM Watson

Calculadora de lógica proposicional avançada que analisa fórmulas lógicas, identifica seu tipo (tautologia, contradição ou contingência) e gera tabelas verdade completas.

## Funcionalidades

- **Análise Léxica**: Tokenização de fórmulas proposicionais
- **Análise Sintática**: Parsing de fórmulas bem formadas (FBF)
- **Classificação de Fórmulas**: Identifica se a fórmula é:
  - **Tautologia**: Sempre verdadeira em todas as interpretações
  - **Contradição**: Sempre falsa em todas as interpretações
  - **Contingência**: Verdadeira em algumas interpretações e falsa em outras
- **Tabela Verdade**: Geração automática e visualização completa da tabela verdade
- **Teclado Expandido**: Suporte a todas as letras do alfabeto (A-Z) como variáveis proposicionais
- **Modo Escuro/Claro**: Interface com tema escuro por padrão e opção de alternar para modo claro
- **Design Moderno**: Interface visual aprimorada com animações e feedback visual

## Estrutura do Projeto

```
CalculadoraLogica/
├── index.html          # Página principal
├── css/
│   └── styles.css     # Estilos da aplicação
├── js/
│   ├── logic_prover.js # Motor de lógica (lexer, parser, prover)
│   └── app.js         # Lógica da interface
└── README.md          # Este arquivo
```

## Operadores Suportados

- `¬` ou `~` - Negação (NOT)
- `∧` ou `^` - Conjunção (AND)
- `∨` ou `v` - Disjunção (OR)
- `→` ou `->` - Implicação (IMPLIES)
- `↔` ou `<->` - Bicondicional (IFF)

## Variáveis Proposicionais

Todas as letras maiúsculas do alfabeto (A-Z) podem ser usadas como variáveis proposicionais.

## Exemplos de Uso

### Tautologias (sempre verdadeiras)
- `P ∨ ¬P` - Lei do Terceiro Excluído
- `(P → Q) ↔ (¬Q → ¬P)` - Contrapositiva
- `((P → Q) ∧ (Q → R)) → (P → R)` - Silogismo Hipotético
- `P → P` - Identidade

### Contradições (sempre falsas)
- `P ∧ ¬P` - Contradição clássica
- `(P → Q) ∧ (P ∧ ¬Q)` - Contradição por implicação

### Contingências (dependem dos valores)
- `P ∧ Q` - Verdadeira apenas quando ambas são verdadeiras
- `P → Q` - Depende dos valores de P e Q
- `P ∨ Q` - Falsa apenas quando ambas são falsas

## Como Executar

### Opção 1: Abrir diretamente no navegador (Mais Simples)

1. Navegue até a pasta do projeto
2. Abra o arquivo `index.html` com qualquer navegador moderno (Chrome, Firefox, Edge, etc.)
3. Pronto! A aplicação está funcionando

### Opção 2: Usar um servidor HTTP local (Recomendado)

Para evitar possíveis problemas com CORS e ter uma experiência mais próxima de produção:

**Com Python 3:**
```bash
cd /home/ravi/Documentos/Projetos/CalculadoraLogica
python3 -m http.server 8000
```
Depois acesse: `http://localhost:8000`

**Com Node.js (se tiver instalado):**
```bash
cd /home/ravi/Documentos/Projetos/CalculadoraLogica
npx http-server -p 8000
```
Depois acesse: `http://localhost:8000`

**Com PHP (se tiver instalado):**
```bash
cd /home/ravi/Documentos/Projetos/CalculadoraLogica
php -S localhost:8000
```
Depois acesse: `http://localhost:8000`

## Como Usar a Aplicação

1. **Inserir Fórmula**: Use o teclado virtual para inserir a fórmula lógica
   - Seção "Variáveis": Escolha as letras (A-Z) que deseja usar
   - Seção "Operadores": Selecione os operadores lógicos
   - Use DEL para apagar o último caractere ou C para limpar tudo

2. **Calcular**: Clique no botão "CALCULAR" ou pressione Enter

3. **Ver Resultados**: 
   - O tipo de fórmula será exibido com badge colorido (Tautologia/Contradição/Contingência)
   - A estrutura interpretada da fórmula será mostrada
   - A tabela verdade completa será gerada automaticamente

4. **Alternar Tema**: Clique no botão de sol/lua no canto superior direito para alternar entre modo escuro e claro

## Recursos Visuais

- **Tema Escuro (Padrão)**: Interface moderna com cores escuras, ideal para uso prolongado
- **Tema Claro**: Alternativa clara para ambientes bem iluminados
- **Cores Semânticas**: 
  - 🟢 Verde para Tautologias
  - 🔴 Vermelho para Contradições
  - 🟠 Laranja para Contingências
- **Tabela Verdade Interativa**: Visualização clara com cores diferenciadas para valores verdadeiros (V) e falsos (F)
