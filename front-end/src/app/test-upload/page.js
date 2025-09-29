// Página de teste para upload de imagens
import NetlifyImageUploadTest from '@/components/test/NetlifyImageUploadTest';

export default function TestUploadPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          🧪 Página de Teste - Upload de Imagens
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h2 className="font-bold text-yellow-800 mb-2">ℹ️ Instruções:</h2>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Selecione uma imagem (JPG, PNG, etc.)</li>
              <li>Clique em "Upload Imagem"</li>
              <li>Verifique os logs no console do browser (F12)</li>
              <li>Se funcionar, você verá a imagem abaixo</li>
              <li>Se falhar, verifique as variáveis de ambiente</li>
            </ol>
          </div>
          
          <NetlifyImageUploadTest />
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h2 className="font-bold text-blue-800 mb-2">🔧 Troubleshooting:</h2>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li><strong>Erro 500:</strong> Verifique se NEXT_PUBLIC_API_URL está configurada</li>
              <li><strong>Network Error:</strong> Backend pode estar offline</li>
              <li><strong>CORS Error:</strong> Problema de configuração no backend</li>
              <li><strong>Imagem não carrega:</strong> Verifique URL retornada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
