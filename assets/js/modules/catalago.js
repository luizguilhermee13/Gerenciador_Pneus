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

//catalago de pneus no sistema
//pegando os dados do objeto listaPneus -> criando os tr e td e jogando dentro do tbody/tela
export function renderizarCatalago(listaPneus) {
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
}

//catalago de carros no sistema
const tbodyCarros = document.getElementById("CatalagoCarros");
const tbodyCarros2 = document.getElementById("CatalagoCarros2");

export function renderizarCatalagoCarros(listaCarros) {
  if (!tbodyCarros || !tbodyCarros2) return;

  tbodyCarros.innerHTML = "";
  tbodyCarros2.innerHTML = "";

  listaCarros.forEach((item) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", item.prefixo);

    tr.innerHTML = `
      <td>${item.prefixo}</td>
      <td>${item.garagem}</td>
      <td>${item.tamanho}</td>
      <td>${item.cor}</td>
      <td>${item.ano}</td>
      <td>${item.posicao}</td>
      <td>${item.status}</td>`;

    tr.addEventListener("click", () => {
      alert("teste");
    });

    if (item.status == "ativo") {
      tbodyCarros.appendChild(tr);
    } else if (item.status == "gns") {
      tbodyCarros2.appendChild(tr);
    }
  });
}

//catalago de Sucateados no sistema
const tbodySucatas = document.getElementById("catalagoSucatas");

export function renderizarHistoricoSucatas(listaPneus) {
  if (!tbodySucatas) return;

  tbodySucatas.innerHTML = "";

  listaPneus.forEach((item) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", item.nrFogo);

    if (item.motivoRecusa != null)
      tr.innerHTML = `
       <td>${item.nrFogo}</td>
      <td>${item.medida}</td>
      <td>${item.marca}</td>
      <td>${item.vida}</td>
      <td>${item.motivoRecusa}</td>
      <td>${item.garagem}</td>
      <td>${item.posicao}</td>
      <td>${item.dataRecusa}</td>`;

    tr.addEventListener("click", () => {
      alert("teste");
    });

    tbodySucatas.appendChild(tr);
  });
}

const tbodyBaseSucatas = document.getElementById("catalagoSucatasB");

export function renderizarCatalagoSucatas(baseRecusada) {
  if (!tbodyBaseSucatas) return;

  tbodyBaseSucatas.innerHTML = "";

  baseRecusada.forEach((item) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", item.codigoRecusa);

    tr.innerHTML = `
       <td>${item.codigoRecusa}</td>
       <td>${item.motivo}</td>
       <td>${item.motivoSistema}</td>
       <td>${item.local}</td>`;

    tr.addEventListener("click", () => {
      alert("teste");
    });

    tbodyBaseSucatas.appendChild(tr);
  });
}

const tbodyConferencia = document.getElementById("catalagoConferencia1");
const tbodyConferencia2 = document.getElementById("catalagoConferencia2");

export function renderizarCatalagoConferencia(conferenciaSulco) {
  if (!tbodyConferencia) return;
  if (!tbodyConferencia2) return;

  tbodyConferencia.innerHTML = "";
  tbodyConferencia2.innerHTML = "";

  conferenciaSulco.forEach((item) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", item.nrPneu);

    tr.innerHTML = `
       <td>${item.dataConferencia}</td>
       <td>${item.nrPneu}</td>
       <td>${item.veiculo}</td>
       <td>${item.garagem}</td>
       <td>${item.posicao}</td>
       <td>${item.vida}</td>
       <td>${item.marca}</td>
       <td>${item.medida}</td>
       <td>${item.sulco}</td>
       <td>${item.situacao}</td>`;

    tr.addEventListener("click", () => {
      alert("teste");
    });

    if (item.veiculo != null) {
      tbodyConferencia.appendChild(tr);
    } else if (item.status == null) {
      tbodyConferencia2.appendChild(tr);
    }
  });
}
