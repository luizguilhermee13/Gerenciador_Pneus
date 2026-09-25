import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const resultado = await db.query(`
    SELECT
      estoque.id_estoque,
      estoque.data_contagem AS "dataContagem",
      garagem.nome AS garagem,
      estoque.medida,
      estoque.qtd_novo AS "qtdNovo",
      estoque.qtd_meia_vida AS "qtdMeiaVida",
      estoque.qtd_reformado AS "qtdReformado",
      estoque.qtd_para_reforma AS "qtdParaReforma",
      estoque.qtd_para_conserto AS "qtdParaConserto",
      estoque.qtd_sucateado AS "qtdSucateado",
      (
        estoque.qtd_novo +
        estoque.qtd_meia_vida +
        estoque.qtd_reformado +
        estoque.qtd_para_reforma +
        estoque.qtd_para_conserto +
        estoque.qtd_sucateado
      ) AS total
    FROM estoque
    LEFT JOIN garagem
      ON estoque.id_garagem = garagem.id_garagem
    ORDER BY estoque.data_contagem DESC
  `);

  res.json(resultado.rows);
});

// rota para filtrar por status e colocar nos cards
router.get("/status", async (req, res) => {
  const resultadoQuery = await db.query(`
    WITH ultimas AS (
      SELECT
        *,
        ROW_NUMBER() OVER (
          PARTITION BY id_garagem, medida
          ORDER BY data_contagem DESC
        ) AS rn
      FROM estoque
    )

    SELECT
      COALESCE(SUM(qtd_novo), 0)::INTEGER AS "Novo",
      COALESCE(SUM(qtd_meia_vida), 0)::INTEGER AS "Meia Vida",
      COALESCE(SUM(qtd_reformado), 0)::INTEGER AS "Reformado",
      COALESCE(SUM(qtd_para_reforma), 0)::INTEGER AS "P/ Reforma",
      COALESCE(SUM(qtd_para_conserto), 0)::INTEGER AS "P/ Conserto",
      COALESCE(SUM(qtd_sucateado), 0)::INTEGER AS "Sucateado"
    FROM ultimas
    WHERE rn = 1
  `);

  const linha = resultadoQuery.rows[0];

  const cores = {
    Novo: "#16a34a",
    "Meia Vida": "#2563eb",
    Reformado: "#0891b2",
    "P/ Reforma": "#d97706",
    "P/ Conserto": "#ca8a04",
    Sucateado: "#dc2626",
  };

  const resultado = Object.entries(linha).map(([titulo, valor]) => ({
    titulo,
    resultado: valor ?? 0,
    cor: cores[titulo] ?? "#6b7280",
  }));

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const client = await db.connect();

  try {
    const { dataContagem, medida, ...resto } = req.body;

    const garagens = Object.keys(resto)
      .filter((chave) => chave.startsWith("idGaragem_"))
      .map((chave) => Number(resto[chave]));

    await client.query("BEGIN");

    for (const id_garagem of garagens) {
      await client.query(
        `
          INSERT INTO estoque (
            data_contagem,
            id_garagem,
            medida,
            qtd_novo,
            qtd_meia_vida,
            qtd_reformado,
            qtd_para_reforma,
            qtd_para_conserto,
            qtd_sucateado
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9
          )
        `,
        [
          dataContagem,
          id_garagem,
          medida,
          Number(resto[`qtdNovo_${id_garagem}`]) || 0,
          Number(resto[`qtdMeiaVida_${id_garagem}`]) || 0,
          Number(resto[`qtdReformado_${id_garagem}`]) || 0,
          Number(resto[`qtdParaReforma_${id_garagem}`]) || 0,
          Number(resto[`qtdParaConserto_${id_garagem}`]) || 0,
          Number(resto[`qtdSucateado_${id_garagem}`]) || 0,
        ],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensagem: `Contagem registrada para ${garagens.length} garagens`,
    });
  } catch (erro) {
    await client.query("ROLLBACK");

    res.status(400).json({
      mensagem: "Erro ao registrar contagem",
      erro: erro.message,
    });
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      `
        DELETE FROM estoque
        WHERE id_estoque = $1
      `,
      [req.params.id],
    );

    res.json({
      mensagem: "Contagem removida",
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: "Erro ao remover contagem",
      erro: erro.message,
    });
  }
});

//rotas para estoque digital
router.get("/digital", async (req, res) => {
  const resultado = await db.query(`
    WITH classificado AS (
      SELECT
        garagem.nome AS garagem,
        pneus.medida,
        CASE
          WHEN status = 'Sucateado' THEN 'Sucateado'
          WHEN status = 'Para Reforma' THEN 'Para Reforma'
          WHEN status = 'Para Conserto' THEN 'Para Conserto'
          WHEN vida = 'N' AND sulco >= 9 THEN 'Novo'
          WHEN vida = 'N' AND sulco >= 3 THEN 'Meia Vida'
          WHEN vida != 'N' AND sulco >= 7.5 THEN 'Reformado'
          WHEN vida != 'N' AND sulco >= 3 THEN 'Meia Vida'
          ELSE 'Critico'
        END AS categoria
      FROM pneus
      LEFT JOIN garagem ON pneus.id_garagem_atual = garagem.id_garagem
      WHERE status != 'Em carro'
    )
    SELECT
      garagem,
      medida,
      COUNT(*) FILTER (WHERE categoria = 'Novo') AS novo,
      COUNT(*) FILTER (WHERE categoria = 'Meia Vida') AS "meiaVida",
      COUNT(*) FILTER (WHERE categoria = 'Reformado') AS reformado,
      COUNT(*) FILTER (WHERE categoria = 'Para Reforma') AS "paraReforma",
      COUNT(*) FILTER (WHERE categoria = 'Para Conserto') AS "paraConserto",
      COUNT(*) FILTER (WHERE categoria = 'Sucateado') AS sucateado,
      COUNT(*) AS total
    FROM classificado
    GROUP BY garagem, medida
    ORDER BY garagem, medida
  `);

  res.json(resultado.rows);
});

