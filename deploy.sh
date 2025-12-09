#!/bin/bash

# Script de despliegue para S3 + CloudFront
# Asegúrate de tener AWS CLI instalado y configurado

echo "🚀 Iniciando despliegue..."

# Leer configuración
BUCKET_NAME=$(node -p "require('./deploy-config.json').bucketName")
REGION=$(node -p "require('./deploy-config.json').region")
DISTRIBUTION_ID=$(node -p "require('./deploy-config.json').cloudFrontDistributionId")

# Crear build de producción
echo "📦 Generando build de producción..."
npm run build

# Verificar que el build se creó correctamente
if [ ! -d "build" ]; then
  echo "❌ Error: La carpeta build no existe"
  exit 1
fi

# Subir archivos a S3
echo "☁️  Subiendo archivos a S3..."
aws s3 sync build/ s3://$BUCKET_NAME --delete --region $REGION

# Invalidar cache de CloudFront
echo "🔄 Invalidando cache de CloudFront..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Despliegue completado exitosamente!"
echo "🌐 Tu app estará disponible en unos minutos"
