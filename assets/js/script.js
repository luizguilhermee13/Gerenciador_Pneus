import * as sidebar from "./modules/sidebar.js";
import * as catalago from "./modules/catalago.js";
import * as navegacaoTab from "./modules/navegacaoTab.js";
import * as cardsEstatisticos from "./modules/cardsEstatisticos.js";
import * as coleta from "./modules/coletaRecapagem.js";
import * as indicador from "./modules/indicadores.js";
import * as dados from "./modules/dadosFicticios.js";
import * as estoque from "./modules/estoque.js";
import * as cadastro from "./modules/cadastrar.js";

navegacaoTab.navegacaoTabs();
sidebar.sidebar();
sidebar.pageSelecionada();

//renderizar catalagos

catalago.renderizarCatalagoConferencia(dados.conferenciaPneus);

//Renderiza os cards estáticos normais
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosDashboard, "#metricaDashBoard");

cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosConferirc, "#conferirCarros");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosConferire, "#conferirEstoque");
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosSulcos, "#metricaSucateado");

//Renderizando os cards calculados dinamicamente com base no objeto listaPneus.
const dadosSulcosDinamicos = cardsEstatisticos.cardSulcoDinamico(dados.listaPneus);
cardsEstatisticos.renderizarCards(dadosSulcosDinamicos, "#IndicadorSulco");

const dadosPneusDinamicos = cardsEstatisticos.cardPneuDinamico(dados.listaPneus);
cardsEstatisticos.renderizarCards(dadosPneusDinamicos, "#indicadoresPneus");

// indicador.criarGraficosSucata(dados.listaPneus);

//dashboard principal
catalago.renderizarUltimasMovimentacoes(dados.movimentacoesPneus, ".lastMovimentacoes");

/* ===================================
      FUNÇÕES COM DADOS DO BANCO 
==================================== */

// funções do arquivo veiculos.html
catalago.renderizarCatalagoCarros();
cardsEstatisticos.cardVeiculosStatusDinamico("#metricaVeiculos", "ativo");
cardsEstatisticos.cardVeiculosStatusDinamico("#metricaGns", "gns");

// funções do arquivo pneus.html
cadastro.cadastrarPneus();
cadastro.cadastrarLotePneus();
cadastro.popularSelectVeiculos();

catalago.renderizarCatalago();
catalago.renderizarPainel(dados.listaPneus[0]);

cardsEstatisticos.cardPneusDinamico("#indicadoresPneus");

// funções do arquivo sucateamento.html
cadastro.registrarSucata();
cadastro.popularSelectMotivos();

catalago.renderizarHistoricoSucatas();
catalago.renderizarCatalagoSucatas();

const btnAtualizar = document.getElementById("btn-atualizar");

btnAtualizar.addEventListener("click", () => {
  location.reload();
});

//funcoes da tela estoque
estoque.registrarContagemFisica();
estoque.renderizarTabelaContagemFisica();
estoque.configurarAtualizarContagem();
estoque.renderizarTabelaEstoqueDigital();

cardsEstatisticos.cardEstoqueFDinamico("#metricaEstoqueF");
cardsEstatisticos.cardEstoqueDDinamico("#metricaEstoqueD");
cardsEstatisticos.cardDivergenciaDinamico("#metricaDivergencia");

//funcoes da tela recapagem

// cadastrar coleta
coleta.addPneuColeta();
coleta.popularRecapadoras();
coleta.popularGaragensColeta();
coleta.registrarColeta();

// informar entrega
coleta.carregarPneusReformadora();
coleta.popularGaragensEntrega();
coleta.registrarEntrega();

// status das coletas
coleta.carregarStatusColetas();

// histórico
coleta.carregarHistoricoColetas();
coleta.pesquisarHistoricoColetas();

// cards informar entrega
cardsEstatisticos.cardEntregaDinamico("#metricaEntrega");

// cards status das coletas
cardsEstatisticos.cardStatusColetaDinamico("#metricaStatus");

// cards indicadores recapagem
cardsEstatisticos.cardRecapagemDinamico("#indicadoresRecapagem");

catalago.renderizarLocalizacaoSistemaDinamico(".localizacaoSistema");

cadastro.registrarMovimentacaoEstoque();
catalago.renderizarHistoricoMovEstoque();
catalago.renderizarHistoricoMovCarro();

//graficos com chart js
indicador.renderizarIndicadoresPneus();
indicador.renderizarIndicadoresRecapagem();
indicador.renderizarIndicadoresSulco();
indicador.renderizarIndicadoresSucata();
indicador.renderizarGraficosDashboard();
