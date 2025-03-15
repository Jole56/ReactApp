import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    naziv: "",
    cijena: 0,
    postotak_alkohola: 0,
    boja: "",
    tip: "",
    opis: "",
    slika: "",
    manufacturer: ""
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(id)
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/craftbeer/edit/products/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Ne mogu dohvatiti proizvod!");
        const data = await res.json();
   
        setFormData({
          naziv: data.naziv,
          cijena: data.cijena,
          postotak_alkohola: data.postotak_alkohola,
          boja: data.boja,
          tip: data.tip,
          opis: data.opis,
          slika: data.slika,
          manufacturer: data.manufacturer 
        });
      } catch (err) {
        setMessage(err.message);
      }
    };

    const fetchManufacturers = async () => {
      try {
        const res = await fetch("http://localhost:3000/craftbeer/allmanufacturers", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setManufacturers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchManufacturers();
  }, [id]);
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/craftbeer/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Ne mogu ažurirati proizvod!");
      const data = await res.json();
      setMessage("Proizvod ažuriran!");
      navigate("/admin/products");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Uredi proizvod</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Naziv:</label>
          <input
            type="text"
            name="naziv"
            value={formData.naziv}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cijena:</label>
          <input
            type="number"
            name="cijena"
            value={formData.cijena}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Postotak alkohola:</label>
          <input
            type="number"
            step="0.1"
            name="postotak_alkohola"
            value={formData.postotak_alkohola}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Boja:</label>
          <input
            type="text"
            name="boja"
            value={formData.boja}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Tip:</label>
          <input
            type="text"
            name="tip"
            value={formData.tip}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Opis:</label>
          <input
            type="text"
            name="opis"
            value={formData.opis}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>URL slike:</label>
          <input
            type="text"
            name="slika"
            value={formData.slika}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Proizvođač:</label>
          <select
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
          >
            <option value="">Odaberi proizvođača</option>
            {manufacturers.map((man) => (
              <option key={man._id} value={man._id}>
                {man.naziv}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Spremi</button>
      </form>
    </div>
  );
};

export default EditProduct;
