// Componente de teste para upload de imagens no Netlify
"use client";

import { useState } from 'react';
import { uploadToNetlify } from '@/services/netlifyUploadService';

export default function NetlifyImageUploadTest() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      
      const imageUrl = await uploadToNetlify(
        file,
        '999', // ID de teste
        'Teste de upload via Netlify'
      );
      
      setResult({
        success: true,
        url: imageUrl,
        fileName: file.name,
        size: file.size
      });
      
      
    } catch (error) {
      console.error('💥 TESTE: Erro no upload:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">🧪 Teste Upload Netlify</h2>
      
      {/* Seletor de arquivo */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Selecionar Imagem:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={uploading}
        />
      </div>

      {/* Preview do arquivo */}
      {file && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm">
            <strong>Arquivo:</strong> {file.name}
          </p>
          <p className="text-sm">
            <strong>Tamanho:</strong> {(file.size / 1024).toFixed(1)} KB
          </p>
          <p className="text-sm">
            <strong>Tipo:</strong> {file.type}
          </p>
        </div>
      )}

      {/* Botão de upload */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full py-2 px-4 rounded font-medium ${
          !file || uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {uploading ? '📤 Uploading...' : '🚀 Upload Imagem'}
      </button>

      {/* Resultado do upload */}
      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h3 className="font-medium text-green-800 mb-2">✅ Upload Bem-sucedido!</h3>
          <p className="text-sm text-green-700">
            <strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline">{result.url}</a>
          </p>
          {/* Preview da imagem */}
          <div className="mt-2">
            <img 
              src={result.url} 
              alt="Upload result" 
              className="max-w-full h-auto rounded border"
            />
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h3 className="font-medium text-red-800 mb-2">❌ Erro no Upload</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Debug info */}
      <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
        <h4 className="font-medium mb-1">🔧 Debug Info:</h4>
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Não configurada'}</p>
        <p><strong>Ambiente:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}
