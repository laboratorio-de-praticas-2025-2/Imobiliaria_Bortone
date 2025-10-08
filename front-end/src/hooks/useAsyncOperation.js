"use client";

import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar estados de loading em operações assíncronas
 * Evita cliques múltiplos e fornece feedback visual
 */
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      successMessage = "Operação realizada com sucesso!",
      errorMessage = "Erro ao realizar operação.",
      showAlert = true
    } = options;

    if (loading) {
      console.warn('Operação já em andamento, ignorando novo clique');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction();

      if (onSuccess) {
        await onSuccess(result);
      }

      if (showAlert && successMessage) {
        alert(successMessage);
      }

      return result;
    } catch (err) {
      console.error('Erro na operação:', err);
      setError(err);

      if (onError) {
        await onError(err);
      }

      if (showAlert) {
        alert(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset
  };
}

/**
 * Hook específico para formulários com validação
 */
export function useFormSubmit() {
  const { loading, error, execute, reset } = useAsyncOperation();

  const submitForm = useCallback(async (formData, submitFunction, options = {}) => {
    const { 
      validateFields,
      requiredFields = [],
      ...executeOptions 
    } = options;

    // Validar campos obrigatórios
    if (requiredFields.length > 0) {
      const missingFields = requiredFields.filter(field => 
        !formData[field] || formData[field].toString().trim() === ''
      );

      if (missingFields.length > 0) {
        alert(`Preencha todos os campos obrigatórios: ${missingFields.join(', ')}`);
        return;
      }
    }

    // Validação customizada
    if (validateFields && !validateFields(formData)) {
      return;
    }

    return execute(
      () => submitFunction(formData),
      {
        successMessage: "Dados salvos com sucesso!",
        errorMessage: "Erro ao salvar dados. Tente novamente.",
        ...executeOptions
      }
    );
  }, [execute]);

  return {
    loading,
    error,
    submitForm,
    reset
  };
}