import express from "express";
import db from "../db.js";

const router = express.Router();

//rota para pegar dados dos pneus cadastrados
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

//rota para inserir novos pneus no banco individualmente
router.post("/", (req, res) => {
  try {
    const { nrFogo, medida, dot, vida, marca, desenho, sulco, posicao, garagem, veiculo, kmRodado, responsavel, fornecedor } = req.body;

    const stmt = db.prepare(
      `INSERT INTO pneus (id_nrFogo, medida, dot, vida, marca, desenho, sulco, status, posicao, id_garagemAtual, id_carroAtual, km, responsavel, fornecedor)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
      fornecedor || null,
    );

    res.status(201).json({ id_nrFogo: Number(nrFogo), medida });
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro ao cadastrar pneu", erro: erro.message });
  }
});

//rota para inserir novos pneus no banco em lote
router.post("/lote", (req, res) => {
  try {
    const {
      nrFogoLote,
      qtdPneus,
      marcaLote,
      medidaLote,
      vidaLote,
      dotLote,
      sulcoLote,
      garagemLote,
      kmRodadoLote,
      responsavelLote,
      fornecedorLote,
      dateEntradaLote,
    } = req.body;

    const inicio = Number(nrFogoLote);
    const quantidade = Number(qtdPneus);

    if (!quantidade || quantidade < 1) {
      return res.status(400).json({ mensagem: "Informe uma quantidade válida" });
    }

    const dataCadastro = dateEntradaLote || new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO pneus (id_nrFogo, medida, dot, vida, marca, sulco, status, id_garagemAtual, km, responsavel, fornecedor, dataCadastro)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    const inserirLote = db.transaction((qtd) => {
      for (let i = 0; i < qtd; i++) {
        stmt.run(
          inicio + i,
          medidaLote,
          dotLote,
          vidaLote,
          marcaLote,
          sulcoLote ? Number(sulcoLote) : 0,
          "Estoque",
          garagemLote ? Number(garagemLote) : null,
          kmRodadoLote ? Number(kmRodadoLote) : 0,
          responsavelLote || null,
          fornecedorLote || null,
          dataCadastro,
        );
      }
    });

    inserirLote(quantidade);

    res.status(201).json({ mensagem: `${quantidade} pneus cadastrados`, primeiro: inicio, ultimo: inicio + quantidade - 1 });
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro ao cadastrar lote", erro: erro.message });
  }
});

router.get("/status", (req, res) => {
  const dados = db
    .prepare(
      `SELECT status AS titulo, COUNT(*) AS resultado
       FROM pneus
       GROUP BY status`,
    )
    .all();

  const cores = {
    Estoque: "#2563eb",
    "Em carro": "#16a34a",
    Sucateado: "#dc2626",
    "Na Recapagem": "#d97706",
  };

  const resultado = dados.map((item) => ({
    ...item,
    cor: cores[item.titulo] ?? "#6b7280",
  }));

  res.json(resultado);
});

export default router;
