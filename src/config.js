export const cognitoConfig = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
}

export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  apiKey: process.env.REACT_APP_API_KEY,
}
