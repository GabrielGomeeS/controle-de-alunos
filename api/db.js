import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gabadeberto123@",
  database: "crud",
});

// Teste de conexão (opcional mas útil)
db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("✅ Conectado ao banco de dados MySQL!");
});
