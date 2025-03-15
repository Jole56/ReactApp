import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { FavoritesContext } from "./FavoritesContext";
import "./css/Cart.css";

const Cart = () => {
const { cart, removeFromCart, checkout, increaseQuantity, decreaseQuantity } = useContext(CartContext)
const { favorites, removeFromFavorites } = useContext(FavoritesContext);

const handleRemove = (beerId) => {
    removeFromCart(beerId)
    }
const handleCheckout = () =>{
    checkout()
    }
const handleDecrease = (beerId) =>{
    decreaseQuantity(beerId)
    }
const handleIncrease = (beerId) =>{
    increaseQuantity(beerId)
    }
  const totalPrice = cart.reduce((sum, item) => {
    const singlePrice = item.beerId?.cijena || 0;
    return sum + singlePrice * item.quantity;
  }, 0);

  return (
    <div className="cart-wrapper">
      <div className="cart-left">
        <h2>Košarica</h2>
        {cart.length === 0 ? (
          <p>Košarica je trenutno prazna.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.beerId._id}>
                <h4>{item.beerId.naziv}</h4>
                <p>
                    {item.quantity} kom x {item.beerId.cijena} EUR
                </p>
                <button onClick={()=>handleDecrease(item.beerId._id)}>-</button>
                <button onClick={()=>handleIncrease(item.beerId._id)}>+</button>
                <button onClick={() => handleRemove(item.beerId._id)}>Ukloni</button>
              </li>
            ))}
          </ul>
        )}
        <p><b>Ukupno: {totalPrice.toFixed(2)} EUR</b></p>
        {cart.length > 0 && (
          <button onClick={()=>handleCheckout()}>Checkout</button>
        )}
      </div>

      <div className="cart-right">
        <h2>Favoriti</h2>
        {favorites.length === 0 ? (
          <p>Nema favorita.</p>
        ) : (
          <ul>
            {favorites.map((favBeer) => (
              <li key={favBeer._id}>
                <b>{favBeer.naziv}</b>
                <button onClick={() => removeFromFavorites(favBeer._id)}>
                  Ukloni
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cart;
