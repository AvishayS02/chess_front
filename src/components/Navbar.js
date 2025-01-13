import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../LoginContext';

function Navbar() {
  const { isLoggedIn, username, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">ChessArena</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
              <li className="nav-item">
                  <Link to="/game" className="nav-link">Play Game</Link> 
                </li>
                <li className="nav-item">
                  <Link to="/myaccount" className="nav-link">My Account</Link>
                </li>
                <li className="nav-item">
                  <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
                </li>
                <span className="nav-link text-white">Hello, {username}</span>
                <li className="nav-item">
                  <button className="btn btn-link text-white" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
