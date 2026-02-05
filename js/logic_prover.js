/**
 * IBM Watson Module - Propositional Logic Prover
 * 
 * Equipe de Ciência de Dados
 * Etapas I, II e III
 */

// ==========================================
// ETAPA I: ANÁLISE LÉXICA
// ==========================================

const TokenType = {
    ATOM: 'ATOM',       // P, Q, R...
    NOT: 'NOT',         // ~, ¬
    AND: 'AND',         // ^, ∧
    OR: 'OR',           // v, ∨
    IMPLIES: 'IMPLIES', // ->, →
    IFF: 'IFF',         // <->, ↔
    LPAREN: 'LPAREN',   // (
    RPAREN: 'RPAREN',   // )
    EOF: 'EOF'          // Fim de arquivo
};

class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.currentChar = this.input.length > 0 ? this.input[0] : null;
    }

    advance() {
        this.pos++;
        if (this.pos < this.input.length) {
            this.currentChar = this.input[this.pos];
        } else {
            this.currentChar = null;
        }
    }

    peek() {
        const peekPos = this.pos + 1;
        if (peekPos < this.input.length) {
            return this.input[peekPos];
        }
        return null;
    }

    skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    getNextToken() {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            // Identificar Átomos (Letras Maiúsculas)
            if (/[A-Z]/.test(this.currentChar)) {
                const val = this.currentChar;
                this.advance();
                return new Token(TokenType.ATOM, val, this.pos - 1);
            }

            // Identificar Símbolos
            switch (this.currentChar) {
                case '~':
                case '¬':
                    this.advance();
                    return new Token(TokenType.NOT, '~', this.pos - 1);
                case '^':
                case '∧':
                    this.advance();
                    return new Token(TokenType.AND, '^', this.pos - 1);
                case 'v':
                case 'V': // Aceita V maiúsculo como OR se necessário, mas cuidado com variáveis
                case '∨':
                    this.advance();
                    return new Token(TokenType.OR, 'v', this.pos - 1);
                case '(':
                    this.advance();
                    return new Token(TokenType.LPAREN, '(', this.pos - 1);
                case ')':
                    this.advance();
                    return new Token(TokenType.RPAREN, ')', this.pos - 1);
                case '-':
                    if (this.peek() === '>') {
                        this.advance(); // consome -
                        this.advance(); // consome >
                        return new Token(TokenType.IMPLIES, '->', this.pos - 2);
                    }
                    break;
                case '→':
                    this.advance();
                    return new Token(TokenType.IMPLIES, '->', this.pos - 1);
                case '<':
                    if (this.peek() === '-') {
                        this.advance(); // <
                        if (this.currentChar === '-' && this.peek() === '>') {
                            this.advance(); // -
                            this.advance(); // >
                            return new Token(TokenType.IFF, '<->', this.pos - 3);
                        }
                    }
                    break;
                case '↔':
                    this.advance();
                    return new Token(TokenType.IFF, '<->', this.pos - 1);
            }

            throw new Error(`Erro Léxico: Caractere inesperado '${this.currentChar}' na posição ${this.pos}`);
        }

        return new Token(TokenType.EOF, null, this.pos);
    }
}

// ==========================================
// ETAPA II: ANALISADOR SINTÁTICO (PARSER)
// ==========================================

