import React, { useState } from "react"
import "./css/AuthForms.css"

const Register = () =>{
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "user",
    })
    const [message,setMessage] = useState("")
    const handleChanger = (e) =>{
        const {name,value} = e.target
        setFormData((prevData)=>({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch('http://localhost:3000/user/add',{
                method: "POST",
                headers: { "Content-Type": "application/json",},
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (response.ok){
                setMessage(data.message)
                setFormData({
                    username:"",
                    password:"",
                    role:"user",
                })
            }else{
                setMessage( data.message || "Doslo je do greske.")
            }
        }catch(err){
            setMessage("Greska pri dodavanju korisnika.")
        }
    }

    return (
        <div className="auth-container">
        <h2 className="auth-title">Registracija korisnika</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Korisničko ime:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChanger}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChanger}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Uloga:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChanger}
            >
              <option value="user">Korisnik</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button type="submit" className="auth-btn">
            Dodaj korisnika
          </button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    )
}

export default Register