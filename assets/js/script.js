import * as sidebar from "./modules/sidebar.js";
import * as catalago from "./modules/catalago.js";
import * as navegacaoTab from "./modules/navegacaoTab.js";
import * as cardsEstatisticos from "./modules/cardsEstatisticos.js";
import * as coleta from "./modules/coletaRecapagem.js";
import * as indicador from "./modules/indicadores.js";
import * as dados from "./modules/dadosFicticios.js";
import * as estoque from "./modules/estoque.js";

navegacaoTab.navegacaoTabs();
sidebar.sidebar();
sidebar.pageSelecionada();

//renderizar catalagos
catalago.renderizarCatalago(dados.listaPneus);
catalago.renderizarPainel(dados.listaPneus[0]);
catalago.renderizarHistoricoSucatas(dados.listaPneus);
catalago.renderizarCatalagoSucatas(dados.baseRecusada);
catalago.renderizarCatalagoConferencia(dados.conferenciaPneus);
catalago.renderizarMovimentacoes(dados.movimentacoesPneus);

coleta.addPneuColeta(dados.listaPneus);
coleta.statusColeta(dados.listaColetas);
coleta.renderizarPneusReformadora(dados.pneusNaReformadora);
coleta.renderizarFornecedores(dados.fornecedoresRecapagem);

estoque.renderizarTabelaContagemFisica(dados.listaContagemFisica);

//Renderiza os cards estáticos normais
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosDashboard, "#metricaDashBoard");
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

//Renderizando os cards calculados dinamicamente com base no objeto listaPneus.
const dadosSulcosDinamicos = cardsEstatisticos.cardSulcoDinamico(dados.listaPneus);
cardsEstatisticos.renderizarCards(dadosSulcosDinamicos, "#IndicadorSulco");

const dadosPneusDinamicos = cardsEstatisticos.cardPneuDinamico(dados.listaPneus);
cardsEstatisticos.renderizarCards(dadosPneusDinamicos, "#indicadoresPneus");

//renderizando os graficos
//para evitar erros estou deixando os nomes da garagem em minusculo para filtrar certo em pneu.garagem no objeto listaPneus
const pneusItaquera = dados.listaPneus.filter((pneu) => pneu.garagem && pneu.garagem.toLowerCase() === "itaquera");
const pneusLimeira = dados.listaPneus.filter((pneu) => pneu.garagem && pneu.garagem.toLowerCase() === "limeira");
const pneusJuizDeFora = dados.listaPneus.filter((pneu) => pneu.garagem && pneu.garagem.toLowerCase().includes("juiz"));

indicador.criarGraficoPneus(pneusItaquera, ".graphSulGaragem-1", "sulco", "Sulcos - Itaquera");
indicador.criarGraficoPneus(pneusLimeira, ".graphSulGaragem-2", "sulco", "Sulcos - Limeira");
indicador.criarGraficoPneus(pneusJuizDeFora, ".graphSulGaragem-3", "sulco", "Sulcos - Juiz de Fora");

indicador.criarGraficoPneus(dados.listaPneus, ".graphSulcoTotal", "sulco", "Sulcos por Quantidade Total");
indicador.criarGraficoPneus(dados.listaPneus, ".graphSulcoVida", "status", "Quantidade de Pneus por Status");

indicador.criarGraficosSucata(dados.listaPneus);

//dashboard principal
catalago.renderizarUltimasMovimentacoes(dados.movimentacoesPneus, ".lastMovimentacoes");
catalago.renderizarLocalizacaoSistema(dados.listaPneus, ".localizacaoSistema");

/* funções do arquivo veiculos.html com BD conectado */
catalago.renderizarCatalagoCarros(); // com bd
cardsEstatisticos.cardVeiculosStatusDinamico("#metricaVeiculos", "ativo");
cardsEstatisticos.cardVeiculosStatusDinamico("#metricaGns", "gns");
