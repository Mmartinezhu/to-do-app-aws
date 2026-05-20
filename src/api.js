import axios from "axios"
import { apiConfig } from "./config"

const API_BASE = apiConfig.baseUrl
const API_KEY = apiConfig.apiKey

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "x-api-key": API_KEY,
  },
})

let token = null

export function setToken(jwt) {
  token = jwt
}

function authHeaders() {
  return token ? { Authorization: token } : {}
}

export async function getTasks() {
  const res = await api.get("/tasks", {
    headers: authHeaders(),
  })
  return res.data
}

export async function createTask(description) {
  const taskId = `task-${Date.now()}`
  const res = await api.post(
    "/tasks",
    {
      taskId,
      description,
      status: "pending",
    },
    { headers: authHeaders() },
  )
  return res.data
}

export async function updateTask(task) {
  const res = await api.put(
    "/tasks",
    {
      taskId: task.taskId,
      description: task.description,
      status: task.status,
    },
    { headers: authHeaders() },
  )
  return res.data
}

export async function deleteTask(taskId) {
  const res = await api.delete("/tasks", {
    data: { taskId },
    headers: authHeaders(),
  })
  return res.data
}

export async function deleteAllTasks() {
  const res = await api.delete("/tasks/all", {
    headers: authHeaders(),
  })
  return res.data
}

export async function getTasksByStatus(status) {
  const res = await api.get("/tasks/status", {
    params: { status },
    headers: authHeaders(),
  })

  if (Array.isArray(res.data)) return res.data
  if (res.data && res.data.body) return JSON.parse(res.data.body)

  return []
}

export async function searchTasks(text) {
  const res = await api.get("/tasks/search", {
    params: { q: text },
    headers: authHeaders(),
  })

  if (Array.isArray(res.data)) return res.data
  if (res.data && res.data.body) return JSON.parse(res.data.body)

  return []
}
