import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mensagem: "Pneus funcionando" });
});

router.post("/", (req, res) => {
  const { id_nrFogo, medida, dot, vida, marca, desenho, sulco, status, posicao, id_garagemAtual, id_carroAtual } = req.body;
  const stmt = db.prepare(
    `INSERT INTO garagem (id_nrFogo, medida, dot, vida, marca, desenho, sulco, status, posicao, id_garagemAtual, id_carroAtual) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
  );
  const info = stmt.run(id_nrFogo, medida, dot, vida, marca, desenho, sulco, status, posicao, id_garagemAtual, id_carroAtual);

  res.status(201).json({ id_garagem: info.lastInsertRowid, id_nrFogo });
});

export default router;
