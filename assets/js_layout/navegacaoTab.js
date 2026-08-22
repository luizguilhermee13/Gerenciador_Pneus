//navegação por tabs - sub menus
const submenu = document.querySelectorAll("#sub-menu li");

const secaoSelecionada = document.querySelectorAll(
  "#containerPrincipal section",
);

function selecionarTopico(item) {
  secaoSelecionada.forEach((content) => {
    content.classList.remove("ativo");
  });
  secaoSelecionada[item].classList.add("ativo");
}

if (submenu[0] == true) {
  submenu[0].classList.add("sub-menu-selecionado");
}

submenu.forEach((item, id) => {
  item.addEventListener("click", () => {
    selecionarTopico(id);

    submenu.forEach((outroItem) => {
      outroItem.classList.remove("sub-menu-selecionado");
    });

    item.classList.add("sub-menu-selecionado");
  });
});

//navegação por tabs - menus - sidebar
const sidebar = document.querySelectorAll("#menu ul a");

function pageSelecionada(link) {
  let href = link.href;
  let url = location.href;

  if (url.includes(href)) {
    const itemPai = link.parentElement;

    itemPai.classList.add("active");
  }
}

sidebar.forEach(pageSelecionada);
