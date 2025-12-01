import axios from "axios"

const API_BASE = "https://d57tinotnl.execute-api.us-east-1.amazonaws.com/dev"

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
  const res = await axios.get(`${API_BASE}/tasks`, {
    params: { userId },
    headers: authHeaders(),
  })
  return res.data
}

export async function createTask(description) {
  const taskId = `task-${Date.now()}`
  const res = await axios.post(
    `${API_BASE}/tasks`,
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
  const res = await axios.put(
    `${API_BASE}/tasks`,
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
  const res = await axios.delete(`${API_BASE}/tasks`, {
    data: { userId, taskId },
    headers: authHeaders(),
  })
  return res.data
}
