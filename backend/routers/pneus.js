import express from "express";
import db from "../db.js";

const router = express.Router();

// dados de localização dos pneus para o dashboard
router.get("/dashboard/localizacao", async (req, res) => {
  try {
    // contagem por situação atual
    const contagem = await db.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE LOWER(TRIM(status)) = 'estoque'
        )::int AS estoque,

        COUNT(*) FILTER (
          WHERE LOWER(TRIM(status)) = 'em carro'
        )::int AS "emCarro",

        COUNT(*) FILTER (
          WHERE LOWER(TRIM(status)) = 'na recapagem'
        )::int AS recapagem,

        COUNT(*) FILTER (
          WHERE LOWER(TRIM(status)) = 'recusado'
        )::int AS recusados

      FROM pneus
    `);

    // pneus recusados agrupados por garagem
    const recusadosPorGaragem = await db.query(`
      SELECT
        COALESCE(
          g.nome,
          'Sem garagem'
        ) AS garagem,

        COUNT(*)::int AS quantidade

      FROM pneus p

      LEFT JOIN garagem g
        ON g.id_garagem = p.id_garagem_atual

      WHERE LOWER(TRIM(p.status)) = 'recusado'

      GROUP BY
        g.id_garagem,
        g.nome

      ORDER BY
        quantidade DESC,
        garagem
    `);

    const dados = contagem.rows[0];

    res.json({
      estoque: dados.estoque,
      emCarro: dados.emCarro,
      recapagem: dados.recapagem,
      recusados: dados.recusados,

      aguardandoSucata: recusadosPorGaragem.rows,

      totalAguardandoSucata: dados.recusados,
    });
  } catch (erro) {
    console.error("Erro ao buscar localização dos pneus:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar localização dos pneus",
      erro: erro.message,
    });
  }
});

// rota para pegar dados dos pneus cadastrados
router.get("/", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      pneus.id_nr_fogo AS "id_nrFogo",
      pneus.medida,
      pneus.dot,
      pneus.vida,
      pneus.marca,
      pneus.desenho,
      pneus.sulco,
      pneus.status,
      pneus.posicao,
      pneus.km,
      pneus.responsavel,
      pneus.data_cadastro AS "dataCadastro",
      pneus.id_garagem_atual AS "id_garagemAtual",
      garagem.nome AS garagem,
      veiculos.numero_carro AS veiculo
    FROM pneus
    LEFT JOIN garagem
      ON pneus.id_garagem_atual = garagem.id_garagem
    LEFT JOIN veiculos
      ON pneus.id_carro_atual = veiculos.id_carro
  `);

  res.json(resultado.rows);
});

// rota para inserir novos pneus no banco individualmente
router.post("/", async (req, res) => {
  try {
    const { nrFogo, medida, dot, vida, marca, desenho, sulco, posicao, garagem, veiculo, kmRodado, responsavel, fornecedor, dateEntrada } =
      req.body;

    const dataCadastro = dateEntrada || new Date().toISOString();

    await db.query(
      `
        INSERT INTO pneus (
          id_nr_fogo,
          medida,
          dot,
          vida,
          marca,
          desenho,
          sulco,
          status,
          posicao,
          id_garagem_atual,
          id_carro_atual,
          km,
          responsavel,
          fornecedor,
          data_cadastro
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15
        )
      `,
      [
        Number(nrFogo),
        medida,
        dot,
        vida,
        marca,
        desenho || null,
        sulco ? Number(sulco) : 0,
        veiculo ? "Em carro" : "Estoque",
        posicao || null,
        garagem ? Number(garagem) : null,
        veiculo ? Number(veiculo) : null,
        kmRodado ? Number(kmRodado) : 0,
        responsavel || null,
        fornecedor || null,
        dataCadastro,
      ],
    );

    res.status(201).json({
      id_nrFogo: Number(nrFogo),
      medida,
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: "Erro ao cadastrar pneu",
      erro: erro.message,
    });
  }
});

// rota para inserir novos pneus no banco em lote
router.post("/lote", async (req, res) => {
  const client = await db.connect();

  try {
    const {
      nrFogoLote,
      qtdPneus,
      marcaLote,
      desenhoLote,
      medidaLote,
      vidaLote,
      dotLote,
      sulcoLote,
      garagemLote,
      kmRodadoLote,
      responsavelLote,
      fornecedorLote,
      dateEntradaLote,
    } = req.body;

    const inicio = Number(nrFogoLote);
    const quantidade = Number(qtdPneus);

    if (!quantidade || quantidade < 1) {
      return res.status(400).json({
        mensagem: "Informe uma quantidade válida",
      });
    }

    const dataCadastro = dateEntradaLote || new Date().toISOString();

    await client.query("BEGIN");

    for (let i = 0; i < quantidade; i++) {
      await client.query(
        `
          INSERT INTO pneus (
            id_nr_fogo,
            medida,
            dot,
            vida,
            marca,
            desenho,
            sulco,
            status,
            id_garagem_atual,
            km,
            responsavel,
            fornecedor,
            data_cadastro
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13
          )
        `,
        [
          inicio + i,
          medidaLote,
          dotLote,
          vidaLote,
          marcaLote,
          desenhoLote,
          sulcoLote ? Number(sulcoLote) : 0,
          "Estoque",
          garagemLote ? Number(garagemLote) : null,
          kmRodadoLote ? Number(kmRodadoLote) : 0,
          responsavelLote || null,
          fornecedorLote || null,
          dataCadastro,
        ],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensagem: `${quantidade} pneus cadastrados`,
      primeiro: inicio,
      ultimo: inicio + quantidade - 1,
    });
  } catch (erro) {
    await client.query("ROLLBACK");

    res.status(400).json({
      mensagem: "Erro ao cadastrar lote",
      erro: erro.message,
    });
  } finally {
    client.release();
  }
});

// rota para filtrar por status e colocar nos cards
router.get("/status", async (req, res) => {
  const resultadoQuery = await db.query(`
    SELECT
      status AS titulo,
      COUNT(*)::INTEGER AS resultado
    FROM pneus
    GROUP BY status
  `);

  const cores = {
    Estoque: "#2563eb",
    "Em carro": "#16a34a",
    Sucateado: "#dc2626",
    "Na Recapagem": "#d97706",
  };

  const resultado = resultadoQuery.rows.map((item) => ({
    ...item,
    cor: cores[item.titulo] ?? "#6b7280",
  }));

  res.json(resultado);
});

export default router;
