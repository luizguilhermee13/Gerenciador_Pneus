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

/* catalago VEÍCULOS GNS  */
export async function renderizarCatalagoCarros() {
  try {
    const resposta = await fetch("http://localhost:3000/api/veiculos");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados dos veículos");
    }

    const carros = await resposta.json();

    const tbodyCarros = document.getElementById("CatalagoCarros");
    const tbodyCarros2 = document.getElementById("CatalagoCarros2");

    if (!tbodyCarros || !tbodyCarros2) return;
    tbodyCarros.innerHTML = "";
    tbodyCarros2.innerHTML = "";

    carros.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", item.numeroCarro);

      tr.innerHTML = `
      <td>${item.numeroCarro}</td>
      <td>${item.garagem}</td>
      <td>${item.tamanho}</td>
      <td>${item.cor}</td>
      <td>${item.anoCarroceria}</td>
      <td>${item.placa}</td>
      <td>${item.status}</td>`;

      tr.addEventListener("click", () => {
        alert(`numero do carro é ${item.numeroCarro}`);
      });

      if (item.status.toLowerCase() === "ativo") {
        tbodyCarros.appendChild(tr);
      } else if (item.status.toLowerCase() === "gns") {
        tbodyCarros2.appendChild(tr);
      }
    });
  } catch (erro) {
    console.error("Erro ao carregar cards:", erro);
  }
}

//catalago de Sucateados no sistema
const tbodySucatas = document.getElementById("catalagoSucatas");

