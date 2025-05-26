document.addEventListener("DOMContentLoaded", function() {
  // Pega transações do LocalStorage
  const dadosLocais = localStorage.getItem("transacoes");
  let transacoes = [];

  if (dadosLocais) {
    transacoes = JSON.parse(dadosLocais);
  } else {
    // Dados mock iniciais, caso não haja nada no localStorage
    transacoes = [
      { tipo: "entrada", valor: 2500, categoria: "Salário", data: "2025-05-01" },
      { tipo: "saida", valor: 600, categoria: "Alimentação", data: "2025-05-02" },
      { tipo: "saida", valor: 300, categoria: "Transporte", data: "2025-05-03" },
      { tipo: "saida", valor: 250, categoria: "Lazer", data: "2025-05-05" },
      { tipo: "entrada", valor: 500, categoria: "Freelance", data: "2025-05-07" },
      { tipo: "saida", valor: 100, categoria: "Saúde", data: "2025-05-10" },
    ];
  }

  // Função para atualizar os valores de resumo
  function atualizarResumo() {
    let entradas = 0, saidas = 0;
    transacoes.forEach(t => {
      if (t.tipo === "entrada") entradas += t.valor;
      else if (t.tipo === "saida") saidas += t.valor;
    });

    const saldo = entradas - saidas;

    document.getElementById("valorEntradas").textContent = `R$ ${entradas.toFixed(2)}`;
    document.getElementById("valorSaidas").textContent = `R$ ${saidas.toFixed(2)}`;
    document.getElementById("valorSaldo").textContent = `R$ ${saldo.toFixed(2)}`;
  }

  // Função para gerar gráfico de categorias
  function gerarGraficoCategorias() {
    const categorias = {};
    transacoes.filter(t => t.tipo === "saida").forEach(t => {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + t.valor;
    });

    const ctx = document.getElementById("graficoCategorias").getContext("2d");

    if (window.graficoCategoriasInstance) {
      window.graficoCategoriasInstance.destroy(); // destrói gráfico antigo para atualizar
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

  // Função para gerar gráfico comparativo mensal
  function gerarGraficoMensal() {
    // Agrupa entradas e saídas por mês/ano
    const meses = {};
    transacoes.forEach(t => {
      const d = new Date(t.data);
      if (isNaN(d)) return;
      const mesAno = `${d.getMonth()+1}-${d.getFullYear()}`; // ex: 5-2025
      if (!meses[mesAno]) meses[mesAno] = { entrada: 0, saida: 0 };
      meses[mesAno][t.tipo] += t.valor;
    });

    const labels = Object.keys(meses).sort((a,b) => {
      // Ordena por ano e mês
      const [m1,y1] = a.split("-").map(Number);
      const [m2,y2] = b.split("-").map(Number);
      return y1 === y2 ? m1 - m2 : y1 - y2;
    });

    const entradasData = labels.map(l => meses[l].entrada);
    const saidasData = labels.map(l => meses[l].saida);

    const ctx = document.getElementById("graficoMensal").getContext("2d");

    if (window.graficoMensalInstance) {
      window.graficoMensalInstance.destroy();
    }

    window.graficoMensalInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.map(l => {
          const [mes, ano] = l.split("-");
          return `${mes}/${ano}`;
        }),
        datasets: [
          {
            label: "Entradas",
            data: entradasData,
            backgroundColor: "#2ECC71",
          },
          {
            label: "Saídas",
            data: saidasData,
            backgroundColor: "#E74C3C",
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }

  // Executa as funções
  atualizarResumo();
  gerarGraficoCategorias();
  gerarGraficoMensal();
});
