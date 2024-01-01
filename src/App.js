import Register from "./pages/Register/Register";
import Login from "./pages//Login/Login";
import Home from "./pages//Home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) =>
    currentUser ? children : <Navigate to="/" />;

  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/home">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>

       
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
