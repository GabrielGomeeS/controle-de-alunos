import { db } from "../db.js";

// ✅ Buscar todos os usuários
export const getUsers = (_, res) => {
  const q = "SELECT * FROM users";

  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

// ✅ Adicionar novo usuário
export const addUser = (req, res) => {
  const q = "INSERT INTO users(`nome`, `email`, `fone`, `data_nascimento`, `turma`) VALUES (?)";

  const values = [
    req.body.nome,
    req.body.email,
    req.body.fone,
    req.body.data_nascimento,
    req.body.turma,
  ];

  db.query(q, [values], (err) => {
    if (err) {
      console.error("Erro ao adicionar usuário:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json("Usuário criado com sucesso!");
  });
};

// ✅ Atualizar usuário existente
export const updateUser = (req, res) => {
  const q = `
    UPDATE users 
    SET nome = ?, email = ?, fone = ?, data_nascimento = ?, turma = ?
    WHERE id = ?
  `;

  const values = [
    req.body.nome,
    req.body.email,
    req.body.fone,
    req.body.data_nascimento,
    req.body.turma,
  ];

  db.query(q, [...values, req.params.id], (err) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json("Usuário atualizado com sucesso!");
  });
};

// ✅ Deletar usuário
export const deleteUser = (req, res) => {
  const q = "DELETE FROM users WHERE id = ?";

  db.query(q, [req.params.id], (err) => {
    if (err) {
      console.error("Erro ao deletar usuário:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json("Usuário deletado com sucesso!");
  });
};
