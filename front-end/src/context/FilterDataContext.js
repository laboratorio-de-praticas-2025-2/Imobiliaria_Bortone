import { createContext, useContext, useState, useEffect } from "react";

const FilterDataContext = createContext();

const INITIAL_FILTERS = {
    regiao: 'Registro, São Paulo',
    tipo_negociacao: 'Comprar',
    quartos: null,
    banheiros: null,
};

export function FilterDataProvider({ children }) {
  const [filterData, setFilterData] = useState(INITIAL_FILTERS);

  const updateFilterData = (newData) => {
    setFilterData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  useEffect(() => {
    // chamada da API
    async function fetchData() {
      // Exemplo: await api.get('/imoveis', { params: filterData });
      console.log("Chamando API com filtros:", filterData);
    }
    fetchData();
  }, [filterData]);

  return (
    <FilterDataContext.Provider value={{ filterData, updateFilterData }}>
      {children}
    </FilterDataContext.Provider>
  );
}

export function useFilterData() {
  return useContext(FilterDataContext);
}