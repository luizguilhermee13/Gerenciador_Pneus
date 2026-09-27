import { API_URL } from "../config/api.js";
import { renderizarCards } from "./cardsEstatisticos.js";

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

const paletaPadrao = [
  "rgba(0, 153, 153, 0.8)",
  "rgba(22, 163, 74, 0.8)",
  "rgba(37, 99, 235, 0.8)",
  "rgba(217, 119, 6, 0.8)",
  "rgba(220, 38, 38, 0.8)",
  "rgba(147, 51, 234, 0.8)",
];

const coresStatus = {
  Estoque: "#2563eb",
  "Em carro": "#16a34a",
  Sucateado: "#dc2626",
  "Na Recapagem": "#d97706",
  "Para Reforma": "#ca8a04",
  "Para Conserto": "#7c3aed",
};

/* destrói qualquer gráfico já anexado a esse canvas, evitando o erro "Canvas is already in use" */
function destruirChartExistente(canvas) {
  const chartExistente = Chart.getChart(canvas);
  if (chartExistente) chartExistente.destroy();
}

/* mesma função de sempre, agora com tipoGrafico opcional (bar, pie, doughnut...) */
export function criarGraficoPneus(listaPneus, identificador, tipoFiltro, tituloGrafico, tipoGrafico = "bar") {
  const canvasElement = document.querySelector(identificador);
  if (!canvasElement) return;

  destruirChartExistente(canvasElement);

  const ctx = canvasElement.getContext("2d");

  const contagemDados = listaPneus.reduce((acumulador, item) => {
    let chave = item[tipoFiltro];
    if (tipoFiltro === "sulco") chave = Math.round(chave);
    if (!chave) chave = "Outros";
    acumulador[chave] = (acumulador[chave] || 0) + 1;
    return acumulador;
  }, {});

  let labelsGrafico = Object.keys(contagemDados);
  if (tipoFiltro === "sulco") {
    labelsGrafico = Array.from({ length: 18 }, (_, i) => i + 1);
  }

  const dadosGrafico = labelsGrafico.map((label) => contagemDados[label] || 0);

  let backgroundColorFinal;
  let borderColorFinal;

  if (tipoFiltro === "sulco") {
    backgroundColorFinal = coresBackgroundSulco;
    borderColorFinal = coresBorderSulco;
  } else if (tipoFiltro === "status") {
    backgroundColorFinal = labelsGrafico.map((label) => coresStatus[label] ?? "#6b7280");
    borderColorFinal = "#ffffff";
  } else if (tipoGrafico === "bar") {
    backgroundColorFinal = "rgba(0, 153, 153, 0.8)";
    borderColorFinal = "rgb(0, 153, 153)";
  } else {
    backgroundColorFinal = paletaPadrao;
    borderColorFinal = "#ffffff";
  }

  new Chart(ctx, {
    type: tipoGrafico,
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
      plugins: {
        title: { display: true, text: tituloGrafico },
        legend: { display: tipoGrafico !== "bar", position: "bottom" },
      },
      scales: tipoGrafico === "bar" ? { y: { beginAtZero: true, ticks: { precision: 0 } } } : undefined,
    },
  });
}

/* orquestra os 5 gráficos da tela de indicadores de Pneus, com um fetch só */
export async function renderizarIndicadoresPneus() {
  const container = document.getElementById("indicadores_pneus");
  if (!container) return;

  try {
    const resposta = await fetch(`${API_URL}/api/pneus`);
    if (!resposta.ok) throw new Error("Erro ao buscar pneus para os indicadores");

    const pneus = await resposta.json();

    criarGraficoPneus(pneus, "#graficoPneusVida", "vida", "Pneus por Vida", "bar");
    criarGraficoPneus(pneus, "#graficoPneusMarca", "marca", "Pneus por Marca", "doughnut");

    const itaquera = pneus.filter((p) => p.garagem?.toLowerCase() === "itaquera");
    const limeira = pneus.filter((p) => p.garagem?.toLowerCase() === "limeira");
    const juizDeFora = pneus.filter((p) => p.garagem?.toLowerCase().includes("juiz"));

    criarGraficoPneus(itaquera, "#graficoGaragemItaquera", "status", "Itaquera — por Status", "bar");
    criarGraficoPneus(limeira, "#graficoGaragemLimeira", "status", "Limeira — por Status", "bar");
    criarGraficoPneus(juizDeFora, "#graficoGaragemJuizFora", "status", "Juiz de Fora — por Status", "bar");
  } catch (error) {
    console.error("Erro ao carregar indicadores de pneus:", error);
  }
}

const coresColetaStatus = {
  "Na Reformadora": "#d97706",
  Entregue: "#16a34a",
  Recusado: "#dc2626",
};

