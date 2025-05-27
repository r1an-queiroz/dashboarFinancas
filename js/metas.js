form.addEventListener('submit', e => {
  e.preventDefault();

  const descricao = form.descricaoMeta.value;
  const valor = parseFloat(form.valorMeta.value);
  const data = form.dataMeta.value;

  if (descricao && valor && data) {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    transacoes.push({
      tipo: "meta",
      descricao: descricao,
      valor: valor,
      data: data,
      categoria: "Meta"
    });

    localStorage.setItem("transacoes", JSON.stringify(transacoes));
    alert("Meta registrada com sucesso!");

    atualizarTabela();
    form.reset();
  } else {
    alert("Preencha todos os campos da meta.");
  }
});


// Obter metas do localStorage
function obterMetas() {
  const dados = localStorage.getItem("metas");
  return dados ? JSON.parse(dados) : [];
}

// Salvar metas no localStorage
function salvarMetas(metas) {
  localStorage.setItem("metas", JSON.stringify(metas));
}

// Atualizar tabela de metas
function atualizarTabelaMetas() {
  const tbody = document.querySelector("#tabelaMetas tbody");
  tbody.innerHTML = "";
  const metas = obterMetas();

  metas.forEach((meta, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${meta.descricao}</td>
      <td>R$ ${parseFloat(meta.valor).toFixed(2)}</td>
      <td>${meta.prazo}</td>
      <td><button data-index="${index}" class="btnExcluirMeta">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Adiciona evento excluir
  document.querySelectorAll(".btnExcluirMeta").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      excluirMeta(idx);
    });
  });
}

// Excluir meta
function excluirMeta(index) {
  const metas = obterMetas();
  metas.splice(index, 1);
  salvarMetas(metas);
  atualizarTabelaMetas();
}

// Evento do formulário para adicionar meta
document.getElementById("formMeta").addEventListener("submit", e => {
  e.preventDefault();

  const descricao = document.getElementById("descricaoMeta").value.trim();
  const valor = parseFloat(document.getElementById("valorMeta").value);
  const prazo = document.getElementById("prazoMeta").value;

  if (!descricao || !valor || !prazo) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const metas = obterMetas();
  metas.push({ descricao, valor, prazo });
  salvarMetas(metas);

  e.target.reset();
  atualizarTabelaMetas();
});

// Atualiza tabela ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarTabelaMetas);
