import { API_URL } from "../config/api.js";

// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

// formata valor em real
function formatarValor(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// formata data
function formatarData(data) {
  if (!data) return "-";

  const dataFormatada = String(data).substring(0, 10);

  const [ano, mes, dia] = dataFormatada.split("-");

  return `${dia}/${mes}/${ano}`;
}

// ======================================================
// CADASTRAR COLETA
// ======================================================

const tbodyColeta = document.getElementById("addPneuList");
const buttonAddLinha = document.getElementById("addManualmente");
const formCadastrarColeta = document.getElementById("formCadastrarColeta");
const selectRecapadora = document.getElementById("id_recapadora");
const selectGaragem = document.getElementById("id_garagemColeta");

// limpa os dados de uma linha
function limparLinhaPneu(tr) {
  tr.dataset.idNrFogo = "";
  tr.dataset.medida = "";

  tr.querySelector(".tr-garagem").textContent = "-";
  tr.querySelector(".tr-medida").textContent = "-";
  tr.querySelector(".tr-marca").textContent = "-";
  tr.querySelector(".tr-vida").textContent = "-";
  tr.querySelector(".tr-sulco").textContent = "-";

  tr.querySelector(".select-servico").innerHTML = `
    <option value="">Serviço</option>
  `;

  tr.querySelector(".select-valor").innerHTML = `
    <option value="">-</option>
  `;
}

// busca os preços conforme recapadora + medida
async function carregarPrecosLinha(tr) {
  const idRecapadora = selectRecapadora.value;
  const medida = tr.dataset.medida;

  const selectServico = tr.querySelector(".select-servico");

  const selectValor = tr.querySelector(".select-valor");

  selectServico.innerHTML = `
    <option value="">Selecionar</option>
  `;

  selectValor.innerHTML = `
    <option value="">-</option>
  `;

  if (!idRecapadora || !medida) return;

  try {
    const response = await fetch(`${API_URL}/api/coleta/precos/${idRecapadora}?medida=${encodeURIComponent(medida)}`);

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.mensagem || "Erro ao buscar preços");
    }

    dados.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.servico;
      option.textContent = item.servico;
      option.dataset.preco = item.precoPadrao;

      selectServico.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar preços:", erro);

    alert(`Não foi possível carregar os preços para a medida ${medida}`);
  }
}

// atualiza o valor quando o serviço mudar
function configurarServicoLinha(tr) {
  const selectServico = tr.querySelector(".select-servico");

  const selectValor = tr.querySelector(".select-valor");

  selectServico.addEventListener("change", () => {
    const optionSelecionada = selectServico.options[selectServico.selectedIndex];

    const preco = optionSelecionada.dataset.preco;

    if (preco === undefined) {
      selectValor.innerHTML = `
          <option value="">-</option>
        `;

      return;
    }

    selectValor.innerHTML = `
        <option value="${preco}">
          ${formatarValor(preco)}
        </option>
      `;
  });
}

// busca um pneu no banco
async function buscarPneu(tr, valorFogo) {
  try {
    const response = await fetch(`${API_URL}/api/coleta/pneu/${valorFogo}`);

    const pneu = await response.json();

    if (!response.ok) {
      throw new Error(pneu.mensagem || "Pneu não encontrado");
    }

    // verifica se o pneu já foi adicionado
    const pneuRepetido = [...tbodyColeta.querySelectorAll("tr")].some(
      (linha) => linha !== tr && linha.dataset.idNrFogo === String(pneu.idNrFogo),
    );

    if (pneuRepetido) {
      limparLinhaPneu(tr);

      tr.querySelector(".input-fogo").value = "";

      alert("Este pneu já foi adicionado na coleta.");

      return;
    }

    tr.dataset.idNrFogo = pneu.idNrFogo;

    tr.dataset.medida = pneu.medida;

    tr.querySelector(".tr-garagem").textContent = pneu.garagem || "-";

    tr.querySelector(".tr-medida").textContent = pneu.medida || "-";

    tr.querySelector(".tr-marca").textContent = pneu.marca || "-";

    tr.querySelector(".tr-vida").textContent = pneu.vida || "-";

    tr.querySelector(".tr-sulco").textContent = pneu.sulco ?? "-";

    await carregarPrecosLinha(tr);
  } catch (erro) {
    console.error("Erro ao buscar pneu:", erro);

    limparLinhaPneu(tr);

    alert(erro.message);
  }
}