export async function renderizarIndicadoresRecapagem() {
  const container = document.getElementById("graficosRecapagem");
  if (!container) return;

  container.innerHTML = "";

  try {
    const [statusResp, custoResp, servicoResp] = await Promise.all([
      fetch(`${API_URL}/api/coleta/indicadores/status`),
      fetch(`${API_URL}/api/coleta/indicadores/custo`),
      fetch(`${API_URL}/api/coleta/indicadores/servico`),
    ]);

    const status = await statusResp.json();
    const custo = await custoResp.json();
    const servico = await servicoResp.json();

    const grid = document.createElement("div");
    grid.className = "graficos-sucata";
    grid.innerHTML = `
      <div class="graficoSucata"><h3>Pneus por Status na Recapagem</h3><div class="areaGrafico"><canvas id="graficoColetaStatus"></canvas></div></div>
      <div class="graficoSucata"><h3>Custo por Recapadora (R$)</h3><div class="areaGrafico"><canvas id="graficoColetaCusto"></canvas></div></div>
      <div class="graficoSucata"><h3>Serviços Realizados</h3><div class="areaGrafico"><canvas id="graficoColetaServico"></canvas></div></div>
    `;
    container.appendChild(grid);

    new Chart(grid.querySelector("#graficoColetaStatus"), {
      type: "bar",
      data: {
        labels: status.map((s) => s.titulo),
        datasets: [
          {
            label: "Pneus por Status",
            data: status.map((s) => s.quantidade),
            backgroundColor: status.map((s) => coresColetaStatus[s.titulo] ?? "#6b7280"),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });

    new Chart(grid.querySelector("#graficoColetaCusto"), {
      type: "bar",
      data: {
        labels: custo.map((c) => c.recapadora),
        datasets: [
          {
            label: "Custo (R$)",
            data: custo.map((c) => c.custo),
            backgroundColor: "rgba(0, 153, 153, 0.8)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: { legend: { display: false } },
      },
    });

    new Chart(grid.querySelector("#graficoColetaServico"), {
      type: "doughnut",
      data: {
        labels: servico.map((s) => s.titulo),
        datasets: [
          {
            data: servico.map((s) => s.quantidade),
            backgroundColor: paletaPadrao,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
      },
    });
  } catch (error) {
    console.error("Erro ao carregar indicadores de recapagem:", error);
  }
}

function classificarSulco(pneu) {
  const sulco = Number(pneu.sulco);
  if (pneu.status === "Sucateado") return "Sucateado";
  if (pneu.status === "Para Reforma") return "Para Reforma";
  if (pneu.status === "Para Conserto") return "Para Conserto";

  if (pneu.vida === "N") {
    if (sulco >= 9) return "Novo";
    if (sulco >= 3) return "Meia Vida";
    return "Crítico";
  }

  if (sulco >= 7.5) return "Reformado";
  if (sulco >= 3) return "Meia Vida";
  return "Crítico";
}

const coresSulco = {
  Novo: "#16a34a",
  "Meia Vida": "#2563eb",
  Reformado: "#0891b2",
  "Para Reforma": "#d97706",
  "Para Conserto": "#ca8a04",
  Sucateado: "#dc2626",
  Crítico: "#7c3aed",
};

export async function renderizarIndicadoresSulco() {
  const cardsContainer = document.getElementById("IndicadorSulco");
  if (!cardsContainer) return;

  try {
    const resposta = await fetch(`${API_URL}/api/pneus`);
    if (!resposta.ok) throw new Error("Erro ao buscar pneus");
    const pneus = await resposta.json();

    const contagem = {};
    pneus.forEach((p) => {
      const categoria = classificarSulco(p);
      contagem[categoria] = (contagem[categoria] || 0) + 1;
    });

    const dadosCards = Object.entries(contagem).map(([titulo, resultado]) => ({
      titulo,
      resultado,
      cor: coresSulco[titulo] ?? "#6b7280",
    }));
    renderizarCards(dadosCards, "#IndicadorSulco");

    const itaquera = pneus.filter((p) => p.garagem?.toLowerCase() === "itaquera");
    const limeira = pneus.filter((p) => p.garagem?.toLowerCase() === "limeira");
    const juizDeFora = pneus.filter((p) => p.garagem?.toLowerCase().includes("juiz"));

    criarGraficoPneus(itaquera, "#graphSulGaragem1", "sulco", "Sulco — Itaquera");
    criarGraficoPneus(limeira, "#graphSulGaragem2", "sulco", "Sulco — Limeira");
    criarGraficoPneus(juizDeFora, "#graphSulGaragem3", "sulco", "Sulco — Juiz de Fora");
    criarGraficoPneus(pneus, "#graphSulcoTotal", "sulco", "Sulco — Total da Frota");
    criarGraficoSulcoMedioPorVida(pneus, "#graphSulcoVida");
  } catch (error) {
    console.error("Erro ao carregar indicadores de sulco:", error);
  }
}

export async function renderizarIndicadoresSucata() {
  const container = document.getElementById("indicadorSucateado");
  if (!container) return;

  container.innerHTML = "";

  try {
    const [motivoResp, garagemResp, marcaResp] = await Promise.all([
      fetch(`${API_URL}/api/sucatas/indicadores/motivo`),
      fetch(`${API_URL}/api/sucatas/indicadores/garagem`),
      fetch(`${API_URL}/api/sucatas/indicadores/marca`),
    ]);

    const motivo = await motivoResp.json();
    const garagem = await garagemResp.json();
    const marca = await marcaResp.json();

    container.innerHTML = `
      <div class="graficoSucata"><h3>Sucatas por Motivo</h3><div class="areaGrafico"><canvas id="graficoSucataMotivo"></canvas></div></div>
      <div class="graficoSucata"><h3>Sucatas por Garagem</h3><div class="areaGrafico"><canvas id="graficoSucataGaragem"></canvas></div></div>
      <div class="graficoSucata"><h3>Sucatas por Marca</h3><div class="areaGrafico"><canvas id="graficoSucataMarca"></canvas></div></div>
    `;

    new Chart(container.querySelector("#graficoSucataMotivo"), {
      type: "bar",
      data: {
        labels: motivo.map((m) => m.titulo),
        datasets: [{ label: "Sucatas", data: motivo.map((m) => m.quantidade), backgroundColor: "rgba(220, 38, 38, 0.8)" }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });

    new Chart(container.querySelector("#graficoSucataGaragem"), {
      type: "doughnut",
      data: {
        labels: garagem.map((g) => g.titulo ?? "Sem garagem"),
        datasets: [{ data: garagem.map((g) => g.quantidade), backgroundColor: paletaPadrao }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
    });

    new Chart(container.querySelector("#graficoSucataMarca"), {
      type: "doughnut",
      data: {
        labels: marca.map((m) => m.titulo),
        datasets: [{ data: marca.map((m) => m.quantidade), backgroundColor: paletaPadrao }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
    });
  } catch (error) {
    console.error("Erro ao carregar indicadores de sucata:", error);
  }
}

export function criarGraficoMediaSulco(pneus, identificador, campoAgrupador, tituloGrafico) {
  const canvas = document.querySelector(identificador);
  if (!canvas) return;

  destruirChartExistente(canvas);

  const soma = {};
  const qtd = {};

  pneus.forEach((p) => {
    const chave = p[campoAgrupador] || "Outros";
    soma[chave] = (soma[chave] || 0) + Number(p.sulco);
    qtd[chave] = (qtd[chave] || 0) + 1;
  });

  const labels = Object.keys(soma);
  const medias = labels.map((k) => Number((soma[k] / qtd[k]).toFixed(1)));

  new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: { labels, datasets: [{ label: "Sulco médio (mm)", data: medias, backgroundColor: "rgba(0, 153, 153, 0.8)" }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { title: { display: true, text: tituloGrafico }, legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

// mantém compatibilidade com o que já roda na tela de Sulco
function criarGraficoSulcoMedioPorVida(pneus, identificador) {
  criarGraficoMediaSulco(pneus, identificador, "vida", "Sulco Médio por Vida");
}

/* dashboard: ids próprios (dashGraficoPneusMarca / dashSulcoGaragem / dashSulcoVida),
   sem repetir nenhum id usado em outras telas */
export async function renderizarGraficosDashboard() {
  const temAlgumCanvas =
    document.getElementById("dashGraficoPneusMarca") ||
    document.getElementById("dashSulcoGaragem") ||
    document.getElementById("dashSulcoVida");

  if (!temAlgumCanvas) return;

  try {
    const resposta = await fetch(`${API_URL}/api/pneus`);
    if (!resposta.ok) throw new Error("Erro ao buscar pneus para o dashboard");

    const pneus = await resposta.json();

    criarGraficoPneus(pneus, "#dashGraficoPneusMarca", "marca", "Pneus por Marca", "doughnut");
    criarGraficoMediaSulco(pneus, "#dashSulcoGaragem", "garagem", "Sulco Médio por Garagem");
    criarGraficoMediaSulco(pneus, "#dashSulcoVida", "vida", "Sulco Médio por Vida");
  } catch (error) {
    console.error("Erro ao carregar gráficos do dashboard:", error);
  }
}
