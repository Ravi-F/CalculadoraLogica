/**
 * Interface da Calculadora Lógica
 * Gerencia a interação do usuário com a calculadora
 */

// Variável global para armazenar a fórmula atual
let formula = '';

// Função para adicionar caracteres à fórmula
function add(char) {
    formula += char;
    updateDisplay();
}

// Função para deletar o último caractere
function del() {
    formula = formula.slice(0, -1);
    updateDisplay();
}

// Função para limpar a fórmula
function clr() {
    formula = '';
    updateDisplay();
    clearResult();
}

// Função para atualizar o display
function updateDisplay() {
    const input = document.getElementById('formulaInput');
    if (input) {
        input.value = formula;
        // Adiciona placeholder quando vazio
        if (formula === '') {
            input.placeholder = 'Digite uma fórmula lógica...';
        } else {
            input.placeholder = '';
        }
    }
}

// Função para limpar o resultado
function clearResult() {
    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '';
    }
}

// Função principal para verificar a fórmula
function verificar() {
    const resultado = document.getElementById('resultado');
    
    if (!resultado) {
        console.error('Elemento resultado não encontrado');
        return;
    }

    // Limpa resultado anterior
    resultado.innerHTML = '';

    // Verifica se há fórmula
    if (!formula || formula.trim() === '') {
        resultado.innerHTML = '<div class="error">Por favor, insira uma fórmula lógica.</div>';
        return;
    }

    try {
        // Verifica se a função resolverFormula existe
        if (typeof resolverFormula !== 'function') {
            throw new Error('Função resolverFormula não encontrada. Verifique se logic_prover.js está carregado.');
        }

        // Usa a função resolverFormula do logic_prover.js
        const formulaInput = formula.trim();
        console.log('Processando fórmula:', formulaInput);
        const res = resolverFormula(formulaInput);
        console.log('Resultado:', res);

        // Verifica se o resultado é válido
        if (!res || typeof res !== 'object') {
            throw new Error('Resposta inválida do processador de lógica.');
        }

        if (!res.success) {
            resultado.innerHTML = `<div class="error">
                <strong>Erro:</strong> ${res.error || 'Erro desconhecido'}
            </div>`;
            return;
        }

        // Verifica se truthTable existe
        if (!res.truthTable || !res.truthTable.rows || !Array.isArray(res.truthTable.rows)) {
            throw new Error('Tabela verdade não foi gerada corretamente.');
        }

        // Determina o tipo da fórmula
        let tipoFormula = '';
        let tipoClass = '';
        let tipoEmoji = '';
        
        if (res.isTautology === true) {
            tipoFormula = 'Tautologia';
            tipoClass = 'tautology';
            tipoEmoji = '✓';
        } else {
            // Verifica se é contradição (todos os valores são falsos)
            const allFalse = res.truthTable.rows.length > 0 && 
                           res.truthTable.rows.every(row => row.result === false);
            if (allFalse) {
                tipoFormula = 'Contradição';
                tipoClass = 'contradiction';
                tipoEmoji = '✗';
            } else {
                tipoFormula = 'Contingência';
                tipoClass = 'contingency';
                tipoEmoji = '~';
            }
        }

        // Monta o HTML do resultado
        let html = `
            <div class="result-container">
                <div class="result-header">
                    <span class="badge ${tipoClass}">
                        ${tipoEmoji} ${tipoFormula}
                    </span>
                </div>
                
                <div class="formula-structure">
                    <strong>Fórmula:</strong> <code>${escapeHtml(formula)}</code>
                </div>
                
                <div class="formula-structure">
                    <strong>Estrutura:</strong> <code>${escapeHtml(res.ast)}</code>
                </div>
                
                <div class="truth-table-container">
                    <h3>Tabela Verdade</h3>
                    ${generateTruthTableHTML(res.truthTable)}
                </div>
            </div>
        `;

        resultado.innerHTML = html;

    } catch (error) {
        resultado.innerHTML = `<div class="error">
            <strong>Erro inesperado:</strong> ${error.message}
        </div>`;
        console.error('Erro ao processar fórmula:', error);
    }
}

// Função para gerar HTML da tabela verdade
function generateTruthTableHTML(truthTable) {
    if (!truthTable || !truthTable.variables || !truthTable.rows) {
        return '<p>Erro ao gerar tabela verdade.</p>';
    }

    let html = '<table class="truth-table">';
    
    // Cabeçalho
    html += '<thead><tr>';
    truthTable.variables.forEach(variable => {
        html += `<th>${variable}</th>`;
    });
    html += '<th>Resultado</th>';
    html += '</tr></thead>';
    
    // Corpo
    html += '<tbody>';
    truthTable.rows.forEach(row => {
        html += '<tr>';
        truthTable.variables.forEach(variable => {
            const value = row.env[variable];
            html += `<td class="${value ? 'true' : 'false'}">${value ? 'V' : 'F'}</td>`;
        });
        html += `<td class="${row.result ? 'true' : 'false'}">${row.result ? 'V' : 'F'}</td>`;
        html += '</tr>';
    });
    html += '</tbody>';
    
    html += '</table>';
    return html;
}

// Função auxiliar para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Permite usar Enter para calcular
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('formulaInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verificar();
            }
        });
    }
    
    // Inicializa o display
    updateDisplay();
});
