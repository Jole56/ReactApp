import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./css/Admin.css"

const AdminDashboard = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const role = localStorage.getItem('role')
        if (role !== 'admin'){
            navigate('/')
        }
    },[navigate])
    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <nav className="admin-nav">
                <ul>
                    <li><Link to="/admin/manufacturers">Upravljanje proizvodacima</Link></li>
                    <li><Link to="/admin/products">Upravljanje proizvodima</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default AdminDashboard