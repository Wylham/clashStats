import express from "express";

const app = express();

export default app;

app.get("/health", (req, res) => {
  res.send("Api Rodando Tranquilamente");
});

app.listen(3000);
