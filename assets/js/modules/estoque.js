export function renderizarTabelaContagemFisica(dadosContagem) {
  const tbody = document.querySelector("#catalagoContagemF tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  dadosContagem.forEach((item) => {
    const totalGeral =
      (item.novo || 0) + (item.reformado || 0) + (item.meiaVida || 0) + (item.cInterno || 0) + (item.pReforma || 0) + (item.sucateado || 0);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="checkbox" class="checkbox-selecao" value="${item.medida}"></td>
      <td>${item.medida}</td>
      <td>${item.novo}</td>
      <td>${item.reformado}</td>
      <td>${item.meiaVida}</td>
      <td>${item.cInterno}</td>
      <td>${item.pReforma}</td>
      <td>${item.sucateado}</td>
      <td><strong>${totalGeral}</strong></td>
    `;

    tbody.appendChild(tr);
  });
}
