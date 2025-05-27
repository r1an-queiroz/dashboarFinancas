document.addEventListener("DOMContentLoaded", function () {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

  function formatarBRL(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function atualizarResumo() {
    let entradas = 0, saidas = 0;

    transacoes.forEach(t => {
      if (t.tipo === "entrada") entradas += Number(t.valor);
      else if (t.tipo === "saida" || t.tipo === "divida") saidas += Number(t.valor);
    });

    const saldo = entradas - saidas;
    document.getElementById("valorEntradas").textContent = formatarBRL(entradas);
    document.getElementById("valorSaidas").textContent = formatarBRL(saidas);
    document.getElementById("valorSaldo").textContent = formatarBRL(saldo);
  }

  function gerarGraficoCategorias() {
    const categorias = {};
    transacoes.filter(t => t.tipo === "saida").forEach(t => {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + Number(t.valor);
    });

    const ctx = document.getElementById("graficoCategorias")?.getContext("2d");
    if (!ctx) return;

    if (window.graficoCategoriasInstance) window.graficoCategoriasInstance.destroy();

    window.graficoCategoriasInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          label: "Gastos por Categoria",
          data: Object.values(categorias),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71", "#F39C12", "#E67E22"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  function gerarGraficoMensal() {
    const meses = {};

    transacoes.forEach(t => {
      const d = new Date(t.data);
      if (isNaN(d)) return;

      const mesAno = `${d.getMonth() + 1}-${d.getFullYear()}`;
      if (!meses[mesAno]) meses[mesAno] = { entrada: 0, saida: 0 };

      if (t.tipo === "entrada") meses[mesAno].entrada += Number(t.valor);
      else if (t.tipo === "saida" || t.tipo === "divida") meses[mesAno].saida += Number(t.valor);
    });

    const labels = Object.keys(meses).sort((a, b) => {
      const [m1, y1] = a.split("-").map(Number);
      const [m2, y2] = b.split("-").map(Number);
      return y1 === y2 ? m1 - m2 : y1 - y2;
    });

    const entradasData = labels.map(l => meses[l].entrada);
    const saidasData = labels.map(l => meses[l].saida);

    const ctx = document.getElementById("graficoMensal")?.getContext("2d");
    if (!ctx) return;

    if (window.graficoMensalInstance) window.graficoMensalInstance.destroy();

    window.graficoMensalInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.map(l => {
          const [m, y] = l.split("-");
          return `${m.padStart(2, "0")}/${y}`;
        }),
        datasets: [
          {
            label: "Entradas",
            data: entradasData,
            backgroundColor: "#28a745",
          },
          {
            label: "Saídas",
            data: saidasData,
            backgroundColor: "#dc3545",
          }
        ]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  function gerarGraficoMetas() {
    const metas = transacoes.filter(t => t.tipo === "meta");

    const ctx = document.getElementById("graficoMetas")?.getContext("2d");
    if (!ctx || metas.length === 0) return;

    const labels = metas.map(m => m.descricao);
    const valores = metas.map(m => m.valor);

    if (window.graficoMetasInstance) window.graficoMetasInstance.destroy();

    window.graficoMetasInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          label: "Metas Financeiras",
          data: valores,
          backgroundColor: ["#007bff", "#6f42c1", "#ffc107", "#dc3545", "#17a2b8"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  function gerarGraficoInvestimentos() {
    const investimentos = transacoes.filter(t => t.tipo === "investimento");
    const dividas = transacoes.filter(t => t.tipo === "divida");

    const ctx = document.getElementById("graficoInvestimentos")?.getContext("2d");
    if (!ctx || (investimentos.length === 0 && dividas.length === 0)) return;

    const totalInvest = investimentos.reduce((soma, t) => soma + Number(t.valor), 0);
    const totalDivida = dividas.reduce((soma, t) => soma + Number(t.valor), 0);

    if (window.graficoInvestimentosInstance) window.graficoInvestimentosInstance.destroy();

    window.graficoInvestimentosInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Investimentos", "Dívidas"],
        datasets: [{
          data: [totalInvest, totalDivida],
          backgroundColor: ["#4CAF50", "#F44336"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  // ✅ Executa tudo
  atualizarResumo();
  gerarGraficoCategorias();
  gerarGraficoMensal();
  gerarGraficoMetas();
  gerarGraficoInvestimentos();
});