// cria uma nova linha para pneu
function criarLinhaPneu() {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>
      <input
        type="number"
        class="input-fogo"
        placeholder="Digite o fogo..."
      />
    </td>

    <td class="tr-garagem">-</td>
    <td class="tr-medida">-</td>
    <td class="tr-marca">-</td>
    <td class="tr-vida">-</td>
    <td class="tr-sulco">-</td>

    <td>
      <select class="select-servico">
        <option value="">
          Selecionar
        </option>
      </select>
    </td>

    <td>
      <select
        class="select-valor"
        disabled
      >
        <option value="">-</option>
      </select>
    </td>
  `;

  const inputFogo = tr.querySelector(".input-fogo");

  inputFogo.addEventListener("blur", async () => {
    const valorFogo = inputFogo.value.trim();

    if (!valorFogo) {
      limparLinhaPneu(tr);

      return;
    }

    await buscarPneu(tr, valorFogo);
  });

  configurarServicoLinha(tr);

  tbodyColeta.appendChild(tr);
}

// adiciona as linhas de pneus
export function addPneuColeta() {
  if (!tbodyColeta || !buttonAddLinha) {
    return;
  }

  tbodyColeta.innerHTML = "";

  // inicia com 3 linhas
  for (let i = 0; i < 3; i++) {
    criarLinhaPneu();
  }

  buttonAddLinha.addEventListener("click", () => {
    const quantidadeLinhas = tbodyColeta.querySelectorAll("tr").length;

    if (quantidadeLinhas >= 12) {
      alert("Uma coleta pode possuir no máximo 12 pneus.");

      return;
    }

    criarLinhaPneu();
  });
}

// carrega recapadoras
export async function popularRecapadoras() {
  if (!selectRecapadora) return;

  try {
    const response = await fetch(`${API_URL}/api/coleta/recapadoras`);

    const recapadoras = await response.json();

    if (!response.ok) {
      throw new Error("Erro ao carregar recapadoras");
    }

    selectRecapadora.innerHTML = `
      <option
        value=""
        disabled
        selected
      >
        Selecionar Reformadora
      </option>
    `;

    recapadoras.forEach((recapadora) => {
      selectRecapadora.innerHTML += `
          <option value="${recapadora.id}">
            ${recapadora.nome}
          </option>
        `;
    });

    // atualiza preços caso recapadora mude
    selectRecapadora.addEventListener("change", async () => {
      const linhas = tbodyColeta.querySelectorAll("tr");

      for (const linha of linhas) {
        if (linha.dataset.medida) {
          await carregarPrecosLinha(linha);
        }
      }
    });
  } catch (erro) {
    console.error("Erro ao carregar recapadoras:", erro);
  }
}

// carrega garagens para cadastrar coleta
export async function popularGaragensColeta() {
  if (!selectGaragem) return;

  try {
    const response = await fetch(`${API_URL}/api/garagem`);

    const garagens = await response.json();

    if (!response.ok) {
      throw new Error("Erro ao carregar garagens");
    }

    selectGaragem.innerHTML = `
      <option
        value=""
        disabled
        selected
      >
        Selecionar Garagem
      </option>
    `;

    garagens.forEach((garagem) => {
      selectGaragem.innerHTML += `
          <option value="${garagem.id_garagem}">
            ${garagem.nome}
          </option>
        `;
    });
  } catch (erro) {
    console.error("Erro ao carregar garagens:", erro);
  }
}

// registra nova coleta
export function registrarColeta() {
  if (!formCadastrarColeta) return;

  formCadastrarColeta.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputColeta = document.getElementById("id_coleta");

    const dataColeta = document.getElementById("id_dataColeta");

    const numeroColeta = inputColeta.value.trim();

    if (!/^\d{6}$/.test(numeroColeta)) {
      alert("O número da coleta deve possuir 6 dígitos.");

      return;
    }

    if (!selectRecapadora.value) {
      alert("Selecione uma recapadora.");

      return;
    }

    if (!dataColeta.value) {
      alert("Informe a data da coleta.");

      return;
    }

    if (!selectGaragem.value) {
      alert("Selecione uma garagem.");

      return;
    }

    const linhas = [...tbodyColeta.querySelectorAll("tr")];

    const linhaInvalida = linhas.some((linha) => {
      const input = linha.querySelector(".input-fogo");

      return input.value.trim() !== "" && !linha.dataset.idNrFogo;
    });

    if (linhaInvalida) {
      alert("Existe um número de fogo inválido na coleta.");

      return;
    }

    const pneus = linhas
      .filter((linha) => linha.dataset.idNrFogo)
      .map((linha) => ({
        idNrFogo: Number(linha.dataset.idNrFogo),

        servico: linha.querySelector(".select-servico").value,
      }));

    if (pneus.length === 0) {
      alert("Adicione pelo menos um pneu na coleta.");

      return;
    }

    const pneuSemServico = pneus.some((pneu) => !pneu.servico);

    if (pneuSemServico) {
      alert("Selecione o serviço de todos os pneus.");

      return;
    }

    const dadosColeta = {
      id_coleta: Number(numeroColeta),

      id_recapadora: Number(selectRecapadora.value),

      data_coleta: dataColeta.value,

      id_garagem: Number(selectGaragem.value),

      pneus,
    };

    try {
      const response = await fetch(`${API_URL}/api/coleta`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dadosColeta),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.mensagem || resultado.erro || "Erro ao registrar coleta");
      }

      alert(
        `Coleta ${resultado.idColeta} registrada com sucesso!\n${resultado.quantidadePneus} pneus\nValor total: ${formatarValor(resultado.valorTotal)}`,
      );

      formCadastrarColeta.reset();

      tbodyColeta.innerHTML = "";

      for (let i = 0; i < 3; i++) {
        criarLinhaPneu();
      }

      // atualiza demais seções
      await carregarPneusReformadora();
      await carregarStatusColetas();
    } catch (erro) {
      console.error("Erro ao registrar coleta:", erro);

      alert(erro.message);
    }
  });
}

// ======================================================
// INFORMAR ENTREGA
// ======================================================

const tbodyReformadora = document.querySelector("#conteudoReformadora");

const selectGaragemEntrega = document.getElementById("garagemEntrega");

const inputDataEntrega = document.getElementById("dateEntrega");

const btnReceberColeta = document.getElementById("btnReceberColeta");

// renderiza pneus pendentes
export function renderizarPneusReformadora(listaPneus) {
  if (!tbodyReformadora) return;

  tbodyReformadora.innerHTML = "";

  if (listaPneus.length === 0) {
    tbodyReformadora.innerHTML = `
      <tr>
        <td colspan="11">
          Nenhum pneu aguardando retorno.
        </td>
      </tr>
    `;

    return;
  }

  listaPneus.forEach((item) => {
    const tr = document.createElement("tr");

    tr.setAttribute("id", `item-coleta-${item.idItem}`);

    tr.innerHTML = `
        <td>
          <input
            type="checkbox"
            class="checkbox-selecao"
            value="${item.idItem}"
          >
        </td>

        <td>
          ${item.coleta}
        </td>

        <td>
          ${item.reformadora}
        </td>

        <td>
          <strong>
            ${item.nrFogo}
          </strong>
        </td>

        <td>
          ${item.medida || "-"}
        </td>

        <td>
          ${item.marca || "-"}
        </td>

        <td>
          ${item.vida || "-"}
        </td>

        <td>
          <span class="badge-status">
            ${item.status}
          </span>
        </td>

        <td>
          ${item.garagem || "-"}
        </td>

        <td>
          ${item.servico || "-"}
        </td>

        <td>
          ${formatarValor(item.valor)}
        </td>
      `;

    tbodyReformadora.appendChild(tr);
  });
}

// carrega pneus na reformadora
export async function carregarPneusReformadora() {
  if (!tbodyReformadora) return;

  try {
    const response = await fetch(`${API_URL}/api/coleta/pendentes`);

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.mensagem || "Erro ao buscar pneus na reformadora");
    }

    renderizarPneusReformadora(dados);
  } catch (erro) {
    console.error("Erro ao carregar pneus da reformadora:", erro);

    alert(erro.message);
  }
}

// carrega garagem para entrega
export async function popularGaragensEntrega() {
  if (!selectGaragemEntrega) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/garagem`);

    const garagens = await response.json();

    if (!response.ok) {
      throw new Error("Erro ao carregar garagens");
    }

    selectGaragemEntrega.innerHTML = `
      <option
        value=""
        disabled
        selected
      >
        Selecione a unidade
      </option>
    `;

    garagens.forEach((garagem) => {
      selectGaragemEntrega.innerHTML += `
          <option value="${garagem.id_garagem}">
            ${garagem.nome}
          </option>
        `;
    });
  } catch (erro) {
    console.error("Erro ao carregar garagens da entrega:", erro);
  }
}

