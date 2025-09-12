import { createContext, useContext, useState, useEffect } from "react";

const FilterDataContext = createContext();

const INITIAL_FILTERS = {
  cidade: "Registro",
  status: "disponível",
  tipo: "Casa",
  precoMin: 250000,
  precoMax: 1000000,
  area: [100, 10000],
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
