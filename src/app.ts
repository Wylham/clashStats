import express from "express";
import "dotenv/config";
import { getClan } from "./services/clanService";
import clanRoutes from "./routes/clanRoutes";

const app = express();

app.use(express.json());
app.use(clanRoutes);

app.get("/", (req, res) => {
  res.send("Api Rodando Tranquilamente...");
});

app.get("/player", (req, res) => {
  res.json({
    message: "Caminho para os players futuramente",
    status: "ok",
  });
});

export default app;
