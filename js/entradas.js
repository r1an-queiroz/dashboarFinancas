const usuario = localStorage.getItem("usuarioLogado");
if (!usuario) window.location.href = "login.html";

const form = document.getElementById('formEntrada');
const tabela = document.getElementById('tabelaEntradas').querySelector('tbody');

// Carrega todas as transações (entradas e saídas)
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

function atualizarTabela() {
  // Filtra apenas as entradas
  const entradas = transacoes.filter(t => t.tipo === "entrada");
  function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
  
  tabela.innerHTML = '';
  entradas.forEach(entrada => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entrada.descricao}</td>
      <td>R$ ${parseFloat(entrada.valor).toFixed(2)}</td>
      <td>${formatarData(entrada.data)}</td>
    `;
    tabela.appendChild(tr);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const novaEntrada = {
    tipo: "entrada",
    descricao: form.descricao.value,
    valor: parseFloat(form.valor.value),
    data: form.data.value,
    categoria: "Outros"
  };

  transacoes.push(novaEntrada);
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
  atualizarTabela();

  form.reset();
});

atualizarTabela();

function logout() {
  localStorage.removeItem("usuarioLogado");
}