import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router";

const ManageManufacturers = () =>{
    const [manufacturers,setManufacturers] = useState([])
    const [newManufacturer,setNewManufacturer] = useState({ naziv:'', godina_osnivanja:2020, drzava:'', opis:'' })
    navigate = useNavigate()

    useEffect(()=>{
        fetchManufacturers()
    },[])

    const fetchManufacturers = async () =>{
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/craftbeer/allmanufacturers',{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await response.json()
        setManufacturers(data)
    }

    const handleAddManufacturers = async () =>{
        const token = localStorage.getItem("token");
        await fetch('http://localhost:3000/craftbeer/addmanufacturer',{
            method: 'POST',
            headers: {
                 'Content-Type':'application/json',
                 "Authorization": `Bearer ${token}`,
                },
            body: JSON.stringify(newManufacturer)
        })
        fetchManufacturers()
    }

    const handleEditManufacturer = (id) =>{
        navigate(`/admin/manufacturers/${id}/edit`)
    }

    const handleDeleteManufacturers = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/craftbeer/deletemanu/${id}`,{
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
        })
        fetchManufacturers()
    }

    return (
        <div className="admin-container">
            <h2>Upravljanje proizvođačima</h2>
            <div className="form-section">
                <h3>Dodaj proizvođača</h3>
                <input
                type="text"
                placeholder="Naziv"
                value={newManufacturer.naziv}
                onChange={(e) => setNewManufacturer({ ...newManufacturer, naziv: e.target.value})}
                />
                <input
                type="number"
                placeholder="Godina Osnivanja"
                value={newManufacturer.godina_osnivanja}
                onChange={(e) => setNewManufacturer({ ...newManufacturer, godina_osnivanja: e.target.value})}
                />
                <input
                type="text"
                placeholder="Drzava"
                value={newManufacturer.drzava}
                onChange={(e) => setNewManufacturer({ ...newManufacturer, drzava: e.target.value})}
                />
                <input
                type="text"
                placeholder="Opis"
                value={newManufacturer.opis}
                onChange={(e) => setNewManufacturer({ ...newManufacturer, opis: e.target.value})}
                />
                <button onClick={handleAddManufacturers}>Dodaj</button>
            </div>
            <div className="list-section">
                <h3>Lista proizvođača</h3>
                <ul>
                    {manufacturers.map((man)=>(
                        <li key={man._id}>
                            <strong>{man.naziv}</strong> 
                            <button onClick={() => handleEditManufacturer(man._id)}>Uredi</button>
                            <button onClick={()=>handleDeleteManufacturers(man._id)}>Obriši proizvođača</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ManageManufacturers