# To Do App – AWS Serverless

A serverless task management web application built with React and AWS.

The app allows authenticated users to create, list, update, search, filter, and delete personal tasks. The frontend communicates with a REST API deployed on Amazon API Gateway, while authentication is handled with Amazon Cognito and task data is stored in Amazon DynamoDB.

---

## Project Overview

This project demonstrates a full-stack serverless architecture using AWS services.

Main features:

- User registration and login with Amazon Cognito.
- JWT-based authentication.
- Create, read, update, and delete tasks.
- Search tasks by text.
- Filter tasks by status.
- Delete all tasks for the authenticated user.
- Static frontend deployment using Amazon S3.
- Serverless backend using AWS Lambda and API Gateway.
- Task persistence with Amazon DynamoDB.
- Logs and monitoring through Amazon CloudWatch.

---

## Architecture

![ToDoAppArchitecture](https://github.com/user-attachments/assets/8caa3626-2b00-474e-a80f-0c92577acfe7)

Application flow:

1. The user opens the React frontend hosted as a static website.
2. The user registers or logs in through Amazon Cognito.
3. Cognito returns a JWT token after successful authentication.
4. The frontend sends requests to Amazon API Gateway using:
   - `Authorization` header with the JWT token.
   - `x-api-key` header for API Gateway usage plan validation.
5. API Gateway validates access through a Lambda Authorizer and API Key.
6. AWS Lambda handles the business logic.
7. DynamoDB stores and retrieves user tasks.
8. CloudWatch stores logs and supports monitoring.

---

## AWS Services Used

### Frontend

- React
- Static hosting with Amazon S3

### Authentication

- Amazon Cognito User Pool
- JWT tokens
- Lambda Authorizer

### API

- Amazon API Gateway REST API
- API Key
- Usage Plan
- AWS Lambda

### Database

- Amazon DynamoDB

Tables used:

```txt
ToDoTable
```

Main attributes:

```txt
userId
taskId
description
status
createdAt
updatedAt
```

Search/index table:

```txt
ToDoTableSearchIndex
```

Used to support text-based task search.

### Monitoring

- Amazon CloudWatch Logs
- CloudWatch Alarms for Lambda and API errors

---

## API Endpoints

The frontend communicates with the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List tasks for the authenticated user |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks` | Update a task |
| DELETE | `/tasks` | Delete a task |
| GET | `/tasks/status` | Filter tasks by status |
| GET | `/tasks/search` | Search tasks by text |
| DELETE | `/tasks/all` | Delete all tasks for the authenticated user |

The frontend does not need to send `userId` directly. The backend should derive the authenticated user from the Cognito token validated by the authorizer.

---

## Security Notes

This project uses two layers of access control:

1. **Cognito JWT token**  
   Used to authenticate users and identify the owner of each task.

2. **API Gateway API Key**  
   Used for usage plan validation, throttling, and access control at the API Gateway level.

Sensitive values are not hardcoded in the frontend source code. They are loaded through environment variables.

Required values:

```env
REACT_APP_API_BASE_URL=
REACT_APP_API_KEY=
REACT_APP_COGNITO_USER_POOL_ID=
REACT_APP_COGNITO_CLIENT_ID=
```

Do not commit `.env.local` or any file containing real credentials.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
REACT_APP_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
REACT_APP_API_KEY=your-api-key
REACT_APP_COGNITO_USER_POOL_ID=your-cognito-user-pool-id
REACT_APP_COGNITO_CLIENT_ID=your-cognito-client-id
```

A safe example file should be committed as:

```txt
.env.example
```

with empty values:

```env
REACT_APP_API_BASE_URL=
REACT_APP_API_KEY=
REACT_APP_COGNITO_USER_POOL_ID=
REACT_APP_COGNITO_CLIENT_ID=
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/Mmartinezhu/to-do-app-aws.git
cd to-do-app-aws
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill `.env.local` with your real AWS configuration.

Start the development server:

```bash
npm start
```

The app will run locally at:

```txt
http://localhost:3000
```

---

## Build

To create a production build:

```bash
npm run build
```

This generates a `build/` folder with the static frontend files.

---

## Frontend Deployment

The frontend can be deployed as a static website using Amazon S3.

Basic deployment process:

1. Run the production build:

```bash
npm run build
```

2. Upload the contents of the `build/` folder to the S3 bucket configured for static website hosting.

3. Make sure the API URL, Cognito configuration, and API Key were set before building the app.

If any environment variable changes, rebuild the frontend before deploying again.

---

## Backend Overview

The backend is implemented with AWS Lambda and exposed through API Gateway.

The Lambda functions are responsible for:

- Creating tasks.
- Listing tasks.
- Updating task status or description.
- Deleting one task.
- Deleting all tasks.
- Searching tasks.
- Filtering tasks by status.
- Reading the authenticated user from the validated Cognito token.
- Performing DynamoDB operations.

---

## Recommended Repository Structure

```txt
to-do-app-aws/
├── public/
├── src/
│   ├── App.js
│   ├── Login.js
│   ├── api.js
│   ├── config.js
│   ├── App.css
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Git Ignore

The repository should ignore local environment and build files:

```txt
node_modules/
build/
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## Testing Checklist

After any change, test the following flow:

- Register a new user.
- Confirm the user with Cognito verification code.
- Log in.
- Create a task.
- List all tasks.
- Filter pending tasks.
- Search tasks.
- Mark a task as done.
- Delete one task.
- Delete all tasks.
- Log out.

---

## Future Improvements

- Add Infrastructure as Code using AWS SAM, Serverless Framework, Terraform, or AWS CDK.
- Add automated deployment for the frontend.
- Add CI/CD with GitHub Actions.
- Add unit tests for frontend logic.
- Add task due dates and priorities.


---

## Authors

Manuel Santiago Martínez Hurtado
Andrea Sanchez Jimenez

GitHub: [@Mmartinezhu](https://github.com/Mmartinezhu)