// registra entrega
export function registrarEntrega() {
  if (!btnReceberColeta || !inputDataEntrega || !selectGaragemEntrega) {
    return;
  }

  btnReceberColeta.addEventListener("click", async () => {
    const checkboxesSelecionados = [...document.querySelectorAll("#conteudoReformadora .checkbox-selecao:checked")];

    if (checkboxesSelecionados.length === 0) {
      alert("Selecione pelo menos um pneu para receber.");

      return;
    }

    if (!inputDataEntrega.value) {
      alert("Informe a data da entrega.");

      return;
    }

    if (!selectGaragemEntrega.value) {
      alert("Selecione a garagem de destino.");

      return;
    }

    const itens = checkboxesSelecionados.map((checkbox) => Number(checkbox.value));

    const dadosEntrega = {
      data_entrega: inputDataEntrega.value,

      id_garagem_destino: Number(selectGaragemEntrega.value),

      itens,
    };

    try {
      const response = await fetch(`${API_URL}/api/coleta/entrega`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dadosEntrega),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.mensagem || resultado.erro || "Erro ao registrar entrega");
      }

      alert(`${resultado.quantidadePneus} pneu(s) recebido(s) com sucesso!`);

      inputDataEntrega.value = "";

      selectGaragemEntrega.value = "";

      // atualiza todas as seções
      await carregarPneusReformadora();
      await carregarStatusColetas();
      await carregarHistoricoColetas();
    } catch (erro) {
      console.error("Erro ao receber pneus:", erro);

      alert(erro.message);
    }
  });
}

