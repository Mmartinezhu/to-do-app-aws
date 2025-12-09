# To Do App – AWS Serverless

Aplicación web de lista de tareas (To Do App) construida con arquitectura serverless sobre AWS.  
Permite a usuarios autenticados crear, listar, actualizar, eliminar y buscar tareas desde una interfaz web en React, con backend desplegado en AWS Lambda, API Gateway, DynamoDB y autenticación con Amazon Cognito.

---

## 1. Descripción general

La aplicación ofrece un CRUD completo de tareas por usuario, incluyendo búsqueda por texto y paginación en el listado.

Flujo de alto nivel:

1. El usuario accede al frontend desplegado como sitio estático en Amazon S3.
2. Inicia sesión mediante Amazon Cognito y obtiene un token JWT.
3. El frontend llama a la API publicada en Amazon API Gateway, enviando el token de Cognito y una API Key.
4. API Gateway valida la autorización mediante un Lambda Authorizer y la API Key.
5. Si la autorización es correcta, invoca una función AWS Lambda que realiza las operaciones sobre las tablas de DynamoDB.
6. La respuesta se devuelve al frontend en formato JSON.

---

## 2. Arquitectura

Servicios principales utilizados:

- **Frontend**
  - React (Create React App).
  - Desplegado como sitio estático en Amazon S3.

- **Autenticación**
  - Amazon Cognito User Pool (usuarios y login).
  - El frontend obtiene tokens JWT (Access Token / Id Token) y los envía en el header `Authorization`.

- **API**
  - Amazon API Gateway (REST API, stage `dev`).
  - Endpoints principales:
    - `GET /tasks` – Listar tareas con paginación.
    - `POST /tasks` – Crear tarea.
    - `PUT /tasks/{id}` – Actualizar estado de la tarea.
    - `DELETE /tasks/{id}` – Eliminar tarea.
    - `GET /tasks/search` – Buscar tareas por texto.
  - Protecciones:
    - Lambda Authorizer que valida el token de Cognito.
    - API Key en el header `x-api-key` asociada a un Usage Plan.

- **Lógica de negocio**
  - AWS Lambda (Node.js):
    - Lambda principal: CRUD, búsqueda y paginación.
    - Lambda Authorizer: validación de token JWT emitido por Cognito.

- **Base de datos**
  - Amazon DynamoDB:
    - `ToDoTable`
      - Partición: `userId`
      - Sort key: `taskId`
      - Atributos: `title`, `description`, `status`, `createdAt`, `updatedAt`.
    - `ToDoTableSearchIndex`
      - Información mínima de cada tarea para soportar la búsqueda (`userId`, `taskId`, `title`, `status`).

- **Monitoreo**
  - Amazon CloudWatch Logs:
    - Logs de las funciones Lambda (principal y authorizer).
  - CloudWatch Alarms:
    - Alarmas sobre errores (5xx / errores en Lambda) que envían notificación cuando se superan umbrales definidos.

---

## 3. Estructura del repositorio

La estructura general del repositorio es:

```text
.
├── backend/          # Código del backend (AWS Lambda, authorizer, etc.)
│   ├── handler.js    # Lambda principal: CRUD, búsqueda, paginación
│   ├── authorizer.js # Lambda Authorizer: validación token Cognito
│   ├── package.json  # Dependencias backend
│   └── ...
├── src/              # Código del frontend (React)
├── public/
├── package.json      # Dependencias frontend
├── README.md
└── ...


You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