export function renderizarHistoricoSucatas(listaPneus) {
  if (!tbodySucatas) return;

  tbodySucatas.innerHTML = "";

  listaPneus.forEach((item) => {
    if (item.motivoRecusa != null) return;

    const tr = document.createElement("tr");
    tr.setAttribute("id", item.nrFogo);

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

// --- MOVIMENTAÇÕES catalagos ---

const sectionEstoque = document.querySelector(".movimentacaoEstoque");
const sectionCarro = document.querySelector(".historicoMoviCarro");

export function renderizarMovimentacoes(listaMovimentacoes) {
  if (!sectionEstoque || !sectionCarro) return;

  // Limpa as seções antes de renderizar novamente
  sectionEstoque.innerHTML = "";
  sectionCarro.innerHTML = "";

  // =========================================
  // HISTÓRICO DE MOVIMENTAÇÕES DO ESTOQUE
  // =========================================

  sectionEstoque.innerHTML = `
    <div class="formulario">
      <div class="form-titulo-container">
        <div class="form-titulo">
          <h3>Movimentações de Estoque</h3>
          <p>Histórico de movimentações realizadas no estoque</p>
        </div>
      </div>

      <div class="table-container">
        <table class="tabela-coleta tabela-movimentacao">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nr. Fogo</th>
              <th>Medida</th>
              <th>Marca</th>
              <th>Movimentação / Rota</th>
              <th>Motivo / Ação</th>
              <th>Garagem</th>
              <th>Sulco</th>
            </tr>
          </thead>

          <tbody id="corpoMovEstoque"></tbody>
        </table>
      </div>
    </div>
  `;

  // =========================================
  // HISTÓRICO DE MOVIMENTAÇÕES DOS CARROS
  // =========================================

  sectionCarro.innerHTML = `
    <div class="formulario">
      <div class="form-titulo-container">
        <div class="form-titulo">
          <h3>Movimentações em Carro</h3>
          <p>Histórico de movimentações realizadas nos veículos</p>
        </div>
      </div>

      <div class="table-container">
        <table class="tabela-coleta tabela-movimentacao">
          <thead>
            <tr>
              <th>Data</th>
              <th>Veículo</th>
              <th>Nr. Fogo</th>
              <th>Medida</th>
              <th>Marca</th>
              <th>Posição</th>
              <th>Motivo Troca</th>
              <th>Sulco</th>
              <th>Km</th>
            </tr>
          </thead>

          <tbody id="corpoMovCarro"></tbody>
        </table>
      </div>
    </div>
  `;

  const tbodyEstoque = document.querySelector("#corpoMovEstoque");
  const tbodyCarro = document.querySelector("#corpoMovCarro");

  listaMovimentacoes.forEach((item) => {
    const tr = document.createElement("tr");

    tr.id = item.nrFogo;

    // =========================================
    // MOVIMENTAÇÃO DE ESTOQUE
    // =========================================

    if (item.tipo.toLowerCase() === "estoque") {
      tr.innerHTML = `
        <td>${item.dataMovimentacao}</td>
        <td><strong>${item.nrFogo}</strong></td>
        <td>${item.medida}</td>
        <td>${item.marca}</td>
        <td>${item.origemDestino}</td>
        <td>
          <span class="badge-motivo">
            ${item.motivo}
          </span>
        </td>
        <td>${item.garagem}</td>
        <td>${item.sulco} mm</td>
      `;

      tbodyEstoque.appendChild(tr);
    }

    // =========================================
    // MOVIMENTAÇÃO EM CARRO
    // =========================================
    else if (item.tipo.toLowerCase() === "carro") {
      tr.innerHTML = `
        <td>${item.dataMovimentacao}</td>
        <td>${item.placaOuPrefixo}</td>
        <td><strong>${item.nrFogo}</strong></td>
        <td>${item.medida}</td>
        <td>${item.marca}</td>
        <td>${item.posicao}</td>
        <td>
          <span class="badge-motivo">
            ${item.motivo}
          </span>
        </td>
        <td>${item.sulco} mm</td>
        <td>${item.km.toLocaleString("pt-BR")} km</td>
      `;

      tbodyCarro.appendChild(tr);
    }

    // Clique para abrir detalhes
    tr.addEventListener("click", () => {
      if (typeof renderizarPainel === "function") {
        renderizarPainel(item);
      }
    });
  });
}

export function renderizarUltimasMovimentacoes(listaMovimentacoes, identificador) {
  const container = document.querySelector(identificador);
  if (!container) return;

  // Pega apenas os 5 registros mais recentes
  const ultimosRegistros = listaMovimentacoes.slice(0, 5);

  // Mapeia o array para criar os itens da lista em HTML
  const htmlList = ultimosRegistros
    .map((mov) => {
      let corBadge = "badge-blue"; // cor padrão
      const motivo = mov.motivo.toLowerCase();

      if (motivo.includes("avaria") || motivo.includes("envio")) corBadge = "badge-orange";
      if (motivo.includes("furado") || motivo.includes("liso")) corBadge = "badge-red";
      if (motivo.includes("retorno") || motivo.includes("transferência")) corBadge = "badge-green";

      const infoExtra = mov.tipo === "Carro" ? `${mov.placaOuPrefixo} / ${mov.posicao}` : mov.origemDestino;

      return `
      <li class="mov-item">
        <div class="mov-status-dot ${corBadge}-dot"></div>
        <div class="mov-content">
          <div class="mov-header-info">
            <span class="mov-badge ${corBadge}-bg">${mov.motivo}</span>
            <span class="mov-fogo">${mov.nrFogo}</span>
            <span class="mov-info">${infoExtra}</span>
          </div>
          <div class="mov-meta">
            ${mov.garagem} &middot; ${mov.dataMovimentacao}
          </div>
        </div>
      </li>
    `;
    })
    .join("");

  // Monta o Card completo com Cabeçalho, Lista e Rodapé (Delta)
  const cardHTML = `
    <div class="card-mov-ultimas">
      <div class="card-mov-header">
        <div class="card-mov-title">
          <h3>Últimas Movimentações</h3>
          <p>${ultimosRegistros.length} registros mais recentes</p>
        </div>
        <a href="#" class="card-mov-link">Ver todos &rarr;</a>
      </div>
      
      <ul class="card-mov-list">
        ${htmlList}
      </ul>

      <div class="card-mov-footer">
        <h4>FÍSICO &times; SISTEMA (DELTA)</h4>
        <div class="delta-row">
          <span>Borracharia</span> 
          <span>1179 sis / 35 fís <b class="text-red">+1144</b></span>
        </div>
        <div class="delta-row">
          <span>Almoxarifado</span> 
          <span>0 sis / 279 fís <b class="text-red">-279</b></span>
        </div>
        <div class="delta-row">
          <span>Recapagem</span> 
          <span>691 sis / 167 fís <b class="text-red">+524</b></span>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = cardHTML;
}

export function renderizarLocalizacaoSistema(listaPneus, identificador) {
  const container = document.querySelector(identificador);
  if (!container) return;

  const qtd = { borracharia: 0, almoxarifado: 0, recapagem: 0, carros: 0 };
  const sucatas = { borracharia: 0, almoxarifado: 0, recapagem: 0, total: 0 };

  listaPneus.forEach((pneu) => {
    const status = pneu.status ? pneu.status.toLowerCase() : "";
    const garagem = pneu.garagem ? pneu.garagem.toLowerCase() : "";

    // Contagem geral
    if (status.includes("carro")) {
      qtd.carros++;
    } else if (status.includes("recapagem")) {
      qtd.recapagem++;
    } else if (garagem.includes("almoxarifado")) {
      qtd.almoxarifado++;
    } else if (status.includes("estoque") || status.includes("borracharia") || !status.includes("sucata")) {
      qtd.borracharia++;
    }

    // Contagem específica para as Sucatas
    if (status.includes("sucata")) {
      sucatas.total++;
      if (garagem.includes("recapagem")) {
        sucatas.recapagem++;
      } else if (garagem.includes("almoxarifado")) {
        sucatas.almoxarifado++;
      } else {
        sucatas.borracharia++;
      }
    }
  });

  // Monta a estrutura HTML do Card
  const cardHTML = `
    <div class="card-loc">
      <div class="card-loc-header">
        <h3>Localização no Sistema</h3>
        <p>Pneus por local — dados do sistema</p>
      </div>

      <div class="card-loc-grid">
        <div class="loc-box">
          <span class="loc-box-title">Borracharia</span>
          <span class="loc-box-num text-teal">${qtd.borracharia}</span>
          <span class="loc-box-sub">077 + 028 + 027</span>
        </div>
        <div class="loc-box">
          <span class="loc-box-title">Almoxarifado</span>
          <span class="loc-box-num text-purple">${qtd.almoxarifado}</span>
          <span class="loc-box-sub">não contabilizado</span>
        </div>
        <div class="loc-box">
          <span class="loc-box-title">Recapagem</span>
          <span class="loc-box-num text-blue">${qtd.recapagem}</span>
          <span class="loc-box-sub">externo — JBQ</span>
        </div>
        <div class="loc-box">
          <span class="loc-box-title">Carros</span>
          <span class="loc-box-num text-green">${qtd.carros}</span>
          <span class="loc-box-sub">em operação</span>
        </div>
      </div>

      <div class="card-loc-table-wrapper">
        <h4 class="loc-table-title">PNEUS PARA BAIXA COMO SUCATA</h4>
        <table class="loc-table">
          <thead>
            <tr>
              <th>Localização</th>
              <th class="text-right">Qtd</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Almoxarifado</td>
              <td class="text-right">${sucatas.almoxarifado}</td>
            </tr>
            <tr>
              <td>Borracharia</td>
              <td class="text-right">${sucatas.borracharia}</td>
            </tr>
            <tr>
              <td>Recapagem</td>
              <td class="text-right ${sucatas.recapagem > 0 ? "text-red" : ""}">${sucatas.recapagem}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td class="text-right">${sucatas.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = cardHTML;
}
