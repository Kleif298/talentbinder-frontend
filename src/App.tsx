import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Candidates from "./pages/Candidates/Candidates.tsx";
import Events from "./pages/Events/Events";
import Users from "./pages/Users/Users";
import ProtectedRoute from "./guards/ProtectedRoute";
import AdminProtectedRoute from "./guards/AdminProtectedRoute";

import "./App.css"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/candidates"
          element={
            <AdminProtectedRoute>
              <Candidates />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtectedRoute>
              <Users />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
