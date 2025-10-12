"use client";
import { Table } from "antd";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import ConfirmModal from "@/components/cms/ConfirmModal";
import { createStyles } from "antd-style";
import { apiClient } from "@/utils/apiClient";

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
    try {
      setLoading(true);
      await apiClient.delete(`/agendamentos/${deleteId}`);
      setAgendamentos((prev) => prev.filter((a) => a.id !== deleteId));
      setAllAgendamentos((prev) => prev.filter((a) => a.id !== deleteId));
      setIsConfirmModalVisible(false);
      setDeleteId(null);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao deletar agendamento:", err);
      setIsConfirmModalVisible(false);
      setDeleteId(null);
      setLoading(false);
    }
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
      render: (imovel) => {
        if (!imovel) return "N/A";
        const parts = [];
        if (imovel.endereco) parts.push(imovel.endereco);
        if (imovel.cidade) parts.push(imovel.cidade);
        return parts.length > 0 ? parts.join(" - ") : "Sem endereço";
      },
    },
    {
      title: "Nome",
      dataIndex: ["usuario", "nome"],
      key: "nome",
    },
    {
      title: "Email",
      dataIndex: ["usuario", "email"],
      key: "email",
    },
    {
      title: "Telefone",
      dataIndex: ["usuario", "celular"],
      key: "telefone",
    },
    {
      title: "Data Marcada",
      dataIndex: "data_marcada",
      key: "data_marcada",
      render: (data) => data ? new Date(data).toLocaleString('pt-BR') : "N/A",
    },
    {
      title: "Mensagem",
      dataIndex: "mensagem",
      key: "mensagem",
      render: (texto) => texto || "N/A",
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
    async function fetchAgendamentos() {
      try {
        setLoading(true);
        
        // Debug da autenticação
        const authToken = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
        
        console.log('🔐 Debug Auth:', { 
          tokenExists: !!authToken, 
          tokenPrefix: authToken?.substring(0, 20) + '...',
          userInfo: parsedUserInfo,
          userLevel: parsedUserInfo?.nivel,
          isAdmin: parsedUserInfo?.nivel === 0
        });
        
        if (!authToken) {
          throw new Error('Token de autenticação não encontrado');
        }
        
        if (parsedUserInfo?.nivel !== 0) {
          throw new Error(`Usuário não é admin (nível ${parsedUserInfo?.nivel})`);
        }
        
        console.log('📡 Fazendo requisição para /agendamentos...');
        let response;
        
        try {
          // Tentar buscar todos os agendamentos (admin)
          response = await apiClient.get("/agendamentos");
          console.log('✅ Resposta de /agendamentos (admin):', response.data);
        } catch (adminError) {
          if (adminError.response?.status === 403) {
            console.log('⚠️ Acesso negado para /agendamentos, tentando /agendamentos/me...');
            // Se não for admin, buscar apenas os próprios agendamentos
            response = await apiClient.get("/agendamentos/me");
            console.log('✅ Resposta de /agendamentos/me:', response.data);
          } else {
            throw adminError;
          }
        }
        
        const agendamentosData = response.data.data || response.data || [];
        console.log('📊 Total de agendamentos:', agendamentosData.length);
        console.log('🔍 Primeiro agendamento:', agendamentosData[0]);
        console.log('👤 Dados do usuário do primeiro:', agendamentosData[0]?.usuario);
        console.log('🏠 Dados do imóvel do primeiro:', agendamentosData[0]?.imovel);
        if (agendamentosData[0]?.imovel) {
          console.log('🏠 Campos do imóvel:', {
            id: agendamentosData[0].imovel.id,
            endereco: agendamentosData[0].imovel.endereco,
            cidade: agendamentosData[0].imovel.cidade,
            tipo: agendamentosData[0].imovel.tipo,
            preco: agendamentosData[0].imovel.preco
          });
        }
        
        setAgendamentos(Array.isArray(agendamentosData) ? agendamentosData : []);
        setAllAgendamentos(Array.isArray(agendamentosData) ? agendamentosData : []);
        setLoading(false);
      } catch (err) {
        console.error("❌ Erro detalhado ao buscar agendamentos:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message
        });
        
        // Se erro 401, tentar usar dados mockados temporariamente
        if (err.response?.status === 401) {
          console.warn('⚠️ Erro 401 - usando dados mockados temporariamente');
          setAgendamentos(mockedAgendamentos);
          setAllAgendamentos(mockedAgendamentos);
        } else {
          setAgendamentos([]);
          setAllAgendamentos([]);
        }
        setLoading(false);
      }
    }
    fetchAgendamentos();
  }, []);  let orderedAgendamentos = [...agendamentos];
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