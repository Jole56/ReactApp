import React, { useContext } from "react";
import ReactDOM from "react-dom"
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./css/Modal.css"

const CartModal = () =>{
    const { showModal, closeModal } = useContext(CartContext)
    const navigate = useNavigate()

    if(!showModal){
        return null
    }

    const handleYes = () =>{
        closeModal()
        navigate('/cart')
    }

    const handleNo = () =>{
        closeModal()
    }

    const modalContent = (
        <div className="modal-backdrop">
            <div className="modal-window">
                <p>Proizvod je dodan u košaricu.</p>
                <p>Želite li vidjeti košaricu sada?</p>
                <div>
                    <button onClick={handleYes}>Da</button>
                    <button onClick={handleNo}>Ne</button>
                </div>
            </div>
        </div>
    )

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('portal-root')
    )
}

export default CartModal