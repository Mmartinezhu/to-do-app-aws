"use client"

import { useState } from "react"
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from "amazon-cognito-identity-js"
import { cognitoConfig } from "./config"

const userPool = new CognitoUserPool(cognitoConfig)

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' o 'error'

  const showMessage = (text, type = "success") => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 5000)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (!email || !password) {
      showMessage("Por favor completa todos los campos", "error")
      return
    }

    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
    ]

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        showMessage(err.message || "Error al registrarse", "error")
        return
      }
      showMessage("¡Registro exitoso! Revisa tu correo para el código de confirmación.", "success")
    })
  }

  const handleConfirm = (e) => {
    e.preventDefault()
    if (!email || !confirmationCode) {
      showMessage("Por favor ingresa el email y el código de confirmación", "error")
      return
    }

    const userData = {
      Username: email,
      Pool: userPool,
    }

    const cognitoUser = new CognitoUser(userData)

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        showMessage(err.message || "Error al confirmar usuario", "error")
        return
      }
      showMessage("¡Usuario confirmado! Ahora puedes iniciar sesión.", "success")
      setConfirmationCode("")
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      showMessage("Por favor completa todos los campos", "error")
      return
    }

    const authenticationData = {
      Username: email,
      Password: password,
    }

    const authenticationDetails = new AuthenticationDetails(authenticationData)

    const userData = {
      Username: email,
      Pool: userPool,
    }

    const cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken()
        showMessage("¡Inicio de sesión exitoso!", "success")
        setTimeout(() => {
          onLogin(idToken)
        }, 500)
      },
      onFailure: (err) => {
        showMessage(err.message || "Error al iniciar sesión", "error")
      },
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">To-Do Serverless</h1>
          <p className="login-subtitle">Inicia sesión o crea tu cuenta</p>
        </div>

        {message && (
          <div className={`message ${messageType === "error" ? "message-error" : "message-success"}`}>{message}</div>
        )}

        <form className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Código de verificación (opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="123456"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={handleRegister}>
              Registrarme
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleConfirm}>
              Confirmar usuario
            </button>
            <button type="submit" className="btn btn-primary" onClick={handleLogin}>
              Entrar
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p className="footer-text">Al registrarte recibirás un código de confirmación por correo electrónico</p>
        </div>
      </div>
    </div>
  )
}

export default Login
