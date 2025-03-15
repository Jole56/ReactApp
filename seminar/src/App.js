import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login"
import AdminDashboard from "./AdminDashboard";
import ManageManufacturers from "./ManageManufacturers";
import ManageProducts from "./ManageProducts";
import Logout from "./Logout";
import BeerDetails from "./BeerDetails";
import { CartProvider } from "./CartContext";
import CartModal from "./CartModal";
import Cart from "./Cart";
import HomePage from "./HomePage";
import ManufacturerProducts from "./ManufacturerProduct";
import NavBar from "./Navbar";
import { FavoritesProvider } from "./FavoritesContext";
import EditManufacturer from "./EditManufacturer";
import EditProduct from "./EditProduct";
import Provjera from "./Provjera";
import Users from "./Users";



const root = createRoot(document.getElementById("root"));
root.render(
<CartProvider>
  <FavoritesProvider>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/manufacturers/:manufacturerId" element={<ManufacturerProducts />}/>
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/logout" element={<Logout />} />
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="/admin/manufacturers" element={<ManageManufacturers />}/>
        <Route path="/admin/products" element={<ManageProducts />}/>
        <Route path="/product/:id" element={<BeerDetails />}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/admin/manufacturers/:id/edit" element={<EditManufacturer />} />
        <Route path="/admin/products/:id/edit" element={<EditProduct/>} />
        <Route path="/provjera" element={<Provjera />}/>
        <Route path="/userspanel" element={<Users />}/>
        </Routes>
      <CartModal/>
    </BrowserRouter>
  </FavoritesProvider>
</CartProvider>
);

