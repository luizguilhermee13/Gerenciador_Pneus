# Gerenciador de Pneus - Frota

Sistema web em fase de construção para o controle e gestão de pneus de frotas de ônibus urbano.

O projeto está sendo desenvolvido com base na minha experiência prática anterior como auxiliar administrativo, aplicando regras e necessidades reais do dia a dia da operação.

🌐 **Acesse a aplicação online:** [Gerenciador de Pneus no GitHub Pages](https://luizguilhermee13.github.io/Gerenciador_Pneus/)

📄 **Documentação:** [Levantamento de Requisitos](docs/levantamento-requisitos.md)

---

## 📌 Status do Projeto

⚠️ **Em Desenvolvimento Ativo**  
📍 **Etapa Atual:** Finalizando o levantamento de requisitos e estrutura do layout para iniciar a modelagem e implementação do banco de dados (SQLite).

---

## 🗺️ Roadmap de Desenvolvimento (Etapas)

O projeto está estruturado nas seguintes etapas progressivas de desenvolvimento:

### 🟢 Etapa 1: Prototipagem e Levantamento de Requisitos *(Concluída / Em andamento)*
* Levantamento de requisitos funcionais e regras de negócio com base na vivência operacional.
* Desenvolvimento do layout inicial (HTML, CSS e JavaScript puro).
* Utilização de cards e catálogos dinâmicos consumindo dados fictícios (Arrays de Objetos) para simular o fluxo da aplicação.
* Estruturação inicial da lógica para futura modelagem de dados.

### 🟡 Etapa 2: Refatoração, Dashboard e Estruturação do Banco *(Próxima Fase)*
* Refatoração do layout da aplicação para design responsivo e moderno utilizando **Tailwind CSS**.
* Implementação de dashboards visuais e gráficos operacionais com **Chart.js** (desgaste, vida útil, substituições).
* Criação das tabelas e esquemas de dados relacionais com **SQLite**.

### 🟠 Etapa 3: Integração com Banco de Dados & API
* Conexão definitiva do front-end com o banco de dados **SQLite**.
* Criação de uma API RESTful para realizar o CRUD completo da frota de pneus.
* Implementação dos métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`) para gestão em tempo real.

### 🔴 Etapa 4: Publicação e Ajustes Finais
* Testes de uso e refinamentos de performance.
* Hospedagem e deploy da versão final da aplicação.
* Documentação final e guias de uso.

---

## 🛠️ Tecnologias e Ferramentas

* **Front-end:** HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
* **Visualização de Dados:** Chart.js
* **Banco de Dados:** SQLite
* **Documentação & Requisitos:** Notion
* **Hospedagem / Versionamento:** GitHub Pages, Git e GitHub

---

## 🎯 Principais Funcionalidades (Planejadas)

- [x] Catálogo e listagem visual de pneus por status (Novos, Recapados, Descartados).
- [ ] Cadastro, edição e remoção de pneus da frota.
- [ ] Histórico de movimentações (rodízio entre eixos/veículos).
- [ ] Gráficos intuitivos de controle de vida útil e quilometragem rodada.
- [ ] Relatórios operacionais para tomada de decisão no setor de manutenção/suprimentos.