// ======================================================
// STATUS DAS COLETAS
// ======================================================

const containerStatus = document.getElementById("statusfeitas");

// renderiza as coletas
export function renderizarStatusColetas(listaColetas) {
  if (!containerStatus) return;

  containerStatus.innerHTML = "";

  if (listaColetas.length === 0) {
    containerStatus.innerHTML = `
      <div class="formulario">
        <p>Nenhuma coleta cadastrada.</p>
      </div>
    `;

    return;
  }

  listaColetas.forEach((coleta) => {
    const bloco = document.createElement("div");

    bloco.classList.add("formulario", "bloco-coleta-item");

    bloco.innerHTML = `
      <div class="form-titulo-container">

        <div class="form-titulo">
          <h3>
            Coleta ${coleta.idColeta}
          </h3>

          <p>
            ${coleta.recapadora}
            ·
            ${coleta.garagem}
            ·
            ${formatarData(coleta.dataColeta)}
          </p>
        </div>

        <div class="form-titulo-button">
          ${coleta.status}
        </div>

      </div>

      <div class="status-coleta-dados">

        <div>
          <strong>${coleta.total}</strong>
          <span>Pneus</span>
        </div>

        <div>
          <strong>${coleta.entregues}</strong>
          <span>Entregues</span>
        </div>

        <div>
          <strong>${coleta.pendentes}</strong>
          <span>Pendentes</span>
        </div>

        <div>
          <strong>${coleta.recusados}</strong>
          <span>Recusados</span>
        </div>

        <div>
          <strong>
            ${formatarValor(coleta.valorTotal)}
          </strong>
          <span>Valor</span>
        </div>

      </div>

      <div class="status-progresso">

        <div class="status-progresso-info">
          <span>Progresso</span>

          <strong>
            ${coleta.finalizados}/${coleta.total}
            (${coleta.progresso}%)
          </strong>
        </div>

        <div class="status-progresso-barra">
          <div
            class="status-progresso-preenchimento"
            style="width: ${coleta.progresso}%"
          ></div>
        </div>

      </div>

      <div class="table-container tabela-pneus-coleta">

        <table class="table-system">

          <thead>
            <tr>
              <th>Nr. Fogo</th>
              <th>Medida</th>
              <th>Marca</th>
              <th>Vida</th>
              <th>Sulco</th>
              <th>Serviço</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${coleta.pneus
              .map(
                (pneu) => `
                  <tr>
                    <td>
                      <strong>
                        ${pneu.nrFogo}
                      </strong>
                    </td>

                    <td>
                      ${pneu.medida || "-"}
                    </td>

                    <td>
                      ${pneu.marca || "-"}
                    </td>

                    <td>
                      ${pneu.vida || "-"}
                    </td>

                    <td>
                      ${pneu.sulco ?? "-"}
                    </td>

                    <td>
                      ${pneu.servico || "-"}
                    </td>

                    <td>
                      ${formatarValor(pneu.valor)}
                    </td>

                    <td>
                      <span class="badge-status">
                        ${pneu.status}
                      </span>
                    </td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>

        </table>

      </div>
    `;

    containerStatus.appendChild(bloco);
  });
}

// busca status das coletas
export async function carregarStatusColetas() {
  if (!containerStatus) return;

  try {
    const response = await fetch(`${API_URL}/api/coleta/status`);

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.mensagem || "Erro ao buscar status das coletas");
    }

    renderizarStatusColetas(dados);
  } catch (erro) {
    console.error("Erro ao carregar status das coletas:", erro);

    containerStatus.innerHTML = `
      <div class="formulario">
        <p>
          Erro ao carregar status das coletas.
        </p>
      </div>
    `;
  }
}

// ======================================================
// HISTÓRICO DAS COLETAS
// ======================================================

const tbodyHistorico = document.getElementById("conteudoEntregue");

const inputBuscaHistorico = document.getElementById("buscaHistoricoColeta");

let listaHistoricoColetas = [];

// renderiza histórico
export function renderizarHistoricoColetas(lista) {
  if (!tbodyHistorico) return;

  tbodyHistorico.innerHTML = "";

  if (lista.length === 0) {
    tbodyHistorico.innerHTML = `
      <tr>
        <td colspan="11">
          Nenhum pneu encontrado no histórico.
        </td>
      </tr>
    `;

    return;
  }

  lista.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        -
      </td>

      <td>
        ${item.coleta}
      </td>

      <td>
        ${item.reformadora}
      </td>

      <td>
        <strong>
          ${item.nrFogo}
        </strong>
      </td>

      <td>
        ${item.medida || "-"}
      </td>

      <td>
        ${item.marca || "-"}
      </td>

      <td>
        ${item.vida || "-"}
      </td>

      <td>
        <span class="badge-status">
          ${item.status}
        </span>
      </td>

      <td>
        ${item.garagemDestino || item.garagemOrigem || "-"}
      </td>

      <td>
        ${item.servico || "-"}
      </td>

      <td>
        ${formatarValor(item.valor)}
      </td>
    `;

    tbodyHistorico.appendChild(tr);
  });
}

