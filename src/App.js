import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import GamePage from "./components/GamePage";
import MyAccount from "./components/MyAccount";
import Footer from "./components/Footer"
import Register from "./components/Register";
import Leaderboard from "./components/Leaderboard";



function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <Footer />
      </div>
  );
}

export default App;
