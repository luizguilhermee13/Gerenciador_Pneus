import * as sidebar from "./modules/sidebar.js";
import * as catalago from "./modules/catalago.js";
import * as navegacaoTab from "./modules/navegacaoTab.js";
import * as cardsEstatisticos from "./modules/cardsEstatisticos.js";
import * as coleta from "./modules/coletaRecapagem.js";
import * as indicador from "./modules/indicadores.js";
import * as dados from "./modules/dadosFicticios.js";
import * as estoque from "./modules/estoque.js";
import * as cadastro from "./modules/cadastrar.js";

// navegação e sidebar
navegacaoTab.navegacaoTabs();
sidebar.sidebar();
sidebar.pageSelecionada();

// renderizar catálogos
catalago.renderizarCatalagoConferencia(dados.conferenciaPneus);

// cards estáticos
cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosDashboard, "#metricaDashBoard");

cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosConferirc, "#conferirCarros");

cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosConferire, "#conferirEstoque");

cardsEstatisticos.renderizarCards(cardsEstatisticos.dadosSulcos, "#metricaSucateado");

// cards calculados com dados fictícios
const dadosSulcosDinamicos = cardsEstatisticos.cardSulcoDinamico(dados.listaPneus);

cardsEstatisticos.renderizarCards(dadosSulcosDinamicos, "#IndicadorSulco");

// dashboard principal
catalago.renderizarUltimasMovimentacoes(dados.movimentacoesPneus, ".lastMovimentacoes");

/* ===================================
     FUNÇÕES COM DADOS DO BANCO
==================================== */

// funções da tela veículos
catalago.renderizarCatalagoCarros();

cardsEstatisticos.cardDinamico("/api/veiculos/status/ativo", "#metricaVeiculos", true);

cardsEstatisticos.cardDinamico("/api/veiculos/status/gns", "#metricaGns", true);

// funções da tela pneus
cadastro.cadastrarPneus();
cadastro.cadastrarLotePneus();
cadastro.popularSelectVeiculos();

catalago.renderizarCatalago();
catalago.renderizarPainel(dados.listaPneus[0]);

cardsEstatisticos.cardDinamico("/api/pneus/status", "#indicadoresPneus", true);

// funções da tela sucateamento
cadastro.registrarSucata();
cadastro.popularSelectMotivos();

catalago.renderizarHistoricoSucatas();
catalago.renderizarCatalagoSucatas();

// botão atualizar
const btnAtualizar = document.getElementById("btn-atualizar");

if (btnAtualizar) {
  btnAtualizar.addEventListener("click", () => {
    location.reload();
  });
}

// funções da tela estoque
estoque.registrarContagemFisica();
estoque.renderizarTabelaContagemFisica();
estoque.configurarAtualizarContagem();
estoque.renderizarTabelaEstoqueDigital();

cardsEstatisticos.cardDinamico("/api/estoque/status", "#metricaEstoqueF", true);

cardsEstatisticos.cardDinamico("/api/estoque/digital/status", "#metricaEstoqueD");

cardsEstatisticos.cardDinamico("/api/estoque/divergencia", "#metricaDivergencia");

/* ===================================
              RECAPAGEM
==================================== */

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
cardsEstatisticos.cardDinamico("/api/coleta/cards/entrega", "#metricaEntrega");

// cards status das coletas
cardsEstatisticos.cardDinamico("/api/coleta/cards/status", "#metricaStatus");

// cards indicadores recapagem
cardsEstatisticos.cardDinamico("/api/coleta/cards/recapagem", "#indicadoresRecapagem");

/* ===================================
              DASHBOARD
==================================== */

catalago.renderizarLocalizacaoSistemaDinamico(".localizacaoSistema");

/* ===================================
             MOVIMENTAÇÕES
==================================== */

cadastro.registrarMovimentacaoEstoque();

catalago.renderizarHistoricoMovEstoque();
catalago.renderizarHistoricoMovCarro();

/* ===================================
                GRÁFICOS
==================================== */

indicador.renderizarIndicadoresPneus();
indicador.renderizarIndicadoresRecapagem();
indicador.renderizarIndicadoresSulco();
indicador.renderizarIndicadoresSucata();
indicador.renderizarGraficosDashboard();
