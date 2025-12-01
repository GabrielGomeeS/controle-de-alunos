// src/App.js
import GlobalStyle from "./styles/global";
import styled from "styled-components";
import Form from "./components/Form";
import Grid from "./components/Grid";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AppWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 30px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.header`
  background-color: #ffffff;
  padding: 18px 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #1e3a8a;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  color: #4b5563;
`;

const Badge = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  color: #0f172a;
  background-color: ${({ tipo }) =>
    tipo === "professor" ? "#bfdbfe" : "#bbf7d0"};
  margin-top: 3px;
`;

const LogoutButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background-color: #ef4444;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
`;

const ContentCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const LoginWrapper = styled.div`
  width: 100%;
  max-width: 420px;
  margin: auto;
  margin-top: 60px;
`;

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar alunos no servidor.");
    }
  };

  useEffect(() => {
    if (usuarioLogado) {
      getUsers();
    }
  }, [usuarioLogado]);

  const handleLogout = () => {
    setUsuarioLogado(null);
    setUsers([]);
    setOnEdit(null);
    toast.info("Você saiu do sistema.");
  };

  // Tela de login / cadastro
  if (!usuarioLogado) {
    return (
      <>
        <AppWrapper>
          <LoginWrapper>
            <ContentCard>
              <Title>Controle Escolar</Title>
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                Acesse com seu usuário ou cadastre-se como professor ou aluno.
              </p>
              <Login onLoginSuccess={setUsuarioLogado} />
            </ContentCard>
          </LoginWrapper>
        </AppWrapper>

        <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
        <GlobalStyle />
      </>
    );
  }

  // Tela principal após login
  return (
    <>
      <AppWrapper>
        <Header>
          <div>
            <Title>Controle Escolar</Title>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Gerencie alunos e turmas de forma simples e organizada.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <UserInfo>
              <span>Olá, <strong>{usuarioLogado.nome}</strong></span>
              <Badge tipo={usuarioLogado.tipo}>
                {usuarioLogado.tipo === "professor" ? "Professor" : "Aluno"}
                {usuarioLogado.tipo === "aluno" && usuarioLogado.turma
                  ? ` • ${usuarioLogado.turma}`
                  : ""}
              </Badge>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          </div>
        </Header>

        <ContentCard>
          {usuarioLogado.tipo === "professor" && (
            <>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Cadastro de alunos</h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
                Preencha os dados do aluno e clique em <strong>SALVAR</strong> para
                adicioná-lo ou atualizar suas informações.
              </p>
              <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
            </>
          )}

          <div style={{ marginTop: usuarioLogado.tipo === "professor" ? 10 : 0 }}>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Lista de alunos</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
              Use a busca, filtros e ordenação para encontrar rapidamente os alunos.
            </p>
            <Grid
              setOnEdit={setOnEdit}
              users={users}
              setUsers={setUsers}
              usuarioLogado={usuarioLogado}
            />
          </div>
        </ContentCard>
      </AppWrapper>

      <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
      <GlobalStyle />
    </>
  );
}

export default App;
