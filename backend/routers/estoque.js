import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const contagens = db
    .prepare(
      `SELECT
        estoque.id_estoque,
        estoque.dataContagem,
        garagem.nome AS garagem,
        estoque.medida,
        estoque.qtdNovo,
        estoque.qtdMeiaVida,
        estoque.qtdReformado,
        estoque.qtdParaReforma,
        estoque.qtdParaConserto,
        estoque.qtdSucateado,
        (estoque.qtdNovo + estoque.qtdMeiaVida + estoque.qtdReformado + estoque.qtdParaReforma + estoque.qtdParaConserto + estoque.qtdSucateado) AS total
      FROM estoque
      LEFT JOIN garagem ON estoque.id_garagem = garagem.id_garagem
      ORDER BY estoque.dataContagem DESC`,
    )
    .all();

  res.json(contagens);
});

router.post("/", (req, res) => {
  try {
    const { dataContagem, medida, ...resto } = req.body;

    const garagens = Object.keys(resto)
      .filter((chave) => chave.startsWith("idGaragem_"))
      .map((chave) => Number(resto[chave]));

    const stmt = db.prepare(`
      INSERT INTO estoque (dataContagem, id_garagem, medida, qtdNovo, qtdMeiaVida, qtdReformado, qtdParaReforma, qtdParaConserto, qtdSucateado)
      VALUES (?,?,?,?,?,?,?,?,?)
    `);

    const registrarContagem = db.transaction(() => {
      garagens.forEach((id_garagem) => {
        stmt.run(
          dataContagem,
          id_garagem,
          medida,
          Number(resto[`qtdNovo_${id_garagem}`]) || 0,
          Number(resto[`qtdMeiaVida_${id_garagem}`]) || 0,
          Number(resto[`qtdReformado_${id_garagem}`]) || 0,
          Number(resto[`qtdParaReforma_${id_garagem}`]) || 0,
          Number(resto[`qtdParaConserto_${id_garagem}`]) || 0,
          Number(resto[`qtdSucateado_${id_garagem}`]) || 0,
        );
      });
    });

    registrarContagem();

    res.status(201).json({ mensagem: `Contagem registrada para ${garagens.length} garagens` });
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro ao registrar contagem", erro: erro.message });
  }
});

router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM estoque WHERE id_estoque = ?").run(req.params.id);
    res.json({ mensagem: "Contagem removida" });
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro ao remover contagem", erro: erro.message });
  }
});

export default router;
