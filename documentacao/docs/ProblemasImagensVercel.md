# Problemas com Imagens no Vercel: Análise e Soluções

## Resumo Executivo

Este documento analisa os problemas enfrentados pelo front-end da aplicação imobiliária quando hospedada no Vercel em relação ao carregamento de imagens, identificando as causas raiz e propondo soluções eficazes.

## Problemas Identificados

### 1. **Arquitetura de Armazenamento Atual**

**Situação Atual:**
- Backend salva imagens físicas no diretório `../front-end/public/images/imoveis/`
- Banco de dados armazena URLs relativas: `/images/imoveis/nome_arquivo.jpg`
- Backend serve imagens via middleware: `app.use('/images', express.static(...))`

**Código Problemático:**
```javascript
// ImagemImovelController.js - Linha 11-15
const uploadPath = path.join(process.cwd(), '../front-end/public/images/imoveis');

// app.js - Linha 54
app.use('/images', express.static(path.join(__dirname, '../../front-end/public/images')));
```

### 2. **Problemas no Vercel**

#### **2.1 Sistema de Arquivos Readonly**
- Vercel usa sistema de arquivos somente-leitura após o build
- Impossível salvar novas imagens durante runtime
- Imagens não persistem entre deployments

#### **2.2 Separação de Serviços**
- Frontend e backend são deployados separadamente
- Frontend não consegue acessar arquivos do backend
- URLs relativas falham quando serviços estão em domínios diferentes

#### **2.3 Configuração de Variáveis de Ambiente**
```javascript
// Problema: variável não configurada corretamente em produção
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Resulta em: undefined/images/imoveis/arquivo.jpg
```

### 3. **Inconsistências no Frontend**

#### **3.1 Multiple Padrões de URL**
```javascript
// ImageCarroussel.js - Inconsistente
src={`${apiUrl}/images/imoveis/${img.url_imagem}`}

// PublicidadeImage.js - Mais robusto
const normalizedBase = apiBase.replace(/\/$/, '');
return `${normalizedBase}${src}`;
```

#### **3.2 Tratamento de Erro Inadequado**
- Alguns componentes usam fallback para imagem 404
- Outros componentes falham silenciosamente
- Falta de estratégia unificada de fallback

## Soluções Recomendadas

### **Solução 1: AWS S3 Bucket (Mais Robusta)**

#### **1.1 Configuração do AWS S3**

```javascript
// services/s3UploadService.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export const uploadImageToS3 = async (file, folder = 'imoveis') => {
  try {
    // Gerar nome único para o arquivo
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Tornar arquivo público
      ACL: 'public-read'
    });

    await s3Client.send(command);
    
    // Retornar URL completa e acessível
    return {
      url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key: key,
      fileName: fileName
    };
  } catch (error) {
    console.error('Erro no upload S3:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }
};

export const deleteImageFromS3 = async (imageUrl) => {
  try {
    // Extrair key da URL
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove primeira barra

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Erro ao deletar do S3:', error);
    return false;
  }
};
```

#### **1.2 Configuração de Variáveis de Ambiente**

```bash
# Backend (.env)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=imobiliaria-bortone-images

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

### **Solução 2: Netlify Deploy (Alternativa Gratuita)**

#### **2.1 Migrar Frontend para Netlify**

```javascript
// netlify/functions/upload-image.js
const formidable = require('formidable');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Só aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse do multipart form data
    const form = new formidable.IncomingForm();
    const { files, fields } = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadedFile = files.image;
    if (!uploadedFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nenhum arquivo enviado' })
      };
    }

    // Gerar nome único
    const fileExtension = path.extname(uploadedFile.originalFilename);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    
    // Definir pasta de destino
    const folder = fields.folder || 'imoveis';
    const destinationPath = path.join('/tmp', 'netlify-uploads', folder, fileName);
    
    // Criar diretório se não existir
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    
    // Copiar arquivo para destino
    await fs.copyFile(uploadedFile.filepath, destinationPath);

    // Resposta de sucesso
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        url: `/images/${folder}/${fileName}`,
        fileName: fileName
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      })
    };
  }
};
```

#### **2.2 Configuração do Netlify**

```toml
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://seu-backend.onrender.com"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    Access-Control-Allow-Origin = "*"
```

### **Solução 3: Cloudinary (Alternativa Premium Gratuita)**

#### **3.1 Implementação Cloudinary**

```javascript
// services/cloudinaryService.js
import { v2 as cloudinary } from 'cloudinary';

