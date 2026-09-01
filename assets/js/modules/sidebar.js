//mostrar e esconder menu hamburguer e sidebar
export function sidebar() {
  const btnHamburguer = document.getElementById("btn-hamburguer");
  const menuSidebar = document.getElementById("menu");

  if (btnHamburguer && menuSidebar) {
    btnHamburguer.addEventListener("click", () => {
      menuSidebar.classList.toggle("menu-mobile-ativo");
    });

    const linksMenuMobile = menuSidebar.querySelectorAll("a");
    linksMenuMobile.forEach((link) => {
      link.addEventListener("click", () => {
        menuSidebar.classList.remove("menu-mobile-ativo");
      });
    });
  }
}

//navegação por tabs - menus - sidebar
export function pageSelecionada() {
  const linksMenu = document.querySelectorAll("#menu ul a");

  linksMenu.forEach((link) => {
    let href = link.href; //#pneus.html
    let url = location.href; // localhost.../pneus.html

    if (url.includes(href)) {
      const itemPai = link.parentElement;
      itemPai.classList.add("active");
    }
  });
}
