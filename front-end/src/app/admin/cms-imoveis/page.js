"use client";
import { Table } from "antd";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { mockImoveis } from "@/mock/imoveis";
import { useEffect, useState } from "react";
import { LuHousePlus } from "react-icons/lu";
import { BiPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
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

export default function CmsUserPage() {
  const [imoveis, setImoveis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterData, setFilterData] = useState({ order: null });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const { styles } = useStyle();

  const onDelete = () => {
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = () => {
    console.log("Delete Confirmed");
    setIsConfirmModalVisible(false);
  };

  // toggle ativo / pausado
  const handleToggleActive = (id) => {
    setImoveis((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ativo: !item.ativo } : item
      )
    );
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Endereço",
      dataIndex: "endereco",
      key: "endereco",
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "cidade",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Preço",
      dataIndex: "preco",
      key: "preco",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Área",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Data",
      dataIndex: "data_cadastro",
      key: "data",
    },
    {
      title: "Murado",
      dataIndex: "possui_muro",
      key: "murado",
      render: (value) => (value ? "Sim" : "-"),
    },
    {
      title: "Jardim",
      dataIndex: "possui_jardim",
      key: "jardim",
      render: (value) => (value ? "Sim" : "-"),
    },
    {
      title: "Quartos",
      dataIndex: "quartos",
      key: "quartos",
    },
    {
      title: "Banheiros",
      dataIndex: "banheiros",
      key: "banheiros",
    },
    {
      title: "Vagas",
      dataIndex: "vagas",
      key: "vagas",
    },
    {
      title: "Piscina",
      dataIndex: "possui_piscina",
      key: "piscina",
      render: (value) => (value ? "Sim" : "-"),
    },
    // Coluna de Pause / Start
    {
      title: "Ações",
      key: "acoes",
      fixed: "right",
      width: 140, // ajuste conforme precisar
      render: (_, record) => (
        <div className="flex gap-4">
          {/* pause/play */}
          <button
            onClick={() => handleToggleActive(record.id)}
            aria-label={record.ativo ? "Pausar" : "Iniciar"}
            className="flex items-center"
          >
            {record.ativo ? (
              <IoMdPause
                size={22}
                className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
              />
            ) : (
              <FaPlay
                size={22}
                className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
              />
            )}
          </button>

          {/* editar */}
          <Link href={`/admin/cms-imoveis/editar/${record.id}`}>
            <BiPencil
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </Link>

          {/* excluir */}
          <button onClick={onDelete}>
            <IoMdTrash
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setImoveis(mockImoveis);
  }, []);

  // fatia os imoveis conforme página, mantém o boolean 'ativo' e adiciona textos de exibição
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMock = imoveis.slice(startIndex, endIndex).map((item) => ({
    ...item,
    ativoText: item.ativo ? "Sim" : "-",
    verificadoText: item.verificado ? "Sim" : "-",
  }));

  const onSearch = (value) => console.log("Search:", value);
  const handleSelectOrder = (value) => {
    setFilterData((prev) => ({ ...prev, order: value }));
    console.log("Selected order:", value);
  };
  const updateFilterData = (newData) => {
    setFilterData((prev) => ({ ...prev, ...newData }));
    console.log("Update filter data:", newData);
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
        <CMS.Body title={"Imóveis"}>
          <CMS.Table>
            <CMS.TableHeader
              buttonText="Novo Imóvel"
              buttonIcon={<LuHousePlus />}
              onSearch={onSearch}
              href={"/admin/cms-imoveis/criar"}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
              type={"imovel"}
            />
            <CMS.TableBody table={true}>
              <Table
                columns={columns}
                dataSource={paginatedMock}
                rowKey="id"
                pagination={false}
                className={styles.customTable}
                scroll={{ x: "max-content" }}
                // aplica transparência na linha quando ativo === false
                rowClassName={(record) => (record.ativo ? "" : "opacity-50")}
              />
            </CMS.TableBody>

            {/* Paginador controlado */}
            <CMS.TableFooter
              postsData={imoveis}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
