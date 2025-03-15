import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/favorites", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Greška kod fetchFavorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  const addToFavorites = async (beerId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/favorites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ beerId })
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites); 
      } else {
        console.error("Dodavanje u favorite nije uspjelo");
      }
    } catch (err) {
      console.error("Greška kod addToFavorites:", err);
    }
  }
  const removeFromFavorites = async (beerId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch(`http://localhost:3000/favorites/${beerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites); 
      } else {
        console.error("Greška: removeFromFavorites nije uspjelo");
      }
    } catch (err) {
      console.error("Greška kod removeFromFavorites:", err);
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
