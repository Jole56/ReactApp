import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditManufacturer = () => {
  const { id } = useParams();      
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    naziv: "",
    drzava: "",
    godina_osnivanja: "",
    opis: ""
  });
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    const fetchManufacturer = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3000/craftbeer/manufacturers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Ne mogu dohvatiti proizvođača!");
        const data = await res.json();
        
        setFormData({
          naziv: data.naziv,
          drzava: data.drzava,
          godina_osnivanja: data.godina_osnivanja,
          opis: data.opis
        });
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchManufacturer();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/craftbeer/manufacturers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error("Ne mogu ažurirati proizvođača!");
      }
      const data = await res.json();
      setMessage("Proizvođač uspješno ažuriran!");
      navigate("/admin/manufacturers");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Uredi proizvođača</h2>
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
          <label>Država:</label>
          <input
            type="text"
            name="drzava"
            value={formData.drzava}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Godina osnivanja:</label>
          <input
            type="number"
            name="godina_osnivanja"
            value={formData.godina_osnivanja}
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
        <button type="submit">Spremi</button>
      </form>
    </div>
  );
};

export default EditManufacturer;
