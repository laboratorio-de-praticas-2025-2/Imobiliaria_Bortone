import Image from "next/image";
import Card from "@/components/relatorio/Card.js";
import { FaUserPlus, FaUserPen, FaUser, FaHouseChimney } from "react-icons/fa6";
import "../../styles/relatorio.css";
import { FaCheckSquare } from "react-icons/fa";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdOutlineBedroomParent, MdTerrain } from "react-icons/md";
import { PiCoinsFill } from "react-icons/pi";
import LineGraph from "./LineGraph";
import PizzaGraph from "./PizzaGraph";
import logo from "@/../public/images/LogoAzul.svg";
import TableRelatorio from "@/components/relatorio/TableRelatorio.js";
import React from "react";

export default function Relatorio({ data, secoes = [] }) {
  let pageNumber = 1;
  
  // Debug: verificar dados recebidos
  console.log("Dados recebidos no Relatorio:", data);

  // Se não vier array de seções ou vier vazio, renderiza todas as seções
  const todasSecoes = [
    "SUMARIO_EXECUTIVO",
    "JORNADA_CLIENTE",
    "ESTOQUE_IMOBILIARIO",
    "DESEMPENHO_VENDAS",
    "DESEMPENHO_LOCACOES",
  ];

  const secoesParaRenderizar =
    secoes && secoes.length > 0 ? secoes : todasSecoes;

  //MOCKAR TUDO
  if (!data.desempenhoVendas) {
    data.desempenhoVendas = {};
  }
  if (!data.desempenhoLocacoes) {
    data.desempenhoLocacoes = {};
  }
  if (!data.estoqueImobiliario) {
    data.estoqueImobiliario = {};
  }
  if (!data.jornadaCliente) {
    data.jornadaCliente = {};
  }

  // Mock do campo distribuicaoTipo de desemepenhoVendas
  data.desempenhoVendas.distribuicaoTipo = [
    { tipo: "Apartamento", quantidade: 1, porcentagem: 20 },
    { tipo: "Casa", quantidade: 0, porcentagem: 0 },
    { tipo: "Terreno", quantidade: 4, porcentagem: 80 },
  ];

  // Mock do campo distribuicaoTipo de desempenhoLocacoes
  data.desempenhoLocacoes.distribuicaoTipo = [
    { tipo: "Apartamento", quantidade: 10, porcentagem: 10 },
    { tipo: "Casa", quantidade: 70, porcentagem: 80 },
    { tipo: "Terreno", quantidade: 20, porcentagem: 20 },
  ];

  data.desempenhoVendas.tabelaVendas = [
    {
      id: 1,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 2,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 3,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 4,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 5,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 6,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 7,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 8,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 9,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 10,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 11,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 12,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 13,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 14,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 15,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 16,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 17,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 18,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 19,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 20,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 21,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 22,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 23,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 24,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 25,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 26,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 27,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 28,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 29,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 30,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 31,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 32,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 33,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 34,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 35,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 36,
      data_update_status: "2025-09-01T01:00:00.000Z",
      endereco: "Rua T, 567",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
    {
      id: 37,
      data_update_status: "2025-08-17T01:00:00.000Z",
      endereco: "Rua V, 890",
      tipo: "Terreno",
      preco: "135000.00",
      visibilidade_preco: "Visível",
      area: 400,
    },
    {
      id: 38,
      data_update_status: "2025-08-14T01:00:00.000Z",
      endereco: "Rua Paraguai, 012",
      tipo: "Apartamento",
      preco: "245000.00",
      visibilidade_preco: "Visível",
      area: 68,
    },
    {
      id: 39,
      data_update_status: "2025-07-27T01:00:00.000Z",
      endereco: "Rua R, 345",
      tipo: "Terreno",
      preco: "95000.00",
      visibilidade_preco: "Visível",
      area: 200,
    },
    {
      id: 40,
      data_update_status: "2025-07-22T01:00:00.000Z",
      endereco: "Rua J, 678",
      tipo: "Terreno",
      preco: "125000.00",
      visibilidade_preco: "Visível",
      area: 350,
    },
  ];

  data.desempenhoVendas.evolucaoMensal = [
    {
      mes: "2025-07",
      Apartamento: 0,
      Casa: 0,
      Terreno: 2,
    },
    {
      mes: "2025-08",
      Apartamento: 1,
      Casa: 0,
      Terreno: 1,
    },
    {
      mes: "2025-09",
      Apartamento: 0,
      Casa: 0,
      Terreno: 1,
    },
    {
      mes: "2025-10",
      Apartamento: 0,
      Casa: 0,
      Terreno: 0,
    },
    {
      mes: "2025-11",
      Apartamento: 0,
      Casa: 0,
      Terreno: 0,
    },
  ];

  data.desempenhoLocacoes.evolucaoMensal = [
    {
      mes: "2025-07",
      Apartamento: 0,
      Casa: 0,
      Terreno: 2,
    },
    {
      mes: "2025-08",
      Apartamento: 1,
      Casa: 0,
      Terreno: 1,
    },
    {
      mes: "2025-09",
      Apartamento: 0,
      Casa: 0,
      Terreno: 1,
    },
    {
      mes: "2025-10",
      Apartamento: 0,
      Casa: 0,
      Terreno: 0,
    },
    {
      mes: "2025-11",
      Apartamento: 0,
      Casa: 0,
      Terreno: 0,
    },
  ];

  data.jornadaCliente.evolucaoMensal = [
    {
      mes: "2025-08",
      quantidadeAgendamentos: 20,
      quantidadeNovosUsuarios: 10,
    },
    {
      mes: "2025-09",
      quantidadeAgendamentos: 5,
      quantidadeNovosUsuarios: 10,
    },
    {
      mes: "2025-10",
      quantidadeAgendamentos: 12,
      quantidadeNovosUsuarios: 14,
    },
  ];

  data.estoqueImobiliario.resumo = {
    totalImoveis: 5,
    totalDisponivel: 3,
    totalLocado: 1,
    totalVendido: 1,
    distribuicaoImoveisPreco: [
      {
        faixa: "-300k",
        quantidade: 51,
        porcentagem: 60,
      },
      {
        faixa: "300-600",
        quantidade: 32,
        porcentagem: 37.65,
      },
      {
        faixa: "+600",
        quantidade: 2,
        porcentagem: 2.35,
      },
    ],
    distribuicaoImoveisTipo: [
      { tipo_imovel: "Apartamento", quantidade: 12 },
      { tipo_imovel: "Casa", quantidade: 14 },
      { tipo_imovel: "Terreno", quantidade: 10 },
    ],
    totalPrecoVisivel: 4,
    totalPrecoOculto: 1,
  };

  data.estoqueImobiliario.imoveisMaisAcessados = [
    //Todos os imóveis ordenados pela quantidade de acesso DESC
    {
      id_imovel: "xx",
      quantidade_acesso: "xx",
      endereco: "xx",
      tipo: "xx",
      preco: "xx",
      visibilidade: "xx",
      tamanho: "xx",
    },
    {
      id_imovel: "xx",
      quantidade_acesso: "xx",
      endereco: "xx",
      tipo: "xx",
      preco: "xx",
      visibilidade: "xx",
      tamanho: "xx",
    },
  ];

  const desempenhoVendasDistribuicaoTipo = data?.desempenhoVendas
    ?.distribuicaoTipo
    ? {
        labels: data.desempenhoVendas.distribuicaoTipo.map((item) => item.tipo),
        datasets: [
          {
            data: data.desempenhoVendas.distribuicaoTipo.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const desempenhoLocacoesDistribuicaoTipo = data?.desempenhoLocacoes
    ?.distribuicaoTipo
    ? {
        labels: data.desempenhoLocacoes.distribuicaoTipo.map(
          (item) => item.tipo
        ),
        datasets: [
          {
            data: data.desempenhoLocacoes.distribuicaoTipo.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const estoqueImobiliarioDistribuicaoFaixaPreco = data?.estoqueImobiliario
    ?.resumo?.distribuicaoImoveisPreco
    ? {
        labels: data.estoqueImobiliario.resumo.distribuicaoImoveisPreco.map(
          (item) => item.faixa
        ),
        datasets: [
          {
            data: data.estoqueImobiliario.resumo.distribuicaoImoveisPreco.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#118C4F", "#F1EB9C", "#FF7276"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const estoqueImobiliarioDistribuicaoTipo = data?.estoqueImobiliario?.resumo
    ?.distribuicaoImoveisTipo
    ? {
        labels: data.estoqueImobiliario.resumo.distribuicaoImoveisTipo.map(
          (item) => item.tipo_imovel
        ),
        datasets: [
          {
            data: data.estoqueImobiliario.resumo.distribuicaoImoveisTipo.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Inclui os dados como atributo para captura no PDF
  const dataAttribute = JSON.stringify(data);

  const currDate = new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dataLocacaoPorTipo = data?.alugueis?.locacoesPorTipo
    ? {
        labels: Object.keys(data.alugueis.locacoesPorTipo),
        datasets: [
          {
            data: Object.values(data.alugueis.locacoesPorTipo),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      } : { labels: [], datasets: [] };

      const dataVendasPorTipo = data?.vendas?.vendasPorTipo
    ? {
        labels: Object.keys(data.vendas.vendasPorTipo),
        datasets: [
          {
            data: Object.values(data.vendas.vendasPorTipo),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      } : { labels: [], datasets: [] };

  const distribuicaoImoveisPorPreco =   data?.imoveis?.porFaixaDePreco
  ? {
    labels: [
      "até R$300.000",
      "entre R$300.000 e R$600.000",
      "maior que R$600.000",
    ],
    datasets: [
      {
        data: Object.values(data.imoveis.porFaixaDePreco),
        backgroundColor: ["#118C4F", "#F1EB9C", "#FF7276"],
        borderWidth: 1,
        cutout: "0%",
      },
    ],
  } : { labels: [], datasets: [] };

  // Safety check to ensure data exists
  if (!data) {
    return <div>Carregando dados do relatório...</div>;
  }

  // Definição das seções disponíveis com subtítulos
  const SECTIONS = {
    SUMARIO_EXECUTIVO: {
      title: "Sumário Executivo",
      subtitles: [],
      render: () => (
        <div
          className="page flex flex-col justify-between"
          id="sumario-executivo"
        >
          <div>
            <header className="flex items-center gap-4 mb-4">
              <Image src={logo.src} alt="Logo Bortone" width={180} height={50} />
            </header>
            <h2 className="main-title text-center mb-6">Sumário Executivo</h2>
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">KPIs de Vendas:</h3>
              <ul className="list-disc ml-8 mb-4">
                <li>
                  <span className="font-semibold">
                    Valor Geral de Vendas (VGV):
                  </span>{" "}
                  <span className="text-sm">
                    [Soma do valor de todos os imóveis vendidos no período]
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Total de Vendas:</span>{" "}
                  <span className="text-sm">
                    [Contagem de imóveis vendidos]
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Ticket Médio por Venda:</span>{" "}
                  <span className="text-sm">[VGV / Total de Vendas]</span>
                </li>
              </ul>
              <hr className="my-4 border-gray-400" />
              <h3 className="font-bold text-lg mb-2">
                KPIs de Leads e Engajamento:
              </h3>
              <ul className="list-disc ml-8">
                <li>
                  <span className="font-semibold">
                    Novos Agendamentos Criados:
                  </span>{" "}
                  <span className="text-sm">
                    [Contagem de agendamentos.id WHERE data_criacao no período]
                  </span>
                </li>
                <li>
                  <span className="font-semibold">
                    Novos Usuários Cadastrados que realizaram agendamentos:
                  </span>{" "}
                  <span className="text-sm">
                    [Contagem de usuario.id WHERE data_cadastro no período e tem
                    agendamento marcado]
                  </span>
                </li>
                <li>
                  <span className="font-semibold">xxxxxxxxxxxxxx</span>
                </li>
              </ul>
            </div>
          </div>
          {/* <footer className="flex justify-between items-center text-xs mt-8 px-2 pb-2">
            <span>
              Período Analisado:{" "}
              {data?.periodoInicio && data?.periodoFim
                ? `${data.periodoInicio} - ${data.periodoFim}`
                : "01/01/2025 - 04/09/2025"}
            </span>
            <span className="font-bold">3</span>
          </footer> */}
        </div>
      ),
    },
    JORNADA_CLIENTE: {
      title: "Jornada do Cliente",
      subtitles: [
        "Resumo dos Dados",
        "Relação - Novos Usuários e Agendamentos",
        "Tabela Detalhada de Agendamentos",
      ],
      render: () => (
        <div className="page" id="jornada-cliente">
          <header>
            <Image src={logo.src} alt="Logo Bortone" width={180} height={50} />
          </header>
          <div className="text-center">
            <h2 className="main-title">Jornada do Cliente:</h2>
          </div>
          <div>
            <h3 className="title">Resumo dos Dados:</h3>
            <p className="label-item">
              Usuários Cadastrados no Período:{" "}
              <span>
                {data?.jornadaCliente?.resumo?.novosUsuarios || "..."}
              </span>
            </p>
            <p className="label-item">
              Agendamentos Criados por novos Usuários:{" "}
              <span>
                {data?.jornadaCliente?.resumo?.agendamentosNovosUsuarios ||
                  "..."}
              </span>
            </p>
            <p className="label-item">
              Agendamentos Criados por Usuários Antigos{" "}
              <span>
                {data?.jornadaCliente?.resumo?.agendamentosAntigosUsuarios ||
                  "..."}
              </span>
            </p>
            <p className="label-item">
              Taxa de Conversao de Agendamentos por Novos Usuários:{" "}
              <span>
                {data?.jornadaCliente?.resumo?.taxaConversao || "..."}
              </span>
            </p>
          </div>
          <div>
            <h3 className="title">Relação - Novos Usuários e Agendamentos:</h3>
            {data.jornadaCliente?.evolucaoMensal ? (
              <LineGraph
                label=""
                graphData={data.jornadaCliente.evolucaoMensal}
              />
            ) : (
              <p>Sem registro de Dados de Evolução Mensal.</p>
            )}
          </div>
        </div>
      ),
    },
    ESTOQUE_IMOBILIARIO: {
      title: "Análise de Estoque Imobiliário",
      subtitles: [
        "Resumo do Estoque",
        "Imóveis Mais Acessados no Site",
        "Registro Detalhado do Portfólio",
        "Insights e Ações",
      ],
      render: () => (
        <>
          <div className="page" id="estoque-imobiliario">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div className="text-center">
              <h2 className="main-title">Análise de Estoque Imobiliário</h2>
              <span>
                Essa seção abrange análises além do intervalo de período
                selecionado!
              </span>
            </div>
            <div>
              <h3 className="title"> Resumo do Estoque:</h3>
              <p className="label-item">
                Total de Imóveis Disponíveis:{" "}
                <span>
                  {data?.estoqueImobiliario?.resumo?.totalDisponivel ||
                    "Não foi possível resgatar os dados!"}
                </span>
              </p>
              <p className="label-item">
                Distribuição de imóveis por faixa de preço:{" "}
              </p>
              <PizzaGraph
                label={""}
                className={"w-[450px] h-[300px] !ms-12"}
                data={estoqueImobiliarioDistribuicaoFaixaPreco}
              />
              <p className="label-item">Distribuição de imóveis por tipo: </p>
              <PizzaGraph
                label={""}
                className={"w-[450px] h-[300px] !ms-12"}
                data={estoqueImobiliarioDistribuicaoTipo}
              />
              <p className="label-item">
                Imóveis com Preço Visível:{" "}
                <span>
                  {data?.estoqueImobiliario?.resumo?.totalPrecoVisivel ||
                    "Não foi possível resgatar os dados!"}
                </span>
              </p>
              <p className="label-item">
                Imóveis com Preço Oculto:{" "}
                <span>
                  {data?.estoqueImobiliario?.resumo?.totalPrecoOculto ||
                    "Não foi possível resgatar os dados!"}
                </span>
              </p>
            </div>
          </div>
          <div className="page" id="estoque-imobiliario-tabela">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h3 className="title">Tabela Detalhada de Vendas:</h3>
            </div>
            <TableRelatorio
              className="min-w-full border-separate border-spacing-0"
              title=""
              data={data?.estoqueImobiliario?.imoveisMaisAcessados}
              headers={[
                { key: "id_imovel", label: "ID", align: "center" },
                { key: "quantidade_acessos", label: "Quantidade Acessos" },
                { key: "endereco", label: "Endereço" },
                { key: "tipo", label: "Tipo" },
                {
                  key: "preco",
                  label: "Preço",
                  align: "center",
                  render: (value) =>
                    value?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }),
                },
                { key: "visibilidade", label: "Visibilidade Preço" },
                {
                  key: "area",
                  label: "Área",
                  align: "center",
                  render: (value) => (value ? `${value} m²` : "-"),
                },
              ]}
            />
          </div>
        </>
      ),
    },
    DESEMPENHO_VENDAS: {
      title: "Desempenho de Vendas",
      subtitles: [
        "Resumo de Vendas",
        "Gráfico de Evolução Mensal das Vendas",
        "Tabela Detalhada de Vendas",
      ],
      render: () => (
        <>
          <div className="page" id="desempenho-vendas">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h2 className="main-title">Desempenho de Vendas</h2>
              <h3 className="title"> Resumo de Vendas:</h3>
              <div>
                <p className="label-item">
                  Total em Vendas:{" "}
                  <span>R$ {data?.desempenhoVendas?.total || "XX"}</span>
                </p>
                <p className="label-item">Distribuição das Vendas por Tipo:</p>
                {desempenhoVendasDistribuicaoTipo ? (
                  <PizzaGraph
                    label={""}
                    className={"w-[450px] h-[300px] !ms-12"}
                    data={desempenhoVendasDistribuicaoTipo}
                  />
                ) : (
                  <p className="!ms-4">Não Houveram Vendas No período</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="title">Evolucao Mensal das Vendas:</h3>
              {data.desempenhoVendas?.evolucaoMensal ? (
                <LineGraph
                  label=""
                  graphData={data.desempenhoVendas.evolucaoMensal}
                />
              ) : (
                <p>Sem registro de Dados de Evolução Mensal das Vendas.</p>
              )}
            </div>
          </div>
          <div className="page" id="desempenho-venda-tabela">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h3 className="title">Tabela Detalhada de Vendas:</h3>
            </div>
            <TableRelatorio
              className="min-w-full border-separate border-spacing-0"
              title=""
              data={data?.desempenhoVendas?.tabelaVendas}
              headers={[
                { key: "id", label: "ID", align: "center" },
                { key: "tipo", label: "Tipo do Imóvel" },
                { key: "endereco", label: "Endereco" },
                {
                  key: "preco",
                  label: "Preço",
                  align: "right",
                  render: (value) =>
                    value?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }),
                },
                { key: "visibilidade_preco", label: "Visibilidade do Preço" },
                {
                  key: "area",
                  label: "Área",
                  align: "right",
                  render: (value) => (value ? `${value} m²` : "-"),
                },
              ]}
            />
          </div>
        </>
      ),
    },
    DESEMPENHO_LOCACOES: {
      title: "Desempenho de Locações",
      subtitles: [
        "Resumo de Locações",
        "Gráfico de Evolução Mensal das Locações",
        "Tabela Detalhada de Locações",
      ],
      render: () => (
        <>
          <div className="page" id="desempenho-locacoes">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h2 className="main-title">Desempenho de Locações</h2>
              <h3 className="title"> Resumo de Locações:</h3>
              <div>
                <p className="label-item">
                  Total em Locações:{" "}
                  <span>R$ {data?.desempenhoLocacoes?.total || "XX"}</span>
                </p>
                <p className="label-item">
                  Distribuição das Locações por Tipo:
                </p>
                {desempenhoLocacoesDistribuicaoTipo.length > 0 ? (
                  <PizzaGraph
                    label={""}
                    className={"w-[450px] h-[300px] !ms-12"}
                    data={desempenhoLocacoesDistribuicaoTipo}
                  />
                ) : (
                  <p>Não Houveram Locações No período</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="title">Evolucao Mensal das Locações:</h3>
              {data.desempenhoLocacoes?.evolucaoMensal ? (
                <LineGraph
                  label=""
                  graphData={data.desempenhoLocacoes.evolucaoMensal}
                />
              ) : (
                <p>Sem registro de Dados de Evolução Mensal das Locações.</p>
              )}
            </div>
          </div>
          <div className="page">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h3 className="title">Tabela Detalhada de Locações:</h3>
            </div>
            <TableRelatorio
              className="min-w-full border-separate border-spacing-0"
              title=""
              data={data?.desempenhoLocacoes?.tabelaLocacoes}
              headers={[
                { key: "id", label: "ID", align: "center" },
                { key: "tipo", label: "Tipo do Imóvel" },
                { key: "endereco", label: "Endereco" },
                {
                  key: "preco",
                  label: "Preço",
                  align: "right",
                  render: (value) =>
                    value?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }),
                },
                { key: "visibilidade_preco", label: "Visibilidade do Preço" },
                {
                  key: "area",
                  label: "Área",
                  align: "right",
                  render: (value) => (value ? `${value} m²` : "-"),
                },
              ]}
            />
          </div>
        </>
      ),
    },
  };

  // Gera o sumário dinâmico
  const generateSumario = () => {
    let sumarioItems = [];
    let sectionCounter = 1;

    secoesParaRenderizar.forEach((secaoKey) => {
      const secao = SECTIONS[secaoKey];
      if (!secao) return;

      // Adiciona título principal da seção
      sumarioItems.push(
        <div
          key={`section-${secaoKey}`}
          className="flex justify-between border-b border-transparent mb-1 mt-2"
        >
          <span className="font-semibold">
            {sectionCounter}. {secao.title}
          </span>
        </div>
      );

      // Adiciona subtítulos se existirem
      if (secao.subtitles && secao.subtitles.length > 0) {
        secao.subtitles.forEach((subtitle, subtitleIndex) => {
          sumarioItems.push(
            <div
              key={`${secaoKey}-${subtitleIndex}`}
              className="pl-4 flex justify-between border-b border-transparent mb-1"
            >
              <span>
                {sectionCounter}.{subtitleIndex + 1}. {subtitle}
              </span>
            </div>
          );
        });
      }

      sectionCounter++;
    });

    return sumarioItems;
  };

  return (
    <div data-report-data={dataAttribute}>
      {/* Página Imóveis */}
      {data?.imoveis && (
        <div className="page">
          <header>
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={180}
              height={50}
            />
            <div className="header-meta">Emitido em: {currDate}</div>
          </header>
          <div>
            <h1 className="main-title">Relatório - Imobiliária Bortone</h1>
            <h2 className="title">Imóveis</h2>
          </div>

          <div className="card-container">
            <div className="grid grid-cols-2 content-between gap-6 h-full">
              <Card
                name={"imoveis_disponiveis"}
                label={"Total de imóveis disponíveis"}
                value={data.imoveis?.totalImoveis || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <FaCheckSquare className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
              <Card
                name={"apartamentos_disponiveis"}
                label={"Apartamentos disponíveis"}
                value={data.imoveis?.totalApartamentos || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <BsFillBuildingFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
            </div>
            <div className="grid grid-cols-2 content-between gap-6 h-full">
              <Card
                name={"casas_disponiveis"}
                label={"Casas disponíveis"}
                value={data.imoveis?.totalCasas || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <FaHouseChimney className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
              <Card
                name={"terrenos_disponiveis"}
                label={"Terrenos disponíveis"}
                value={data.imoveis?.totalTerrenos || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <MdTerrain className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
            </div>
          </div>
        </div>
        <div className="header-meta">Data de Emissão: {currDate}</div>
      </div>

      {/* SUMÁRIO */}
      <div className="page flex flex-col items-center pt-10">
        <header className="w-full flex justify-start items-center mb-8">
          <Image
            src={logo.src}
            alt="Logo Bortone"
            width={180}
            height={50}
            className="mb-2"
          />
        </header>
        <h2 className="main-title text-left w-full mb-8">Sumário:</h2>
        <div className="w-full max-w-2xl mx-auto text-[1.1rem]">
          {generateSumario()}
        </div>
      </div>
      {/* PÁGINAS */}
      {/* Renderiza as seções selecionadas */}

      {/* Renderiza as seções selecionadas COM KEY */}
      {secoesParaRenderizar.map((secaoKey) => (
        <React.Fragment key={secaoKey}>
          {SECTIONS[secaoKey]?.render()}
        </React.Fragment>
      ))}
    </div>
  );
}
