import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-gauche">
        <div className="logo">🌿</div>
        <div>
          <h1>Épicerie Malagasy</h1>
          <p>Gestion des produits</p>
        </div>
      </div>

      <nav className="nav">
        <Link to="/">
          <button className={location.pathname === "/" ? "actif" : ""}>
            📦 Produits
          </button>
        </Link>

        <Link to="/ventes">
          <button className={location.pathname === "/ventes" ? "actif" : ""}>
            🛒 Ventes
          </button>
        </Link>

        <Link to="/Dashboard">
          <button className={location.pathname === "/Dashboard" ? "actif" : ""}>
            📊 Dashboard
          </button>
        </Link>
      </nav>
    </header>
  );
}