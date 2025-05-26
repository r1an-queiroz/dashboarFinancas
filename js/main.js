document.addEventListener("DOMContentLoaded", function () {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

  // Se quiser garantir dados de exemplo
  if (transacoes.length === 0) {
    localStorage.setItem("transacoes", JSON.stringify([
      { tipo: "entrada", valor: 2500, categoria: "Salário", data: "2025-05-01" },
      { tipo: "saida", valor: 600, categoria: "Alimentação", data: "2025-05-02" },
      { tipo: "saida", valor: 300, categoria: "Transporte", data: "2025-05-03" },
      { tipo: "saida", valor: 250, categoria: "Lazer", data: "2025-05-05" },
      { tipo: "entrada", valor: 500, categoria: "Freelance", data: "2025-05-07" },
      { tipo: "saida", valor: 100, categoria: "Saúde", data: "2025-05-10" },
    ]));
  }

  const transacoesAtualizadas = JSON.parse(localStorage.getItem("transacoes"));

  // Atualiza valores no resumo
  function atualizarResumo() {
    let entradas = 0, saidas = 0;

    transacoesAtualizadas.forEach(t => {
      if (t.tipo === "entrada") entradas += Number(t.valor);
      else if (t.tipo === "saida") saidas += Number(t.valor);
    });

    const saldo = entradas - saidas;

    document.getElementById("valorEntradas").textContent = `R$ ${entradas.toFixed(2)}`;
    document.getElementById("valorSaidas").textContent = `R$ ${saidas.toFixed(2)}`;
    document.getElementById("valorSaldo").textContent = `R$ ${saldo.toFixed(2)}`;
  }

  // Gráfico de categorias
  function gerarGraficoCategorias() {
    const categorias = {};
    transacoesAtualizadas.filter(t => t.tipo === "saida").forEach(t => {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + t.valor;
    });

    const ctx = document.getElementById("graficoCategorias").getContext("2d");

    if (window.graficoCategoriasInstance) {
      window.graficoCategoriasInstance.destroy();
    }

    window.graficoCategoriasInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          label: "Gastos por Categoria",
          data: Object.values(categorias),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71", "#F39C12", "#E67E22"
          ],
        }],
      },
    });
  }

  // Gráfico mensal
  function gerarGraficoMensal() {
    const meses = {};
    transacoesAtualizadas.forEach(t => {
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
            backgroundColor: "#2ECC71"
          },
          {
            label: "Saídas",
            data: saidas,
            backgroundColor: "#E74C3C"
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

  // Inicializa tudo
  atualizarResumo();
  gerarGraficoCategorias();
  gerarGraficoMensal();
});
