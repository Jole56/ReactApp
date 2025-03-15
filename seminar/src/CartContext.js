import React, { createContext, useEffect, useState } from "react";


export const CartContext = createContext()

export const CartProvider = ({ children }) =>{ 
    const[cart,setCart] = useState([])
    const [showModal,setShowModal] = useState(false)

    useEffect(()=>{
        const fetchCart = async () =>{
            const token = localStorage.getItem('token')
            if(!token){
                return;
            }
            try{
                const res = await fetch('http://localhost:3000/cart/',{
                    headers:{ authorization: `Bearer ${token}`}
                })
                if (res.ok){
                    const data = await res.json()
                    setCart(data)
                }
            }catch(err){
                console.error('Greška kod fetchCart',err)
            }
        }
        fetchCart()
    },[])

    const refetchCart = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCart(data);  
      };

    const addToCart = async (beerId) =>{
        const token = localStorage.getItem('token')
        if(!token){
            return;
        }
        try{
            const res = await fetch('http://localhost:3000/cart/add',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ beerId })
            })
            if (res.ok){
                const data = await res.json()
                setCart(data.cart)
                console.log("data.cart", data.cart)
                setShowModal(true)
                await refetchCart()
            }else{
                console.error('Dodavanje proizvoda nije uspjelo')
            }
        }catch(err){
            console.error('Greška kod addToCart')
        }
    }

    const removeFromCart = async (beerId) =>{
        const token = localStorage.getItem('token')
        if(!token){
            return ;
        }
        const res = await fetch(`http://localhost:3000/cart/${beerId}`,{
            method: "DELETE",
            headers: { authorization: `Bearer ${token}`}
        })
        if(res.ok){
            const data = await res.json()
            setCart(data.cart)
        }
    }

    const checkout = async () => {
        const token = localStorage.getItem('token')
        if(!token){
            return;
        }
        const res = await fetch('http://localhost:3000/cart/checkout',{
            method: 'POST',
            headers:{ authorization: `Bearer ${token}`}
        })
        if(res.ok){
            const data = await res.json()
            setCart([])
            alert(data.message)
        }
    }

    const increaseQuantity = async (beerId) =>{
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:3000/cart/increase/${beerId}`, {
                method: 'PATCH',
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data.cart);
            } else {
                console.error("Povećanje količine nije uspjelo");
            }
        } catch (err) {
            console.error("Greška kod increaseQuantity:", err);
        }
    }

    const decreaseQuantity = async (beerId) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:3000/cart/decrease/${beerId}`, {
                method: 'PATCH',
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data.cart);
            } else {
                console.error("Smanjenje količine nije uspjelo");
            }
        } catch (err) {
            console.error("Greška kod decreaseQuantity:", err);
        }
    }

    const closeModal = () =>{
        setShowModal(false)
    }

    return (
        <CartContext.Provider
        value={{
            cart,
            addToCart,
            removeFromCart,
            checkout,
            increaseQuantity,
            decreaseQuantity,
            showModal,
            closeModal,
        }}
        >
            {children}
        </CartContext.Provider>
    )
}