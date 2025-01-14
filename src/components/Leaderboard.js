import React, { useState, useEffect, useContext } from 'react';
import axios from '../axios';
import { LoginContext } from '../LoginContext';
import { Card, ListGroup } from 'react-bootstrap';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, refreshAccessToken } = useContext(LoginContext); // Get token and refresh function from context

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        // Fetch leaderboard data
        const response = await axios.get('https://chessarena-fpp9.onrender.com/api/users/leaderboard/', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass token in header
          },
        });
        setLeaderboard(response.data.leaderboard);
      } catch (err) {
        // Token expired, attempt refresh
        if (err.response && err.response.status === 401) {
          await refreshAccessToken();  // Refresh token

          // Retry request after refresh
          try {
            const retryResponse = await axios.get('https://chessarena-fpp9.onrender.com/api/leaderboard/', {
              headers: {
                'Authorization': `Bearer ${token}`,  // Use refreshed token
              },
            });
            setLeaderboard(retryResponse.data.leaderboard);
          } catch (retryError) {
            setError('Error fetching leaderboard data after refreshing token');
          }
        } else {
          setError('Error fetching leaderboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token, refreshAccessToken]);  // Re-run effect when token changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="leaderboard-container">
      <h2>Top Scoring Players</h2>
      <Card className="leaderboard-card">
        <ListGroup variant="flush">
          {leaderboard.length > 0 ? (
            leaderboard.map((player, index) => (
              <ListGroup.Item key={index}>
                <strong>{index + 1}. {player.username}</strong> - Elo: {player.score}
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No players found</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
};

export default LeaderBoard;
