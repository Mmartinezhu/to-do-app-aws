# To Do App – AWS Serverless

Aplicación web de lista de tareas (To Do App) construida con arquitectura serverless sobre AWS.  
Permite a usuarios autenticados crear, listar, actualizar, eliminar y buscar tareas desde una interfaz web en React, con backend desplegado en AWS Lambda, API Gateway, DynamoDB y autenticación con Amazon Cognito.

---

## 1. Descripción general

La aplicación ofrece un CRUD completo de tareas por usuario, incluyendo búsqueda por texto y paginación en el listado. Se sigue el siguiente flujo:

1. El usuario accede al frontend desplegado como sitio estático en Amazon S3.
2. Inicia sesión mediante Amazon Cognito y obtiene un token JWT.
3. El frontend llama a la API publicada en Amazon API Gateway, enviando el token de Cognito y una API Key.
4. API Gateway valida la autorización mediante un Lambda Authorizer y la API Key.
5. Si la autorización es correcta, invoca una función AWS Lambda que realiza las operaciones sobre las tablas de DynamoDB.
6. La respuesta se devuelve al frontend en formato JSON.

---

## 2. Arquitectura

![ToDoAppArchitecture (1)](https://github.com/user-attachments/assets/8caa3626-2b00-474e-a80f-0c92577acfe7)


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
    - `PUT /tasks` – Actualizar estado de la tarea.
    - `DELETE /tasks` – Eliminar 1 tarea.
    - `GET /search` – Buscar tareas por texto.
    -  `DELETE /all`  - Eliminar todas las tareas.
  - Protecciones:
    - Lambda Authorizer que valida el token de Cognito.
    - API Key en el header `x-api-key` asociada a un Usage Plan.


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
- ** Frontend **
  Los archivos de la carpeta build se deben subir a S3 para que funcione como un frontend estático. En este caso ya esta construido pero puede se le puede hacer build nuevamente si se cambia algo con "npm build" y subiendo los archivos nuevamente al bucket de S3.

  ** Backend **
  Se dejan a disposición las funciones Lambda utilizadas para el correcto funcionamiento de la página, se deben configurar como función de python o como archivo j.son Node.js x20.
