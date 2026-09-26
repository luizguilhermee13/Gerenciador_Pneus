import { API_URL } from "../config/api.js";

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

// --- MOVIMENTAÇÕES — com banco ---

export async function renderizarHistoricoMovEstoque() {
  const tbody = document.getElementById("corpoMovEstoque");
  if (!tbody) return;

  try {
    const resposta = await fetch(`${API_URL}/api/movimentacoes/estoque`);
    if (!resposta.ok) throw new Error("Erro ao buscar histórico de movimentações de estoque");

    const dados = await resposta.json();
    tbody.innerHTML = "";

    dados.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.dataMovimentacao}</td>
        <td><strong>${item.idNrFogo}</strong></td>
        <td>${item.medida}</td>
        <td>${item.marca}</td>
        <td><span class="badge-motivo">${item.motivo ?? "—"}</span></td>
        <td>${item.garagem ?? "—"}</td>
        <td>${item.sulco} mm</td>`;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar histórico de movimentações de estoque:", error);
  }
}

export async function renderizarHistoricoMovCarro() {
  const tbody = document.getElementById("corpoMovCarro");
  if (!tbody) return;

  try {
    const resposta = await fetch(`${API_URL}/api/movimentacoes/carro`);
    if (!resposta.ok) throw new Error("Erro ao buscar histórico de movimentações de carro");

    const dados = await resposta.json();
    tbody.innerHTML = "";

    dados.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.dataMovimentacao}</td>
        <td>${item.numeroCarro ?? "—"}</td>
        <td><strong>${item.idNrFogo}</strong></td>
        <td>${item.medida}</td>
        <td>${item.marca}</td>
        <td>${item.posicao ?? "—"}</td>
        <td>${item.sulco} mm</td>
        <td>${item.km} km</td>`;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar histórico de movimentações de carro:", error);
  }
}

