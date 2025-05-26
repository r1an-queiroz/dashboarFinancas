// Função para obter os dados do localStorage
function obterDadosID() {
  const dados = localStorage.getItem("investimentosDividas");
  return dados ? JSON.parse(dados) : [];
}

// Função para salvar os dados no localStorage
function salvarDadosID(dados) {
  localStorage.setItem("investimentosDividas", JSON.stringify(dados));
}

// Função para atualizar a tabela com os dados
function atualizarTabelaID() {
  const tbody = document.querySelector("#tabelaInvestimentosDividas tbody");
  tbody.innerHTML = "";
  const dados = obterDadosID();

  dados.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.tipo}</td>
      <td>${item.descricao}</td>
      <td>R$ ${parseFloat(item.valor).toFixed(2)}</td>
      <td>${item.data}</td>
      <td><button data-index="${index}" class="btnExcluirID">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Botões de excluir
  document.querySelectorAll(".btnExcluirID").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      excluirItemID(idx);
    });
  });

  // Atualiza o gráfico após atualizar a tabela
  gerarGraficoID();
}

// Função para excluir um item
function excluirItemID(index) {
  const dados = obterDadosID();
  dados.splice(index, 1);
  salvarDadosID(dados);
  atualizarTabelaID();
}

// Evento de envio do formulário
document.getElementById("formInvestimentoDivida").addEventListener("submit", e => {
  e.preventDefault();

  const tipo = document.getElementById("tipoID").value;
  const descricao = document.getElementById("descricaoID").value.trim();
  const valor = parseFloat(document.getElementById("valorID").value);
  const data = document.getElementById("dataID").value;

  if (!tipo || !descricao || isNaN(valor) || !data) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const dados = obterDadosID();
  dados.push({ tipo, descricao, valor, data });
  salvarDadosID(dados);

  e.target.reset();
  atualizarTabelaID();
});

// Função para gerar o gráfico de pizza
function gerarGraficoID() {
  const dados = obterDadosID();

  const totalInvestimentos = dados
    .filter(item => item.tipo === "investimento")
    .reduce((soma, item) => soma + parseFloat(item.valor), 0);

  const totalDividas = dados
    .filter(item => item.tipo === "divida")
    .reduce((soma, item) => soma + parseFloat(item.valor), 0);

  const ctx = document.getElementById("graficoID")?.getContext("2d");
  if (!ctx) return; // Garante que o canvas existe

  if (window.graficoIDInstance) {
    window.graficoIDInstance.destroy(); // Remove gráfico anterior, se existir
  }

  window.graficoIDInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Investimentos", "Dívidas"],
      datasets: [{
        data: [totalInvestimentos, totalDividas],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// Inicializa a tabela ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarTabelaID);
