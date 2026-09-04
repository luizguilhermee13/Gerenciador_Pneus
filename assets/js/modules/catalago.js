//dados ficticios até a implementar o BD
export const listaPneus = [
  {
    nrFogo: "MBR-1001",
    marca: "Bridgestone",
    vida: "R1",
    status: "Em carro",
    garagem: "Itaquera",
    posicao: "077-089 / TDE",
    sulco: 10.2,
    km: "68.000",
    medida: "275/80 R22.5",
    entrada: "05/01/2026",
  },
  {
    nrFogo: "MBR-1002",
    marca: "Michelin",
    vida: "N",
    status: "Em carro",
    garagem: "Itaquera",
    posicao: "077-001 / TEE",
    sulco: 14.8,
    km: "12.000",
    medida: "275/80 R22.5",
    entrada: "12/01/2026",
  },
  {
    nrFogo: "MBR-1003",
    marca: "Goodyear",
    vida: "R1",
    status: "Sucata",
    garagem: "Itaquera",
    posicao: "—",
    sulco: 3.1,
    km: "42.000",
    medida: "275/80 R22.5",
    entrada: "10/01/2026",
  },
  {
    nrFogo: "MBR-1004",
    marca: "Continental",
    vida: "N",
    status: "Em carro",
    garagem: "Juiz de Fora",
    posicao: "028-045 / DE",
    sulco: 16.2,
    km: "8.000",
    medida: "275/80 R22.5",
    entrada: "15/02/2026",
  },
  {
    nrFogo: "MBR-1005",
    marca: "Pirelli",
    vida: "R2",
    status: "Em carro",
    garagem: "Limeira",
    posicao: "027-018 / TDE",
    sulco: 8.7,
    km: "92.000",
    medida: "275/80 R22.5",
    entrada: "20/11/2025",
  },
  {
    nrFogo: "MBR-1006",
    marca: "Bridgestone",
    vida: "N",
    status: "Almoxarifado",
    garagem: "Juiz de Fora",
    posicao: "—",
    sulco: 18.0,
    km: "0",
    medida: "275/80 R22.5",
    entrada: "01/03/2026",
  },
  {
    nrFogo: "MBR-1007",
    marca: "Michelin",
    vida: "R2",
    status: "Sucata",
    garagem: "Itaquera",
    posicao: "—",
    sulco: 1.2,
    km: "88.000",
    medida: "275/80 R22.5",
    entrada: "05/10/2025",
  },
  {
    nrFogo: "MBR-1008",
    marca: "Goodyear",
    vida: "R1",
    status: "Borracharia",
    garagem: "Itaquera",
    posicao: "—",
    sulco: 3.2,
    km: "52.000",
    medida: "275/80 R22.5",
    entrada: "18/12/2025",
  },
  {
    nrFogo: "MBR-1009",
    marca: "Continental",
    vida: "R2",
    status: "Borracharia",
    garagem: "Itaquera",
    posicao: "—",
    sulco: 13.0,
    km: "71.000",
    medida: "275/80 R22.5",
    entrada: "14/01/2026",
  },
  {
    nrFogo: "MBR-1010",
    marca: "Pirelli",
    vida: "R2",
    status: "Em carro",
    garagem: "Juiz de Fora",
    posicao: "028-062 / TEE",
    sulco: 7.4,
    km: "78.000",
    medida: "275/80 R22.5",
    entrada: "02/11/2025",
  },
];

const tbody = document.getElementById("conteudoCatalago");
const painel = document.getElementById("painel-lateral");

//usando o id de cada objeto como parametro, pega o objeto todo e joga dentro do painel lateral
export function renderizarPainel(pneu) {
  if (!painel) return;
  painel.innerHTML = `
    <div class="painel-card">
      <div class="painel-header">
      <div class="painel-titulo">
        <h2>${pneu.nrFogo}</h2>
        <p>${pneu.marca} · ${pneu.medida}</p>
      </div>
        <span class="painel-vida">${pneu.vida}</span>
      </div>
      <div class="painel-corpo">
        <div class="painel-linha">
          <span class="painel-label">Status</span>
          <span class="painel-valor">${pneu.status}</span>
        </div>
        <div class="painel-linha">
          <span class="painel-label">Garagem</span>
          <span class="painel-valor">${pneu.garagem}</span>
        </div>
        <div class="painel-linha">
          <span class="painel-label">Posição</span>
          <span class="painel-valor">${pneu.posicao}</span>
        </div>
        <div class="painel-linha">
          <span class="painel-label">Sulco atual</span>
          <span class="painel-valor sulco-destaque">${pneu.sulco} mm</span>
        </div>
        <div class="painel-linha">
          <span class="painel-label">Km rodados</span>
          <span class="painel-valor">${pneu.km} km</span>
        </div>
        <div class="painel-linha">
          <span class="painel-label">Medida</span>
          <span class="painel-valor">${pneu.medida} km</span>
        </div>
        <div class="painel-linha ultima">
          <span class="painel-label">Data de Entrada</span>
          <span class="painel-valor">${pneu.entrada}</span>
        </div>
      </div>
    </div>
  `;
}

//pegando os dados do objeto listaPneus -> criando os tr e td e jogando dentro do tbody/tela
export function renderizarCatalago() {
  document.addEventListener("DOMContentLoaded", () => {
    if (!tbody) return;
    listaPneus.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", item.nrFogo);

      tr.innerHTML = `
      <td>${item.nrFogo}</td>
      <td>${item.medida}</td>
      <td>${item.marca}</td>
      <td>${item.vida}</td>
      <td>${item.status}</td>
      <td>${item.garagem}</td>
      <td>${item.posicao}</td>
      <td>${item.sulco}</td>
      <td>${item.km}</td>`;

      tr.addEventListener("click", () => {
        renderizarPainel(item);
      });

      tbody.appendChild(tr);
    });
  });
}

//pegando o quantitativo de cada status para colocar no card - temporario
let emCarro = 0;
let borracharia = 0;
let almoxarifado = 0;
let recapadora = 0;
let sucateado = 0;

export function contador(listaPneus) {
  listaPneus.forEach((pneu) => {
    if (pneu.status.toLowerCase() == "em carro") {
      return emCarro++;
    }

    if (pneu.status.toLowerCase() == "borracharia") {
      return borracharia++;
    }

    if (pneu.status.toLowerCase() == "almoxarifado") {
      return almoxarifado++;
    }

    if (pneu.status.toLowerCase() == "recapadora") {
      return recapadora++;
    }

    if (pneu.status.toLowerCase() == "sucata") {
      return sucateado++;
    }
  });

  let metricaPneuCarro = document.querySelector("#emCarro span");
  let metricaPneuBorracharia = document.querySelector("#borracharia span");
  let metricaPneuAlmoxarifado = document.querySelector("#almoxarifado span");
  let metricaPneuRecapagem = document.querySelector("#recapadora span");
  let metricaPneuSucatado = document.querySelector("#sucata span");

  if (!metricaPneuCarro || !metricaPneuBorracharia || !metricaPneuAlmoxarifado || !metricaPneuRecapagem || !metricaPneuSucatado) {
    return;
  }

  metricaPneuCarro.innerHTML = emCarro;
  metricaPneuBorracharia.innerHTML = borracharia;
  metricaPneuAlmoxarifado.innerHTML = almoxarifado;
  metricaPneuRecapagem.innerHTML = recapadora;
  metricaPneuSucatado.innerHTML = sucateado;
}
