"use client"

import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import Login from "./Login"
import {
  setToken,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
  getTasksByStatus,
  searchTasks,
} from "./api"
import "./App.css"
import { cognitoConfig } from "./config"
const { CognitoUserPool } = require("amazon-cognito-identity-js")

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [newDesc, setNewDesc] = useState("")
  const [filter, setFilter] = useState("all") // "all" o "pending"
  const [searchText, setSearchText] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  const onLogin = (jwt) => {
    const decoded = jwtDecode(jwt)
    const sub = decoded.sub
    setToken(jwt)
    setUserId(sub)
    setToken(jwt)
  }

  const loadTasks = async (filterType = filter) => {
    setLoading(true)
    try {
      console.log("[v0] Cargando tareas con filtro:", filterType)

      let data
      if (filterType === "pending") {
        console.log("[v0] Llamando getTasksByStatus('pending')")
        data = await getTasksByStatus("pending")
        console.log("[v0] Respuesta de getTasksByStatus:", data)
      } else {
        console.log("[v0] Llamando getTasks()")
        data = await getTasks()
        console.log("[v0] Respuesta de getTasks:", data)
      }

      if (Array.isArray(data)) {
        console.log("[v0] Tareas encontradas:", data.length)
        setTasks(data)
        setCurrentPage(1)
      } else {
        console.error("Error: respuesta no es un array:", data)
        setTasks([])
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error)
      console.error("[v0] Error completo:", error.response?.data || error.message)
      alert("Error al cargar las tareas")
      setTasks([])
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

  useEffect(() => {
    if (token) {
      loadTasks(filter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

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

  const handleDeleteAll = async () => {
    if (!window.confirm("¿Seguro que quieres borrar TODAS tus tareas?")) return
    try {
      await deleteAllTasks()
      await loadTasks()
    } catch (error) {
      console.error("Error al borrar todas las tareas:", error)
      alert("Error al borrar todas las tareas")
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
      if (isSearching) {
        handleClearSearch()
      } else {
        await loadTasks()
      }
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

  const handleSearch = async (e) => {
    if (e) e.preventDefault()

    if (!searchText.trim()) {
      alert("Por favor ingresa un texto para buscar")
      return
    }

    setLoading(true)
    setIsSearching(true)
    try {
      const data = await searchTasks(searchText)
      if (Array.isArray(data)) {
        setTasks(data)
        setCurrentPage(1)
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error("Error al buscar tareas:", error)
      alert("Error al buscar tareas")
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchText("")
    setIsSearching(false)
    loadTasks()
  }

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(tasks.length / tasksPerPage)

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  if (!token) {
    return <Login onLogin={onLogin} />
  }

  return (
    <div className="app-container">
      <div className="todo-card">
        <header className="todo-header">
          <div className="header-content">
            <div className="header-logo-title">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M7 12L10.5 15.5L17 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="header-title">To Do App</h1>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>

        <div className="todo-body">
          <div className="filter-bar">
            <button
              className={filter === "all" ? "filter-button active" : "filter-button"}
              onClick={() => setFilter("all")}
            >
              Ver todas
            </button>
            <button
              className={filter === "pending" ? "filter-button active" : "filter-button"}
              onClick={() => setFilter("pending")}
            >
              Solo pendientes
            </button>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar tareas..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e)
                }
              }}
            />
            <button type="submit" className="search-button">
              Buscar
            </button>
            {isSearching && (
              <button type="button" className="clear-search-button" onClick={handleClearSearch}>
                Limpiar búsqueda
              </button>
            )}
          </form>

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
            <button type="button" className="delete-all-button" onClick={handleDeleteAll}>
              Borrar todas
            </button>
          </form>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando tareas...</p>
            </div>
          ) : (
            <div className="tasks-container">
              {isSearching && <div className="search-info">Mostrando resultados para: "{searchText}"</div>}

              {tasks.length === 0 ? (
                <p className="empty-message">
                  {isSearching ? "No se encontraron tareas con ese texto" : "No tienes tareas. ¡Agrega una nueva!"}
                </p>
              ) : (
                <>
                  <div className="tasks-list">
                    {currentTasks.map((task) => (
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

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button className="pagination-button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                        ← Anterior
                      </button>

                      <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            className={currentPage === pageNum ? "pagination-number active" : "pagination-number"}
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        className="pagination-button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}

                  <div className="pagination-info">
                    Mostrando {indexOfFirstTask + 1} - {Math.min(indexOfLastTask, tasks.length)} de {tasks.length}{" "}
                    tareas
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
