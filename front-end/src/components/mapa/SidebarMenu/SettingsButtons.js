"use client";
import { useFilters } from "@/context/FiltersContext";
import { Flex } from "antd";
import "dotenv/config";

export default function SettingsButtons({
  type,
  setImoveisMapa,
  setImoveisCarrossel,
}) {
  const { getFiltersForApi, removeFilters } = useFilters();

  const handleApply = async () => {
    try {
      // Obter filtros do contexto
      const filters = getFiltersForApi(type);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        console.error("NEXT_PUBLIC_API_URL não configurada");
        return;
      }
      
      // Converte os filtros em query parameters
      const queryParams = new URLSearchParams();
      
      // Processar cada filtro adequadamente
      if (filters && typeof filters === 'object') {
        Object.entries(filters).forEach(([key, value]) => {
          
          // Tratamento especial para arrays (preco, area, localizacao)
          if (Array.isArray(value)) {
            if (key === 'preco' && value.length === 2) {
              // Para preço, sempre envia os valores se forem números válidos
              if (typeof value[0] === 'number' && typeof value[1] === 'number') {
                queryParams.append('precoMin', value[0]);
                queryParams.append('precoMax', value[1]);
              }
            } else if (key === 'area' && value.length === 2) {
              if (typeof value[0] === 'number' && typeof value[1] === 'number') {
                if (value[0] >= 0) queryParams.append('areaMin', value[0]);
                if (value[1] > 0) queryParams.append('areaMax', value[1]);
              }
            } else if (key === 'localizacao' && value.length > 0) {
              // Para localização (array de cidades), envia todas as cidades selecionadas
              queryParams.append('cidades', value.join(','));
            }
          } 
          // Tratamento para valores não-nulos, não-undefined e não-vazios
          else if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'boolean') {
              // Para valores booleanos, só adiciona se for true
              if (value) {
                // Mapear nomes de campos do front-end para a API
                const apiFieldMap = {
                  'possui_piscina': 'possuiPiscina',
                  'possui_jardim': 'possuiJardim'
                };
                const apiKey = apiFieldMap[key] || key;
                queryParams.append(apiKey, 'true');
              }
            } else {
              // Para outros valores, adiciona diretamente
              queryParams.append(key, String(value));
            }
          }
        });
      }
      
      
      const response = await fetch(`${apiUrl}/mapa/busca?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Atualiza a lista de imóveis com os dados retornados do backend
        setImoveisMapa(data.data);
        setImoveisCarrossel(data.data);
      } else {
        console.warn("Nenhum imóvel encontrado com os filtros aplicados");
        // Limpa a lista se não houver resultados
        setImoveisMapa([]);
        setImoveisCarrossel([]);
      }
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
      // Em caso de erro, não limpa os imóveis para manter a UX
    }
  };

  return (
    <div className="flex gap-3 pt-7 pb-6">
      {/* Botão Desfazer */}
      <button
        onClick={async () => {
          removeFilters();
          // Recarregar todos os imóveis quando desfizer filtros
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
              console.error("NEXT_PUBLIC_API_URL não configurada");
              return;
            }
            
            const response = await fetch(`${apiUrl}/mapa/busca`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                setImoveisMapa(data.data);
                setImoveisCarrossel(data.data);
              }
            }
          } catch (error) {
            console.error("Erro ao desfazer filtros:", error);
          }
        }}
        className=" w-full rounded-lg border-3 border-[#374A8C54] font-semibold bg-transparent hover:bg-[#1b2235] transition"
        style={{ color: "#767A8B " }}
      >
        Desfazer
      </button>

      {/* Botão Aplicar */}
      <button
        onClick={handleApply}
        className="w-full py-2 rounded-lg bg-[var(--secondary)] font-bold  hover:bg-[#d88500] transition"
        style={{ color: "white" }}
      >
        <Flex align="center" justify="center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Aplicar
        </Flex>
      </button>
    </div>
  );
}
