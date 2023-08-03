import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from 'react'
import { useContext } from "react";
import { AuthContext } from './context/AuthContext';







function App() {

  const { currentUser } = useContext(AuthContext)
  


  const ProtectedRoute = ({ children }) => (
    currentUser ? children : <Navigate to="/login" />
  );
  


  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/">
          <Route index element={<ProtectedRoute>
            <Home />
          </ProtectedRoute>
          }></Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>


  );
}

export default App;