// Classes da AST (Abstract Syntax Tree)
class ASTNode {}
class AtomNode extends ASTNode {
    constructor(name) { super(); this.name = name; }
    toString() { return this.name; }
}
class UnaryNode extends ASTNode {
    constructor(operator, operand) { super(); this.operator = operator; this.operand = operand; }
    toString() { return `(${this.operator} ${this.operand.toString()})`; }
}
class BinaryNode extends ASTNode {
    constructor(left, operator, right) { super(); this.left = left; this.operator = operator; this.right = right; }
    toString() { return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`; }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            // Melhora mensagens de erro específicas
            let mensagem = `Erro Sintático: Esperado ${tokenType}, encontrado ${this.currentToken.type}`;
            if (this.currentToken.value !== null) {
                mensagem += ` ('${this.currentToken.value}')`;
            }
            
            // Mensagens mais específicas para casos comuns
            if (tokenType === TokenType.RPAREN && this.currentToken.type === TokenType.ATOM) {
                mensagem += `. Parece que falta um operador antes de '${this.currentToken.value}'. Verifique a fórmula.`;
            } else if (tokenType === TokenType.RPAREN) {
                mensagem += `. Parêntese não fechado corretamente.`;
            }
            
            throw new Error(mensagem);
        }
    }

    // Gramática:
    // Formula -> Iff
    // Iff     -> Implies ('<->' Implies)*
    // Implies -> Or ('->' Or)*
    // Or      -> And ('v' And)*
    // And     -> Not ('^' Not)*
    // Not     -> '~' Not | Primary
    // Primary -> ATOM | '(' Formula ')'

    parse() {
        const node = this.iff();
        if (this.currentToken.type !== TokenType.EOF) {
            // Tenta dar uma mensagem mais útil
            let mensagem = "Erro Sintático: Entrada não consumida completamente.";
            if (this.currentToken.type === TokenType.ATOM) {
                mensagem += ` Parece que falta um operador antes de '${this.currentToken.value}'.`;
            } else if (this.currentToken.type === TokenType.NOT) {
                mensagem += ` Parece que falta um operador antes de '${this.currentToken.value}'.`;
            } else {
                mensagem += ` Token restante: ${this.currentToken.type} ('${this.currentToken.value}'). Verifique parênteses ou operadores.`;
            }
            throw new Error(mensagem);
        }
        return node;
    }

    iff() {
        let node = this.implies();
        while (this.currentToken.type === TokenType.IFF) {
            const token = this.currentToken;
            this.eat(TokenType.IFF);
            node = new BinaryNode(node, token.value, this.implies());
        }
        return node;
    }

    implies() {
        let node = this.or();
        while (this.currentToken.type === TokenType.IMPLIES) {
            const token = this.currentToken;
            this.eat(TokenType.IMPLIES);
            node = new BinaryNode(node, token.value, this.or());
        }
        return node;
    }

    or() {
        let node = this.and();
        while (this.currentToken.type === TokenType.OR) {
            const token = this.currentToken;
            this.eat(TokenType.OR);
            node = new BinaryNode(node, token.value, this.and());
        }
        return node;
    }

    and() {
        let node = this.not();
        while (this.currentToken.type === TokenType.AND) {
            const token = this.currentToken;
            this.eat(TokenType.AND);
            // Verifica se há um elemento válido após o operador
            if (this.currentToken.type === TokenType.EOF || this.currentToken.type === TokenType.RPAREN) {
                throw new Error(`Erro Sintático: Operador '${token.value}' sem elemento à direita. Verifique a fórmula.`);
            }
            node = new BinaryNode(node, token.value, this.not());
        }
        return node;
    }

    not() {
        if (this.currentToken.type === TokenType.NOT) {
            const token = this.currentToken;
            this.eat(TokenType.NOT);
            return new UnaryNode(token.value, this.not());
        }
        return this.primary();
    }

    primary() {
        const token = this.currentToken;
        if (token.type === TokenType.ATOM) {
            this.eat(TokenType.ATOM);
            return new AtomNode(token.value);
        } else if (token.type === TokenType.LPAREN) {
            this.eat(TokenType.LPAREN);
            const node = this.iff(); // Volta para o topo da precedência
            // Melhora a mensagem de erro se não encontrar o parêntese de fechamento
            if (this.currentToken.type !== TokenType.RPAREN) {
                let mensagem = '';
                if (this.currentToken.type === TokenType.ATOM) {
                    mensagem = `Erro Sintático: Falta um operador (∧, ∨, →, ↔) antes de '${this.currentToken.value}'. `;
                    mensagem += `Exemplo correto: (P∧Q)∧${this.currentToken.value} ou (P∧Q)∨${this.currentToken.value}`;
                } else if (this.currentToken.type === TokenType.NOT) {
                    mensagem = `Erro Sintático: Falta um operador (∧, ∨, →, ↔) antes de '${this.currentToken.value}'. `;
                    mensagem += `Exemplo correto: (P∧Q)∧${this.currentToken.value}P ou (P∧Q)∨${this.currentToken.value}P`;
                } else {
                    mensagem = `Erro Sintático: Esperado ')' para fechar parêntese, mas encontrado ${this.currentToken.type} ('${this.currentToken.value}').`;
                }
                throw new Error(mensagem);
            }
            this.eat(TokenType.RPAREN);
            return node;
        } else {
            throw new Error(`Erro Sintático: Token inesperado no início da expressão: ${token.value}`);
        }
    }
}

// ==========================================
// ETAPA III: PROVADOR DE TAUTOLOGIA (TABLEAUX)
// ==========================================

class TableauProver {
    // Verifica se a fórmula é uma tautologia tentando provar que sua negação é insatisfatível
    static isTautology(formulaNode) {
        // 1. Negar a fórmula original
        const negatedFormula = new UnaryNode('~', formulaNode);
        
        // 2. Iniciar o Tableau com a fórmula negada
        // Um ramo é uma lista de fórmulas. O Tableau começa com um único ramo.
        const initialBranch = [negatedFormula];
        
        // 3. Tentar fechar todos os ramos
        return this.solve([initialBranch]);
    }

    static solve(branches) {
        // Se não há ramos abertos, provamos que é insatisfatível (logo, Tautologia)
        if (branches.length === 0) return true;

        const currentBranch = branches.shift(); // Pega o primeiro ramo para processar

        // Verifica contradição imediata no ramo (P e ~P)
        if (this.isClosed(currentBranch)) {
            return this.solve(branches); // Ramo fechado, continua com os outros
        }

        // Procura uma fórmula composta para expandir (Alpha ou Beta)
        // Prioridade: Alpha (não ramifica) > Beta (ramifica) para eficiência
        const compoundIndex = currentBranch.findIndex(f => !(f instanceof AtomNode) && !this.isLiteral(f));

        if (compoundIndex === -1) {
            // Ramo totalmente expandido e sem contradição -> Contra-exemplo encontrado.
            // Não é tautologia.
            return false; 
        }

        const formula = currentBranch[compoundIndex];
        const remainingFormulas = currentBranch.filter((_, i) => i !== compoundIndex);
        
        const newBranches = this.expand(formula, remainingFormulas);
        
        // Adiciona os novos ramos gerados à lista de ramos a processar
        return this.solve([...branches, ...newBranches]);
    }

    static isLiteral(node) {
        // Literal é Atom ou ~Atom
        if (node instanceof AtomNode) return true;
        if (node instanceof UnaryNode && node.operator === '~' && node.operand instanceof AtomNode) return true;
        return false;
    }

    static isClosed(branch) {
        // Verifica se existe A e ~A no ramo
        const atoms = new Set();
        const negatedAtoms = new Set();

        for (const f of branch) {
            if (f instanceof AtomNode) {
                if (negatedAtoms.has(f.name)) return true;
                atoms.add(f.name);
            } else if (f instanceof UnaryNode && f.operator === '~' && f.operand instanceof AtomNode) {
                if (atoms.has(f.operand.name)) return true;
                negatedAtoms.add(f.operand.name);
            }
        }
        return false;
    }

    static expand(node, context) {
        // Retorna array de novos ramos (arrays de fórmulas)
        
        // Dupla Negação: ~~A => A
        if (node instanceof UnaryNode && node.operator === '~' && node.operand instanceof UnaryNode && node.operand.operator === '~') {
            return [[...context, node.operand.operand]];
        }

        // Conjunção: A ^ B => A, B
        if (node instanceof BinaryNode && node.operator === '^') {
            return [[...context, node.left, node.right]];
        }

        // Negação da Disjunção: ~(A v B) => ~A, ~B
        if (node instanceof UnaryNode && node.operator === '~' && node.operand instanceof BinaryNode && node.operand.operator === 'v') {
            return [[...context, new UnaryNode('~', node.operand.left), new UnaryNode('~', node.operand.right)]];
        }

        // Negação da Implicação: ~(A -> B) => A, ~B
        if (node instanceof UnaryNode && node.operator === '~' && node.operand instanceof BinaryNode && node.operand.operator === '->') {
            return [[...context, node.operand.left, new UnaryNode('~', node.operand.right)]];
        }

        // --- Regras Beta (Ramificam) ---

        // Disjunção: A v B => Ramo1(A), Ramo2(B)
        if (node instanceof BinaryNode && node.operator === 'v') {
            return [[...context, node.left], [...context, node.right]];
        }

        // Negação da Conjunção: ~(A ^ B) => Ramo1(~A), Ramo2(~B)
        if (node instanceof UnaryNode && node.operator === '~' && node.operand instanceof BinaryNode && node.operand.operator === '^') {
            return [[...context, new UnaryNode('~', node.operand.left)], [...context, new UnaryNode('~', node.operand.right)]];
        }

        // Implicação: A -> B => Ramo1(~A), Ramo2(B)
        if (node instanceof BinaryNode && node.operator === '->') {
            return [[...context, new UnaryNode('~', node.left)], [...context, node.right]];
        }

        // Bicondicional e sua negação podem ser expandidos em termos de AND/OR/NOT
        // A <-> B é equivalente a (A -> B) ^ (B -> A)
        if (node instanceof BinaryNode && node.operator === '<->') {
            const imp1 = new BinaryNode(node.left, '->', node.right);
            const imp2 = new BinaryNode(node.right, '->', node.left);
            return [[...context, imp1, imp2]]; // Trata como conjunção
        }

        // ~(A <-> B) é equivalente a ~(A -> B) v ~(B -> A)
        if (node instanceof UnaryNode && node.operator === '~' && node.operand instanceof BinaryNode && node.operand.operator === '<->') {
            const negImp1 = new UnaryNode('~', new BinaryNode(node.operand.left, '->', node.operand.right));
            const negImp2 = new UnaryNode('~', new BinaryNode(node.operand.right, '->', node.operand.left));
            return [[...context, negImp1], [...context, negImp2]]; // Trata como disjunção
        }

        return [context]; // Fallback
    }
}

// ==========================================
// GERADOR DE TABELA VERDADE
// ==========================================

class TruthTableGenerator {
    static generate(ast) {
        const variables = Array.from(this.getVariables(ast)).sort();
        const rows = [];
        const numRows = 1 << variables.length; // 2^n

        // Gera de 0 até 2^n - 1 (Binário: F=0, V=1)
        for (let i = 0; i < numRows; i++) {
            const env = {};
            for (let j = 0; j < variables.length; j++) {
                // Extrai o bit correspondente para a variável
                // Ex: Variáveis [P, Q]. i=2 (10 binário) -> P=1, Q=0
                const bit = (i >> (variables.length - 1 - j)) & 1;
                env[variables[j]] = bit === 1;
            }
            const result = this.evaluate(ast, env);
            rows.push({ env, result });
        }
        return { variables, rows };
    }

    static getVariables(node, set = new Set()) {
        if (node instanceof AtomNode) {
            set.add(node.name);
        } else if (node instanceof UnaryNode) {
            this.getVariables(node.operand, set);
        } else if (node instanceof BinaryNode) {
            this.getVariables(node.left, set);
            this.getVariables(node.right, set);
        }
        return set;
    }

    static evaluate(node, env) {
        if (node instanceof AtomNode) {
            return env[node.name];
        } else if (node instanceof UnaryNode) {
            if (node.operator === '~') return !this.evaluate(node.operand, env);
        } else if (node instanceof BinaryNode) {
            const l = this.evaluate(node.left, env);
            const r = this.evaluate(node.right, env);
            switch (node.operator) {
                case '^': return l && r;
                case 'v': return l || r;
                case '->': return !l || r;
                case '<->': return l === r;
            }
        }
        return false;
    }
}

// ==========================================
// EXECUÇÃO E TESTES
// ==========================================

function resolverFormula(input) {
    try {
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        const isTautology = TableauProver.isTautology(ast);
        const truthTable = TruthTableGenerator.generate(ast);
        return { success: true, ast: ast.toString(), isTautology, truthTable };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

function testarFormula(input) {
    console.log(`\nEntrada: "${input}"`);
    const res = resolverFormula(input);
    if (res.success) {
        console.log(`  [OK] Sintaxe Válida (FBF). Estrutura: ${res.ast}`);
        console.log(`  [RESULTADO] É Tautologia? ${res.isTautology ? "SIM (VERDADEIRO)" : "NÃO (FALSO)"}`);
    } else {
        console.error(`  [ERRO] ${res.error}`);
    }
}

// Casos de Teste do Enunciado e Extras
if (typeof window === 'undefined') {
    console.log("=== INICIANDO MÓDULO WATSON DE LÓGICA PROPOSICIONAL ===");
    testarFormula("(A -> B) ^ (B -> A)"); // Exemplo FBF
    testarFormula("A)) ^ -> BC");         // Exemplo Não FBF
    testarFormula("P v ~P");              // Tautologia simples (Terceiro Excluído)
    testarFormula("P ^ Q");               // Contingência (Falso para tautologia)
    testarFormula("(P -> Q) <-> (~Q -> ~P)"); // Contrapositiva (Tautologia)
    testarFormula("((P -> Q) ^ (Q -> R)) -> (P -> R)"); // Silogismo Hipotético (Tautologia)
}