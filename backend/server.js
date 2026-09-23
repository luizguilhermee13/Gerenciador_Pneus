import express from "express";
import pneusRouter from "./routers/pneus.js";
import garagemRouter from "./routers/garagem.js";
import veiculosRouter from "./routers/veiculos.js";
import sucatasRouter from "./routers/sucatas.js";
import estoqueRouter from "./routers/estoque.js";

import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/garagem", garagemRouter);
app.use("/api/pneus", pneusRouter);
app.use("/api/veiculos", veiculosRouter);
app.use("/api/sucatas", sucatasRouter);
app.use("/api/estoque", estoqueRouter);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
