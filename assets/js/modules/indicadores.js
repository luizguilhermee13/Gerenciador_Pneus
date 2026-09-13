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
  // 1. Pegamos o container onde os gráficos serão colocados
  const container = document.querySelector("#indicadorSucateado");

  // 2. Se não encontrar o container, para a execução
  if (!container) {
    console.warn("Container #indicadorSucateado não encontrado.");
    return;
  }

  // 3. Verificamos se o Chart.js foi carregado
  const ChartJS = window.Chart;

  if (!ChartJS) {
    console.error("Chart.js não foi carregado.");
    return;
  }

  // 4. Filtramos somente os pneus relacionados a sucata
  const pneusSucateados = listaPneus.filter((pneu) => {
    return pneu.status === "Sucata" || pneu.status === "Recusado" || pneu.motivoRecusa !== null;
  });

  console.log("Pneus sucateados:", pneusSucateados);

  // 5. Limpamos o container
  container.innerHTML = "";

  // =====================================================
  // GRÁFICO 1 - MOTIVOS
  // =====================================================

  // Criamos o primeiro container
  const containerMotivos = document.createElement("div");

  containerMotivos.classList.add("graficoSucata");

  containerMotivos.innerHTML = `
    <h3>Pneus Sucateados por Motivo</h3>
    <div class="areaGrafico">
      <canvas id="graficoMotivos"></canvas>
    </div>
  `;

  // Colocamos dentro da section
  container.appendChild(containerMotivos);

  // Pegamos o canvas que acabamos de criar
  const canvasMotivos = document.querySelector("#graficoMotivos");

  const ctxMotivos = canvasMotivos.getContext("2d");

  // =====================================================
  // AGRUPANDO OS MOTIVOS
  // =====================================================

  const contagemMotivos = pneusSucateados.reduce((acumulador, pneu) => {
    const motivo = pneu.motivoRecusa || "Não informado";

    acumulador[motivo] = (acumulador[motivo] || 0) + 1;

    return acumulador;
  }, {});

  console.log("Contagem por motivo:", contagemMotivos);

  const labelsMotivos = Object.keys(contagemMotivos);

  const dadosMotivos = labelsMotivos.map((motivo) => {
    return contagemMotivos[motivo];
  });

  // =====================================================
  // CRIANDO GRÁFICO DE MOTIVOS
  // =====================================================

  new ChartJS(ctxMotivos, {
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
            "rgba(147, 51, 234, 0.8)",
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
    },
  });

  // =====================================================
  // GRÁFICO 2 - MARCAS
  // =====================================================

  const containerMarcas = document.createElement("div");

  containerMarcas.classList.add("graficoSucata");

  containerMarcas.innerHTML = `
    <h3>Pneus Sucateados por Marca</h3>
    <div class="areaGrafico">
      <canvas id="graficoMarcasSucata"></canvas>
    </div>
  `;

  container.appendChild(containerMarcas);

  // Pegamos o segundo canvas
  const canvasMarcas = document.querySelector("#graficoMarcasSucata");

  const ctxMarcas = canvasMarcas.getContext("2d");

  // =====================================================
  // AGRUPANDO AS MARCAS
  // =====================================================

  const contagemMarcas = pneusSucateados.reduce((acumulador, pneu) => {
    const marca = pneu.marca || "Não informado";

    acumulador[marca] = (acumulador[marca] || 0) + 1;

    return acumulador;
  }, {});

  console.log("Contagem por marca:", contagemMarcas);

  const labelsMarcas = Object.keys(contagemMarcas);

  const dadosMarcas = labelsMarcas.map((marca) => {
    return contagemMarcas[marca];
  });

  // =====================================================
  // CRIANDO GRÁFICO DE MARCAS
  // =====================================================

  new ChartJS(ctxMarcas, {
    type: "doughnut",

    data: {
      labels: labelsMarcas,

      datasets: [
        {
          label: "Quantidade de Pneus",
          data: dadosMarcas,

          backgroundColor: [
            "rgba(220, 38, 38, 0.8)",
            "rgba(234, 88, 12, 0.8)",
            "rgba(22, 163, 74, 0.8)",
            "rgba(0, 153, 153, 0.8)",
            "rgba(147, 51, 234, 0.8)",
            "rgba(59, 130, 246, 0.8)",
          ],

          borderWidth: 1,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,
    },
  });
}
