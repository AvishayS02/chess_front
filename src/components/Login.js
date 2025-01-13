import React, { useState, useContext } from 'react';
import axios from '../axios'; // Ensure axios is correctly set up
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../LoginContext'; // Import the LoginContext

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(LoginContext); // Access login function from context

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading

        try {
            // Send login request to your Django backend
            console.log('Sending login request with:', { username, password });
            const response = await axios.post('https://chessarena-fpp9.onrender.com/api/users/login/', {
                username,
                password
            });

            console.log('Login response:', response.data);

            // Check if the response contains tokens
            if (response.data.access && response.data.refresh) {
                // Save JWT tokens to localStorage
                const { access, refresh } = response.data;
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);

                // Store the username in localStorage
                localStorage.setItem('username', username);

                // Update login state through context
                login(access, refresh, username); // Pass tokens and username to the context

                // Redirect after successful login
                navigate('/'); // Redirect to home page or another page
            } else {
                throw new Error('Invalid response from backend.');
            }
        } catch (error) {
            console.error('Login error:', error);  // Log error to console for debugging
            setError('Invalid credentials or an error occurred'); // Set error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login to Your Account</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
