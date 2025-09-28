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
import axios from "axios";

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
  const [filterData, setFilterData] = useState({
    order: null,
    searchTerm: null,
    advancedSearch: false, 
    tipoNegocio: null,
    tipo: null,
    preco: null,
    area: null,
    quartos: null,
    banheiros: null,
    vagas: null,
  });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [imovelToDelete, setImovelToDelete] = useState(null);
  const { styles } = useStyle();

  const onDelete = (imovelId) => {
    setImovelToDelete(imovelId);
    setIsConfirmModalVisible(true);
  };

  const onConfirmDelete = async () => {
    if (!imovelToDelete) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/imoveis/${imovelToDelete}`);
      
      setImoveis(prev => prev.filter(imovel => imovel.id !== imovelToDelete));
      
      console.log("Imóvel deletado com sucesso!");
      setIsConfirmModalVisible(false);
      setImovelToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
      
    }
  };

  
  const handleToggleActive = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const imovel = imoveis.find(item => item.id === id);
      
      if (!imovel) return;
      
      const newStatus = imovel.status === "indisponivel" ? "disponivel" : "indisponivel";
      
      await axios.patch(`${apiUrl}/imoveis/${id}/status`, { status: newStatus });
      
      setImoveis((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      
      console.log(`Status do imóvel ${id} alterado para: ${newStatus}`);
    } catch (error) {
      console.error("Erro ao alterar status do imóvel:", error);
    }
  };

  const fetchImoveis = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filterData.order) {
        queryParams.append("order", filterData.order);
      }
      if (filterData.searchTerm) {
        queryParams.append("searchTerm", filterData.searchTerm);
      }
      if (filterData.advancedSearch) {
        if (filterData.tipoNegocio.toLowerCase() == "comprar") queryParams.append("tipo_negociacao", "venda");
        else if (filterData.tipoNegocio.toLowerCase() == "alugar") queryParams.append("tipo_negociacao", "aluguel")
        if (filterData.tipo) queryParams.append("tipo", filterData.tipo);
        if (filterData.preco) {
          queryParams.append("minPreco", filterData.preco[0]);
          queryParams.append("maxPreco", filterData.preco[1]);
        }
        if (filterData.area) {
          queryParams.append("minArea", filterData.area[0]);
          queryParams.append("maxArea", filterData.area[1]);
        }
        if (filterData.quartos) queryParams.append("quartos", filterData.quartos);
        if (filterData.banheiros) queryParams.append("banheiros", filterData.banheiros);
        if (filterData.vagas) queryParams.append("vagas", filterData.vagas);
      }

      const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/imoveis?${queryParams.toString()}`;
      console.log("Fetching data from endpoint:", requestUrl)
      const response = await axios.get(
        requestUrl
      );
      console.log("API Response Data:", response.data);
      if (Array.isArray(response.data)) {
        setImoveis(response.data);
      } else {
        console.warn("API did not return an array for imoveis, received:", response.data);
        setImoveis([]); 
      }
    } catch (error) {
      console.error("Error fetching imoveis:", error);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, [filterData, currentPage]);

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
      dataIndex:"murado",
      key: "murado",
      render: (value) => (value ? "Sim" : "-"),
    },
    {
      title: "Jardim",
      dataIndex: ['casa',"possui_jardim"],
      key: "jardim",
      render: (value) => (value ? "Sim" : "-"),
    },
    {
      title: "Quartos",
      dataIndex: ['casa',"quartos"],
      key: "quartos",
    },
    {
      title: "Banheiros",
      dataIndex: ['casa',"banheiros"],
      key: "banheiros",
    },
    {
      title: "Vagas",
      dataIndex: ['casa',"vagas"],
      key: "vagas",
    },
    {
      title: "Piscina",
      dataIndex: ['casa',"possui_piscina"],
      key: "piscina",
      render: (value) => (value ? "Sim" : "-"),
    },
    
    {
      title: "Ações",
      key: "acoes",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex gap-4">
          {/* pause/play */}
          <button
            onClick={() => handleToggleActive(record.id)}
            aria-label={record.status === "indisponivel" ? "Ativar" : "Pausar"}
            className="flex items-center"
          >
            {record.status === "indisponivel" ? (
              <FaPlay
                size={22}
                className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
              />
            ) : (
              <IoMdPause
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
          <button onClick={() => onDelete(record.id)}>
            <IoMdTrash
              size={22}
              className="text-[#192243] hover:text-[var(--primary)] transition-colors cursor-pointer"
            />
          </button>
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMock = imoveis.slice(startIndex, endIndex).map((item) => ({
    ...item,
    verificadoText: item.verificado ? "Sim" : "-",
  }));

  const onSearch = (value) => {
    setFilterData((prev) => ({
      ...prev,
      searchTerm: value || null,
      advancedSearch: false,
    }));
  };
  const handleSelectOrder = (value) => {
    setFilterData((prev) => ({
      ...prev,
      order: value === "Ordenar por" ? null : value,
      advancedSearch: false, 
    }));
  };
  const updateFilterData = (newData) => {
    setFilterData((prev) => {
      const newState = { ...prev, ...newData };
      console.log("FilterData after update:", newState);
      return newState;
    });
  };

  const handleAdvancedSearch = (filters) => {
    setFilterData({
      ...filters,
      searchTerm: null, 
      order: null,
      advancedSearch: true, 
    });
  };

  return (
    <>
      {isConfirmModalVisible && (
        <ConfirmModal
          message={`Você tem certeza que deseja excluir o imóvel ID ${imovelToDelete} definitivamente?`}
          onConfirm={onConfirmDelete}
          onCancel={() => {
            setIsConfirmModalVisible(false);
            setImovelToDelete(null);
          }}
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
              onAdvancedSearch={handleAdvancedSearch}
            />
            <CMS.TableBody table={true}>
              <Table
                columns={columns}
                dataSource={paginatedMock}
                rowKey="id"
                pagination={false}
                className={styles.customTable}
                scroll={{ x: "max-content" }}
                 rowClassName={(record) => (record.status === "indisponivel" ? "opacity-50" : "")}
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
