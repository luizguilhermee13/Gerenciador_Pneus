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

/* graficos temporario abaixo */
export function criarGraficosSucata(listaPneus) {
  const container = document.querySelector("#indicadorSucateado");

  if (!container) return;

  const ChartJS = window.Chart;

  if (!ChartJS) {
    console.error("Chart.js não foi carregado.");
    return;
  }

  const pneusSucateados = listaPneus.filter((pneu) => {
    return pneu.status === "Sucata" || pneu.status === "Recusado" || pneu.motivoRecusa !== null;
  });

  container.innerHTML = "";

  /* ===================================
     DADOS - MOTIVOS
  =================================== */

  const contagemMotivos = pneusSucateados.reduce((acumulador, pneu) => {
    const motivo = pneu.motivoRecusa || "Não informado";

    acumulador[motivo] = (acumulador[motivo] || 0) + 1;

    return acumulador;
  }, {});

  const labelsMotivos = Object.keys(contagemMotivos);

  const dadosMotivos = Object.values(contagemMotivos);

  /* ===================================
     GRÁFICO - MOTIVOS
  =================================== */

  const containerMotivos = document.createElement("div");

  containerMotivos.classList.add("graficoSucata");

  containerMotivos.innerHTML = `
    <h3>Pneus Sucateados por Motivo</h3>

    <div class="areaGrafico">
      <canvas id="graficoMotivos"></canvas>
    </div>
  `;

  container.appendChild(containerMotivos);

  const canvasMotivos = containerMotivos.querySelector("#graficoMotivos");

  new ChartJS(canvasMotivos, {
    type: "bar",

    data: {
      labels: labelsMotivos,

      datasets: [
        {
          label: "Quantidade de Pneus",

          data: dadosMotivos,

          backgroundColor: [
            "rgba(220, 38, 38, 0.8)",
            "rgba(234, 88, 12, 0.8)",
            "rgba(22, 163, 74, 0.8)",
            "rgba(0, 153, 153, 0.8)",
            "rgba(37, 99, 235, 0.8)",
          ],

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

          ticks: {
            stepSize: 1,
          },
        },
      },

      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });

  /* ===================================
     DADOS - MARCAS
  =================================== */

  const contagemMarcas = pneusSucateados.reduce((acumulador, pneu) => {
    const marca = pneu.marca || "Não informado";

    acumulador[marca] = (acumulador[marca] || 0) + 1;

    return acumulador;
  }, {});

  const labelsMarcas = Object.keys(contagemMarcas);

  const dadosMarcas = Object.values(contagemMarcas);

  /* ===================================
     GRÁFICO - MARCAS
  =================================== */

  const containerMarcas = document.createElement("div");

  containerMarcas.classList.add("graficoSucata");

  containerMarcas.innerHTML = `
    <h3>Pneus Sucateados por Marca</h3>

    <div class="areaGrafico">
      <canvas id="graficoMarcasSucata"></canvas>
    </div>
  `;

  container.appendChild(containerMarcas);

  const canvasMarcas = containerMarcas.querySelector("#graficoMarcasSucata");

  new ChartJS(canvasMarcas, {
    type: "doughnut",

    data: {
      labels: labelsMarcas,

      datasets: [
        {
          label: "Quantidade de Pneus",

          data: dadosMarcas,

          backgroundColor: [
            "rgba(0, 153, 153, 0.8)",
            "rgba(22, 163, 74, 0.8)",
            "rgba(37, 99, 235, 0.8)",
            "rgba(217, 119, 6, 0.8)",
            "rgba(220, 38, 38, 0.8)",
          ],

          borderWidth: 1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}
