"use client";
import { AutoComplete, Input, Spin } from 'antd';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGeocoding } from '@/hooks/useGeocoding';

/**
 * Componente de autocomplete para cidades brasileiras
 * Busca cidades conforme o usuário digita
 */
export default function CityAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Digite o nome da cidade",
  state = '', // Sigla do estado para filtrar (opcional)
  disabled = false,
  style = {}
}) {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState(value || '');
  const { searchCity, loading } = useGeocoding();
  const debounceTimeout = useRef(null);

  // Função debounce manual
  const debouncedSearch = useCallback((searchText) => {
    // Limpar timeout anterior
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Criar novo timeout
    debounceTimeout.current = setTimeout(async () => {
      if (!searchText || searchText.length < 3) {
        setOptions([]);
        return;
      }

      const results = await searchCity(searchText, state);
      
      if (results && results.length > 0) {
        const uniqueCities = new Map();
        
        results.forEach(item => {
          const key = `${item.cidade}-${item.estado}`;
          if (!uniqueCities.has(key) && item.cidade) {
            uniqueCities.set(key, {
              value: `${item.cidade}, ${item.estado}`,
              label: `${item.cidade} - ${item.estado}`,
              cidade: item.cidade,
              estado: item.estado,
              latitude: item.latitude,
              longitude: item.longitude
            });
          }
        });

        setOptions(Array.from(uniqueCities.values()));
      } else {
        setOptions([]);
      }
    }, 500);
  }, [state, searchCity]);

  // Cleanup do timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setSearchValue(value || '');
  }, [value]);

  const handleSearch = (text) => {
    setSearchValue(text);
    if (onChange) {
      onChange(text);
    }
    debouncedSearch(text);
  };

  const handleSelect = (selectedValue, option) => {
    setSearchValue(selectedValue);
    if (onSelect) {
      onSelect(selectedValue, option);
    }
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <AutoComplete
      value={searchValue}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: '100%', ...style }}
      notFoundContent={loading ? <Spin size="small" /> : 'Nenhuma cidade encontrada'}
      filterOption={false} // Desabilita filtro local, usa apenas resultados da API
    >
      <Input.Search 
        placeholder={placeholder}
        loading={loading}
        enterButton={false}
      />
    </AutoComplete>
  );
}
