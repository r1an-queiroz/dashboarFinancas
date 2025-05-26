// Função para obter transações do LocalStorage
function obterTransacoes() {
  const dados = localStorage.getItem("transacoes");
  return dados ? JSON.parse(dados) : [];
}

// Função para salvar transações no LocalStorage
function salvarTransacoes(transacoes) {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Função para atualizar a tabela
function atualizarTabela() {
  const tbody = document.querySelector("#tabelaTransacoes tbody");
  tbody.innerHTML = "";
  const transacoes = obterTransacoes();

  transacoes.forEach((t, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.tipo}</td>
      <td>R$ ${t.valor.toFixed(2)}</td>
      <td>${t.categoria}</td>
      <td>${t.data}</td>
      <td><button data-index="${index}" class="btnExcluir">Excluir</button></td>
    `;

    tbody.appendChild(tr);
  });

  // Adiciona evento para excluir
  document.querySelectorAll(".btnExcluir").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      excluirTransacao(idx);
    });
  });
}

// Função para excluir transação
function excluirTransacao(index) {
  const transacoes = obterTransacoes();
  transacoes.splice(index, 1);
  salvarTransacoes(transacoes);
  atualizarTabela();
}

// Evento do formulário para adicionar transação
document.getElementById("formTransacao").addEventListener("submit", e => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value.trim();
  const data = document.getElementById("data").value;

  if (!tipo || !valor || !categoria || !data) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const transacoes = obterTransacoes();
  transacoes.push({ tipo, valor, categoria, data });
  salvarTransacoes(transacoes);

  // Limpa o formulário
  e.target.reset();

  atualizarTabela();
});

// Inicializa tabela ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarTabela);
