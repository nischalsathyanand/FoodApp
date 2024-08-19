import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import AdminPanel from "./AdminPanel";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/admin/*" element={<AdminPanel />} /> {/* Handles nested routes */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