// Configuração
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file, folder = 'imoveis') => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
      folder: `imobiliaria/${folder}`,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ],
      use_filename: false,
      unique_filename: true
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Erro no Cloudinary:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Erro ao deletar do Cloudinary:', error);
    return false;
  }
};

// Gerar URLs otimizadas
export const getOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  };

  return cloudinary.url(publicId, { ...defaultOptions, ...options });
};
```

## Adaptações para Cada Solução

### **Implementação AWS S3 - Modificações no Backend**

#### **Atualizar ImagemImovelController.js**

```javascript
// controllers/ImagemImovelController.js
import { uploadImageToS3, deleteImageFromS3 } from '../services/s3UploadService.js';

export const uploadImage = async (req, res) => {
  try {
    const { imovel_id, descricao } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    // Upload para S3
    const uploadResult = await uploadImageToS3(req.file, 'imoveis');

    // Salvar URL completa no banco
    const novaImagem = await ImagemImovelService.createImagem({
      imovel_id: parseInt(imovel_id),
      url_imagem: uploadResult.url, // URL completa do S3
      descricao: descricao || "Imagem do imóvel",
    });

    res.status(201).json({
      ...novaImagem.toJSON(),
      fileName: uploadResult.fileName
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar imagem no banco
    const imagem = await ImagemImovelService.getImageById(id);
    if (!imagem) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }

    // Deletar do S3
    await deleteImageFromS3(imagem.url_imagem);

    // Deletar do banco
    const deleted = await ImagemImovelService.deleteImagem(id);
    if (!deleted) {
      return res.status(404).json({ error: "Erro ao excluir imagem do banco." });
    }
    
    res.status(200).json({ message: "Imagem excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
```

#### **Configuração do Multer para S3**

```javascript
// middleware/multerS3Config.js
import multer from 'multer';

// Para S3, usar memoryStorage ao invés de diskStorage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'), false);
    }
  }
});

export default upload;
```

### **Implementação Netlify - Modificações no Frontend**

#### **Estrutura de Pastas para Netlify**

```
front-end/
├── netlify/
│   └── functions/
│       ├── upload-image.js
│       └── delete-image.js
├── public/
│   └── images/
│       └── imoveis/ (será populado via Functions)
└── src/
    └── services/
        └── netlifyUploadService.js
```

#### **Serviço de Upload para Netlify**

```javascript
// src/services/netlifyUploadService.js
export const uploadToNetlify = async (file, folder = 'imoveis') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  try {
    const response = await fetch('/.netlify/functions/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const deleteFromNetlify = async (fileName, folder = 'imoveis') => {
  try {
    const response = await fetch('/.netlify/functions/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, folder })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};
```

#### **Function para Deletar Imagens no Netlify**

```javascript
// netlify/functions/delete-image.js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { fileName, folder = 'imoveis' } = JSON.parse(event.body);
    
    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nome do arquivo é obrigatório' })
      };
    }

    const filePath = path.join(process.cwd(), 'public', 'images', folder, fileName);
    
    // Verificar se arquivo existe
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true, message: 'Arquivo deletado' })
      };
    } catch (error) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Arquivo não encontrado' })
      };
    }

  } catch (error) {
    console.error('Delete error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      })
    };
  }
};
```

### **Adaptação dos Componentes Frontend**

#### **Componente Unificado para Ambas Soluções**

```javascript
// components/common/UniversalImage.js
import { useState } from 'react';
import Image from 'next/image';

export default function UniversalImage({ 
  src, 
  alt, 
  width = 400, 
  height = 300,
  fallback = '/images/placeholder.jpg',
  className = '',
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallback);
      setError(true);
    }
  };

  // Determinar se é URL completa (S3/Cloudinary) ou relativa (Netlify)
  const isAbsoluteUrl = imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('https'));
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${error ? 'opacity-50' : ''}`}
      onError={handleError}
      unoptimized={isAbsoluteUrl} // Para URLs externas
      {...props}
    />
  );
}
```

#### **Adaptação do ImageCarroussel**

