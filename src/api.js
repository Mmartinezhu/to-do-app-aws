import axios from "axios"

import { apiConfig } from "./config"

const API_BASE = apiConfig.baseUrl
const API_KEY = apiConfig.apiKey

// Cliente axios que siempre envía la API key
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "x-api-key": API_KEY,
  },
})

let token = null
let userId = null

export function setTokenAndUser(jwt, sub) {
  token = jwt
  userId = sub
}

function authHeaders() {
  return token ? { Authorization: token } : {}
}

export async function getTasks() {
  const res = await api.get("/tasks", {
    params: { userId },
    headers: authHeaders(),
  })
  return res.data
}

export async function createTask(description) {
  const taskId = `task-${Date.now()}`
  const res = await api.post(
    "/tasks",
    {
      userId,
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
      userId,
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
    data: { userId, taskId },
    headers: authHeaders(),
  })
  return res.data
}

export async function deleteAllTasks() {
  const res = await api.delete("/tasks/all", {
    data: { userId },
    headers: authHeaders(),
  })
  return res.data
}

export async function getTasksByStatus(status) {
  const res = await api.get("/tasks/status", {
    params: { status, userId },
    headers: authHeaders(),
  })

  console.log("[api] respuesta getTasksByStatus cruda:", res.data)

  if (Array.isArray(res.data)) return res.data

  if (res.data && res.data.body) {
    return JSON.parse(res.data.body)
  }

  return []
}

export async function searchTasks(text) {
  const res = await api.get("/tasks/search", {
    params: { q: text, userId },
    headers: authHeaders(),
  })

  if (Array.isArray(res.data)) return res.data
  if (res.data && res.data.body) return JSON.parse(res.data.body)
  return []
}