export function renderizarUltimasMovimentacoes(listaMovimentacoes, identificador) {
  const container = document.querySelector(identificador);
  if (!container) return;

  const ultimosRegistros = listaMovimentacoes.slice(0, 5);

  const htmlList = ultimosRegistros
    .map((mov) => {
      let corBadge = "badge-blue";
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

//com bd

const tbody = document.getElementById("conteudoCatalago");
const painel = document.getElementById("painel-lateral");

export function renderizarPainel(pneu) {
  if (!painel) return;
  painel.innerHTML = `
    <div class="painel-card">
      <div class="painel-header">
      <div class="painel-titulo">
        <h2>${pneu.id_nrFogo}</h2>
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
          <span class="painel-valor">${pneu.veiculo} - ${pneu.posicao}</span>
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
          <span class="painel-valor">${pneu.medida}</span>
        </div>
        <div class="painel-linha ultima">
          <span class="painel-label">Data de Entrada</span>
          <span class="painel-valor">${pneu.dataCadastro}</span>
        </div>
      </div>
    </div>
  `;
}

//catalago de pneus no sistema
export async function renderizarCatalago() {
  if (!tbody) return;
  tbody.innerHTML = "";

  try {
    const resposta = await fetch(`${API_URL}/api/pneus`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados dos veículos");
    }

    const pneus = await resposta.json();

    pneus.forEach((pneus) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", pneus.id_nrFogo);

      tr.innerHTML = `
  <td>${pneus.id_nrFogo}</td>
  <td>${pneus.medida}</td>
  <td>${pneus.dot}</td>
  <td>${pneus.vida}</td>
  <td>${pneus.marca}</td>
  <td>${pneus.desenho}</td>
  <td>${pneus.sulco}</td>
  <td>${pneus.status}</td>
  <td>${pneus.posicao ?? "—"}</td>
  <td>${pneus.km}</td>
  <td>${pneus.garagem ?? "—"}</td>
  <td>${pneus.veiculo ?? "—"}</td>`;

      tr.addEventListener("click", () => {
        renderizarPainel(pneus);
      });

      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error("Erro ao carregar os pneus:", erro);
  }
}

export async function renderizarCatalagoCarros() {
  try {
    const resposta = await fetch(`${API_URL}/api/veiculos`);

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

/* catalago sucatas   */

export async function renderizarHistoricoSucatas() {
  const tbody = document.getElementById("catalagoSucatas");
  if (!tbody) return;

  try {
    const resposta = await fetch(`${API_URL}/api/sucatas`);
    if (!resposta.ok) throw new Error("Erro ao buscar histórico de sucatas");

    const sucatas = await resposta.json();
    tbody.innerHTML = "";

    sucatas.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.id_nrFogo}</td>
        <td>${item.medida}</td>
        <td>${item.marca}</td>
        <td>${item.vida}</td>
        <td>${item.motivo ?? "—"}</td>
        <td>${item.garagem ?? "—"}</td>
        <td>${item.sulco}</td>
        <td>${item.data ?? "—"}</td>`;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar histórico de sucatas:", error);
  }
}

export async function renderizarCatalagoSucatas() {
  const tbody = document.getElementById("catalagoSucatasB");
  if (!tbody) return;

  try {
    const resposta = await fetch(`${API_URL}/api/sucatas/motivos`);
    if (!resposta.ok) throw new Error("Erro ao buscar base de motivos");

    const motivos = await resposta.json();
    tbody.innerHTML = "";

    motivos.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", item.codigo);

      tr.innerHTML = `
        <td>${item.codigo}</td>
        <td>${item.descricao}</td>
        <td>${item.grupo}</td>
        <td>${item.local}</td>`;

      tr.addEventListener("click", () => {
        alert("teste");
      });

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar base de motivos:", error);
  }
}

//catalagos dashboard
// localização atual dos pneus no sistema
export async function renderizarLocalizacaoSistemaDinamico(identificador) {
  const container = document.querySelector(identificador);

  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/api/pneus/dashboard/localizacao`);

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.mensagem || "Erro ao buscar localização dos pneus");
    }

    let linhasSucata = "";

    if (dados.aguardandoSucata.length === 0) {
      linhasSucata = `
        <tr>
          <td>Nenhum pneu aguardando sucata</td>
          <td class="text-right">0</td>
        </tr>
      `;
    } else {
      dados.aguardandoSucata.forEach((item) => {
        linhasSucata += `
            <tr>
              <td>${item.garagem}</td>
              <td class="text-right">${item.quantidade}</td>
            </tr>
          `;
      });
    }

    const cardHTML = `
      <div class="card-loc">
        <div class="card-loc-header">
          <h3>Localização no Sistema</h3>
          <p>Pneus por situação — dados do sistema</p>
        </div>

        <div class="card-loc-grid">
          <div class="loc-box">
            <span class="loc-box-title">Estoque</span>
            <span class="loc-box-num text-teal">${dados.estoque}</span>
            <span class="loc-box-sub">disponíveis</span>
          </div>

          <div class="loc-box">
            <span class="loc-box-title">Em Carros</span>
            <span class="loc-box-num text-green">${dados.emCarro}</span>
            <span class="loc-box-sub">em operação</span>
          </div>

          <div class="loc-box">
            <span class="loc-box-title">Recapagem</span>
            <span class="loc-box-num text-blue">${dados.recapagem}</span>
            <span class="loc-box-sub">na reformadora</span>
          </div>

          <div class="loc-box">
            <span class="loc-box-title">Recusados</span>
            <span class="loc-box-num text-red">${dados.recusados}</span>
            <span class="loc-box-sub">aguardando sucata</span>
          </div>
        </div>

        <div class="card-loc-table-wrapper">
          <h4 class="loc-table-title">PNEUS RECUSADOS AGUARDANDO SUCATA</h4>

          <table class="loc-table">
            <thead>
              <tr>
                <th>Garagem</th>
                <th class="text-right">Qtd</th>
              </tr>
            </thead>

            <tbody>
              ${linhasSucata}
            </tbody>

            <tfoot>
              <tr>
                <td>Total</td>
                <td class="text-right">${dados.totalAguardandoSucata}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = cardHTML;
  } catch (erro) {
    console.error("Erro ao carregar localização dos pneus:", erro);

    container.innerHTML = `
      <div class="card-loc">
        <div class="card-loc-header">
          <h3>Localização no Sistema</h3>
          <p>Não foi possível carregar os dados</p>
        </div>
      </div>
    `;
  }
}
