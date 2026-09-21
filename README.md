# 🛞 Gerenciador de Pneus - Frota

Sistema web voltado para o controle, gestão e rastreabilidade de pneus de frotas de ônibus urbano.

O projeto está sendo desenvolvido com base em vivência prática operacional no setor de manutenção/borracharia (regras de sulco, rodízio, controle de vida útil N/R1...R9, e divergências entre estoque físico e sistema).

🌐 **Acesse a aplicação online:** [Gerenciador de Pneus no GitHub Pages](https://luizguilhermee13.github.io/Gerenciador_Pneus/)
📄 **Documentação:** [Levantamento de Requisitos](docs/levantamento-requisitos.md)

---

## 📌 Status do Projeto

🟡 **Em Desenvolvimento Ativo**
📍 **Etapa Atual:** **Etapa 3** — Backend com Node.js/Express e SQLite: rotas de leitura e cadastro (individual e em lote) já funcionando para pneus, veículos e garagens.

---

## 🗺️ Roadmap de Desenvolvimento (Etapas)

### 🟢 Etapa 1: Prototipagem e Levantamento de Requisitos _(Concluída)_

- [x] Estrutura e layout inicial em HTML, CSS e JavaScript puro.
- [x] Levantamento de requisitos funcionais e regras de negócio operacionais.
- [x] Simulação de fluxo com arrays de objetos, para representar o que viria do banco.
- [x] Estruturação conceitual da lógica de sulco, vida útil (N, R1...R9) e status.

### 🟢 Etapa 2: Refatoração com Tailwind, Gráficos e Modelagem SQLite _(Concluída)_

- [x] Migração do CSS para Tailwind (grids e layouts responsivos).
- [x] Modelagem relacional completa e criação das tabelas no SQLite.
- [x] Gráficos operacionais (sulco por garagem, status dos pneus) com Chart.js.

### 🟡 Etapa 3: Backend com Node.js e Integração SQLite _(Em Andamento)_

- [x] Servidor Node.js/Express com conexão real ao banco SQLite.
- [x] Rotas de consulta (garagens, veículos e catálogo de pneus, com joins entre tabelas).
- [x] Cadastro de pneu individual e em lote, gravando direto no banco.
- [ ] Rotas de atualização (mudança de status: sucateamento, envio para recapagem, movimentações).
- [ ] Migração completa das demais telas (hoje ainda usando dados fictícios) para consumir a API.
- [ ] Escolha e configuração da hospedagem definitiva.

### 🔴 Etapa 4: Refino de Código e Ajustes Finais _(Planejada)_

- [ ] Refatoração do JavaScript do front-end (organização dos módulos, tratamento de erros consistente).
- [ ] Testes de validação de regras de negócio e usabilidade.
- [ ] Ajustes finais de layout, responsividade e acessibilidade.

---

## 🛠️ Tecnologias e Ferramentas

- **Front-end:** HTML5, CSS3, Tailwind CSS
- **Back-end:** Node.js, Express
- **Banco de Dados:** SQLite
- **Visualização de Dados:** Chart.js
- **Documentação:** Markdown
- **Versionamento:** Git e GitHub

---

## 🌐 Hospedagem

Atualmente, apenas o front-end está publicado, via **GitHub Pages** (não hospeda o backend/banco). Com o backend em desenvolvimento, a hospedagem completa ainda está em avaliação — as opções em consideração no momento são **Firebase** e **Render**.

---

## 🎯 Principais Funcionalidades

- [x] Cadastro de pneu individual e em lote, gravando no banco SQLite.
- [x] Catálogo de pneus com busca e filtro, consumindo a API.
- [x] Catálogo de veículos por garagem, com contagem dinâmica por status.
- [x] Gráficos de sulco por garagem e por status.
- [ ] Fluxo completo de sucateamento (atualização de status + motivo).
- [ ] Fluxo completo de coleta/entrega em recapadoras.
- [ ] Histórico de movimentações consumindo o banco (hoje ainda fictício).

---

## 📁 Estrutura do Projeto

\`\`\`text
Gerenciador_Pneus/
├── index.html
├── assets/
│ ├── css/
│ └── js/
│ └── modules/
├── backend/
│ ├── server.js
│ ├── db.js
│ └── routers/
├── database/
│ └── db.sqlite
└── docs/
└── levantamento-requisitos.md
\`\`\`
