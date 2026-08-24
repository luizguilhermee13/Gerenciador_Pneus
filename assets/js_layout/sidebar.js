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
