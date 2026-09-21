export function cadastrarPneus() {
  const form = document.getElementById("formularioCadastro");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const dados = Object.fromEntries(new FormData(form));

      const resposta = await fetch("http://localhost:3000/api/pneus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.mensagem);
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

      const resposta = await fetch("http://localhost:3000/api/pneus/lote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.mensagem);
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
    const resposta = await fetch("http://localhost:3000/api/veiculos");
    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados dos veículos");
    }

    const veiculos = await resposta.json();
    const select = document.getElementById("veiculo");

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
