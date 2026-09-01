//navegação por tabs - sub menus
export function navegacaoTabs() {
  const submenu = document.querySelectorAll("#sub-menu li");

  const secaoSelecionada = document.querySelectorAll("#containerPrincipal section");

  function selecionarTopico(item) {
    secaoSelecionada.forEach((content) => {
      content.classList.remove("ativo");
    });
    secaoSelecionada[item].classList.add("ativo");
  }

  if (submenu.length > 0 && secaoSelecionada.length > 0) {
    submenu[0].classList.add("sub-menu-selecionado");
    selecionarTopico(0);
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
}
