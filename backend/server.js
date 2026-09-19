import express from "express";
import pneusRouter from "./routers/pneus.js";
import garagemRouter from "./routers/garagem.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/garagem", garagemRouter);
app.use("/api/pneus", pneusRouter);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
