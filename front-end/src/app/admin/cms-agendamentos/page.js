"use client";
import { Table } from "antd";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import { createStyles } from "antd-style";

const mockedAgendamentos = [
  {
    id: 1,
    imovel: "Apartamento no Centro",
    nome: "João Silva",
    email: "joao.silva@example.com",
    telefone: "1234-5678",
    cidade_estado: "São Paulo/SP",
    comentario: "Gostaria de agendar uma visita."
  },
  {
    id: 2,
    imovel: "Casa na Praia",
    nome: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    telefone: "9876-5432",
    cidade_estado: "Rio de Janeiro/RJ",
    comentario: "Tenho interesse em saber mais sobre este imóvel."
  },
  {
    id: 3,
    imovel: "Chácara em Atibaia",
    nome: "Carlos Pereira",
    email: "carlos.pereira@example.com",
    telefone: "4567-8901",
    cidade_estado: "São Paulo/SP",
    comentario: "Gostaria de agendar uma visita."
  }
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
  const [agendamentos, setAgendamentos] = useState([]);
  const [allAgendamentos, setAllAgendamentos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterData, setFilterData] = useState({ order: null });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { styles } = useStyle();

  const [deleteId, setDeleteId] = useState(null);
  const onDelete = (id) => {
    setDeleteId(id);
    setIsConfirmModalVisible(true);
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
      title: "Imóvel",
      dataIndex: "imovel",
      key: "imovel",
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
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
    },
    {
      title: "Cidade/Estado",
      dataIndex: "cidade_estado",
      key: "cidade_estado",
    },
    {
      title: "Comentário",
      dataIndex: "comentario",
      key: "comentario",
    },
    {
      title: "Ações",
      dataIndex: "acoes",
      key: "acoes",
      render: (_, record) => (
        <div className="flex gap-4">
          <button onClick={() => onDelete(record.id)}>
            <IoMdTrash
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </button>
        </div>
      ),
      fixed: "right",
    },
  ];

  useEffect(() => {
    // async function fetchAgendamentos() {
    //   try {
    //     setLoading(true);
    //     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    //     const res = await axios.get(`${apiUrl}/user/faq`);
    //     setAgendamentos(Array.isArray(res.data) ? res.data : []);
    //     setAllAgendamentos(Array.isArray(res.data) ? res.data : []);
    //     setLoading(false);
    //   } catch (err) {
    //     console.error("Erro ao buscar respostas:", err);
    //     setAgendamentos([]);
    //     setAllAgendamentos([]);
    //     setLoading(false);
    //   }
    // }
    // fetchAgendamentos();
    setAgendamentos(mockedAgendamentos);
  }, []);

  let orderedAgendamentos = [...agendamentos];
  if (filterData.order === "Ordem alfabetica") {
    orderedAgendamentos.sort((a, b) => {
      if (!a.pergunta) return 1;
      if (!b.pergunta) return -1;
      return a.pergunta.localeCompare(b.pergunta);
    });
  } else if (filterData.order === "Data de inclusão") {
    orderedAgendamentos.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.data_inclusao || 0);
      const bDate = new Date(b.createdAt || b.data_inclusao || 0);
      return bDate - aDate;
    });
  }
  // fatia os usuários conforme página
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAgendamentos = orderedAgendamentos.slice(startIndex, endIndex);

  const onSearch = (value) => {
    if (!value) {
      setAgendamentos(allAgendamentos);
      setCurrentPage(1);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = allAgendamentos.filter(
      (u) =>
        (u.pergunta && u.pergunta.toLowerCase().includes(lower)) ||
        (u.resposta && u.resposta.toLowerCase().includes(lower))
    );
    setAgendamentos(filtered);
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
        <CMS.Body title={"Agendamentos"}>
          <CMS.Table>
            <CMS.TableHeader
              onSearch={onSearch}
              filterData={filterData}
              updateFilterData={updateFilterData}
              newButton={false}
            />
            <CMS.TableBody table={true}>
              <Table
                columns={columns}
                dataSource={paginatedAgendamentos}
                rowKey="id"
                pagination={false}
                className={styles.customTable}
                scroll={{ x: "max-content" }}
              />
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={agendamentos}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}