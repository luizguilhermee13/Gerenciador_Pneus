import express from "express";
import db from "../db.js";

const router = express.Router();

// catalago veiculos ativos e de gns
router.get("/", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      veiculos.id_carro,
      veiculos.numero_carro AS "numeroCarro",
      veiculos.placa,
      veiculos.tamanho,
      veiculos.cor,
      veiculos.ano_carroceria AS "anoCarroceria",
      veiculos.status,
      garagem.nome AS garagem
    FROM veiculos
    JOIN garagem
      ON veiculos.id_garagem = garagem.id_garagem
  `);

  res.json(resultado.rows);
});

// get para filtrar por status e colocar nos cards
router.get("/status/:status", async (req, res) => {
  const { status } = req.params;

  if (!["ativo", "gns"].includes(status)) {
    return res.status(400).json({
      mensagem: "Status inválido",
    });
  }

  const resultadoQuery = await db.query(
    `
      SELECT
        g.id_garagem AS id,
        g.nome AS titulo,
        COUNT(v.id_carro)::INTEGER AS resultado
      FROM garagem g
      LEFT JOIN veiculos v
        ON v.id_garagem = g.id_garagem
        AND v.status = $1
      WHERE g.id_garagem IN (1, 2, 3)
      GROUP BY g.id_garagem, g.nome
      ORDER BY g.id_garagem
    `,
    [status],
  );

  const cores = {
    1: "#16a34a",
    2: "#2563eb",
    3: "#dc2626",
  };

  const resultado = resultadoQuery.rows.map((item) => ({
    ...item,
    cor: cores[item.id],
  }));

  res.json(resultado);
});

export default router;
