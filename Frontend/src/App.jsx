import { Routes, Route, Navigate } from "react-router-dom";
import ProduitsPage from "./pages/ProduitsPage.jsx";
import Header from "./components/Header.jsx";
import VentesPage from "./pages/VentesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
 
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Navigate to="/produits" replace />} />
        <Route path="/produits" element={<ProduitsPage />} />
        <Route path="/ventes" element={<VentesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}>Page non trouvée</div>} />
      </Routes>
    </>
  );
}
