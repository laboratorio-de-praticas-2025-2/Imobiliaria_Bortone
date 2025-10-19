"use client";
import { Table } from "antd";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import PesquisaAvancadaUser from "@/components/cms/table/pesquisaavancada/PesquisaAvancada";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdPersonAdd } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import Link from "next/link";
import ConfirmModal from "@/components/cms/ConfirmModal";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
export default function Page() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterData, setFilterData] = useState({ order: null });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const { styles } = useStyle();

  const [deleteId, setDeleteId] = useState(null);
  const onDelete = (id) => {
    setDeleteId(id);
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/user/user/${deleteId}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      setIsConfirmModalVisible(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      setIsConfirmModalVisible(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nível",
      dataIndex: "nivel",
      key: "nivel",
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
    },
    {
      title: "Ações",
      dataIndex: "acoes",
      key: "acoes",
      render: (_, record) => (
        <div className="flex gap-4">
          <Link href={`/admin/cms-usuarios/editar/${record.id}`}>
            <BiPencil
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </Link>
          <button onClick={() => onDelete(record.id)}>
            <IoMdTrash
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </button>
        </div>
      ),
      fixed: 'right',
    },
  ];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/user/users`);
        setUsers(Array.isArray(res.data) ? res.data : []);
        setAllUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setUsers([]);
        setAllUsers([]);
      }
    }
    fetchUsers();
  }, []);

  let orderedUsers = [...users];
  if (filterData.order === "Ordem alfabetica") {
    orderedUsers.sort((a, b) => {
      if (!a.nome) return 1;
      if (!b.nome) return -1;
      return a.nome.localeCompare(b.nome);
    });
  } else if (filterData.order === "Data de inclusão") {
    orderedUsers.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.data_inclusao || 0);
      const bDate = new Date(b.createdAt || b.data_inclusao || 0);
      return bDate - aDate;
    });
  }

  // Paginação manual dos dados
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = orderedUsers.slice(startIndex, endIndex);

  const onSearch = (value) => {
    if (!value) {
      setUsers(allUsers);
      setCurrentPage(1);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = allUsers.filter(
      (u) =>
        (u.nome && u.nome.toLowerCase().includes(lower)) ||
        (u.email && u.email.toLowerCase().includes(lower))
    );
    setUsers(filtered);
    setCurrentPage(1);
  };

  // Filtro avançado por nível
  const onAdvancedFilter = (nivel) => {
    if (!nivel) {
      setUsers(allUsers);
      setCurrentPage(1);
      return;
    }
    const nivelNum = nivel === "administrador" ? 0 : 1;
    setUsers(allUsers.filter(u => u.nivel === nivelNum));
    setCurrentPage(1);
  };
  const handleSelectOrder = (value) => {
    setFilterData((prev) => ({ ...prev, order: value }));
  };
  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <>
      {isConfirmModalVisible && (
        <ConfirmModal
          message="Você tem certeza que deseja excluir o registro definitivamente?"
          onConfirm={onConfirmDelete}
          onCancel={() => setIsConfirmModalVisible(false)}
        />
      )}
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Usuários"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Novo Usuário"
              buttonIcon={<MdPersonAdd />}
              onSearch={onSearch}
              href={"/admin/cms-usuarios/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
              type={"user"}
              onAdvancedFilter={onAdvancedFilter}
            />
            <CMS.TableBody table={true}>
              <Table
                columns={columns}
                dataSource={paginatedUsers}
                rowKey="id"
                pagination={false}
                className={styles.customTable}
                scroll={{ x: 'max-content' }}
              />
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              totalItems={orderedUsers.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}