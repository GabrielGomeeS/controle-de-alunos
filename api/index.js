import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js"; // << NOVO

const app = express();

app.use(express.json());
app.use(cors());

// CRUD de alunos
app.use("/", userRoutes);

// Login / Cadastro
app.use("/auth", authRoutes); // << NOVO

app.listen(3001, () => {
  console.log("✅ Servidor rodando na porta 3001");
});
