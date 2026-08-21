let menu = document.querySelectorAll("#sub-menu li");
const secaoSelecionada = document.querySelectorAll(
  "#containerPrincipal section",
);

console.log(menu);

function selecionarTopico(item) {
  secaoSelecionada.forEach((content) => {
    content.classList.remove("ativo");
  });
  secaoSelecionada[item].classList.add("ativo");
}

menu.forEach((item, id) => {
  item.addEventListener("click", () => {
    selecionarTopico(id);
  });
});
