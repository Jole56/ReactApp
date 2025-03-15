import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/App.css";

const HomePage = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token){
            navigate('/user/login')
        }
    },[navigate])

  useEffect(() => {
    const fetchManufacturers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/craftbeer/allmanufacturers", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error(`Greška kod dohvaćanja! Status: ${res.status}`);
        }
        const data = await res.json();
        setManufacturers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchManufacturers();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Greška: {error}</p>;
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Popis Proizvođača</h1>

      <div className="manufacturer-grid">
        {manufacturers.map((manu) => (
          <div className="manufacturer-card" key={manu._id}>
            <h3>{manu.naziv}</h3>
            <p className="manufacturer-country">
              <i>{manu.drzava}</i> - {manu.godina_osnivanja}
            </p>
            <p className="manufacturer-desc">{manu.opis}</p>
            <Link to={`/manufacturers/${manu._id}`} className="btn-view-products">
              Pogledaj proizvode
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
