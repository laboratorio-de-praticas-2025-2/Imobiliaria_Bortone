"use client";
import { Input } from 'antd';
import { useState } from 'react';
import { useViaCEP } from '@/hooks/useViaCEP';

/**
 * Componente de campo CEP com busca automática
 * Preenche automaticamente cidade, estado e rua ao digitar o CEP
 */
export default function CEPField({ 
  value, 
  onChange, 
  onAddressFound, // Callback quando o endereço é encontrado
  disabled = false,
  style = {}
}) {
  const [cepValue, setCepValue] = useState(value || '');
  const { buscarCEP, formatarCEP, loading } = useViaCEP();

  const handleCEPChange = (e) => {
    let inputValue = e.target.value;
    
    // Remove caracteres não numéricos
    const numericValue = inputValue.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const limitedValue = numericValue.slice(0, 8);
    
    // Formata o CEP
    let formattedCEP = limitedValue;
    if (limitedValue.length > 5) {
      formattedCEP = `${limitedValue.slice(0, 5)}-${limitedValue.slice(5)}`;
    }
    
    setCepValue(formattedCEP);
    
    if (onChange) {
      onChange(formattedCEP);
    }

    // Busca automaticamente quando completar 8 dígitos
    if (limitedValue.length === 8) {
      handleCEPSearch(limitedValue);
    }
  };

  const handleCEPSearch = async (cep) => {
    const resultado = await buscarCEP(cep);
    
    if (resultado && onAddressFound) {
      onAddressFound(resultado);
    }
  };

  return (
    <Input
      value={cepValue}
      onChange={handleCEPChange}
      placeholder="00000-000"
      disabled={disabled}
      loading={loading}
      maxLength={9}
      style={{ width: '100%', ...style }}
      addonAfter={loading ? "Buscando..." : null}
    />
  );
}
