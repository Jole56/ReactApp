import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

const NavBar = () => {
  const navigate = useNavigate();


  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");    
  const isLoggedIn = !!token;
  const isAdmin = (role === "admin");          

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-section navbar-left">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {isAdmin && (
          <Link to="/admin" className="nav-link">
            AdminPanel
          </Link>
        )}
      </div>

      <div className="navbar-section navbar-center">
        {isLoggedIn && (
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
        )}
      </div>

      <div className="navbar-section navbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/user/login" className="nav-link">
              Login
            </Link>
            <Link to="/user/register" className="nav-link">
              Register
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
