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
export function renderizarCatalago(listaPneus) {
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
