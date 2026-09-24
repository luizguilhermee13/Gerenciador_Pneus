import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const resultado = await db.query(`
    SELECT *
    FROM garagem
  `);

  res.json(resultado.rows);
});

// teste filtrando
router.get("/:id", async (req, res) => {
  const resultado = await db.query(
    `
      SELECT *
      FROM garagem
      WHERE id_garagem = $1
    `,
    [req.params.id],
  );

  res.json(resultado.rows[0]);
});

router.post("/", async (req, res) => {
  await db.query(
    `
      INSERT INTO garagem (nome)
      VALUES ($1)
    `,
    ["Juiz de Fora"],
  );

  res.status(201).json({
    mensagem: "Garagem cadastrada com sucesso",
  });
});

export default router;
