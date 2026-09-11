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

const tbodyReformadora = document.querySelector("#conteudoReformadora");
const tbodyEntregue = document.querySelector("#conteudoEntregue");

export function renderizarPneusReformadora(listaPneus) {
  if (!tbodyReformadora || !tbodyEntregue) return;
  tbodyReformadora.innerHTML = "";
  tbodyEntregue.innerHTML = "";

  listaPneus.forEach((item) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", item.nrFogo);

    tr.innerHTML = `
      <td><input type="checkbox" class="checkbox-selecao" value="${item.medida}"></td>
      <td>${item.coleta}</td>
      <td>${item.reformadora}</td>
      <td><strong>${item.nrFogo}</strong></td>
      <td>${item.medida}</td>
      <td>${item.marca}</td>
      <td>${item.vida}</td>
      <td><li class="badge-status">${item.status}</span></td>
      <td>${item.garagem}</td>
      <td>${item.servico}</td>
      <td>R$ ${item.valor.toFixed(2)}</td>
    `;

    tr.addEventListener("click", () => {
      if (typeof renderizarPainel === "function") {
        renderizarPainel(item);
      }
    });

    if (item.status.toLowerCase() === "na reformadora") {
      tbodyReformadora.appendChild(tr);
    } else if (item.status.toLowerCase() === "entregue") {
      tbodyEntregue.appendChild(tr);
    }
  });
}

const dadosRef = document.querySelector(".fornecedoresRef");

export function renderizarFornecedores(fornecedores) {
  if (!dadosRef) return;

  dadosRef.innerHTML = "";

  fornecedores.forEach((recapadora, id) => {
    const teste = `
      <div class="card-dados">
      <div class="card-dados-topo">
      <div class="card-icon">
      <span class="icon">&#128295;</span>
      <h3>${recapadora.nome}</h3>
      <span>${recapadora.cidadeEstado}</span>
      </div>
      <span>${recapadora.descricao}</span>
      </div>
      <ul class="card-dados-body">
      <li>Contato<span>${recapadora.contato}</span></li>
      <li>Recapagem<span>${recapadora.recapagem}</span></li>
      <li>Conserto<span>${recapadora.conserto}</span></li>
      <li>Prazo médio<span>${recapadora.prazoMedio}</span></li>
      </ul>
      </div>`;

    dadosRef.innerHTML += teste;
  });
}
