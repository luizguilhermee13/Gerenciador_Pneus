import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/estoque", async (req, res) => {
  const client = await db.connect();

  try {
    const { nrFogo, motivo, garagem, dateEntrada, responsavel } = req.body;

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO movimentacoes_estoque (id_nr_fogo, id_garagem, data_movimentacao, motivo, responsavel)
       VALUES ($1, $2, $3, $4, $5)`,
      [Number(nrFogo), Number(garagem), dateEntrada, motivo, responsavel || null],
    );

    await client.query(`UPDATE pneus SET id_garagem_atual = $1 WHERE id_nr_fogo = $2`, [Number(garagem), Number(nrFogo)]);

    await client.query("COMMIT");
    res.status(201).json({ mensagem: "Movimentação registrada" });
  } catch (erro) {
    await client.query("ROLLBACK");
    res.status(400).json({ mensagem: "Erro ao registrar movimentação", erro: erro.message });
  } finally {
    client.release();
  }
});

router.get("/estoque", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      movimentacoes_estoque.data_movimentacao AS "dataMovimentacao",
      pneus.id_nr_fogo AS "idNrFogo",
      pneus.medida,
      pneus.marca,
      pneus.sulco,
      movimentacoes_estoque.motivo,
      garagem.nome AS garagem
    FROM movimentacoes_estoque
    JOIN pneus ON movimentacoes_estoque.id_nr_fogo = pneus.id_nr_fogo
    LEFT JOIN garagem ON movimentacoes_estoque.id_garagem = garagem.id_garagem
    ORDER BY movimentacoes_estoque.data_movimentacao DESC
  `);
  res.json(resultado.rows);
});

router.get("/carro", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      movimentacoes_carro.data_movimentacao AS "dataMovimentacao",
      veiculos.numero_carro AS "numeroCarro",
      pneus.id_nr_fogo AS "idNrFogo",
      pneus.medida,
      pneus.marca,
      pneus.sulco,
      pneus.km,
      movimentacoes_carro.posicao
    FROM movimentacoes_carro
    JOIN pneus ON movimentacoes_carro.id_nr_fogo = pneus.id_nr_fogo
    LEFT JOIN veiculos ON movimentacoes_carro.id_carro = veiculos.id_carro
    ORDER BY movimentacoes_carro.data_movimentacao DESC
  `);
  res.json(resultado.rows);
});

// últimas 5 movimentações (estoque + carro juntos) para o card do dashboard
router.get("/ultimas", async (req, res) => {
  const resultado = await db.query(`
    SELECT * FROM (
      SELECT
        'Estoque' AS tipo,
        me.data_movimentacao AS "dataMovimentacao",
        me.id_nr_fogo AS "nrFogo",
        COALESCE(me.motivo, 'Transferência') AS motivo,
        g.nome AS garagem,
        '→ ' || g.nome AS "origemDestino",
        NULL::text AS "placaOuPrefixo",
        NULL::text AS posicao
      FROM movimentacoes_estoque me
      LEFT JOIN garagem g ON me.id_garagem = g.id_garagem

      UNION ALL

      SELECT
        'Carro' AS tipo,
        mc.data_movimentacao,
        mc.id_nr_fogo,
        'Montagem em carro' AS motivo,
        g.nome,
        NULL::text,
        v.numero_carro::text,
        mc.posicao
      FROM movimentacoes_carro mc
      LEFT JOIN veiculos v ON mc.id_carro = v.id_carro
      LEFT JOIN garagem g ON v.id_garagem = g.id_garagem
    ) t
    ORDER BY "dataMovimentacao" DESC
    LIMIT 5
  `);

  res.json(resultado.rows);
});

export default router;
