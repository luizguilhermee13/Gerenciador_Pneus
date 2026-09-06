export const dadosDashboard = [
  { titulo: "Total no Sistema", resultado: 4.935, cor: "#009999", id: "emCarro" },
  { titulo: "Em Carros", resultado: 3.065, cor: "#16a34a", id: "borracharia" },
  { titulo: "Na Recapagem", resultado: 691, cor: "#2563eb", id: "almoxarifado" },
  { titulo: "Sucatas p/ Baixa", resultado: 171, cor: "#dc2626", id: "recapadora" },
  { titulo: "Sulco Crítico ≤4mm", resultado: 88, cor: "#d97706", id: "sucata" },
];

export const dadosPneus = [
  { titulo: "Em carro", resultado: 24, cor: "#009999", id: "emCarro" },
  { titulo: "Borracharia", resultado: 2, cor: "#d97706", id: "borracharia" },
  { titulo: "Almoxarifado", resultado: 1, cor: "#16a34a", id: "almoxarifado" },
  { titulo: "Recapadora", resultado: 1, cor: "#2563eb", id: "recapadora" },
  { titulo: "Sucata", resultado: 10, cor: "#dc2626", id: "sucata" },
];

export const dadosVeiculos = [
  { titulo: "São Francisco", resultado: 224, cor: "#009999" },
  { titulo: "Vitorino", resultado: 202, cor: "#dc2626" },
  { titulo: "Bandeirantes", resultado: 145, cor: "#2563eb" },
];

export const dadosVeiculosGNS = [
  { titulo: "São Francisco", resultado: 20, cor: "#009999" },
  { titulo: "Vitorino", resultado: 15, cor: "#dc2626" },
  { titulo: "Bandeirantes", resultado: 4, cor: "#2563eb" },
];

export const dadosMovimentacao = [
  { titulo: "Total Movimentações", resultado: 40, cor: "#009999" },
  { titulo: "Montagens (Ago/26)", resultado: 13, cor: "#dc2626" },
  { titulo: "Rodízios Realizados", resultado: 3, cor: "#9333ea" },
  { titulo: "Descartes", resultado: 2, cor: "#2563eb" },
];

export const dadosEstoque = [
  { titulo: "Novo", resultado: 7, cor: "#009999" },
  { titulo: "Reformado", resultado: 24, cor: "#2563eb" },
  { titulo: "Meia Vida", resultado: 18, cor: "#f59e0b" },
  { titulo: "C.Interno", resultado: 3, cor: "#ea580c" },
  { titulo: "P/Reforma", resultado: 15, cor: "#9333ea" },
  { titulo: "Sucateado", resultado: 2, cor: "#dc2626" },
];

export const dadosEstoqueDivergente = [
  { titulo: "Total Divergências", resultado: 2, cor: "" },
  { titulo: "Medidas Afetadas", resultado: 3, cor: "#ea580c" },
  { titulo: "Medidas OK", resultado: 7, cor: "#009999" },
];

export const dadosInfo = [
  { titulo: "Reformados", resultado: 2, cor: "#009999" },
  { titulo: "Recusados", resultado: 3, cor: "#dc2626" },
  { titulo: "Total Retornado", resultado: 7, cor: "#000000" },
];

export const dadosStatus = [
  { titulo: "Pendentes", resultado: 2, cor: "#ea580c" },
  { titulo: "Concluídas", resultado: 3, cor: "#009999" },
  { titulo: "Total", resultado: 7, cor: "#6b7280" },
];

export const dadosRecapagem = [
  { titulo: "Meta Mensal", resultado: 2, cor: "#009999" },
  { titulo: "Gasto Mai/26", resultado: 3, cor: "#ea580c" },
  { titulo: "Saldo", resultado: 7, cor: "#16a34a" },
  { titulo: "Tx. Recusa", resultado: 3, cor: "#dc2626" },
];

export const dadosConferirc = [
  { titulo: "Total Conferidos", resultado: 2, cor: "#009999" },
  { titulo: "Crítico (≤2mm)", resultado: 3, cor: "#dc2626" },
  { titulo: "Atenção (3-4mm)", resultado: 7, cor: "#ea580c" },
  { titulo: "Alerta (5-7mm)", resultado: 3, cor: "#f59e0b" },
];

export const dadosConferire = [
  { titulo: "Em Estoque", resultado: 2, cor: "#009999" },
  { titulo: "Novos (N)", resultado: 7, cor: "#16a34a" },
  { titulo: "Sulco ≤7mm", resultado: 3, cor: "#ea580c" },
  { titulo: "Reformados", resultado: 3, cor: "#2563eb" },
];

export const dadosSulcos = [
  { titulo: "Total", resultado: 2, cor: "#dc2626" },
  { titulo: "Banda Rodagem", resultado: 7, cor: "#ea580c" },
  { titulo: "Avaria", resultado: 3, cor: "#f59e0b" },
  { titulo: "Talão", resultado: 3, cor: "#9333ea" },
];

export const dadosIndicadorSulco = [
  { titulo: "Total Sucatas", resultado: 2, cor: "#dc2626" },
  { titulo: "Vida Média p/ Sucata", resultado: 7, cor: "#ea580c" },
  { titulo: "Sulco Médio Final", resultado: 3, cor: "#f59e0b" },
  { titulo: "Custo Estimado", resultado: 3, cor: "#9333ea" },
];

export function calcularDadosSulcoDinamico(listaPneus) {
  let critico = 0; // ≤ 4mm
  let alerta = 0; // 5 a 7mm
  let bom = 0; // ≥ 8mm

  listaPneus.forEach((item) => {
    const sulco = Math.round(item.sulco);
    if (sulco <= 4) {
      critico++;
    } else if (sulco >= 5 && sulco <= 7) {
      alerta++;
    } else if (sulco >= 8) {
      bom++;
    }
  });

  return [
    { titulo: "Sulco ≤ 4mm (Crítico)", resultado: critico, cor: "#dc2626" },
    { titulo: "Sulco 5–7mm (Alerta)", resultado: alerta, cor: "#ea580c" },
    { titulo: "Sulco ≥ 8mm (Bom)", resultado: bom, cor: "#009999" },
  ];
}

// Função genérica para renderizar os cards na tela
export function renderizarCards(dados, containerPage) {
  const cards = document.querySelector(containerPage);
  if (!cards) return;

  cards.innerHTML = "";

  dados.forEach((item) => {
    const cardHTML = `<div class="card" id="${item.id}" style="color: ${item.cor}">

           <p>${item.titulo}</p>

           <span>${item.resultado}</span>

        </div>`;

    cards.innerHTML += cardHTML;
  });
}
