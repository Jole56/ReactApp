import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "./CartContext";
import { FavoritesContext } from "./FavoritesContext";
import "./css/App.css";

const BeerDetails = () => {
  const { id } = useParams();
  
  const [beer, setBeer] = useState(null);
  const [error, setError] = useState("");

  const { addToCart } = useContext(CartContext);
  const { addToFavorites } = useContext(FavoritesContext); 

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/craftbeer/beer/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBeer(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBeerDetails();
  }, [id]);

  if (error) {
    return <p style={{color:'red'}}>Greška: {error}</p>;
  }

  if (!beer) {
    return <p>Učitavanje...</p>;
  }

  const handleAddToCart = () => {
    addToCart(beer._id);
  };

  const handleAddToFavorites = () => {
    addToFavorites(beer._id); 
  };

  return (
    <div className="beer-details-container">
      <h2 className="beer-details-title">Detalji o proizvodu</h2>

      <div className="beer-info">
        <h3>{beer.naziv}</h3>
        <p>Tip: {beer.tip}</p>
        <p>Boja: {beer.boja}</p>
        <p>Postotak alkohola: {beer.postotak_alkohola}%</p>
        <p>Cijena: {beer.cijena} EUR</p>
        <p>Opis: {beer.opis}</p>
      </div>

      {beer.slika && (
        <img
          src={beer.slika}
          alt={beer.naziv}
          className="beer-image"
        />
      )}

      <div className="beer-actions">
        <button onClick={handleAddToCart} className="btn-add-cart">
          Dodaj u košaricu
        </button>
        <button onClick={handleAddToFavorites} className="btn-add-fav">
          Dodaj u favorite
        </button>
      </div>
    </div>
  );
};

export default BeerDetails;
