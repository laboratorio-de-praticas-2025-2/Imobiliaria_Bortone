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

  // Função para buscar FAQs da API
  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const fullUrl = `${apiUrl}/faq`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      const data = Array.isArray(jsonData) ? jsonData : [];
      
      setAnswers(data);
      setAllAnswers(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar FAQs:", err);
      setAnswers([]);
      setAllAnswers([]);
      setLoading(false);
    }
  };

  const [deleteId, setDeleteId] = useState(null);
  const onDelete = (id) => {
    setDeleteId(id);
    setIsConfirmModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalVisible(true);
  };

  const onConfirmDelete = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const response = await fetch(`${apiUrl}/faq/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Recarregar dados da API após sucesso
      await fetchAnswers();
      setCurrentPage(1);
      setIsConfirmModalVisible(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Erro ao deletar a pergunta:", err);
      setIsConfirmModalVisible(false);
      setDeleteId(null);
    }
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
    fetchAnswers();
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

  // Paginação manual dos dados
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
              totalItems={orderedAnswers.length}
              pageSize={pageSize}
              currentPage={currentPage}
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
          onSave={async (updatedItem) => {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
              const response = await fetch(`${apiUrl}/faq/${updatedItem.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pergunta: updatedItem.pergunta,
                  resposta: updatedItem.resposta,
                  ultima_atualizacao: updatedItem.ultima_atualizacao,
                }),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              // Recarregar dados da API após sucesso
              await fetchAnswers();
              setIsEditModalVisible(false);
            } catch (err) {
              console.error("Erro ao editar FAQ:", err);
            }
          }}
        />
      )}
      {isCreateModalVisible && (
        <FaqModal
          onClose={() => setIsCreateModalVisible(false)}
          onSave={async (newItem) => {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
              const usuarioId = JSON.parse(localStorage.getItem("userInfo"))?.id;
              const response = await fetch(`${apiUrl}/faq`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  usuario_id: usuarioId,
                  ...newItem,
                }),
              });

              if (!response.ok) {
                throw new Error(`Erro ao criar FAQ: ${response.status}`);
              }

              // Recarregar dados da API após sucesso
              await fetchAnswers();
              setCurrentPage(1);
              setIsCreateModalVisible(false);
            } catch (err) {
              console.error("Erro ao criar FAQ: ", err);
            }
          }}
        />
      )}
    </>
  );
}