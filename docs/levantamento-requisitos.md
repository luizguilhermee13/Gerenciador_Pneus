# Modelagem de Dados

# Levantamento de Requisitos — Gerenciador de Pneus

## Ideia do projeto

Criar um sistema para o controle gerencial e operacional do estoque de pneus, onde é possível ver as movimentações que estão sendo realizadas nos carros, as perdas de pneus sucateados, o custo que vem sendo gerado com as recapagens e a situação atual dos pneus que estão no estoque e nos carros, utilizando o sulco e a vida do pneu.

## O que o projeto tem

Dashboard, Pneus, Veículos, Movimentações de pneus nos carros, Estoque, Recapadora, Sulco e Sucatas.

## Dado chefe

Pneus — pois para todas essas telas funcionarem o pneu precisa existir. É o pneu que move o projeto inteiro.

## Tabelas iniciais

pneus, veiculos, garagem, estoque, sucatas, recapagem, precosRecapagem, coletasFeitas, pneusEntregues, movimentacoesCarro, movimentacoesEstoque

*(Dashboard não entra na lista — não é uma tabela, é uma camada de consultas sobre as tabelas acima.)*

## Dados das tabelas

### tabela pneus

| campo | descrição |
| --- | --- |
| id_nrFogo (PK) | identificador único do pneu |
| medida | medida do pneu (275/80R22.5 ou 215/75R17.5) |
| dot | semana e ano de fabricação (4 dígitos) |
| vida | se o pneu já foi ou não reformado — Novo, R1, R2, R3... |
| marca | marca do pneu — Goodyear, Michelin, Continental etc. |
| desenho | desenho do pneu — Kmax Extreme, Michelin In City etc. |
| sulco | profundidade do sulco, de 0 a 18 mm |
| status | Estoque, Em Carro, Sucateado, Na Recapagem |
| posicao | posição no veículo — DD, DE, TDE, TDI, TEE, TEI *(em definição)* |
| id_garagemAtual (FK → garagem) | em qual garagem o pneu está no momento |
| id_carroAtual (FK → veiculos) | em qual carro o pneu está no momento |
| dataCadastro | data de cadastro (CURRENT_TIMESTAMP) |

### tabela veiculos

| campo | descrição |
| --- | --- |
| id_carro (PK) | id único do veículo |
| numeroCarro | numeração única do veículo |
| placa | placa única do veículo |
| tamanho | comum ou micro-ônibus (pneu 275 → comum, pneu 215 → micro) |
| *posições (6 no total)* | *em definição* |
| cor | cor associada à garagem do veículo, usada visualmente no sistema |
| anoCarroceria | ano da carroceria — não pode ser alterado |
| id_garagem (FK → garagem) | garagem à qual o veículo pertence |

### tabela garagem

| campo | descrição |
| --- | --- |
| id_garagem (PK) | id único |
| nome | nome da garagem/unidade |

### tabela estoque (contagem física)

| campo | descrição |
| --- | --- |
| id_estoque (PK) | id de cada contagem |
| dataContagem | data em que a contagem foi feita |
| id_garagem (FK) | garagem onde a contagem foi feita |
| statusPneu | situação do pneu contado — reformado, novo etc. |
| qtdContada | quantidade contada naquele status, naquela contagem |

O "estoque digital" não é uma tabela: é o resultado de consultar `pneus` filtrando os que não estão em nenhum carro (soltos no sistema). A divergência é a diferença entre esse resultado e o que está registrado aqui, na contagem física. Só aumenta a quantidade de pneus no estoque quando chega pneu novo, e só diminui quando um sucateado é despachado.

### tabela sucatas

| campo | descrição |
| --- | --- |
| id_sucata (PK) | id único do sucateamento |
| id_nrFogo (FK) | pneu sucateado |
| motivo | avaria, perfuração, falta de calibragem etc. |

### tabela recapagem (cadastro da recapadora)

| campo | descrição |
| --- | --- |
| id_recapadora (PK) | id único da recapadora |
| nomeRecapadora | nome da recapadora — ex.: JBQ Pneus, Jacar |
| telefone | telefone da recapadora/gerente |
| endereco | localização da unidade |
| id_garagem (FK) | garagem associada |

### tabela precosRecapagem (tabela de referência de preços)

| campo | descrição |
| --- | --- |
| id_precoRecapagem (PK) | id único |
| id_recapadora (FK) | recapadora à qual o preço se refere |
| medida | 275/80R22.5 ou 215/75R17.5 — o preço varia por medida |
| servico | Recapagem, Conserto etc. |
| precoPadrao | valor padrão/contratual daquele serviço para aquela medida |

Essa tabela serve como referência para preencher o preço no formulário de coleta/entrega, mas o valor efetivamente cobrado em cada recapagem realizada é copiado para a linha da transação (ver `pneusEntregues`) — assim, se o contrato mudar de preço no futuro, o histórico de custos já registrado não muda retroativamente.

### tabela coletasFeitas

| campo | descrição |
| --- | --- |
| id_coleta (PK) | id único |
| id_recapadora (FK) | recapadora que coletou |
| dataColeta | data da coleta |
| id_garagem (FK) | garagem onde a coleta foi realizada |
| id_nrFogo (FK) | pneu coletado |

### tabela pneusEntregues - pensando se mantenho essa tabela no projeto

| campo | descrição |
| --- | --- |
| id_entrega (PK) | id único |
| id_nrFogo (FK) | pneu entregue |
| id_recapadora (FK) | recapadora que entregou |
| id_garagem (FK) | garagem de destino da entrega |
| servico | serviço realizado nesse pneu |
| precoCobrado | valor efetivamente cobrado nessa entrega (pode vir de `precosRecapagem` ou ser ajustado manualmente na baixa) |

Observação: coletas e entregas de um mesmo dia costumam vir de lotes diferentes e fora de ordem (pneus coletados juntos podem ser entregues em dias diferentes, e entregas de um dia podem vir de coletas de dias distintos) — por isso cada pneu tem seu próprio rastro de coleta e entrega, casados pelo `id_nrFogo`, e não pelo lote/nota.

### tabela movimentacoesCarro

| campo | descrição |
| --- | --- |
| id_movimentacaoCarro (PK) | id único |
| id_nrFogo (FK) | pneu movimentado |
| id_carro (FK) | carro envolvido na movimentação |
| dataMovimentacao | data da alteração |

### tabela movimentacoesEstoque

| campo | descrição |
| --- | --- |
| id_movimentacaoEstoque (PK) | id único |
| id_nrFogo (FK) | pneu movimentado |
| id_garagem (FK) | garagem para a qual o pneu foi movimentado (atualiza `id_garagemAtual` em `pneus`) |
| dataMovimentacao | data da alteração |

### Dashboard

Por enquanto de lado — não é uma tabela, é uma camada de consultas/agregações sobre as tabelas acima (será definida quando o restante do modelo estiver mais maduro).

## Possíveis relacionamentos

`pneus` se relaciona com praticamente todas as demais tabelas, pois é o dado central do sistema:

- **veiculos**: um veículo tem pneus alocados em suas posições; pertence a uma garagem.
- **garagem**: tem veículos e pneus em seu estoque; recebe contagens físicas (`estoque`).
- **estoque**: representa a contagem física por garagem, comparada ao estoque digital (consulta sobre `pneus`).
- **sucatas**: pneus que não podem mais ser reutilizados.
- **recapagem / precosRecapagem / coletasFeitas / pneusEntregues**: fluxo de reforma dos pneus — coleta, preço de referência, entrega.
- **movimentacoesCarro / movimentacoesEstoque**: histórico de trocas de posição/carro e de transferências entre garagens.