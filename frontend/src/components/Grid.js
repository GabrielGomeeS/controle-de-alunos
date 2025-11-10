import React from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaSort, FaSortUp, FaSortDown, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 1120px;
  margin: 20px auto;
  word-break: break-word;
  table-layout: fixed;
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;
export const Tr = styled.tr``;

export const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0;
  gap: 10px;
`;

const InputBusca = styled.input`
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const ButtonExport = styled.button`
  padding: 8px 14px;
  background-color: #2c73d2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Grid = ({ users, setUsers, setOnEdit }) => {
  const [filtroTurma, setFiltroTurma] = React.useState("");
  const [filtroNome, setFiltroNome] = React.useState("");
  const [sortField, setSortField] = React.useState("nome");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const turmasDisponiveis = [...new Set(users.map((u) => u.turma).filter(Boolean))];

  const handleEdit = (item) => setOnEdit(item);

  const handleDelete = async (id) => {
    await axios
      .delete("http://localhost:3001/" + id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.id !== id);
        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  };

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!a[sortField]) return -1;
    if (!b[sortField]) return 1;
    if (sortOrder === "asc") return a[sortField] > b[sortField] ? 1 : -1;
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const usuariosFiltrados = sortedUsers.filter((user) => {
    const nomeMatch = user.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(filtroNome.toLowerCase());
    const turmaMatch = filtroTurma ? user.turma === filtroTurma : true;
    return (nomeMatch || emailMatch) && turmaMatch;
  });

  const exportarCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nome,Email,Fone,Data Nascimento,Turma"]
        .concat(
          usuariosFiltrados.map(
            (u) => `${u.nome},${u.email},${u.fone},${u.data_nascimento},${u.turma}`
          )
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "alunos.csv";
    link.click();
  };

  // Contagem de alunos por turma
  const contagemPorTurma = users.reduce((acc, u) => {
    acc[u.turma] = (acc[u.turma] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Controls>
        <InputBusca
          type="text"
          placeholder="Buscar por nome ou email..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />

        <select
          value={filtroTurma}
          onChange={(e) => setFiltroTurma(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Todas as turmas</option>
          {turmasDisponiveis.map((turma, index) => (
            <option key={index} value={turma}>
              {turma}
            </option>
          ))}
        </select>

        <ButtonExport onClick={exportarCSV}>
          <FaDownload /> Exportar CSV
        </ButtonExport>
      </Controls>

      <Table>
        <Thead>
          <Tr>
            {["nome", "email", "fone", "turma"].map((field) => (
              <Th key={field} onClick={() => handleSort(field)}>
                {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                {sortField === field ? (
                  sortOrder === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </Th>
            ))}
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {usuariosFiltrados.map((item, i) => (
            <Tr key={i}>
              <Td width="25%">{item.nome}</Td>
              <Td width="25%">{item.email}</Td>
              <Td width="20%" onlyWeb>
                {item.fone}
              </Td>
              <Td width="20%">{item.turma}</Td>
              <Td alignCenter width="5%">
                <FaEdit onClick={() => handleEdit(item)} style={{ cursor: "pointer" }} />
              </Td>
              <Td alignCenter width="5%">
                <FaTrash onClick={() => handleDelete(item.id)} style={{ cursor: "pointer" }} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <div
        style={{
          marginTop: "15px",
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0px 0px 5px #ccc",
        }}
      >
        <h4>📊 Total de alunos por turma:</h4>
        {Object.entries(contagemPorTurma).map(([turma, total]) => (
          <p key={turma}>
            <strong>{turma}:</strong> {total} aluno(s)
          </p>
        ))}
      </div>
    </>
  );
};

export default Grid;
