// controllers/auth.js
import { db } from "../db.js";

// POST /auth/register
export const register = (req, res) => {
  const { nome, email, senha, tipo, turma } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: "Preencha nome, email, senha e tipo." });
  }

  if (tipo === "aluno" && !turma) {
    return res.status(400).json({ message: "Alunos precisam ter uma turma." });
  }

  const qCheck = "SELECT id FROM login_users WHERE email = ?";

  db.query(qCheck, [email], (err, data) => {
    if (err) {
      console.error("Erro ao verificar usuário:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (data.length > 0) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const qInsert = `
      INSERT INTO login_users (nome, email, senha, tipo, turma)
      VALUES (?, ?, ?, ?, ?)
    `;

    const turmaValue = tipo === "aluno" ? turma : null;

    db.query(qInsert, [nome, email, senha, tipo, turmaValue], (err2) => {
      if (err2) {
        console.error("Erro ao registrar usuário:", err2);
        return res.status(500).json({ message: "Erro ao registrar usuário." });
      }

      return res.status(201).json({ message: "Usuário registrado com sucesso!" });
    });
  });
};

// POST /auth/login
export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Informe e-mail e senha." });
  }

  const q = `
    SELECT id, nome, email, tipo, turma
    FROM login_users
    WHERE email = ? AND senha = ?
  `;

  db.query(q, [email, senha], (err, data) => {
    if (err) {
      console.error("Erro ao fazer login:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (data.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    // devolve os dados do usuário logado
    return res.status(200).json(data[0]);
  });
};
