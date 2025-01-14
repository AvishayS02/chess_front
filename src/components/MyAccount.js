import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../LoginContext';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import '../styles/custom.css';

const MyAccount = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [gameHistory, setGameHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, refreshAccessToken } = useContext(LoginContext);  

    // Fetch user data and game history
    useEffect(() => {
        const fetchData = async () => {
            try {
                let currentToken = token;
                if (!currentToken) {
                    currentToken = await refreshAccessToken(); // If token is expired, refresh it
                }

                // get user profile
                const profileResponse = await axios.get('https://chessarena-fpp9.onrender.com/api/users/profile/', {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                setUserProfile(profileResponse.data);

                // get game history data
                const historyResponse = await axios.get('https://chessarena-fpp9.onrender.com/api/game/game_history/', {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                setGameHistory(historyResponse.data.games || []);
            } catch (err) {
                setError('Error fetching data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        } else {
            setLoading(false); // If no token, don't attempt fetch
        }
    }, [token, refreshAccessToken]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container my-5">
      <h1 className="text-center mb-4">My Account</h1>

      {userProfile && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="profile-card">
              <Card.Body>
                <Card.Title className="text-center">Profile Information</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Username:</strong> {userProfile.username}</ListGroup.Item>
                  <ListGroup.Item><strong>Email:</strong> {userProfile.email}</ListGroup.Item>
                  <ListGroup.Item><strong>Elo Rating:</strong> {userProfile.score}</ListGroup.Item>
                  <ListGroup.Item><strong>Joined:</strong> {new Date(userProfile.date_joined).toLocaleDateString()}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="game-stats-card">
              <Card.Body>
                <Card.Title className="text-center">Game Statistics</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Wins:</strong> {userProfile.wins}</ListGroup.Item>
                  <ListGroup.Item><strong>Losses:</strong> {userProfile.losses}</ListGroup.Item>
                  <ListGroup.Item><strong>Draws:</strong> {userProfile.draws}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="daily-stats-card">
              <Card.Body>
                <Card.Title className="text-center">Daily Stats</Card.Title>
                <p>Work in Progress...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <h2 className="text-center">Game History</h2>
      {gameHistory.length > 0 ? (
        <div className="card-container">
          {gameHistory.map((game, index) => (
            <Card key={index} className="game-history-card mb-3">
              <Card.Header>Game {index + 1}</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>White Player:</strong> {game.white_player}</ListGroup.Item>
                  <ListGroup.Item><strong>Black Player:</strong> {game.black_player}</ListGroup.Item>
                  <ListGroup.Item><strong>Result:</strong> {game.result}</ListGroup.Item>
                  <ListGroup.Item><strong>Played as:</strong> {game.color_played}</ListGroup.Item>
                  <ListGroup.Item><strong>Opponent:</strong> {game.opponent}</ListGroup.Item>
                  <ListGroup.Item><strong>Game Date:</strong> {new Date(game.game_date).toLocaleDateString()}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p>No games played yet.</p>
      )}
    </div>
  );
};

export default MyAccount;
