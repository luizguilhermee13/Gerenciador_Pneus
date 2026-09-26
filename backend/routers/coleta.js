import express from "express";
import db from "../db.js";

const router = express.Router();

// ======================================================
// BUSCAR PNEU
// ======================================================

// busca um pneu pelo número de fogo
router.get("/pneu/:nrFogo", async (req, res) => {
  try {
    const nrFogo = Number(req.params.nrFogo);

    if (!Number.isInteger(nrFogo) || nrFogo <= 0) {
      return res.status(400).json({
        mensagem: "Número de fogo inválido",
      });
    }

    const resultado = await db.query(
      `
        SELECT
          p.id_nr_fogo AS "idNrFogo",
          p.medida,
          p.marca,
          p.vida,
          p.sulco,
          p.status,
          g.id_garagem AS "idGaragem",
          g.nome AS garagem
        FROM pneus p
        LEFT JOIN garagem g
          ON p.id_garagem_atual = g.id_garagem
        WHERE p.id_nr_fogo = $1
      `,
      [nrFogo],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pneu não encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar pneu:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar pneu",
      erro: erro.message,
    });
  }
});

// ======================================================
// RECAPADORAS
// ======================================================

// lista as recapadoras cadastradas
router.get("/recapadoras", async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT
        r.id_recapadora AS id,
        r.nome_recapadora AS nome,
        r.telefone,
        r.endereco,
        r.id_garagem AS "idGaragem",
        g.nome AS garagem
      FROM recapagem r
      LEFT JOIN garagem g
        ON r.id_garagem = g.id_garagem
      ORDER BY r.nome_recapadora
    `);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar recapadoras:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar recapadoras",
      erro: erro.message,
    });
  }
});

// ======================================================
// PREÇOS
// ======================================================

// busca serviços e preços da recapadora pela medida
router.get("/precos/:idRecapadora", async (req, res) => {
  try {
    const idRecapadora = Number(req.params.idRecapadora);

    const { medida } = req.query;

    if (!Number.isInteger(idRecapadora) || idRecapadora <= 0) {
      return res.status(400).json({
        mensagem: "Recapadora inválida",
      });
    }

    if (!medida) {
      return res.status(400).json({
        mensagem: "Informe a medida do pneu",
      });
    }

    const resultado = await db.query(
      `
          SELECT
            id_preco_recapagem AS id,
            servico,
            preco_padrao AS "precoPadrao"
          FROM precos_recapagem
          WHERE id_recapadora = $1
            AND LOWER(TRIM(medida)) =
                LOWER(TRIM($2))
          ORDER BY servico
        `,
      [idRecapadora, medida],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Nenhum preço encontrado para essa medida",
      });
    }

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar preços:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar preços de recapagem",
      erro: erro.message,
    });
  }
});

// ======================================================
// CADASTRAR COLETA
// ======================================================

router.post("/", async (req, res) => {
  const client = await db.connect();

  let transacaoIniciada = false;

  try {
    const { id_coleta, id_recapadora, data_coleta, id_garagem, pneus } = req.body;

    const idColeta = Number(id_coleta);
    const idRecapadora = Number(id_recapadora);
    const idGaragem = Number(id_garagem);

    // valida dados principais
    if (!Number.isInteger(idColeta) || !Number.isInteger(idRecapadora) || !Number.isInteger(idGaragem) || !data_coleta) {
      return res.status(400).json({
        mensagem: "Preencha todos os dados da coleta",
      });
    }

    // valida quantidade
    if (!Array.isArray(pneus) || pneus.length === 0) {
      return res.status(400).json({
        mensagem: "Informe pelo menos um pneu",
      });
    }

    if (pneus.length > 12) {
      return res.status(400).json({
        mensagem: "Uma coleta pode possuir no máximo 12 pneus",
      });
    }

    // números de fogo
    const numerosFogo = pneus.map((pneu) => Number(pneu.idNrFogo));

    const possuiNumeroInvalido = numerosFogo.some((numero) => !Number.isInteger(numero) || numero <= 0);

    if (possuiNumeroInvalido) {
      return res.status(400).json({
        mensagem: "Existe um número de fogo inválido na coleta",
      });
    }

    // impede pneu repetido
    const numerosUnicos = new Set(numerosFogo);

    if (numerosUnicos.size !== numerosFogo.length) {
      return res.status(400).json({
        mensagem: "Existem pneus repetidos na coleta",
      });
    }

    // confirma recapadora
    const recapadoraBanco = await client.query(
      `
          SELECT id_recapadora
          FROM recapagem
          WHERE id_recapadora = $1
        `,
      [idRecapadora],
    );

    if (recapadoraBanco.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Recapadora não encontrada",
      });
    }

    // confirma garagem
    const garagemBanco = await client.query(
      `
          SELECT id_garagem
          FROM garagem
          WHERE id_garagem = $1
        `,
      [idGaragem],
    );

    if (garagemBanco.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Garagem não encontrada",
      });
    }

    await client.query("BEGIN");

    transacaoIniciada = true;

    // impede repetir número de coleta
    const coletaExistente = await client.query(
      `
          SELECT id_coleta
          FROM coletas_feitas
          WHERE id_coleta = $1
          LIMIT 1
        `,
      [idColeta],
    );

    if (coletaExistente.rows.length > 0) {
      await client.query("ROLLBACK");

      transacaoIniciada = false;

      return res.status(409).json({
        mensagem: "Número de coleta já cadastrado",
      });
    }

    let valorTotal = 0;

    for (const pneu of pneus) {
      const idNrFogo = Number(pneu.idNrFogo);

      const servico = pneu.servico;

      if (!servico) {
        throw new Error(`Informe o serviço do pneu ${idNrFogo}`);
      }

      // busca e trava pneu
      const pneuBanco = await client.query(
        `
            SELECT
              id_nr_fogo,
              medida,
              status
            FROM pneus
            WHERE id_nr_fogo = $1
            FOR UPDATE
          `,
        [idNrFogo],
      );

      if (pneuBanco.rows.length === 0) {
        throw new Error(`Pneu ${idNrFogo} não encontrado`);
      }

      const pneuEncontrado = pneuBanco.rows[0];

      // impede pneu que ainda não pode voltar para recapagem
      if (["Na Recapagem", "Recusado", "Sucateado"].includes(pneuEncontrado.status)) {
        throw new Error(`Pneu ${idNrFogo} não pode ser enviado para recapagem. Status atual: ${pneuEncontrado.status}`);
      }

      // busca preço oficial
      const precoBanco = await client.query(
        `
            SELECT
              servico,
              preco_padrao
            FROM precos_recapagem
            WHERE id_recapadora = $1
              AND LOWER(TRIM(medida)) =
                  LOWER(TRIM($2))
              AND LOWER(TRIM(servico)) =
                  LOWER(TRIM($3))
            LIMIT 1
          `,
        [idRecapadora, pneuEncontrado.medida, servico],
      );

      if (precoBanco.rows.length === 0) {
        throw new Error(`Não existe preço cadastrado para o pneu ${idNrFogo}, medida ${pneuEncontrado.medida} e serviço ${servico}`);
      }

      const preco = Number(precoBanco.rows[0].preco_padrao);

      const nomeServico = precoBanco.rows[0].servico;

      valorTotal += preco;

      // registra item da coleta
      await client.query(
        `
          INSERT INTO coletas_feitas (
            id_coleta,
            id_recapadora,
            data_coleta,
            id_garagem,
            id_nr_fogo,
            status,
            servico,
            preco_cobrado
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
          )
        `,
        [idColeta, idRecapadora, data_coleta, idGaragem, idNrFogo, "Na Reformadora", nomeServico, preco],
      );

      // altera pneu
      await client.query(
        `
          UPDATE pneus
          SET
            status = 'Na Recapagem',
            id_carro_atual = NULL,
            posicao = NULL
          WHERE id_nr_fogo = $1
        `,
        [idNrFogo],
      );
    }

    await client.query("COMMIT");

    transacaoIniciada = false;

    res.status(201).json({
      mensagem: "Coleta registrada com sucesso",
      idColeta,
      quantidadePneus: pneus.length,
      valorTotal,
    });
  } catch (erro) {
    if (transacaoIniciada) {
      await client.query("ROLLBACK");
    }

    console.error("Erro ao registrar coleta:", erro);

    res.status(400).json({
      mensagem: "Erro ao registrar coleta",
      erro: erro.message,
    });
  } finally {
    client.release();
  }
});

// ======================================================
// PNEUS PENDENTES
// ======================================================

router.get("/pendentes", async (req, res) => {
  try {
    const resultado = await db.query(`
          SELECT
            c.id_item AS "idItem",
            c.id_coleta AS coleta,
            c.data_coleta AS "dataColeta",

            c.id_recapadora AS "idRecapadora",
            r.nome_recapadora AS reformadora,

            c.id_nr_fogo AS "nrFogo",

            p.medida,
            p.marca,
            p.vida,
            p.sulco,

            c.status,

            c.id_garagem AS "idGaragem",
            g.nome AS garagem,

            c.servico,
            c.preco_cobrado AS valor

          FROM coletas_feitas c

          JOIN pneus p
            ON p.id_nr_fogo =
               c.id_nr_fogo

          JOIN recapagem r
            ON r.id_recapadora =
               c.id_recapadora

          JOIN garagem g
            ON g.id_garagem =
               c.id_garagem

          WHERE c.status =
                'Na Reformadora'

          ORDER BY
            c.data_coleta DESC,
            c.id_coleta DESC,
            c.id_item
        `);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar pneus na reformadora:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar pneus na reformadora",
      erro: erro.message,
    });
  }
});

// ======================================================
// INFORMAR RETORNO
// ENTREGUE OU RECUSADO
// ======================================================

router.put("/entrega", async (req, res) => {
  const client = await db.connect();

  let transacaoIniciada = false;

  try {
    const { data_entrega, id_garagem_destino, itens } = req.body;

    const idGaragemDestino = Number(id_garagem_destino);

    if (!data_entrega) {
      return res.status(400).json({
        mensagem: "Informe a data da entrega",
      });
    }

    if (!Number.isInteger(idGaragemDestino) || idGaragemDestino <= 0) {
      return res.status(400).json({
        mensagem: "Selecione uma garagem de destino",
      });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        mensagem: "Selecione pelo menos um pneu para receber",
      });
    }

    /*
        Aceita dois formatos:

        antigo:
        itens: [1, 2]

        novo:
        itens: [
          {
            idItem: 1,
            status: "Entregue"
          },
          {
            idItem: 2,
            status: "Recusado"
          }
        ]

        Caso receba apenas o número,
        considera Entregue.
      */

    const itensNormalizados = itens.map((item) => {
      if (typeof item === "number" || typeof item === "string") {
        return {
          idItem: Number(item),
          status: "Entregue",
        };
      }

      const statusRecebido = String(item.status || "")
        .trim()
        .toLowerCase();

      let status = null;

      if (statusRecebido === "entregue") {
        status = "Entregue";
      }

      if (statusRecebido === "recusado") {
        status = "Recusado";
      }

      return {
        idItem: Number(item.idItem),
        status,
      };
    });

    // valida ids
    const possuiIdInvalido = itensNormalizados.some((item) => !Number.isInteger(item.idItem) || item.idItem <= 0);

    if (possuiIdInvalido) {
      return res.status(400).json({
        mensagem: "Existe um item inválido na entrega",
      });
    }

    // valida status
    const possuiStatusInvalido = itensNormalizados.some((item) => !["Entregue", "Recusado"].includes(item.status));

    if (possuiStatusInvalido) {
      return res.status(400).json({
        mensagem: "O status do retorno deve ser Entregue ou Recusado",
      });
    }

    // não permite item repetido
    const idsItens = itensNormalizados.map((item) => item.idItem);

    const idsUnicos = new Set(idsItens);

    if (idsUnicos.size !== idsItens.length) {
      return res.status(400).json({
        mensagem: "Existem pneus repetidos no retorno",
      });
    }

    // confirma garagem
    const garagemBanco = await client.query(
      `
            SELECT id_garagem
            FROM garagem
            WHERE id_garagem = $1
          `,
      [idGaragemDestino],
    );

    if (garagemBanco.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Garagem não encontrada",
      });
    }

    await client.query("BEGIN");

    transacaoIniciada = true;

    // busca e trava os itens
    const itensBanco = await client.query(
      `
            SELECT
              id_item,
              id_nr_fogo,
              status,
              data_coleta,
              preco_cobrado
            FROM coletas_feitas
            WHERE id_item =
                  ANY($1::int[])
            FOR UPDATE
          `,
      [idsItens],
    );

    if (itensBanco.rows.length !== idsItens.length) {
      throw new Error("Um ou mais itens da coleta não foram encontrados");
    }

    // verifica se já foi finalizado
    const itemJaFinalizado = itensBanco.rows.find((item) => item.status !== "Na Reformadora");

    if (itemJaFinalizado) {
      throw new Error(`O pneu ${itemJaFinalizado.id_nr_fogo} já foi finalizado`);
    }

    // mapeia status escolhido por id_item
    const statusPorItem = new Map(itensNormalizados.map((item) => [item.idItem, item.status]));

    const pneusEntregues = [];
    const pneusRecusados = [];

    for (const itemBanco of itensBanco.rows) {
      const statusFinal = statusPorItem.get(itemBanco.id_item);

      // atualiza item da coleta
      await client.query(
        `
            UPDATE coletas_feitas
            SET
              status = $1,
              data_entrega = $2,
              id_garagem_destino = $3,
              preco_cobrado =
                CASE
                  WHEN $1 = 'Recusado'
                    THEN 0
                  ELSE preco_cobrado
                END
            WHERE id_item = $4
          `,
        [statusFinal, data_entrega, idGaragemDestino, itemBanco.id_item],
      );

      // pneu entregue normalmente
      if (statusFinal === "Entregue") {
        await client.query(
          `
              UPDATE pneus
              SET
                status = 'Estoque',
                id_garagem_atual = $1,
                id_carro_atual = NULL,
                posicao = NULL
              WHERE id_nr_fogo = $2
            `,
          [idGaragemDestino, itemBanco.id_nr_fogo],
        );

        pneusEntregues.push(itemBanco.id_nr_fogo);
      }

      // pneu recusado
      if (statusFinal === "Recusado") {
        await client.query(
          `
              UPDATE pneus
              SET
                status = 'Recusado',
                id_garagem_atual = $1,
                id_carro_atual = NULL,
                posicao = NULL
              WHERE id_nr_fogo = $2
            `,
          [idGaragemDestino, itemBanco.id_nr_fogo],
        );

        pneusRecusados.push(itemBanco.id_nr_fogo);
      }
    }

    await client.query("COMMIT");

    transacaoIniciada = false;

    res.json({
      mensagem: "Retorno registrado com sucesso",

      quantidadePneus: itensNormalizados.length,

      quantidadeEntregues: pneusEntregues.length,

      quantidadeRecusados: pneusRecusados.length,

      entregues: pneusEntregues,

      recusados: pneusRecusados,
    });
  } catch (erro) {
    if (transacaoIniciada) {
      await client.query("ROLLBACK");
    }

    console.error("Erro ao registrar retorno:", erro);

    res.status(400).json({
      mensagem: "Erro ao registrar retorno",
      erro: erro.message,
    });
  } finally {
    client.release();
  }
});

// ======================================================
// STATUS DAS COLETAS
// ======================================================

router.get("/status", async (req, res) => {
  try {
    const resultado = await db.query(`
          SELECT
            c.id_coleta AS "idColeta",
            c.data_coleta AS "dataColeta",

            r.nome_recapadora AS recapadora,
            g.nome AS garagem,

            COUNT(*)::int AS total,

            COUNT(*) FILTER (
              WHERE c.status =
                    'Entregue'
            )::int AS entregues,

            COUNT(*) FILTER (
              WHERE c.status =
                    'Recusado'
            )::int AS recusados,

            COUNT(*) FILTER (
              WHERE c.status =
                    'Na Reformadora'
            )::int AS pendentes,

            COALESCE(
              SUM(c.preco_cobrado),
              0
            ) AS "valorTotal",

            JSON_AGG(
              JSON_BUILD_OBJECT(
                'idItem',
                c.id_item,

                'nrFogo',
                c.id_nr_fogo,

                'medida',
                p.medida,

                'marca',
                p.marca,

                'vida',
                p.vida,

                'sulco',
                p.sulco,

                'status',
                c.status,

                'servico',
                c.servico,

                'valor',
                c.preco_cobrado
              )

              ORDER BY c.id_item
            ) AS pneus

          FROM coletas_feitas c

          JOIN pneus p
            ON p.id_nr_fogo =
               c.id_nr_fogo

          JOIN recapagem r
            ON r.id_recapadora =
               c.id_recapadora

          JOIN garagem g
            ON g.id_garagem =
               c.id_garagem

          GROUP BY
            c.id_coleta,
            c.data_coleta,
            r.nome_recapadora,
            g.nome

          ORDER BY
            c.data_coleta DESC,
            c.id_coleta DESC
        `);

    const coletas = resultado.rows.map((coleta) => {
      const finalizados = coleta.entregues + coleta.recusados;

      let status = "Pendente";

      if (finalizados === coleta.total) {
        status = "Concluída";
      } else if (finalizados > 0) {
        status = "Em andamento";
      }

      const progresso = coleta.total > 0 ? Math.round((finalizados / coleta.total) * 100) : 0;

      return {
        ...coleta,
        status,
        finalizados,
        progresso,
      };
    });

    res.json(coletas);
  } catch (erro) {
    console.error("Erro ao buscar status das coletas:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar status das coletas",
      erro: erro.message,
    });
  }
});

// ======================================================
// HISTÓRICO
// ======================================================

router.get("/historico", async (req, res) => {
  try {
    const resultado = await db.query(`
          SELECT
            c.id_item AS "idItem",
            c.id_coleta AS coleta,

            c.data_coleta AS "dataColeta",
            c.data_entrega AS "dataEntrega",

            r.nome_recapadora AS reformadora,

            c.id_nr_fogo AS "nrFogo",

            p.medida,
            p.marca,
            p.vida,
            p.sulco,

            c.status,

            g_origem.nome AS "garagemOrigem",
            g_destino.nome AS "garagemDestino",

            c.servico,

            c.preco_cobrado AS valor

          FROM coletas_feitas c

          JOIN pneus p
            ON p.id_nr_fogo =
               c.id_nr_fogo

          JOIN recapagem r
            ON r.id_recapadora =
               c.id_recapadora

          JOIN garagem g_origem
            ON g_origem.id_garagem =
               c.id_garagem

          LEFT JOIN garagem g_destino
            ON g_destino.id_garagem =
               c.id_garagem_destino

          WHERE c.status IN (
            'Entregue',
            'Recusado'
          )

          ORDER BY
            c.data_entrega DESC
              NULLS LAST,
            c.id_coleta DESC,
            c.id_item DESC
        `);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar histórico de coletas:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar histórico de coletas",
      erro: erro.message,
    });
  }
});

// ======================================================
// CARDS - INFORMAR ENTREGA
// ======================================================

router.get("/cards/entrega", async (req, res) => {
  try {
    const resultado = await db.query(`
          SELECT

            COUNT(*) FILTER (
              WHERE status =
                    'Entregue'
            )::int AS reformados,

            COUNT(*) FILTER (
              WHERE status =
                    'Recusado'
            )::int AS recusados,

            COUNT(*) FILTER (
              WHERE status IN (
                'Entregue',
                'Recusado'
              )
            )::int AS total_retornado

          FROM coletas_feitas
        `);

    const dados = resultado.rows[0];

    res.json([
      {
        titulo: "Reformados",
        resultado: dados.reformados,
        cor: "#009999",
      },
      {
        titulo: "Recusados",
        resultado: dados.recusados,
        cor: "#dc2626",
      },
      {
        titulo: "Total Retornado",
        resultado: dados.total_retornado,
        cor: "#000000",
      },
    ]);
  } catch (erro) {
    console.error("Erro ao buscar cards de entrega:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar indicadores de entrega",
      erro: erro.message,
    });
  }
});

// ======================================================
// CARDS - STATUS DAS COLETAS
// ======================================================

router.get("/cards/status", async (req, res) => {
  try {
    const resultado = await db.query(`
          WITH status_coletas AS (
            SELECT
              id_coleta,

              COUNT(*) FILTER (
                WHERE status =
                      'Na Reformadora'
              )::int AS pendentes

            FROM coletas_feitas

            GROUP BY id_coleta
          )

          SELECT
            COUNT(*) FILTER (
              WHERE pendentes > 0
            )::int AS pendentes,

            COUNT(*) FILTER (
              WHERE pendentes = 0
            )::int AS concluidas,

            COUNT(*)::int AS total

          FROM status_coletas
        `);

    const dados = resultado.rows[0];

    res.json([
      {
        titulo: "Pendentes",
        resultado: dados.pendentes,
        cor: "#ea580c",
      },
      {
        titulo: "Concluídas",
        resultado: dados.concluidas,
        cor: "#009999",
      },
      {
        titulo: "Total",
        resultado: dados.total,
        cor: "#6b7280",
      },
    ]);
  } catch (erro) {
    console.error("Erro ao buscar cards de status:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar indicadores das coletas",
      erro: erro.message,
    });
  }
});

// ======================================================
// CARDS - INDICADORES RECAPAGEM
// ======================================================

router.get("/cards/recapagem", async (req, res) => {
  try {
    const resultado = await db.query(`
          SELECT

            COUNT(*) FILTER (
              WHERE DATE_TRUNC(
                'month',
                data_coleta
              ) =
              DATE_TRUNC(
                'month',
                CURRENT_DATE
              )
            )::int AS coletados_mes,

            COALESCE(
              SUM(preco_cobrado)
              FILTER (
                WHERE status =
                      'Entregue'

                AND DATE_TRUNC(
                  'month',
                  data_entrega
                ) =
                DATE_TRUNC(
                  'month',
                  CURRENT_DATE
                )
              ),
              0
            ) AS gasto_mes,

            COUNT(*) FILTER (
              WHERE status =
                    'Na Reformadora'
            )::int AS pendentes,

            COUNT(*) FILTER (
              WHERE status =
                    'Recusado'

                AND DATE_TRUNC(
                  'month',
                  data_entrega
                ) =
                DATE_TRUNC(
                  'month',
                  CURRENT_DATE
                )
            )::int AS recusados_mes,

            COUNT(*) FILTER (
              WHERE status IN (
                'Entregue',
                'Recusado'
              )

              AND DATE_TRUNC(
                'month',
                data_entrega
              ) =
              DATE_TRUNC(
                'month',
                CURRENT_DATE
              )
            )::int AS retornados_mes

          FROM coletas_feitas
        `);

    const dados = resultado.rows[0];

    const taxaRecusa = dados.retornados_mes > 0 ? ((dados.recusados_mes / dados.retornados_mes) * 100).toFixed(1) : "0.0";

    const gastoMes = Number(dados.gasto_mes).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    res.json([
      {
        titulo: "Pneus Coletados",
        resultado: dados.coletados_mes,
        cor: "#009999",
      },
      {
        titulo: "Gasto no Mês",
        resultado: gastoMes,
        cor: "#ea580c",
      },
      {
        titulo: "Pneus Pendentes",
        resultado: dados.pendentes,
        cor: "#16a34a",
      },
      {
        titulo: "Tx. Recusa",
        resultado: `${taxaRecusa}%`,
        cor: "#dc2626",
      },
    ]);
  } catch (erro) {
    console.error("Erro ao buscar cards de recapagem:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar indicadores de recapagem",
      erro: erro.message,
    });
  }
});

export default router;
