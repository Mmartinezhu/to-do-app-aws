"use client"

import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import Login from "./Login"
import { setTokenAndUser, getTasks, createTask, updateTask, deleteTask } from "./api"
import "./App.css"
import { cognitoConfig } from "./config"
const { CognitoUserPool } = require("amazon-cognito-identity-js")

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [newDesc, setNewDesc] = useState("")

  const onLogin = (jwt) => {
    const decoded = jwtDecode(jwt)
    const sub = decoded.sub
    setToken(jwt)
    setUserId(sub)
    setTokenAndUser(jwt, sub)
  }

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error("Error al cargar tareas:", error)
      alert("Error al cargar las tareas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadTasks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "done" : "pending"
    try {
      await updateTask({ ...task, status: newStatus })
      await loadTasks()
    } catch (error) {
      console.error("Error al actualizar tarea:", error)
      alert("Error al actualizar la tarea")
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId)
      await loadTasks()
    } catch (error) {
      console.error("Error al eliminar tarea:", error)
      alert("Error al eliminar la tarea")
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newDesc.trim()) {
      alert("Por favor ingresa una descripción")
      return
    }
    try {
      await createTask(newDesc)
      setNewDesc("")
      await loadTasks()
    } catch (error) {
      console.error("Error al crear tarea:", error)
      alert("Error al crear la tarea")
    }
  }

  const handleLogout = () => {
    const userPool = new CognitoUserPool(cognitoConfig)
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
    }

    // Limpiar estado
    setToken(null)
    setUserId(null)
    setTasks([])
    setTokenAndUser(null, null)
  }

  if (!token) {
    return <Login onLogin={onLogin} />
  }

  return (
    <div className="app-container">
      <div className="todo-card">
        <header className="todo-header">
          <div className="header-content">
            <h1 className="header-title">To-Do Serverless</h1>
            <p className="header-subtitle">AWS Lambda · API Gateway · DynamoDB · Cognito</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>

        <div className="todo-body">
          <form className="task-form" onSubmit={handleCreate}>
            <input
              type="text"
              className="task-input"
              placeholder="Nueva tarea…"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <button type="submit" className="add-button">
              Agregar
            </button>
          </form>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando tareas...</p>
            </div>
          ) : (
            <div className="tasks-container">
              {tasks.length === 0 ? (
                <p className="empty-message">No tienes tareas. ¡Agrega una nueva!</p>
              ) : (
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div key={task.taskId} className="task-item">
                      <div className="task-content">
                        <input
                          type="checkbox"
                          className="task-checkbox"
                          checked={task.status === "done"}
                          onChange={() => toggleStatus(task)}
                        />
                        <span className={task.status === "done" ? "task-text done" : "task-text"}>
                          {task.description}
                        </span>
                      </div>
                      <button className="delete-button" onClick={() => handleDelete(task.taskId)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
