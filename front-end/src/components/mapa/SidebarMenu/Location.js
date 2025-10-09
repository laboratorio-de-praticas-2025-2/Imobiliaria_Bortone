"use client";
import { useFilters } from "@/context/FiltersContext";
import { Col, Row } from "antd";
import { useState, useEffect } from "react";
import LocationButton from "./LocationButton";

export default function Location() {
  const { filters, updateFilters } = useFilters();
  // Estado para armazenar as opções selecionadas
  const [selectedOptions, setSelectedOptions] = useState([]);
  // Estado para armazenar as cidades disponíveis
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sincronizar com o contexto de filtros quando ele mudar
  useEffect(() => {
    const currentLocalizacao = filters.terreno?.localizacao || [];
    console.log('Location: Sincronizando com contexto:', currentLocalizacao);
    setSelectedOptions(currentLocalizacao);
  }, [filters.terreno?.localizacao]);

  // Buscar cidades disponíveis da API
  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("NEXT_PUBLIC_API_URL não configurada");
          return;
        }

        const response = await fetch(`${apiUrl}/mapa/cidades`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCidades(data.data);
            console.log("Cidades carregadas:", data.data);
          }
        } else {
          console.error("Erro ao buscar cidades:", response.statusText);
        }
      } catch (error) {
        console.error("Erro na requisição de cidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCidades();
  }, []);

  // Função para lidar com a seleção/desseleção dos botões
  const handleSelectOption = (optionLabel) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.includes(optionLabel)
        ? prevSelectedOptions.filter((item) => item !== optionLabel)
        : [...prevSelectedOptions, optionLabel];

      // Atualiza os filtros no contexto
      updateFilters("terreno", { localizacao: updatedOptions });
      console.log("Cidades selecionadas:", updatedOptions);
      return updatedOptions;
    });
  };

  if (loading) {
    return (
      <div className="pt-7">
        <h2 className="menu-label pb-5">Localização</h2>
        <div className="text-center text-gray-400">Carregando cidades...</div>
      </div>
    );
  }

  // Função para renderizar as cidades em grupos de 3 por linha
  const renderCidades = () => {
    const rows = [];
    const cidadesPorLinha = 3;
    
    for (let i = 0; i < cidades.length; i += cidadesPorLinha) {
      const cidadesNaLinha = cidades.slice(i, i + cidadesPorLinha);
      const spans = cidadesPorLinha === 3 ? 8 : cidadesPorLinha === 2 ? 12 : 24;
      
      rows.push(
        <Row key={i} gutter={[8, 8]} justify="center" className={i > 0 ? "pt-3" : ""}>
          {cidadesNaLinha.map((cidade, index) => (
            <Col key={`${cidade}-${index}`} span={spans} align="center">
              <LocationButton
                label={cidade}
                onClick={() => handleSelectOption(cidade)}
                active={selectedOptions.includes(cidade)}
              />
            </Col>
          ))}
        </Row>
      );
    }
    
    return rows;
  };

  return (
    <div className="pt-7">
      <h2 className="menu-label pb-3">Localização</h2>
      {selectedOptions.length > 0 && (
        <div className="text-xs text-gray-300 pb-2">
          {selectedOptions.length} cidade{selectedOptions.length > 1 ? 's' : ''} selecionada{selectedOptions.length > 1 ? 's' : ''}
        </div>
      )}
      {cidades.length > 0 ? (
        <div>{renderCidades()}</div>
      ) : (
        <div className="text-center text-gray-400">Nenhuma cidade encontrada</div>
      )}
    </div>
  );
}
