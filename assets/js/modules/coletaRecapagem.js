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

const containerStatus = document.querySelector("#statusfeitas");

export function statusColeta(coletasFeitas) {
  console.log(coletasFeitas);
  if (!containerStatus) return;

  containerStatus.innerHTML = "";

  coletasFeitas.forEach((coleta) => {
    const blocoColeta = document.createElement("div");
    blocoColeta.classList.add("bloco-coleta-item");

    blocoColeta.innerHTML = `
      <div class="formulario statusColeta">
        <div class="form-titulo-container">
          <div class="form-titulo">
            <h3>Coleta: ${coleta.numeroColeta}</h3>
            <p>${coleta.reformadora} · ${coleta.garagem} · ${coleta.dataColeta}</p>
          </div>
          <div class="form-titulo-button">${coleta.pneusColetados.length} pneus</div>
        </div>
      </div>

      <table class="tabela-coleta">
        <thead>
          <tr>
            <th>nrFogo</th>
            <th>garagem</th>
            <th>medida</th>
            <th>marca</th>
            <th>vida</th>
            <th>sulco</th>
            <th>servico</th>
            <th>valor</th>
          </tr>
        </thead>
        <tbody id="corpo-${coleta.numeroColeta}"></tbody>
      </table>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;">
    `;

    containerStatus.appendChild(blocoColeta);

    const tbodyColeta = document.querySelector(`#corpo-${coleta.numeroColeta}`);

    coleta.pneusColetados.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", item.nrFogo);

      tr.innerHTML = `
        <td>${item.nrFogo}</td>
        <td>${item.garagem}</td>
        <td>${item.medida}</td>
        <td>${item.marca}</td>
        <td>${item.vida}</td>
        <td>${item.sulco}</td>
        <td>${item.servico}</td>
        <td>R$ ${item.valor.toFixed(2)}</td>
      `;

      tr.addEventListener("click", () => {
        console.log("teste");
      });

      tbodyColeta.appendChild(tr);
    });
  });
}
