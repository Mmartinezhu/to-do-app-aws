# Guía de Despliegue en AWS S3 + CloudFront

## Requisitos previos

1. **AWS CLI instalado**
   \`\`\`bash
   # Instalar AWS CLI
   # Windows: https://aws.amazon.com/cli/
   # Mac: brew install awscli
   # Linux: sudo apt install awscli
   \`\`\`

2. **Configurar credenciales AWS**
   \`\`\`bash
   aws configure
   # Ingresar:
   # - AWS Access Key ID
   # - AWS Secret Access Key
   # - Default region (us-east-1)
   \`\`\`

## Configuración inicial

### 1. Crear bucket S3

\`\`\`bash
# Crear bucket (cambia YOUR-BUCKET-NAME)
aws s3 mb s3://YOUR-BUCKET-NAME --region us-east-1

# Habilitar hosting de sitio web estático
aws s3 website s3://YOUR-BUCKET-NAME --index-document index.html --error-document index.html
\`\`\`

### 2. Configurar política del bucket

Crea un archivo `bucket-policy.json`:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
\`\`\`

Aplicar la política:
\`\`\`bash
aws s3api put-bucket-policy --bucket YOUR-BUCKET-NAME --policy file://bucket-policy.json
\`\`\`

### 3. Crear distribución CloudFront

1. Ve a AWS Console > CloudFront > Create Distribution
2. Configuración:
   - **Origin Domain**: Selecciona tu bucket S3
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Default Root Object**: index.html
   - **Error Pages**: Agregar error 404 → /index.html (código 200)
3. Copia el **Distribution ID**

### 4. Configurar el proyecto

Edita `deploy-config.json` con tus valores:

\`\`\`json
{
  "bucketName": "your-actual-bucket-name",
  "region": "us-east-1",
  "cloudFrontDistributionId": "E1234567890ABC"
}
\`\`\`

## Desplegar

### En Linux/Mac:
\`\`\`bash
chmod +x deploy.sh
./deploy.sh
\`\`\`

### En Windows (PowerShell):
\`\`\`powershell
# Ejecutar comandos manualmente:
npm run build
aws s3 sync build/ s3://YOUR-BUCKET-NAME --delete --region us-east-1
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
\`\`\`

## Despliegue manual (alternativa)

Si prefieres no usar el script:

1. **Build**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Subir a S3**
   \`\`\`bash
   aws s3 sync build/ s3://YOUR-BUCKET-NAME --delete
   \`\`\`

3. **Invalidar CloudFront**
   \`\`\`bash
   aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
   \`\`\`

## Variables de entorno en producción

Recuerda que las variables de entorno deben estar definidas en **tiempo de build**:

\`\`\`bash
# Crear archivo .env.production en la raíz
REACT_APP_API_BASE=https://d57tinotnl.execute-api.us-east-1.amazonaws.com/dev
\`\`\`

Las variables que empiecen con `REACT_APP_` estarán disponibles en el código.

## Troubleshooting

**Error: Refresh devuelve 404**
- Configura CloudFront Error Pages para redirigir 404 a /index.html con código 200

**Error: CORS**
- Verifica que tu API Gateway tenga CORS habilitado
- Verifica los headers de tu bucket S3

**Cambios no se ven**
- El cache de CloudFront puede tardar. Siempre invalida el cache después de desplegar.
