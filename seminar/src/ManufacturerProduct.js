import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/App.css";
import { Link } from "react-router-dom";

const ManufacturerProducts = () => {
  const { manufacturerId } = useParams();
  const [beers, setBeers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token){
            navigate('/user/login')
        }
    },[navigate])

  useEffect(() => {
    const fetchBeers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3000/craftbeer/products/${manufacturerId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error(`Greška pri dohvatu proizvoda! Status: ${res.status}`);
        }
        const data = await res.json();
        setBeers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBeers();
  }, [manufacturerId]);

  if (error) {
    return <p style={{ color: "red" }}>Greška: {error}</p>;
  }

  if (beers.length === 0) {
    return <p>Nema proizvoda ili se učitavaju...</p>;
  }

  return (
    <div className="products-container">
      <h2>Proizvodi proizvođača</h2>
      <div className="product-grid">
        {beers.map((beer) => (
          <div className="product-card" key={beer._id}>
            <h3>{beer.naziv}</h3>
            <p>
              {beer.tip} - {beer.cijena} EUR
            </p>
            <p>{beer.opis}</p>
            {beer.slika && (
              <img
                className="product-image"
                src={beer.slika}
                alt={beer.naziv}
                style={{ width: "100px", height: "auto" }}
              /> 
            )}
            <Link to={`/product/${beer._id}`} className="btn-details">
              More details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturerProducts;
