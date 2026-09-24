# 🛞 Gerenciador de Pneus - Frota

Sistema web voltado para o **controle, gestão e rastreabilidade de pneus de frotas de ônibus urbano**.

O projeto está sendo desenvolvido com base em vivência prática operacional no setor de manutenção/borracharia, considerando regras como controle de sulco, vida útil dos pneus (`N`, `R1`...`R9`), movimentações, sucateamento, recapagem e divergências entre estoque físico e sistema.

🌐 **Aplicação online:**  
https://gerenciador-pneus.web.app

📄 **Documentação:**  
[Levantamento de Requisitos](docs/levantamento-requisitos.md)

---

## 📌 Status do Projeto

🟡 **Em Desenvolvimento Ativo**

📍 **Etapa Atual:** desenvolvimento e integração do backend com **Node.js, Express e PostgreSQL/Supabase**.

Parte das funcionalidades já utiliza dados reais através da API, enquanto outros módulos ainda utilizam dados simulados durante o desenvolvimento.

---

## 🗺️ Roadmap de Desenvolvimento

### 🟢 Etapa 1: Prototipagem e Levantamento de Requisitos _(Concluída)_

- [x] Estrutura e layout inicial em HTML, CSS e JavaScript.
- [x] Levantamento de requisitos funcionais e regras de negócio.
- [x] Simulação inicial de dados utilizando arrays de objetos.
- [x] Estruturação da lógica de sulco, vida útil (`N`, `R1...R9`) e status dos pneus.

### 🟢 Etapa 2: Interface, Gráficos e Modelagem de Dados _(Concluída)_

- [x] Refatoração da interface utilizando Tailwind CSS.
- [x] Estruturação de layouts responsivos.
- [x] Criação de gráficos operacionais com Chart.js.
- [x] Modelagem relacional inicial utilizando SQLite.
- [x] Estruturação das principais tabelas e relacionamentos do sistema.

### 🟡 Etapa 3: Backend e Integração com Banco de Dados _(Em Andamento)_

- [x] Criação da API com Node.js e Express.
- [x] Migração do banco SQLite para PostgreSQL utilizando Supabase.
- [x] Integração do backend com PostgreSQL.
- [x] Consulta de garagens, veículos e pneus.
- [x] Cadastro individual de pneus.
- [x] Cadastro de pneus em lote.
- [x] Controle e consulta de estoque físico.
- [x] Registro de sucateamento e consulta dos motivos.
- [x] Integração parcial do front-end com a API.
- [ ] Implementação completa das movimentações de pneus.
- [ ] Implementação completa do fluxo de recapagem.
- [ ] Migração das telas que ainda utilizam dados simulados para dados reais da API.

### 🟢 Etapa 4: Hospedagem e Deploy _(Concluída parcialmente)_

- [x] Front-end publicado no Firebase Hosting.
- [x] Backend publicado no Render.
- [x] Banco PostgreSQL hospedado no Supabase.
- [x] Configuração de ambientes local e produção.
- [x] Integração Firebase → Render → Supabase.

### 🔴 Etapa 5: Refino e Ajustes Finais _(Planejada)_

- [ ] Refatoração e organização dos módulos JavaScript.
- [ ] Padronização do tratamento de erros da API.
- [ ] Validação das regras de negócio.
- [ ] Testes de usabilidade.
- [ ] Ajustes finais de responsividade e acessibilidade.
- [ ] Substituição completa dos dados fictícios por dados persistidos.

---

## 🛠️ Tecnologias e Ferramentas

### Front-end

- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- Chart.js

### Back-end

- Node.js
- Express
- API REST
- CORS

### Banco de Dados

- PostgreSQL
- Supabase

> SQLite foi utilizado durante as etapas iniciais de modelagem e desenvolvimento local antes da migração para PostgreSQL.

### Hospedagem

- **Firebase Hosting** — Front-end
- **Render** — API Node.js / Express
- **Supabase** — PostgreSQL

### Desenvolvimento

- Git
- GitHub
- npm
- VS Code
- Postman
- Beekeeper Studio

---

## 🌐 Arquitetura Atual

```text
Frontend
Firebase Hosting
      │
      │ HTTP / Fetch API
      ▼
Backend
Node.js + Express
Render
      │
      │ SQL
      ▼
Banco de Dados
PostgreSQL
Supabase
```