// busca histórico
export async function carregarHistoricoColetas() {
  if (!tbodyHistorico) return;

  try {
    const response = await fetch(`${API_URL}/api/coleta/historico`);

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.mensagem || "Erro ao buscar histórico");
    }

    listaHistoricoColetas = dados;

    renderizarHistoricoColetas(listaHistoricoColetas);
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);

    tbodyHistorico.innerHTML = `
      <tr>
        <td colspan="11">
          Erro ao carregar histórico.
        </td>
      </tr>
    `;
  }
}

// pesquisa histórico
export function pesquisarHistoricoColetas() {
  if (!inputBuscaHistorico) {
    return;
  }

  inputBuscaHistorico.addEventListener("input", () => {
    const busca = inputBuscaHistorico.value.trim().toLowerCase();

    if (!busca) {
      renderizarHistoricoColetas(listaHistoricoColetas);

      return;
    }

    const resultado = listaHistoricoColetas.filter(
      (item) =>
        String(item.nrFogo).toLowerCase().includes(busca) ||
        String(item.coleta).toLowerCase().includes(busca) ||
        String(item.marca || "")
          .toLowerCase()
          .includes(busca) ||
        String(item.reformadora || "")
          .toLowerCase()
          .includes(busca) ||
        String(item.servico || "")
          .toLowerCase()
          .includes(busca) ||
        String(item.garagemDestino || "")
          .toLowerCase()
          .includes(busca) ||
        String(item.status || "")
          .toLowerCase()
          .includes(busca),
    );

    renderizarHistoricoColetas(resultado);
  });
}
