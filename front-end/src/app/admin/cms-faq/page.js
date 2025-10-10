"use client";
import { Table } from "antd";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import { createStyles } from "antd-style";
import FaqModal from "@/components/cms/FaqModal";

const mockedAnswers = [
  {
    id: 1,
    pergunta: "Como faço para criar uma conta?",
    resposta: "Para criar uma conta, clique no botão 'Registrar' no canto superior direito e preencha o formulário com suas informações.",
    id_usuario: 101,
    ultima_atualizacao: "2024-01-15",
  },
  {
    id: 2,
    pergunta: "Esqueci minha senha. O que devo fazer?",
    resposta: "Clique em 'Esqueci minha senha' na página de login e siga as instruções para redefinir sua senha.",
    id_usuario: 102,
    ultima_atualizacao: "2024-02-10",
  },
  {
    id: 3,
    pergunta: "Como posso entrar em contato com o suporte?",
    resposta: "Você pode entrar em contato com o suporte através do formulário de contato na seção 'Ajuda' ou enviando um e-mail para suporte@exemplo.com.",
    id_usuario: 103,
    ultima_atualizacao: "2024-03-05",
  },
];

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
  const [answers, setAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterData, setFilterData] = useState({ order: null });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { styles } = useStyle();

  const [deleteId, setDeleteId] = useState(null);
  const onDelete = (id) => {
    setDeleteId(id);
    setIsConfirmModalVisible(true);
  };

  const handleEdit = (item) => {
    setLoading(true);
    setEditingItem(item);
    setIsEditModalVisible(true);
    setLoading(false);
  };

  const onConfirmDelete = async () => {
    // try {
    //   setLoading(true);
    //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    //   await axios.delete(`${apiUrl}/user/faq/${deleteId}`);
    //   setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    //   setIsConfirmModalVisible(false);
    //   setDeleteId(null);
    //   setLoading(false);
    // } catch (err) {
    //   console.error("Erro ao deletar a pergunta:", err);
    //   setIsConfirmModalVisible(false);
    //   setDeleteId(null);
    //   setLoading(false);
    // }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Pergunta",
      dataIndex: "pergunta",
      key: "pergunta",
    },
    {
      title: "Resposta",
      dataIndex: "resposta",
      key: "resposta",
    },
    {
      title: "ID Usuário",
      dataIndex: "id_usuario",
      key: "id_usuario",
    },
    {
      title: "Última atualização",
      dataIndex: "ultima_atualizacao",
      key: "ultima_atualizacao",
    },
    {
      title: "Ações",
      dataIndex: "acoes",
      key: "acoes",
      render: (_, record) => (
        <div className="flex gap-4">
          <button onClick={() => handleEdit(record)}>
            <BiPencil
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </button>
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
    // async function fetchAnswers() {
    //   try {
    //     setLoading(true);
    //     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    //     const res = await axios.get(`${apiUrl}/user/faq`);
    //     setAnswers(Array.isArray(res.data) ? res.data : []);
    //     setAllAnswers(Array.isArray(res.data) ? res.data : []);
    //     setLoading(false);
    //   } catch (err) {
    //     console.error("Erro ao buscar respostas:", err);
    //     setAnswers([]);
    //     setAllAnswers([]);
    //     setLoading(false);
    //   }
    // }
    // fetchAnswers();
    setAnswers(mockedAnswers);
  }, []);

  let orderedAnswers = [...answers];
  if (filterData.order === "Ordem alfabetica") {
    orderedAnswers.sort((a, b) => {
      if (!a.pergunta) return 1;
      if (!b.pergunta) return -1;
      return a.pergunta.localeCompare(b.pergunta);
    });
  } else if (filterData.order === "Data de inclusão") {
    orderedAnswers.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.data_inclusao || 0);
      const bDate = new Date(b.createdAt || b.data_inclusao || 0);
      return bDate - aDate;
    });
  }
  // fatia os usuários conforme página
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAnswers = orderedAnswers.slice(startIndex, endIndex);

  const onSearch = (value) => {
    if (!value) {
      setAnswers(allAnswers);
      setCurrentPage(1);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = allAnswers.filter(
      (u) =>
        (u.pergunta && u.pergunta.toLowerCase().includes(lower)) ||
        (u.resposta && u.resposta.toLowerCase().includes(lower))
    );
    setAnswers(filtered);
    setCurrentPage(1);
  };

  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
  }

  if (loading) return <SplashScreen />;

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
        <CMS.Body title={"FAQ"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Adicionar pergunta"
              buttonIcon={<CiCirclePlus />}
              onSearch={onSearch}
              modalNewButton={true}
              onClick={() => setIsCreateModalVisible(true)}
              filterData={filterData}
              updateFilterData={updateFilterData}
            />
            <CMS.TableBody table={true}>
              <Table
                columns={columns}
                dataSource={paginatedAnswers}
                rowKey="id"
                pagination={false}
                className={styles.customTable}
                scroll={{ x: "max-content" }}
              />
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={answers}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
      {isEditModalVisible && (
        <FaqModal
          isEdit
          data={editingItem}
          onClose={() => setIsEditModalVisible(false)}
          onSave={(updatedItem) => {
            setAnswers((prev) =>
              prev.map((ans) => (ans.id === updatedItem.id ? updatedItem : ans))
            );
            setIsEditModalVisible(false);
          }}
        />
      )}
      {isCreateModalVisible && (
        <FaqModal
          onClose={() => setIsCreateModalVisible(false)}
          onSave={(newItem) => {
            setAnswers((prev) => [newItem, ...prev]);
            setAllAnswers((prev) => [newItem, ...prev]);
            setIsCreateModalVisible(false);
          }}
        />
      )}
    </>
  );
}