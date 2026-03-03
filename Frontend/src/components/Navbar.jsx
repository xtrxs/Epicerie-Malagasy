// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

import { useState } from "react"
import { Link, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const { produits, loading, error, refetch } = useProduits()
  const [vue, setVue] = useState("produits") // "produits" | "ventes" | "dashboard"
  const [modal, setModal] = useState(null) // null | "ajouter" | { produit }
  const [recherche, setRecherche] = useState("")
  const [categorieFiltre, setCategorieFiltre] = useState("")

  const categories = [...new Set(produits.map((p) => p.categorie))]

  const produitsFiltres = produits.filter((p) => {
    const matchRecherche = p.nom.toLowerCase().includes(recherche.toLowerCase())
    const matchCategorie = !categorieFiltre || p.categorie === categorieFiltre
    return matchRecherche && matchCategorie
  })
    // TODO EXERCICE : appeler DELETE /api/produits/:id puis refetch()
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/produits/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erreur suppression");
    }

    // ✅ recharge la liste après suppression
    refetch();

  } catch (error) {
    console.error(error);
  }
};

  const handleSucces = () => {
    setModal(null)
    refetch()
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-gauche">
          <span className="logo">🌿</span>
          <div>
            <h1>Épicerie Malagasy</h1>
            <p>Système de gestion des stocks</p>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">
            <button className={location.pathname === "/" && vue === "produits" ? "actif" : ""} onClick={() => setVue("produits")}>
              📦 Produits
            </button>
          </Link>
          <button className={location.pathname === "/ventes" && vue === "ventes" ? "actif" : ""} onClick={() => setVue("ventes")}>
            🛒 Ventes
          </button>
          <button className={location.pathname === "/dashboard" && vue === "dashboard" ? "actif" : ""} onClick={() => setVue("dashboard")}>
            📊 Dashboard
          </button>
        </nav>
      </header>

      <main className="main">
        {/* VUE PRODUITS */}
        {vue === "produits" && (
          <>
            <div className="barre-outils">
              <input
                type="text"
                placeholder="🔍 Rechercher un produit..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="champ-recherche"
              />
              <select
                value={categorieFiltre}
                onChange={(e) => setCategorieFiltre(e.target.value)}
                className="filtre-categorie"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn-ajouter" onClick={() => setModal("ajouter")}>
                + Ajouter un produit
              </button>
            </div>

            {loading && <div className="chargement">Chargement des produits...</div>}
            {error && <div className="alerte-erreur">Erreur : {error}</div>}

            <div className="grille-produits">
              {produitsFiltres.map((p) => (
                <CarteProduit
                  key={p.id}
                  produit={p}
                  onEdit={(produit) => setModal({ produit })}
                  onDelete={handleDelete}
                  onVendre={(produit) => {
                    setModal({ vente: true, produit })
                  }}
                />
              ))}
              {!loading && produitsFiltres.length === 0 && (
                <p className="vide">Aucun produit trouvé.</p>
              )}
            </div>
          </>
        )}

        {/* VUE VENTES */}
        {vue === "ventes" && (
          <div className="vue-ventes">
            <FormulaireVente produits={produits} onSuccess={refetch} />
            {/* TODO EXERCICE BONUS : Afficher l'historique des ventes depuis GET /api/ventes */}
          </div>
        )}

        {/* VUE DASHBOARD */}
        {vue === "dashboard" && <TableauDeBord />}
      </main>

      {/* MODAL */}
      {modal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            {modal === "ajouter" && (
              <FormulaireProduit onSuccess={handleSucces} onCancel={() => setModal(null)} />
            )}
            {modal?.produit && !modal?.vente && (
              <FormulaireProduit
                produit={modal.produit}
                onSuccess={handleSucces}
                onCancel={() => setModal(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}