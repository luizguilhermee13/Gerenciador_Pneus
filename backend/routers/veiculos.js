import express from "express";
import db from "../db.js";

const router = express.Router();

//catalago veiculos ativos e de gns
router.get("/", (req, res) => {
  const veiculos = db
    .prepare(
      `SELECT
        veiculos.id_carro,
        veiculos.numeroCarro,
        veiculos.placa,
        veiculos.tamanho,
        veiculos.cor,
        veiculos.anoCarroceria,
        veiculos.status,
        garagem.nome AS garagem
      FROM veiculos
      JOIN garagem ON veiculos.id_garagem = garagem.id_garagem`,
    )
    .all();

  res.json(veiculos);
});

router.get("/status/:status", (req, res) => {
  const { status } = req.params;

  if (!["ativo", "gns"].includes(status)) {
    return res.status(400).json({
      mensagem: "Status inválido",
    });
  }

  const dados = db
    .prepare(
      `
      SELECT
        g.id_garagem AS id,
        g.nome AS titulo,
        COUNT(v.id_carro) AS resultado
      FROM garagem g
      LEFT JOIN veiculos v
        ON v.id_garagem = g.id_garagem
        AND v.status = ?
      WHERE g.id_garagem IN (1, 2, 3)
      GROUP BY g.id_garagem, g.nome
      ORDER BY g.id_garagem
    `,
    )
    .all(status);

  const cores = {
    1: "#16a34a",
    2: "#2563eb",
    3: "#dc2626",
  };

  const resultado = dados.map((item) => ({
    ...item,
    cor: cores[item.id],
  }));

  res.json(resultado);
});

export default router;
