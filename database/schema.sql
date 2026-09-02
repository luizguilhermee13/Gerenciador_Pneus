create table pneus(
id_nrFogo integer primary key,
medida text NOT NULL COLLATE NOCASE,
dot text NOT NULL,
vida text DEFAULT 'novo',
marca text COLLATE NOCASE,
desenho text COLLATE NOCASE,
sulco integer DEFAULT 0,
status text,
posicao text CHECK (posicao IN ('DD','DE','TDE','TDI','TEE','TEI')),
id_garagemAtual integer,
id_carroAtual integer,
dataCadastro text DEFAULT CURRENT_TIMESTAMP,
foreign key("id_carroAtual") references "veiculos" ("id_carro"),
foreign key("id_garagemAtual") references "garagem" ("id_garagem")
)strict;
  
create table veiculos(
 id_carro integer primary key,
 numeroCarro integer NOT NULL  unique,
 placa text COLLATE NOCASE,
 tamanho text NOT NULL COLLATE NOCASE,
 cor text,
 anoCarroceria integer,
 id_garagem integer,
foreign key("id_garagem") references "garagem" ("id_garagem")
)strict;
  
create table garagem(
 id_garagem integer primary key,
 nome text NOT NULL unique
)strict;

create table estoque (
 id_estoque integer primary key,
 dataContagem text NOT NULL,
 id_garagem integer NOT NULL,
 statusPneu text,
 qtdContada integer,
foreign key("id_garagem") references "garagem" ("id_garagem")
)strict;

create table sucatas(
 id_sucata integer primary key,
 id_nrFogo integer NOT NULL,
 motivo text DEFAULT 'não conferido',
  foreign key("id_nrFogo") references "pneus" ("id_nrFogo")
)strict;

create table recapagem (
 id_recapadora integer primary key,
 nomeRecapadora text NOT NULL COLLATE NOCASE,
 telefone text,
 endereco text,
 id_garagem integer NOT NULL, 
 foreign key("id_garagem") references "garagem" ("id_garagem")
)strict;

create table precosRecapagem (
 id_precoRecapagem integer primary key,
 id_recapadora integer NOT NULL,
 medida text COLLATE NOCASE,
 servico text,
 precoPadrao real CHECK ("precoPadrao" > 0),
 foreign key("id_recapadora") references "recapagem" ("id_recapadora")
)strict;

create table coletasFeitas(
 id_coleta integer primary key,
 id_recapadora integer NOT NULL,
 dataColeta text NOT NULL,
 id_garagem  integer NOT NULL,
 id_nrFogo  integer NOT NULL,
 foreign key("id_recapadora") references "recapagem" ("id_recapadora"),
 foreign key("id_garagem") references "garagem" ("id_garagem"),
 foreign key("id_nrFogo") references "pneus" ("id_nrFogo")
)strict;

create table movimentacoesCarro(
 id_movimentacaoCarro integer primary key,
 id_nrFogo integer NOT NULL ,
 id_carro integer NOT NULL ,
 dataMovimentacao text NOT NULL,
 posicao text CHECK (posicao IN ('DD','DE','TDE','TDI','TEE','TEI')),
 foreign key("id_nrFogo") references "pneus" ("id_nrFogo"),
 foreign key("id_carro") references "veiculos" ("id_carro")
)strict;

create table movimentacoesEstoque(
 id_movimentacaoEstoque integer primary key,
 id_nrFogo integer NOT NULL  ,
 id_garagem integer NOT NULL  ,
 dataMovimentacao text NOT NULL, 
 foreign key("id_nrFogo") references "pneus" ("id_nrFogo"),
 foreign key("id_garagem") references "garagem" ("id_garagem") 
)strict;

