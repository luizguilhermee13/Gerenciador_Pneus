import { API_URL } from "../config/api.js";

export const dadosDashboard = [
  {
    titulo: "Total no Sistema",
    resultado: 4.935,
    cor: "#009999",
    id: "emCarro",
  },

  {
    titulo: "Em Carros",
    resultado: 3.065,
    cor: "#16a34a",
    id: "borracharia",
  },

  {
    titulo: "Na Recapagem",
    resultado: 691,
    cor: "#2563eb",
    id: "almoxarifado",
  },

  {
    titulo: "Sucatas p/ Baixa",
    resultado: 171,
    cor: "#dc2626",
    id: "recapadora",
  },

  {
    titulo: "Sulco Crítico ≤4mm",
    resultado: 88,
    cor: "#d97706",
    id: "sucata",
  },
];

export const dadosConferirc = [
  {
    titulo: "Total Conferidos",
    resultado: 2,
    cor: "#009999",
  },
  {
    titulo: "Crítico (≤2mm)",
    resultado: 3,
    cor: "#dc2626",
  },
  {
    titulo: "Atenção (3-4mm)",
    resultado: 7,
    cor: "#ea580c",
  },
  {
    titulo: "Alerta (5-7mm)",
    resultado: 3,
    cor: "#f59e0b",
  },
];

export const dadosConferire = [
  {
    titulo: "Em Estoque",
    resultado: 2,
    cor: "#009999",
  },
  {
    titulo: "Novos (N)",
    resultado: 7,
    cor: "#16a34a",
  },
  {
    titulo: "Sulco ≤7mm",
    resultado: 3,
    cor: "#ea580c",
  },
  {
    titulo: "Reformados",
    resultado: 3,
    cor: "#2563eb",
  },
];

export const dadosSulcos = [
  {
    titulo: "Total",
    resultado: 2,
    cor: "#dc2626",
  },
  {
    titulo: "Banda Rodagem",
    resultado: 7,
    cor: "#ea580c",
  },
  {
    titulo: "Avaria",
    resultado: 3,
    cor: "#f59e0b",
  },
  {
    titulo: "Talão",
    resultado: 3,
    cor: "#9333ea",
  },
];

// Cards temporários calculados a partir de uma lista de pneus
export function cardSulcoDinamico(listaPneus) {
  let critico = 0;
  let alerta = 0;
  let bom = 0;

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
    {
      titulo: "Sulco ≤ 4mm (Crítico)",
      resultado: critico,
      cor: "#dc2626",
    },
    {
      titulo: "Sulco 5–7mm (Alerta)",
      resultado: alerta,
      cor: "#ea580c",
    },
    {
      titulo: "Sulco ≥ 8mm (Bom)",
      resultado: bom,
      cor: "#009999",
    },
  ];
}

export function cardPneuDinamico(dados) {
  let emCarro = 0;
  let borracharia = 0;
  let almoxarifado = 0;
  let recapadora = 0;
  let sucateado = 0;

  dados.forEach((pneu) => {
    if (pneu.status.toLowerCase() == "em carro") {
      emCarro++;
    } else if (pneu.status.toLowerCase() == "borracharia") {
      borracharia++;
    } else if (pneu.status.toLowerCase() == "almoxarifado") {
      almoxarifado++;
    } else if (pneu.status.toLowerCase() == "recapadora") {
      recapadora++;
    } else if (pneu.status.toLowerCase() == "sucata") {
      sucateado++;
    }
  });

  return [
    {
      titulo: "Em Carro",
      resultado: emCarro,
      cor: "#009999",
    },
    {
      titulo: "Borracharia",
      resultado: borracharia,
      cor: "#d97706",
    },
    {
      titulo: "Almoxarifado",
      resultado: almoxarifado,
      cor: "#16a34a",
    },
    {
      titulo: "Recapadora",
      resultado: recapadora,
      cor: "#2563eb",
    },
    {
      titulo: "Sucata",
      resultado: sucateado,
      cor: "#dc2626",
    },
  ];
}

// Renderiza cards a partir de um array local
export function renderizarCards(dados, containerPage) {
  const cards = document.querySelector(containerPage);

  if (!cards) return;

  cards.innerHTML = "";

  dados.forEach((item) => {
    const cardHTML = `
      <div
        class="card"
        id="${item.id || ""}"
        style="color: ${item.cor}"
      >
        <p>${item.titulo}</p>

        <span>
          ${item.resultado}
        </span>
      </div>
    `;

    cards.innerHTML += cardHTML;
  });
}

// Renderiza cards dinâmicos vindos da API
export async function cardDinamico(rota, identificador, usarIdGaragem = false) {
  try {
    const resposta = await fetch(`${API_URL}${rota}`);

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar dados: ${rota}`);
    }

    const dados = await resposta.json();

    const cards = document.querySelector(identificador);

    if (!cards) return;

    cards.innerHTML = "";

    dados.forEach((item) => {
      const idCard = usarIdGaragem && item.id ? `id="garagem-${item.id}"` : "";

      const cardHTML = `
        <div class="card" ${idCard}>
          <p>${item.titulo}</p>

          <span style="color: ${item.cor}">
            ${item.resultado}
          </span>
        </div>
      `;

      cards.innerHTML += cardHTML;
    });
  } catch (erro) {
    console.error(`Erro ao carregar cards ${rota}:`, erro);
  }
}
