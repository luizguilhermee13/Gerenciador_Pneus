import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const pneus = db
    .prepare(
      `SELECT
  pneus.id_nrFogo,
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
  pneus.dataCadastro,
  pneus.id_garagemAtual,
  garagem.nome AS garagem,
  veiculos.numeroCarro AS veiculo
FROM pneus
LEFT JOIN garagem ON pneus.id_garagemAtual = garagem.id_garagem
LEFT JOIN veiculos ON pneus.id_carroAtual = veiculos.id_carro`,
    )
    .all();

  res.json(pneus);
});

router.post("/", (req, res) => {
  try {
    const { nrFogo, medida, dot, vida, marca, desenho, sulco, posicao, garagem, veiculo, kmRodado, responsavel } = req.body;

    const stmt = db.prepare(
      `INSERT INTO pneus (id_nrFogo, medida, dot, vida, marca, desenho, sulco, status, posicao, id_garagemAtual, id_carroAtual, km, responsavel)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    );

    stmt.run(
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
    );

    res.status(201).json({ id_nrFogo: Number(nrFogo), medida });
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro ao cadastrar pneu", erro: erro.message });
  }
});

export default router;
