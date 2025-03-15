import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router";
import "./css/AuthForms.css"

const Login = (e) =>{
    const navigate = useNavigate()
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [message,setMessage] = useState("")


    const handleLogin = async (e) =>{
        e.preventDefault()
        try{
            const response = await fetch("http://localhost:3000/user/login",{
                method: "POST",
                headers: { "Content-Type":"application/json"},
                body: JSON.stringify({username,password})
            })
            if (!response.ok){
                throw new Error("Invalid username or password")
            }

            const data = await response.json()
            localStorage.setItem("token",data.token)
            localStorage.setItem("role",data.user.role)
            setMessage("Login succesfull!")
            navigate('/')
            console.log("User logged in:",data)
        } catch (err){
            setMessage(err.message)
        }
    }
    return (
        <div className="auth-container">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    )
}

export default Login