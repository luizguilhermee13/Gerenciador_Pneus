// ==========================================
// 1. Função Construtora para Navegação por Abas (Sub-menus / Tabs)
// ==========================================
function TabNavigation(seletorItens, seletorConteudos) {
  this.submenu = document.querySelectorAll(seletorItens);
  this.secaoSelecionada = document.querySelectorAll(seletorConteudos);

  this.init = function () {
    if (this.submenu.length === 0 || this.secaoSelecionada.length === 0) return;

    // Deixa o primeiro item selecionado por padrão ao carregar
    this.submenu[0].classList.add("sub-menu-selecionado");

    // Percorre cada item da lista com forEach
    this.submenu.forEach((item, id) => {
      item.addEventListener("click", () => {
        this.selecionarTopico(id);
        this.ativarClasseVisual(item);
      });
    });
  };

  this.selecionarTopico = function (id) {
    this.secaoSelecionada.forEach((content) => {
      content.classList.remove("ativo");
    });

    if (this.secaoSelecionada[id]) {
      this.secaoSelecionada[id].classList.add("ativo");
    }
  };

  this.ativarClasseVisual = function (itemClicado) {
    this.submenu.forEach((outroItem) => {
      outroItem.classList.remove("sub-menu-selecionado");
    });
    itemClicado.classList.add("sub-menu-selecionado");
  };
}

// ==========================================
// 2. Função Construtora para o Menu Sidebar (Página Ativa)
// ==========================================
function SidebarNavigation(seletorLinks) {
  this.sidebar = document.querySelectorAll(seletorLinks);

  this.init = function () {
    this.sidebar.forEach((link) => {
      this.verificarPaginaAtiva(link);
    });
  };

  this.verificarPaginaAtiva = function (link) {
    let href = link.href;
    let url = location.href;

    // Se a URL atual corresponder ao link, adiciona a classe active no elemento pai (li)
    if (url.includes(href)) {
      const itemPai = link.parentElement;
      itemPai.classList.add("active");
    }
  };
}

// ==========================================
// 3. Inicialização das Classes (Instanciação)
// ==========================================

// Inicializa os sub-menus de abas
const tabs = new TabNavigation("#sub-menu li", "#containerPrincipal section");
tabs.init();

// Inicializa a navegação da barra lateral (Sidebar)
const sidebarNav = new SidebarNavigation("#menu ul a");
sidebarNav.init();