router.get("/digital/status", async (req, res) => {
  const resultado = await db.query(`
    WITH classificado AS (
      SELECT
        CASE
          WHEN status = 'Sucateado' THEN 'Sucateado'
          WHEN status = 'Para Reforma' THEN 'Para Reforma'
          WHEN status = 'Para Conserto' THEN 'Para Conserto'
          WHEN vida = 'N' AND sulco >= 9 THEN 'Novo'
          WHEN vida = 'N' AND sulco >= 3 THEN 'Meia Vida'
          WHEN vida != 'N' AND sulco >= 7.5 THEN 'Reformado'
          WHEN vida != 'N' AND sulco >= 3 THEN 'Meia Vida'
          ELSE 'Critico'
        END AS categoria
      FROM pneus
      WHERE status != 'Em carro'
    )
    SELECT categoria AS titulo, COUNT(*) AS resultado
    FROM classificado
    GROUP BY categoria
  `);

  const cores = {
    Novo: "#16a34a",
    "Meia Vida": "#2563eb",
    Reformado: "#0891b2",
    "Para Reforma": "#d97706",
    "Para Conserto": "#ca8a04",
    Sucateado: "#dc2626",
    Critico: "#7c3aed",
  };

  const dados = resultado.rows.map((item) => ({
    ...item,
    cor: cores[item.titulo] ?? "#6b7280",
  }));

  res.json(dados);
});

//rota comparativo
router.get("/divergencia", async (req, res) => {
  const fisicoQuery = await db.query(`
    WITH ultimas AS (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY id_garagem, medida ORDER BY data_contagem DESC) AS rn
      FROM estoque
    )
    SELECT
      garagem.nome AS garagem,
      ultimas.medida,
      ultimas.qtd_novo AS novo,
      ultimas.qtd_meia_vida AS "meiaVida",
      ultimas.qtd_reformado AS reformado,
      ultimas.qtd_para_reforma AS "paraReforma",
      ultimas.qtd_para_conserto AS "paraConserto",
      ultimas.qtd_sucateado AS sucateado
    FROM ultimas
    LEFT JOIN garagem ON ultimas.id_garagem = garagem.id_garagem
    WHERE rn = 1
  `);

  const digitalQuery = await db.query(`
    WITH classificado AS (
      SELECT
        garagem.nome AS garagem,
        pneus.medida,
        CASE
          WHEN status = 'Sucateado' THEN 'Sucateado'
          WHEN status = 'Para Reforma' THEN 'Para Reforma'
          WHEN status = 'Para Conserto' THEN 'Para Conserto'
          WHEN vida = 'N' AND sulco >= 9 THEN 'Novo'
          WHEN vida = 'N' AND sulco >= 3 THEN 'Meia Vida'
          WHEN vida != 'N' AND sulco >= 7.5 THEN 'Reformado'
          WHEN vida != 'N' AND sulco >= 3 THEN 'Meia Vida'
          ELSE 'Critico'
        END AS categoria
      FROM pneus
      LEFT JOIN garagem ON pneus.id_garagem_atual = garagem.id_garagem
      WHERE status != 'Em carro'
    )
    SELECT
      garagem,
      medida,
      COUNT(*) FILTER (WHERE categoria = 'Novo') AS novo,
      COUNT(*) FILTER (WHERE categoria = 'Meia Vida') AS "meiaVida",
      COUNT(*) FILTER (WHERE categoria = 'Reformado') AS reformado,
      COUNT(*) FILTER (WHERE categoria = 'Para Reforma') AS "paraReforma",
      COUNT(*) FILTER (WHERE categoria = 'Para Conserto') AS "paraConserto",
      COUNT(*) FILTER (WHERE categoria = 'Sucateado') AS sucateado
    FROM classificado
    GROUP BY garagem, medida
  `);

  const chave = (item) => `${item.garagem}__${item.medida}`;
  const categorias = ["novo", "meiaVida", "reformado", "paraReforma", "paraConserto", "sucateado"];

  const mapa = new Map();

  fisicoQuery.rows.forEach((item) => {
    mapa.set(chave(item), { fisico: item, digital: null });
  });

  digitalQuery.rows.forEach((item) => {
    const k = chave(item);
    if (mapa.has(k)) {
      mapa.get(k).digital = item;
    } else {
      mapa.set(k, { fisico: null, digital: item });
    }
  });

  let totalDivergencias = 0;
  let medidasAfetadas = 0;
  let medidasOk = 0;

  mapa.forEach(({ fisico, digital }) => {
    let temDivergencia = false;

    categorias.forEach((cat) => {
      const valorFisico = Number(fisico?.[cat] ?? 0);
      const valorDigital = Number(digital?.[cat] ?? 0);
      if (valorFisico !== valorDigital) {
        totalDivergencias++;
        temDivergencia = true;
      }
    });

    temDivergencia ? medidasAfetadas++ : medidasOk++;
  });

  res.json([
    { titulo: "Total Divergências", resultado: totalDivergencias, cor: "#dc2626" },
    { titulo: "Medidas Afetadas", resultado: medidasAfetadas, cor: "#ea580c" },
    { titulo: "Medidas OK", resultado: medidasOk, cor: "#009999" },
  ]);
});

export default router;
