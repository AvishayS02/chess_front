import React, { useState, useEffect } from 'react'; 
import axios from '../axios'; // Ensure axios is configured properly
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';

const GamePage = () => {
  const [users, setUsers] = useState([]); // 
  const [selectedOpponent, setSelectedOpponent] = useState(null); 
  const [selectedColor, setSelectedColor] = useState('White'); 
  const [gameResult, setGameResult] = useState(null); 
  const [gameId, setGameId] = useState(null); 
  const [result, setResult] = useState(''); 
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token'); // Retrieve token from localStorage

  // Fetch users (opponents) from the API
  useEffect(() => {
    if (!token) {
      navigate('/login'); 
      return;
    }

    axios
      .get('https://chessarena-fpp9.onrender.com/api/game/get_opponents/', {  
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching opponents:', error);
      });
  }, [token, navigate]);

  // Function to start a new game
  const startGame = () => {
    if (!selectedOpponent) {
      alert('Please select an opponent');
      return;
    }

    const gameData = {
      opponent_id: selectedOpponent.id,
    };

    axios
      .post('https://chessarena-fpp9.onrender.com/api/game/play/', gameData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGameId(response.data.game_id); // Set game ID after game starts
        console.log('Game started:', response.data);
      })
      .catch((error) => {
        console.error('Error starting game:', error);
      });
  };

  // Function to submit the result
  const finishGame = () => {
    if (!gameId || !result) {
      alert('Please select the game result');
      return;
    }

    const scoreData = {
      result: result, // Either "White", "Black", or "Draw"
    };

    axios
      .post(`https://chessarena-fpp9.onrender.com/api/game/submit_score/${gameId}/`, scoreData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGameResult(response.data.msg); // Store the game result message
        console.log('Game result updated:', response.data);

        // After successfully submitting the result, redirect to "My Account"
        navigate('/myaccount'); // Navigate to the "My Account" page
      })
      .catch((error) => {
        console.error('Error submitting game result:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h3>Start a New Game</h3>
      <Form>
        {/* Opponent selection */}
        <Form.Group controlId="opponentSelect">
          <Form.Label>Select an Opponent</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              setSelectedOpponent(users.find((u) => u.id === parseInt(e.target.value)));
            }}
          >
            <option>Select an opponent</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Color selection */}
        <Form.Group controlId="colorSelect" className="mt-3">
          <Form.Label>Select Color</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option>White</option>
            <option>Black</option>
          </Form.Control>
        </Form.Group>

        {/* Start game button */}
        <Button
          variant="primary"
          className="mt-3"
          onClick={startGame}
          disabled={!selectedOpponent}
        >
          Start Game
        </Button>
      </Form>

      {/* Show game result message */}
      {gameResult && (
        <div className="mt-4">
          <h5>{gameResult}</h5>
        </div>
      )}

      {/* Result dropdown */}
      {gameId && (
        <Form.Group controlId="resultSelect" className="mt-3">
          <Form.Label>Game Result</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setResult(e.target.value)}
          >
            <option value="">Select Result</option>
            <option value="White">White Wins</option>
            <option value="Black">Black Wins</option>
            <option value="Draw">Draw</option>
          </Form.Control>
        </Form.Group>
      )}

      {/* Submit result */}
      <Button 
        variant="success" 
        onClick={finishGame} 
        className="mt-3" 
        disabled={!result}
      >
        Submit Result
      </Button>
    </div>
  );
};

export default GamePage;
