import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

const INITIAL_FILTERS = {
  casa: {
    tipo: "Casa",
    preco: [25000, 1000000],
    area: [0, 200],
    quartos: null,
    banheiros: null,
    vagas: null,
    possui_piscina: false,
    possui_jardim: false,
    murado: false,
  },
  terreno: {
    tipo: "Terreno",
    preco: [25000, 1000000],
    area: [0, 200],
    murado: false,
    localizacao: [],
  },
};

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const updateFilters = (type, newFilters) => {
    console.log(`FiltersContext: Atualizando filtros para ${type}:`, newFilters);
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [type]: { ...prevFilters[type], ...newFilters },
      };
      console.log(`FiltersContext: Filtros atualizados:`, updatedFilters[type]);
      return updatedFilters;
    });
  };

  // Função para obter apenas os filtros de casa ou terreno para enviar à API
  const getFiltersForApi = (type) => {
    return filters[type];
  };

  const removeFilters = () => {
    console.log('FiltersContext: Removendo todos os filtros');
    setFilters(INITIAL_FILTERS);
  };

  return (
    <FiltersContext.Provider
      value={{ filters, updateFilters, getFiltersForApi, removeFilters }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
