import { API_URL } from "../config/api.js";
import { renderizarHistoricoMovEstoque } from "./catalago.js";

//Cadastrando individualmente e por lote e populando o select carro
export function cadastrarPneus() {
  const form = document.getElementById("formularioCadastro");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const dados = Object.fromEntries(new FormData(form));

      const resposta = await fetch(`${API_URL}/api/pneus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erroResposta = await resposta.json();
        throw new Error(erroResposta.erro || erroResposta.mensagem);
      }

      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar pneu:", error);
    }
  });
}

export function cadastrarLotePneus() {
  const form = document.getElementById("formCadastroLote");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const dados = Object.fromEntries(new FormData(form));

      const resposta = await fetch(`${API_URL}/api/pneus/lote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erroResposta = await resposta.json();
        throw new Error(erroResposta.erro || erroResposta.mensagem);
      }

      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar lote:", error);
    }
  });
}

export async function popularSelectVeiculos() {
  const select = document.getElementById("veiculo");
  if (!select) return;

  try {
    const resposta = await fetch(`${API_URL}/api/veiculos`);
    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados dos veículos");
    }

    const veiculos = await resposta.json();

    veiculos.forEach((v) => {
      const option = document.createElement("option");
      option.value = v.id_carro; // o que realmente vai pro banco
      option.textContent = v.numeroCarro; // o que o usuário vê no dropdown
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar options:", error);
  }
}

//registrando sucata e pupulando o select motivo
//altero o status do pneu para sucata
export function registrarSucata() {
  const form = document.getElementById("formularioSucateamento");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const dados = Object.fromEntries(new FormData(form));

      const resposta = await fetch(`${API_URL}/api/sucatas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erroResposta = await resposta.json();
        throw new Error(erroResposta.erro || erroResposta.mensagem);
      }

      form.reset();
    } catch (error) {
      console.error("Erro ao registrar sucata:", error);
    }
  });
}

export async function popularSelectMotivos() {
  const select = document.getElementById("motivoRecusa");
  if (!select) return;

  try {
    const resposta = await fetch(`${API_URL}/api/sucatas/motivos`);
    if (!resposta.ok) throw new Error("Erro ao buscar motivos de sucateamento");

    const motivos = await resposta.json();

    motivos.forEach((m) => {
      const option = document.createElement("option");
      option.value = m.codigo;
      option.textContent = `${m.codigo} - ${m.descricao}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar motivos:", error);
  }
}

//registrando movimentação de estoque (troca de garagem)
//atualiza id_garagem_atual do pneu junto do histórico
export function registrarMovimentacaoEstoque() {
  const form = document.getElementById("formularioMovimentacao");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const dados = Object.fromEntries(new FormData(form));

      const resposta = await fetch(`${API_URL}/api/movimentacoes/estoque`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erroResposta = await resposta.json();
        throw new Error(erroResposta.erro || erroResposta.mensagem);
      }

      form.reset();
      renderizarHistoricoMovEstoque();
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
    }
  });
}