```javascript
// components/vitrine/ImageCarroussel.js
import UniversalImage from '../common/UniversalImage';

export default function ImageCarroussel({ imovel }) {
  return (
    <div className="w-full">
      <div className="relative w-full h-48 sm:h-56 overflow-hidden sm:rounded-xl">
        <Swiper className="w-full h-full image-carroussel-imoveis">
          {(imovel.imagem_imovel ?? []).map((img, index) => (
            <SwiperSlide key={index}>
              <UniversalImage
                src={img.url_imagem}
                alt={img.descricao || "Imagem do imóvel"}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
```

## Comparação das Soluções

| Aspecto | AWS S3 | Netlify | Cloudinary |
|---------|---------|---------|------------|
| **Custo** | ~$5-15/mês | Gratuito | ~$20-50/mês |
| **Complexidade** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Persistência** | ✅ 100% | ✅ 100% | ✅ 100% |
| **CDN Global** | ✅ CloudFront | ✅ Incluído | ✅ Incluído |
| **Transformações** | ❌ Manual | ❌ Manual | ✅ Automático |
| **Backup** | ✅ Versioning | ⚠️ Manual | ✅ Automático |
| **Limite Gratuito** | 5GB/mês | 100GB | 25GB |

### **Migração de Dados Existentes**

#### **Script para Migrar Imagens Atuais**

