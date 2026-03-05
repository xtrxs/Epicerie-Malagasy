import { useState } from "react";
import useProduits from "../hooks/useProduits.js";
import FormulaireProduit from "../components/FormulaireProduit";
import CarteProduit from "../components/CarteProduit.jsx";

export default function ProduitsPage() {
  const { produits, loading, error, refetch } = useProduits();

  const [modal, setModal] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("");

  const categories = [...new Set(produits.map(p => p.categorie))];

  const produitsFiltres = produits.filter(p => {
    const matchRecherche = p.nom
      .toLowerCase()
      .includes(recherche.toLowerCase());

    const matchCategorie =
      !categorieFiltre || p.categorie === categorieFiltre;

    return matchRecherche && matchCategorie;
  });

  const handleSucces = () => {
    setModal(null);
    refetch();
  };
   console.log("PRODUITS APP:", produits);

  return (
    <div className="main">

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
            <option key="default" value="">Toutes les catégories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-ajouter" onClick={() => setModal("ajouter")}>
            + Ajouter un produit
          </button>
      </div>

      {loading && <div className="chargement">Chargement...</div>}
      {error && <div className="alerte-erreur">{error}</div>}

      <div className="grille-produits">
          {produitsFiltres.map(p => (
            <CarteProduit
              key={p.id}
              produit={p}
              onEdit={(produit) => setModal({ produit })}
            />
          ))}
        </div>

      {modal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            {modal === "ajouter" && <FormulaireProduit onSuccess={ handleSucces } onCancel={() => setModal(null)} />}
            {modal?.produit && <FormulaireProduit produit={modal.produit} onSuccess={ handleSucces } onCancel={() => setModal(null)} />}
          </div>
        </div>
      )}
    </div>
  );
}