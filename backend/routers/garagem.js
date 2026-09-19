import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const garagem = db.prepare("SELECT * FROM garagem").all();

  res.json(garagem);
});

//teste filtrando
router.get("/:id", (req, res) => {
  const garagem = db.prepare("SELECT * FROM garagem WHERE id_garagem = 2").all();

  res.json(garagem);
});

router.post("/", (req, res) => {
  const stmt = db.prepare(`
  INSERT INTO garagem (nome)
  VALUES (?)
`);

  //cadastrando as garagem
  //stmt.run("Itaquera");
  //stmt.run("Limeira");
  stmt.run("Juiz de Fora");

  res.status(201).json({
    mensagem: "Garagem cadastrada com sucesso",
  });
});

export default router;
