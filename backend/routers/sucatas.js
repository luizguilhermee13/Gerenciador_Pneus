import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/motivos", (req, res) => {
  const motivos = db.prepare("SELECT codigo, descricao, grupo, local FROM motivosSucateamento ORDER BY codigo").all();
  res.json(motivos);
});

router.put("/", (req, res) => {
  try {
    const { nrFogo, motivo, sulcoFinal, kmRodadoFinal } = req.body;

    const sucatearPneu = db.transaction((id_nrFogo, motivo, sulco, km) => {
      db.prepare(`UPDATE pneus SET status = 'Sucateado', sulco = ?, km = ? WHERE id_nrFogo = ?`).run(sulco, km, id_nrFogo);
      db.prepare(`INSERT INTO sucatas (id_nrFogo, motivo) VALUES (?, ?)`).run(id_nrFogo, motivo);
    });

    sucatearPneu(Number(nrFogo), motivo, Number(sulcoFinal), Number(kmRodadoFinal));

    res.status(201).json({ mensagem: "Pneu sucateado com sucesso" });
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro no sucateamento do pneu", erro: erro.message });
  }
});

router.get("/", (req, res) => {
  const sucatas = db
    .prepare(
      `SELECT
        pneus.id_nrFogo,
        pneus.medida,
        pneus.marca,
        pneus.vida,
        pneus.sulco,
        garagem.nome AS garagem,
        motivosSucateamento.descricao AS motivo,
        sucatas.dataSucateamento AS data
      FROM sucatas
      JOIN pneus ON sucatas.id_nrFogo = pneus.id_nrFogo
      LEFT JOIN garagem ON pneus.id_garagemAtual = garagem.id_garagem
      LEFT JOIN motivosSucateamento ON sucatas.motivo = motivosSucateamento.codigo
      ORDER BY sucatas.dataSucateamento DESC
      LIMIT 10`,
    )
    .all();

  res.json(sucatas);
});

export default router;
