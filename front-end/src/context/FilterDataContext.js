import { createContext, useContext, useState, useEffect } from "react";

const FilterDataContext = createContext();

const INITIAL_FILTERS = {
  status: "disponível",
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
