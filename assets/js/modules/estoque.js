export function registrarContagemFisica() {
  const form = document.getElementById("formularioQtdFisico");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const dados = Object.fromEntries(new FormData(form));

      const resposta = await fetch("http://localhost:3000/api/estoque", {
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
      console.error("Erro ao registrar contagem:", error);
    }
  });
}

export async function renderizarTabelaContagemFisica() {
  const tbody = document.getElementById("conteudoContagemFisica");
  if (!tbody) return;

  try {
    const resposta = await fetch("http://localhost:3000/api/estoque");
    if (!resposta.ok) throw new Error("Erro ao buscar contagens");

    const contagens = await resposta.json();
    tbody.innerHTML = "";

    contagens.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><button type="button" data-id="${item.id_estoque}" class="btnDeletarContagem">🗑️</button></td>
        <td>${item.dataContagem}</td>
        <td>${item.garagem ?? "—"}</td>
        <td>${item.medida}</td>
        <td>${item.qtdNovo}</td>
        <td>${item.qtdMeiaVida}</td>
        <td>${item.qtdReformado}</td>
        <td>${item.qtdParaReforma}</td>
        <td>${item.qtdParaConserto}</td>
        <td>${item.qtdSucateado}</td>
        <td>${item.total}</td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btnDeletarContagem").forEach((botao) => {
      botao.addEventListener("click", async () => {
        await fetch(`http://localhost:3000/api/estoque/${botao.dataset.id}`, { method: "DELETE" });
        renderizarTabelaContagemFisica();
      });
    });
  } catch (error) {
    console.error("Erro ao carregar contagens:", error);
  }
}

export function configurarAtualizarContagem() {
  const botao = document.getElementById("btnAtualizarContagemFisica");
  if (!botao) return;

  botao.addEventListener("click", () => renderizarTabelaContagemFisica());
}
