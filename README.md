# 🛞 Gerenciador de Pneus - Frota

Sistema web voltado para o controle, gestão e rastreabilidade de pneus de frotas de ônibus urbano.

O projeto está sendo desenvolvido com base em vivência prática operacional real no setor de manutenção/borracharia (regras de sulco, rodízio, controle de vida útil R1/N, e divergências Físico vs Sistema / Delta).

🌐 **Acesse a aplicação online:** [Gerenciador de Pneus no GitHub Pages](https://luizguilhermee13.github.io/Gerenciador_Pneus/)  
📄 **Documentação:** [Levantamento de Requisitos](docs/levantamento-requisitos.md)

---

## 📌 Status do Projeto

🟡 **Em Desenvolvimento Ativo**  
📍 **Etapa Atual:** **Etapa 2** — Refinamento de layout/cards analíticos do Dashboard, contabilidade de frotas/borracharia e estruturação do esquema de banco de dados (SQLite).

---

## 🗺️ Roadmap de Desenvolvimento (Etapas)

### 🟢 Etapa 1: Prototipagem e Levantamento de Requisitos _(Concluída)_

- [x] Levantamento de requisitos funcionais e regras de negócio operacionais.
- [x] Desenvolvimento do layout inicial (HTML, CSS e JavaScript puro).
- [x] Simulação de fluxo com dados mockados (Arrays de Objetos de pneus e movimentações).
- [x] Estruturação conceitual da lógica de sulco, vida útil (`N`, `R1`) e status.

### 🟡 Etapa 2: Refinamento Híbrido, Dashboard Analítico & Modelagem SQLite _(Em Andamento)_

- [x] Integração do Tailwind CSS para estruturação de grids e layouts flexíveis/responsivos.
- [x] Cards analíticos compactos (`Localização no Sistema`, `Últimas Movimentações`) com layout utilitário.
- [x] Contabilidade de frotas (`Borracharia`, `Almoxarifado`, `Recapagem`, `Carros`) e tabela de baixa como sucata (Delta Físico vs Sistema).
- [ ] Integração de gráficos operacionais com **Chart.js**.
- [ ] Modelagem relacional e criação de esquemas de tabelas com **SQLite**.

### 🟠 Etapa 3: Integração Front-to-Back & API RESTful _(Próxima Fase)_

- [ ] Conexão da interface com banco de dados **SQLite**.
- [ ] Desenvolvimento de API RESTful para CRUD completo de pneus, veículos e movimentações.
- [ ] Implementação de métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`) em tempo real.

### 🔴 Etapa 4: Testes, Ajustes Finais & Deploy _(Planejado)_

- [ ] Testes de validação de regras de negócio e usabilidade em campo.
- [ ] Refinamentos de performance, responsividade avançada e acessibilidade.
- [ ] Publicação da versão final integrada.

---

## 🛠️ Tecnologias e Ferramentas

- **Front-end Híbrido:** HTML5, CSS3 (variáveis customizadas e ajustes finos de canvas/grid), **Tailwind CSS** (layout utilitário e responsividade)
- **Visualização de Dados:** Chart.js
- **Banco de Dados (Modelagem):** SQLite
- **Documentação & Requisitos:** Markdown / Notion
- **Hospedagem / Versionamento:** GitHub Pages, Git e GitHub

---

## 🎯 Principais Funcionalidades & Módulos

- [x] Catálogo e listagem visual de pneus por status (`Em carro`, `Sucata`, `Borracharia`).
- [x] Dashboard analítico de localização e inventário distribuído.
- [x] Painel de alerta e contagem segmentada para baixa de pneus como sucata.
- [x] Histórico de últimas movimentações com rastreio de fogo/veículo e cálculo de divergência (Delta Físico vs. Sistema).
- [ ] Cadastro, edição e remoção dinâmica de pneus (UI ligada ao CRUD).
- [ ] Histórico detalhado de rodízio entre eixos/veículos.
- [ ] Gráficos analíticos de quilometragem rodada e desgaste de sulco (Chart.js).

---

## 📁 Estrutura de Layout / Componentes (Etapa 2)

```text
Gerenciador_Pneus/
├── index.html
├── style.css          # Estilização compacta (dash-row-2, card-loc, card-mov)
├── script.js          # Lógica de renderização de arrays, contagem e delta
└── docs/
    └── levantamento-requisitos.md
```
