import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../LoginContext';  // Import the LoginContext
import '../styles/custom.css';

function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(LoginContext);  // Access context values

  const handleStartGame = () => {
    navigate('/game'); 
  };

  const handleLoginClick = () => {
    navigate('/login');  
  };

  const handleLogoutClick = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <div className="home-page">
      {/* Background Image */}
      <div className="hero-section">
        <h1>Welcome to Chess Arena</h1>
        <p>Your ultimate chess gaming platform</p>
      </div>

      <div className="home-page-content">
        {isLoggedIn ? (
          <div className="logged-in-content">
            <h2>Welcome back, {localStorage.getItem('username') || 'Player'}!</h2>
            <p>Start a new game or check your account.</p>
            <Button variant="danger" onClick={handleLogoutClick} className="logout-btn">
              Logout
            </Button>
            <Button variant="primary" onClick={handleStartGame} className="start-game-btn">
              Start a New Game
            </Button>
          </div>
        ) : (
          <div className="logged-out-content">
            <p>Please log in to play or check your account.</p>
            <Button variant="primary" onClick={handleLoginClick} className="login-btn">
              Login
            </Button>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Play against real opponents</li>
          <li>Track your progress and stats</li>
          <li>Compete on the leaderboard</li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
