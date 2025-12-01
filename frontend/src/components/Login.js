import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormBox = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 13px;
  color: #374151;
  display: block;
  margin-bottom: 4px; /* espaçamento entre o texto e o input */
`;

const Input = styled.input`
  height: 38px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0 10px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.15);
  }
`;

const Select = styled.select`
  height: 38px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0 10px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.15);
  }
`;

const Button = styled.button`
  margin-top: 8px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`;

const Toggle = styled.p`
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
  cursor: pointer;
  color: #2563eb;
  text-decoration: underline;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

const Login = ({ onLoginSuccess }) => {
  const [modoCadastro, setModoCadastro] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "",
    turma: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.senha) {
      return toast.warn("Informe e-mail e senha.");
    }

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email: form.email,
        senha: form.senha,
      });

      toast.success(`Bem-vindo(a), ${res.data.nome}!`);
      onLoginSuccess(res.data);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Erro ao fazer login.";
      toast.error(msg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.senha || !form.tipo) {
      return toast.warn("Preencha nome, e-mail, senha e tipo.");
    }

    if (form.tipo === "aluno" && !form.turma) {
      return toast.warn("Informe a turma se o usuário for aluno.");
    }

    try {
      await axios.post("http://localhost:3001/auth/register", {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo: form.tipo,
        turma: form.tipo === "aluno" ? form.turma : null,
      });

      toast.success("Cadastro realizado! Faça login para continuar.");
      setModoCadastro(false);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Erro ao cadastrar usuário.";
      toast.error(msg);
    }
  };

  return (
    <Card>
      {modoCadastro ? (
        <>
          <Subtitle>Preencha os dados para criar seu usuário.</Subtitle>
          <FormBox onSubmit={handleRegister}>
            <div>
              <Label>Nome</Label>
              <Input name="nome" value={form.nome} onChange={handleChange} />
            </div>

            <div>
              <Label>E-mail</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Senha</Label>
              <Input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <Select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
              </Select>
            </div>

            {form.tipo === "aluno" && (
              <div>
                <Label>Turma (obrigatório para aluno)</Label>
                <Input
                  name="turma"
                  value={form.turma}
                  onChange={handleChange}
                />
              </div>
            )}

            <Button type="submit">Cadastrar</Button>
          </FormBox>
        </>
      ) : (
        <>
          <Subtitle>Entre com seu e-mail e senha para acessar o sistema.</Subtitle>
          <FormBox onSubmit={handleLogin}>
            <div>
              <Label>E-mail</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Senha</Label>
              <Input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
              />
            </div>

            <Button type="submit">Entrar</Button>
          </FormBox>
        </>
      )}

      <Toggle onClick={() => setModoCadastro((prev) => !prev)}>
        {modoCadastro
          ? "Já tem conta? Clique aqui para fazer login."
          : "Ainda não tem conta? Clique aqui para se cadastrar."}
      </Toggle>
    </Card>
  );
};

export default Login;
