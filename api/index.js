import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors());

// Rota base
app.use("/", userRoutes);

app.listen(3001, () => {
  console.log("✅ Servidor rodando na porta 3001");
});
