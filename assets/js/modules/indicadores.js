/*para criar o grafico é passado o objeto que futuramente vira do bd, o ID da tag canvas, 
o que eu quero pegar do objeto,por exemplo, sulco,vida,medida etc... 
e por fim o titulo que vou colocar no grafico*/

export function criarGraficoPneus(listaPneus, identificador, tipoFiltro, tituloGrafico) {
  const canvasElement = document.querySelector(identificador);
  if (!canvasElement) return;

  const ctx = canvasElement.getContext("2d");

  // logica de agrupamento genérica baseada no filtro passado por parâmetro - ex. pneu.garagem , pneu.sulco etc...
  const contagemDados = listaPneus.reduce((acumulador, item) => {
    let chave = item[tipoFiltro];

    // Se o filtro for o sulco, arredondamos para inteiro
    if (tipoFiltro === "sulco") {
      chave = Math.round(chave);
    }

    // Se não tiver a informação, tratamos como "Outros"
    if (!chave) chave = "Outros";

    acumulador[chave] = (acumulador[chave] || 0) + 1;
    return acumulador;
  }, {});

  // 2. Definimos os labels e os dados dinamicamente com base nas chaves encontradas ou num padrão
  let labelsGrafico = Object.keys(contagemDados);

  // Se for sulco, garantimos que exiba de 1 a 18 igual ao seu original
  if (tipoFiltro === "sulco") {
    labelsGrafico = Array.from({ length: 18 }, (_, i) => i + 1);
  }

  const dadosGrafico = labelsGrafico.map((label) => {
    return contagemDados[label] || 0;
  });

  // padrozinando corres paras backgroud e border caso o grafico seja referente ao sulco
  const coresBackgroundSulco = [
    "rgba(220, 38, 38, 0.8)",
    "rgba(220, 38, 38, 0.8)",
    "rgba(220, 38, 38, 0.8)",
    "rgba(220, 38, 38, 0.8)",
    "rgba(234, 88, 12, 0.8)",
    "rgba(234, 88, 12, 0.8)",
    "rgba(234, 88, 12, 0.8)",
    "rgba(22, 163, 74, 0.8)",
    "rgba(22, 163, 74, 0.8)",
    "rgba(22, 163, 74, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(0, 153, 153, 0.8)",
  ];

  const coresBorderSulco = [
    "rgb(220, 38, 38)",
    "rgb(220, 38, 38)",
    "rgb(220, 38, 38)",
    "rgb(220, 38, 38)",
    "rgb(234, 88, 12)",
    "rgb(234, 88, 12)",
    "rgb(234, 88, 12)",
    "rgb(22, 163, 74)",
    "rgb(22, 163, 74)",
    "rgb(22, 163, 74)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
    "rgb(0, 153, 153)",
  ];

  // padronizando cores parão para caso eu crie um grafico de barras que não seja referente ao sulco dos pneus
  const backgroundColorFinal = tipoFiltro === "sulco" ? coresBackgroundSulco : "rgba(0, 153, 153, 0.8)";
  const borderColorFinal = tipoFiltro === "sulco" ? coresBorderSulco : "rgb(0, 153, 153)";

  // montagem do Gráfico com Chart.js - barras
  var chartGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelsGrafico,
      datasets: [
        {
          label: tituloGrafico,
          data: dadosGrafico,
          backgroundColor: backgroundColorFinal,
          borderColor: borderColorFinal,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
