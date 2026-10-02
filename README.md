# 🛞 Gerenciador de Pneus - Frota

Sistema web voltado para o **controle, gestão e rastreabilidade de pneus de frotas de ônibus urbano**.

O projeto foi desenvolvido com base em vivência prática operacional no setor de manutenção/borracharia, considerando regras como controle de sulco, vida útil dos pneus (`N`, `R1`...`R9`), movimentações, estoque, sucateamento, recapagem e divergências entre estoque físico e sistema.

🌐 **Aplicação online:**  
https://gerenciador-pneus.web.app

📄 **Documentação:**  
[Levantamento de Requisitos](docs/levantamento-requisitos.md)

---

## 📌 Status do Projeto

🟡 **Em Desenvolvimento Ativo**

📍 **Etapa Atual:** consolidação, testes e ajustes finais.

As principais funcionalidades já estão integradas ao backend utilizando **Node.js, Express e PostgreSQL/Supabase**.

A etapa de refatoração e limpeza estrutural do código já foi realizada utilizando ferramentas de análise estática, detecção de duplicações e auditoria de CSS.

O desenvolvimento encontra-se atualmente focado em:

- substituição dos últimos dados simulados;
- revisão das regras de negócio;
- padronização do tratamento de erros da API;
- testes dos principais fluxos do sistema;
- ajustes finais de responsividade e acessibilidade;
- consolidação da versão atual do projeto.

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

### 🟢 Etapa 3: Backend e Integração com Banco de Dados _(Concluída em grande parte)_

- [x] Criação da API com Node.js e Express.
- [x] Migração do banco SQLite para PostgreSQL utilizando Supabase.
- [x] Integração do backend com PostgreSQL.
- [x] Consulta de garagens, veículos e pneus.
- [x] Cadastro individual de pneus.
- [x] Cadastro de pneus em lote.
- [x] Controle e consulta de estoque físico e digital.
- [x] Registro de sucateamento e consulta dos motivos.
- [x] Integração das principais telas com a API.
- [x] Implementação do fluxo de recapagem.
- [x] Controle de envio e retorno de pneus da recapadora.
- [x] Controle de pneus recusados pela recapadora.
- [x] Indicadores e informações do dashboard utilizando dados do banco.
- [ ] Substituição dos últimos dados simulados ainda existentes.

### 🟢 Etapa 4: Hospedagem e Deploy _(Concluída)_

- [x] Front-end publicado no Firebase Hosting.
- [x] Backend publicado no Render.
- [x] Banco PostgreSQL hospedado no Supabase.
- [x] Configuração de ambientes local e produção.
- [x] Integração Firebase → Render → Supabase.

### 🟡 Etapa 5: Refatoração, Limpeza e Consolidação _(Em Andamento)_

- [x] Separação do código em módulos JavaScript.
- [x] Separação das responsabilidades entre front-end e API.
- [x] Redução progressiva dos dados fictícios.
- [x] Refatoração dos principais módulos JavaScript.
- [x] Remoção de dependências, funções e trechos de código não utilizados.
- [x] Redução de código duplicado.
- [x] Organização e revisão dos arquivos CSS.
- [x] Análise estática do JavaScript.
- [x] Auditoria de estilos CSS não utilizados.
- [x] Utilização de ferramentas de análise e limpeza do código.
- [ ] Padronização de nomes de funções, variáveis e rotas.
- [ ] Padronização do tratamento de erros da API.
- [ ] Revisão das regras de negócio.
- [ ] Testes dos principais fluxos do sistema.
- [ ] Ajustes finais de responsividade e acessibilidade.
- [ ] Remoção completa dos dados simulados restantes.

---

## ⚙️ Principais Funcionalidades

- Cadastro individual de pneus.
- Cadastro de pneus em lote.
- Controle de estoque físico e digital.
- Controle de pneus instalados em veículos.
- Controle de sulco.
- Controle de vida útil do pneu.
- Movimentações entre estoque, veículos e outros locais.
- Envio de pneus para recapagem.
- Retorno de pneus da recapadora.
- Controle de pneus recusados.
- Registro de sucateamento.
- Histórico de operações.
- Dashboard com indicadores e gráficos.
- Controle de garagens e veículos.

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

### Qualidade e Refatoração

- **Knip** — identificação de dependências e exports não utilizados.
- **ESLint** — análise estática do JavaScript.
- **jscpd** — identificação de código duplicado.
- **Stylelint** — análise e padronização dos arquivos CSS.
- **PurgeCSS** — auditoria de estilos CSS não utilizados.

Durante a refatoração, a taxa de duplicação identificada pelo jscpd foi reduzida de **3,54% para 1,32%**, além da remoção de dependências antigas e estilos não utilizados.

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
