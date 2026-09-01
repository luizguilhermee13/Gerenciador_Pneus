import * as sidebar from "./modules/sidebar.js";
import * as catalago from "./modules/catalago.js";
import * as navegacaoTab from "./modules/navegacaoTab.js";
import * as cardsEstatisticos from "./modules/cardsEstatisticos.js";

navegacaoTab.navegacaoTabs();
cardsEstatisticos.cardsEstatisticos();
sidebar.sidebar();
sidebar.pageSelecionada();

catalago.renderizarCatalago();
catalago.renderizarPainel(catalago.listaPneus[0]);
catalago.contador(catalago.listaPneus);
