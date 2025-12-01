// Configuración de AWS Cognito
// INSTRUCCIONES PARA OBTENER ESTOS VALORES:
//
// 1. Ve a AWS Console > Cognito > User Pools
// 2. Selecciona tu User Pool
// 3. En "User pool overview" encontrarás:
//    - User pool ID: algo como "us-east-1_AbCdEfGhI"
// 4. Ve a "App integration" > "App clients"
// 5. Haz clic en tu App Client
// 6. Encontrarás el "Client ID": algo como "1a2b3c4d5e6f7g8h9i0j1k2l3m"
//
// IMPORTANTE: Asegúrate de que tu App Client tenga:
// - Auth flows: ALLOW_USER_PASSWORD_AUTH habilitado
// - NO tenga "Generate client secret" (debe estar sin secreto para apps web)

export const cognitoConfig = {
  UserPoolId: "us-east-1_XXXXXXXXX", // REEMPLAZA con tu User Pool ID
  ClientId: "XXXXXXXXXXXXXXXXXXXXXXXXXX", // REEMPLAZA con tu Client ID
  region: "us-east-1", // Cambia si tu región es diferente
}

// Ejemplo de configuración real (NO USAR, es solo ejemplo):
// export const cognitoConfig = {
//   UserPoolId: "us-east-1_Ab12Cd34E",
//   ClientId: "7a1b2c3d4e5f6g7h8i9j0k1l2m3n",
//   region: "us-east-1"
// };
