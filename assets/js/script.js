import * as sidebar from "./modules/sidebar.js";
import * as catalago from "./modules/catalago.js";
import * as navegacaoTab from "./modules/navegacaoTab.js";
import * as cardsEstatisticos from "./modules/cardsEstatisticos.js";
import * as coleta from "./modules/coletaRecapagem.js";
import * as indicador from "./modules/indicadores.js";

navegacaoTab.navegacaoTabs();
sidebar.sidebar();
sidebar.pageSelecionada();

catalago.renderizarCatalago();
catalago.renderizarPainel(catalago.listaPneus[0]);
catalago.contador(catalago.listaPneus);
coleta.addPneuColeta(catalago.listaPneus);

// 1. Renderiza os cards estáticos normais
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosDashboard, "#metricaDashBoard");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosPneus, "#indicadoresPneus");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosVeiculos, "#metricaVeiculos");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosVeiculosGNS, "#metricaGns");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosMovimentacao, "#indicadoresMovimentacao");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosEstoque, "#metricaEstoqueF");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosEstoque, "#metricaEstoqueD");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosEstoqueDivergente, "#metricaDivergencia");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosInfo, "#metricaEntrega");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosStatus, "#metricaStatus");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosRecapagem, "#indicadoresRecapagem");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosConferirc, "#conferirCarros");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosConferire, "#conferirEstoque");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosSulcos, "#metricaSucateado");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosIndicadorSulco, "#indicadorSucateado");

// 2. Renderiza os cards de Sulcos calculados dinamicamente com base na lista de pneus real
const dadosSulcosDinamicos = cardsEstatisticos.calcularDadosSulcoDinamico(catalago.listaPneus);
cardsEstatisticos.renderizarCards(dadosSulcosDinamicos, "#IndicadorSulco");

// 3. Renderiza o gráfico de sulcos
indicador.indicadorSulco(catalago.listaPneus);
