import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 10px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 12px;
  color: #4b5563;
  display: block;
  margin-bottom: 4px; /* espaçamento entre o texto e o input */
`;

const Input = styled.input`
  width: 150px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 38px;
  font-size: 13px;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 999px;
  border: none;
  background-color: #16a34a;
  color: white;
  height: 38px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;
      user.nome.value = onEdit.nome;
      user.email.value = onEdit.email;
      user.fone.value = onEdit.fone;
      user.data_nascimento.value = onEdit.data_nascimento;
      user.turma.value = onEdit.turma;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = ref.current;

    if (
      !user.nome.value ||
      !user.email.value ||
      !user.fone.value ||
      !user.data_nascimento.value ||
      !user.turma.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    try {
      if (onEdit) {
        await axios.put(`http://localhost:3001/${onEdit.id}`, {
          nome: user.nome.value,
          email: user.email.value,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
          turma: user.turma.value,
        });
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:3001", {
          nome: user.nome.value,
          email: user.email.value,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
          turma: user.turma.value,
        });
        toast.success("Aluno adicionado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar aluno.");
    }

    user.nome.value = "";
    user.email.value = "";
    user.fone.value = "";
    user.data_nascimento.value = "";
    user.turma.value = "";

    setOnEdit(null);
    getUsers();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" />
      </InputArea>

      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>

      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" />
      </InputArea>

      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input name="data_nascimento" type="date" />
      </InputArea>

      <InputArea>
        <Label>Turma</Label>
        <Input name="turma" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;
