import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/motivos", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      codigo,
      descricao,
      grupo,
      local
    FROM motivos_sucateamento
    ORDER BY codigo
  `);

  res.json(resultado.rows);
});

router.put("/", async (req, res) => {
  const client = await db.connect();

  try {
    const { nrFogo, motivo, sulcoFinal, kmRodadoFinal } = req.body;

    await client.query("BEGIN");

    await client.query(
      `
        UPDATE pneus
        SET
          status = 'Sucateado',
          sulco = $1,
          km = $2
        WHERE id_nr_fogo = $3
      `,
      [Number(sulcoFinal), Number(kmRodadoFinal), Number(nrFogo)],
    );

    await client.query(
      `
        INSERT INTO sucatas (
          id_nr_fogo,
          motivo
        )
        VALUES ($1, $2)
      `,
      [Number(nrFogo), motivo],
    );

    await client.query("COMMIT");

    res.status(201).json({
      mensagem: "Pneu sucateado com sucesso",
    });
  } catch (erro) {
    await client.query("ROLLBACK");

    res.status(400).json({
      mensagem: "Erro no sucateamento do pneu",
      erro: erro.message,
    });
  } finally {
    client.release();
  }
});

router.get("/", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      pneus.id_nr_fogo AS "id_nrFogo",
      pneus.medida,
      pneus.marca,
      pneus.vida,
      pneus.sulco,
      garagem.nome AS garagem,
      motivos_sucateamento.descricao AS motivo,
      sucatas.data_sucateamento AS data
    FROM sucatas
    JOIN pneus
      ON sucatas.id_nr_fogo = pneus.id_nr_fogo
    LEFT JOIN garagem
      ON pneus.id_garagem_atual = garagem.id_garagem
    LEFT JOIN motivos_sucateamento
      ON sucatas.motivo = motivos_sucateamento.codigo
    ORDER BY sucatas.data_sucateamento DESC
    LIMIT 10
  `);

  res.json(resultado.rows);
});

export default router;
