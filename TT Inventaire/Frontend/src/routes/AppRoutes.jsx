import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { default as Materiels, MaterielDetails } from '../pages/Materiels';
import Agents from '../pages/Agents';
import Bureaux from '../pages/Bureaux';
import Stock from '../pages/Stock';
import { Inventaires, InventaireDetails } from '../pages/Inventaires';
import Mouvements from '../pages/Mouvements';
import Rapports from '../pages/Rapports';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/materiels"
        element={
          <ProtectedRoute>
            <Materiels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/materiels/:id"
        element={
          <ProtectedRoute>
            <MaterielDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <Agents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bureaux"
        element={
          <ProtectedRoute>
            <Bureaux />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock"
        element={
          <ProtectedRoute>
            <Stock />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventaires"
        element={
          <ProtectedRoute>
            <Inventaires />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventaires/:id"
        element={
          <ProtectedRoute>
            <InventaireDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mouvements"
        element={
          <ProtectedRoute>
            <Mouvements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rapports"
        element={
          <ProtectedRoute>
            <Rapports />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
