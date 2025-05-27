function gerarGraficoMetas() {
  const metas = transacoes.filter(t => t.tipo === "meta");

  if (metas.length === 0) return;

  const ctx = document.getElementById("graficoMetas").getContext("2d");

  if (window.graficoMetasInstance) window.graficoMetasInstance.destroy();

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: metas.map(m => m.descricao),
      datasets: [{
        label: "Valor da Meta (R$)",
        data: metas.map(m => m.valor),
        backgroundColor: "#ffc107"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


function gerarGraficoCategorias() {
  const categorias = {};
  transacoes
    .filter(t => t.tipo === "saida")
    .forEach(t => {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + Number(t.valor);
    });

  const ctx = document.getElementById("graficoCategorias").getContext("2d");

  if (window.graficoCategoriasInstance) window.graficoCategoriasInstance.destroy();

  window.graficoCategoriasInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        label: "Saídas por Categoria",
        data: Object.values(categorias),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#2ECC71", "#8E44AD", "#E67E22"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}


document.addEventListener("DOMContentLoaded", function () {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

  // Atualiza cards
  function atualizarResumo() {
    let entradas = 0, saidas = 0;
    transacoes.forEach(t => {
      if (t.tipo === "entrada") entradas += Number(t.valor);
      else if (t.tipo === "saida") saidas += Number(t.valor);
    });
    const saldo = entradas - saidas;

    document.getElementById("valorEntradas").textContent = `R$ ${entradas.toFixed(2)}`;
    document.getElementById("valorSaidas").textContent = `R$ ${saidas.toFixed(2)}`;
    document.getElementById("valorSaldo").textContent = `R$ ${saldo.toFixed(2)}`;
  }

  // Gráfico de categorias (pizza)
  function gerarGraficoCategorias() {
    const categorias = {};
    transacoes.filter(t => t.tipo === "saida").forEach(t => {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + Number(t.valor);
    });

    const ctx = document.getElementById("graficoCategorias").getContext("2d");

    if (window.graficoCategoriasInstance) {
      window.graficoCategoriasInstance.destroy();
    }

    window.graficoCategoriasInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          label: "Gastos por Categoria",
          data: Object.values(categorias),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71", "#F39C12", "#E67E22"
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Gráfico mensal (entradas/saídas por mês)
  function gerarGraficoMensal() {
    const meses = {};
    transacoes.forEach(t => {
      const d = new Date(t.data);
      if (isNaN(d)) return;
      const chave = `${d.getMonth() + 1}-${d.getFullYear()}`;
      if (!meses[chave]) meses[chave] = { entrada: 0, saida: 0 };
      meses[chave][t.tipo] += Number(t.valor);
    });

    const labels = Object.keys(meses).sort((a, b) => {
      const [m1, y1] = a.split("-").map(Number);
      const [m2, y2] = b.split("-").map(Number);
      return y1 === y2 ? m1 - m2 : y1 - y2;
    });

    const entradas = labels.map(k => meses[k].entrada);
    const saidas = labels.map(k => meses[k].saida);

    const ctx = document.getElementById("graficoMensal").getContext("2d");

    if (window.graficoMensalInstance) {
      window.graficoMensalInstance.destroy();
    }

    window.graficoMensalInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.map(l => {
          const [m, y] = l.split("-");
          return `${m}/${y}`;
        }),
        datasets: [
          {
            label: "Entradas",
            data: entradas,
            backgroundColor: "#28a745"
          },
          {
            label: "Saídas",
            data: saidas,
            backgroundColor: "#dc3545"
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  atualizarResumo();
  gerarGraficoCategorias();
  gerarGraficoMensal();
  atualizarResumo();
gerarGraficoCategorias();
gerarGraficoMensal();
gerarGraficoMetas();
});