```javascript
// scripts/migrateImages.js
import fs from 'fs';
import path from 'path';
import { uploadImageToS3 } from '../services/s3UploadService.js';
import { uploadToNetlify } from '../services/netlifyUploadService.js';
import ImagemImovel from '../models/ImagemImovel.js';

const CURRENT_IMAGES_PATH = path.join(process.cwd(), '../front-end/public/images/imoveis');
const MIGRATION_STRATEGY = process.env.MIGRATION_STRATEGY || 'S3'; // 'S3' ou 'NETLIFY'

export const migrateExistingImages = async () => {
  try {
    console.log('🚀 Iniciando migração de imagens...');
    
    // Buscar todas as imagens no banco
    const images = await ImagemImovel.findAll();
    console.log(`📊 Encontradas ${images.length} imagens no banco`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const image of images) {
      try {
        // Verificar se já é URL completa (já migrada)
        if (image.url_imagem.startsWith('http')) {
          console.log(`⏭️  Pulando ${image.id} - já migrada`);
          continue;
        }

        // Construir caminho local
        const fileName = image.url_imagem.replace('/images/imoveis/', '');
        const localPath = path.join(CURRENT_IMAGES_PATH, fileName);

        // Verificar se arquivo existe
        if (!fs.existsSync(localPath)) {
          console.log(`❌ Arquivo não encontrado: ${fileName}`);
          errorCount++;
          continue;
        }

        // Preparar arquivo para upload
        const fileBuffer = fs.readFileSync(localPath);
        const fileData = {
          buffer: fileBuffer,
          originalname: fileName,
          mimetype: `image/${path.extname(fileName).substring(1)}`
        };

        let newUrl;
        
        if (MIGRATION_STRATEGY === 'S3') {
          const result = await uploadImageToS3(fileData, 'imoveis');
          newUrl = result.url;
        } else if (MIGRATION_STRATEGY === 'NETLIFY') {
          // Para Netlify, copiar para public directory
          const netlifyPath = path.join(process.cwd(), 'public/images/imoveis', fileName);
          fs.mkdirSync(path.dirname(netlifyPath), { recursive: true });
          fs.copyFileSync(localPath, netlifyPath);
          newUrl = `/images/imoveis/${fileName}`;
        }

        // Atualizar no banco
        await image.update({ url_imagem: newUrl });
        
        console.log(`✅ Migrada: ${fileName} -> ${newUrl}`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Erro ao migrar ${image.id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📈 RESULTADO DA MIGRAÇÃO:`);
    console.log(`   ✅ Migradas: ${migratedCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log(`   📊 Total: ${images.length}`);

  } catch (error) {
    console.error('💥 Erro fatal na migração:', error);
  }
};

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateExistingImages();
}
```

### **Configuração de Ambiente por Solução**

#### **Para AWS S3:**

```bash
# Backend (.env)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=imobiliaria-bortone-images

# Frontend - Vercel Environment Variables
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
NEXT_PUBLIC_STORAGE_TYPE=S3
```

#### **Para Netlify:**

```bash
# Netlify (.env)
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
NEXT_PUBLIC_STORAGE_TYPE=NETLIFY

# Build Settings no Netlify Dashboard:
# Build command: npm run build
# Publish directory: dist
# Functions directory: netlify/functions
```

## Implementação das Soluções

### **Fase 1: Correções Imediatas**

1. **Configurar variáveis de ambiente no Vercel**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   ```

2. **Implementar componente unificado de imagem**
3. **Adicionar tratamento de erro robusto**

### **Fase 2: Migração para Cloud Storage**

1. **Configurar AWS S3 ou Cloudinary**
2. **Migrar imagens existentes**
   ```javascript
   // scripts/migrateImages.js
   const migrateExistingImages = async () => {
     const images = await ImagemImovel.findAll();
     for (const image of images) {
       if (!image.url_imagem.startsWith('http')) {
         const localPath = path.join(__dirname, '../front-end/public', image.url_imagem);
         if (fs.existsSync(localPath)) {
           const cloudUrl = await uploadToCloud(localPath);
           await image.update({ url_imagem: cloudUrl });
         }
       }
     }
   };
   ```

3. **Atualizar endpoints de upload**

### **Fase 3: Otimizações**

1. **Implementar CDN**
2. **Lazy loading de imagens**
3. **Compressão automática**
4. **Cache inteligente**

## Monitoramento e Métricas

### **KPIs para Acompanhar:**

1. **Taxa de erro de carregamento de imagens**
2. **Tempo de carregamento médio**
3. **Uso de fallback images**
4. **Custos de storage**

### **Ferramentas de Monitoramento:**

```javascript
// utils/imageMetrics.js
export const trackImageLoad = (src, success, loadTime) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'image_load', {
      event_category: 'performance',
      event_label: src,
      value: loadTime,
      custom_parameter_1: success ? 'success' : 'error'
    });
  }
};
```

## Conclusão

A migração para cloud storage é a solução mais robusta e escalável. Enquanto isso não é implementado, as correções imediatas na configuração de variáveis de ambiente e componentes unificados resolverão a maioria dos problemas no Vercel.

### **Cronograma Sugerido:**

#### **Opção A: AWS S3 (Recomendado para Produção)**
- **Semana 1**: Configurar conta AWS e bucket S3
- **Semana 2**: Implementar serviços de upload/delete no backend
- **Semana 3**: Atualizar componentes do frontend
- **Semana 4**: Migrar imagens existentes e testar

#### **Opção B: Netlify (Recomendado para MVP/Teste)**
- **Semana 1**: Migrar frontend do Vercel para Netlify
- **Semana 2**: Implementar Netlify Functions para upload
- **Semana 3**: Configurar redirecionamentos e CORS
- **Semana 4**: Migrar imagens e testar integração

#### **Cronograma Híbrido (Mais Seguro):**
- **Fase 1 (Semana 1-2)**: Migrar para Netlify (solução rápida)
- **Fase 2 (Semana 3-4)**: Implementar AWS S3 em paralelo
- **Fase 3 (Semana 5-6)**: Migrar gradualmente para S3
- **Fase 4 (Semana 7-8)**: Otimizações e monitoramento

### **Custos Estimados:**

#### **Custos Operacionais:**
- **AWS S3**: ~$5-15/mês (primeiros 50GB gratuitos)
- **Netlify**: Gratuito (até 100GB bandwidth)
- **Cloudinary**: ~$20-50/mês (25GB gratuitos)

#### **Custos de Desenvolvimento:**
- **AWS S3**: ~30-40 horas (mais complexo)
- **Netlify**: ~20-30 horas (mais simples)
- **Migração de dados**: ~10-15 horas (qualquer solução)

### **Recomendação Final:**

**Para começar IMEDIATAMENTE**: Migre para **Netlify** esta semana
**Para produção robusta**: Implemente **AWS S3** nas próximas 4 semanas
**Para máxima funcionalidade**: Use **Cloudinary** se orçamento permitir

A migração para Netlify pode ser feita em 2-3 dias e resolve 90% dos problemas imediatamente, enquanto você planeja a solução definitiva com S3.

A implementação dessas soluções garantirá que as imagens sejam carregadas consistentemente em qualquer ambiente de deploy, incluindo o Vercel.
