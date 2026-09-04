export function addPneuColeta(dadosPneus) {
  const tbodyColeta = document.getElementById("addPneuList");
  const buttonAddLinha = document.getElementById("addManualmente");

  if (buttonAddLinha) {
    buttonAddLinha.addEventListener("click", () => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><input type="text" class="input-fogo" placeholder="Digite o fogo..." /></td>
        <td class="tr-garagem">-</td>
        <td class="tr-medida">-</td>
        <td class="tr-marca">-</td>
        <td class="tr-vida">-</td>
        <td class="tr-sulco">-</td>
        <td><select><option>Recapagem</option><option>Conserto</option></select></td>
        <td><select><option>R$ 550</option><option>R$ 110</option></select></td>`;

      const inputFogo = tr.querySelector(".input-fogo");
      inputFogo.addEventListener("blur", (event) => {
        const valorFogo = event.target.value.trim();

        const pneuEncontrado = dadosPneus.find((p) => p.nrFogo === valorFogo);
        console.log(pneuEncontrado);

        if (pneuEncontrado) {
          tr.querySelector(".tr-garagem").textContent = pneuEncontrado.garagem;
          tr.querySelector(".tr-medida").textContent = pneuEncontrado.medida;
          tr.querySelector(".tr-marca").textContent = pneuEncontrado.marca;
          tr.querySelector(".tr-vida").textContent = pneuEncontrado.vida;
          tr.querySelector(".tr-sulco").textContent = pneuEncontrado.sulco;
        } else if (valorFogo !== "") {
          alert("Pneu não encontrado no sistema!");
        }
      });

      tbodyColeta.append(tr);
    });
  }
}
