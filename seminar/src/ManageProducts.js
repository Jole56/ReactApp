import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router";

const ManageProducts = () =>{
    const [products,setProducts] = useState([])
    const [newProduct,setNewProduct] = useState({ naziv:'', cijena:'', postotak_alkohola:'', boja:'', tip:'', opis:'', slika:'',  manufacturer:'' })
    const [manufacturers,setManufacturers] = useState([])

    navigate = useNavigate()
    useEffect(()=>{
        fetchProducts()
        fetchManufacturers()
    },[])

    const fetchProducts = async () =>{
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/craftbeer/allbeers',{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
        })
        const data = await response.json()
        setProducts(data)
    }

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

    const handleEditProduct = (id) =>{
      navigate(`/admin/products/${id}/edit`)
    }

    const handleAddProducts = async () =>{
        const token = localStorage.getItem("token");
        await fetch('http://localhost:3000/craftbeer/addproduct',{
            method: 'POST',
            headers: { 
                "Content-Type":'application/json',
                "Authorization": `Bearer ${token}`
                },
            body: JSON.stringify(newProduct)
        })
        fetchProducts()
    }

    return (
        <div className="admin-container">
      <h2>Upravljanje proizvodima</h2>
      <div className="form-section">
        <h3>Dodaj proizvod</h3>
        <input
          type="text"
          placeholder="Naziv"
          value={newProduct.naziv}
          onChange={(e) => setNewProduct({ ...newProduct, naziv: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cijena"
          value={newProduct.cijena}
          onChange={(e) => setNewProduct({ ...newProduct, cijena: e.target.value })}
        />
        <input
          type="number"
          placeholder="Postotak alkohola"
          value={newProduct.postotak_alkohola}
          onChange={(e) => setNewProduct({ ...newProduct, postotak_alkohola: e.target.value })}
        />
        <input
          type="text"
          placeholder="Boja"
          value={newProduct.boja}
          onChange={(e) => setNewProduct({ ...newProduct, boja: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tip"
          value={newProduct.tip}
          onChange={(e) => setNewProduct({ ...newProduct, tip: e.target.value })}
        />
        <input
          type="text"
          placeholder="Opis"
          value={newProduct.opis}
          onChange={(e) => setNewProduct({ ...newProduct, opis: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL slike"
          value={newProduct.slika}
          onChange={(e) => setNewProduct({ ...newProduct, slika: e.target.value })}
        />
        <select
          value={newProduct.manufacturer}
          onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
        >
          <option value="">Odaberi proizvođača</option>
          {manufacturers.map((man) => (
            <option key={man._id} value={man._id}>
              {man.naziv}
            </option>
          ))}
        </select>
        <button onClick={handleAddProducts} className="btn-add">Dodaj proizvod</button>

            </div>
        <div className="list-section">
        <h3>Lista proizvoda</h3>
        <ul>
          {products.map((prod) => (
            <li key={prod._id}>
              <div>
                <img
                  src={prod.slika ? prod.slika : require(`./images/pivo_bright_arrow.jpg`)}
                  alt="slika piva"
                  style={{ width: "80px", height: "80px", marginRight: "10px" }}
                />
                <b>{prod.naziv}</b> - {prod.cijena} EUR
                <p>{prod.opis}</p>
              </div>
              <button onClick={() => handleEditProduct(prod._id)}>Uredi</button>
              <button
                onClick={() => handleDeleteProduct(prod._id)}
                className="btn-delete"
              >
                Obriši
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    )
}

export default ManageProducts