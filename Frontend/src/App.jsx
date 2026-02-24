import { useState, useEffect } from "react"

// ============================================================
// CONFIG API
// ============================================================
const API_BASE = "http://localhost:5000/api"

// ============================================================
// TODO EXERCICE FRONTEND 1 : Créer ce hook personnalisé
// useProduits() doit :
//   - Récupérer les produits via GET /api/produits
//   - Retourner { produits, loading, error, refetch }
//
// INDICE : utilisez useEffect + fetch
// ============================================================
function useProduits() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduits = async () => {
    // TODO : compléter cette fonction
    setLoading(true)
    try {
      // ...fetch...
       const response = await fetch("http://localhost:5000/api/produits");

      // vérifier si erreur serveur
      if (!response.ok) {
        throw new Error("Impossible de récupérer les produits");
      }

      // convertir en JSON
      const data = await response.json();

      // sauvegarder dans le state
      setProduits(data);
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduits()
  }, [])

  return { produits, loading, error, refetch: fetchProduits }
}

// ============================================================
// TODO EXERCICE FRONTEND 2 : Compléter ce composant
// FormulaireProduit doit :
//   - Afficher un formulaire avec : nom, categorie, prix, stock, unite
//   - En mode "ajout" : appeler POST /api/produits
//   - En mode "édition" (prop produit fourni) : appeler PUT /api/produits/:id
//   - Après succès : appeler onSuccess()
// ============================================================
function FormulaireProduit({ produit = null, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nom: produit?.nom || "",
    categorie: produit?.categorie || "",
    prix: produit?.prix || "",
    prix_achat: produit?.prix_achat || "",
    stock: produit?.stock || "",
    unite: produit?.unite || "kg",
  });

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(null);

  const categories = ["Céréales","Huiles","Épicerie","Boissons","Hygiène","Produits laitiers","Conserves","Autre"];
  const unites = ["kg","litre","pièce","paquet","boîte","sachet"];

  const addProduit = async (produitData) => {
    const res = await fetch("http://localhost:5000/api/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produitData),
    });

    if (!res.ok) throw new Error("Erreur ajout");

    return await res.json();
  };

  const updateProduit = async (id, produitData) => {
    const res = await fetch(`${"http://localhost:5000/api/produits"}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produitData),
    });

    if (!res.ok) throw new Error("Erreur modification");

    return await res.json();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setEnvoi(true);
    setErreur(null);

    try {
      const produitData = {
        nom: form.nom,
        categorie: form.categorie,
        prix: Number(form.prix),
        prix_achat: Number(form.prix_achat),
        stock: Number(form.stock),
        unite: form.unite,
      };
      let data;
      if (produit) {
        data = await updateProduit(produit.id, produitData);
      }
      else {
        data = await addProduit(produitData);
      }
      onSuccess(data);

    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };
    // TODO : compléter la logique d'envoi (POST ou PUT selon le mode)
    // Penser à convertir prix et stock en nombres
    // Appeler onSuccess() si tout se passe bien
    // await fetch("http://localhost:5000/api/produits", {
    //   method: "POST",
    //   headers: {
    //   "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     nom: "nom",
    //     prix: "prix"
    //   })
    // });
  return (
    <form onSubmit={handleSubmit} className="formulaire-produit">
      <h3>{produit ? "✏️ Modifier le produit" : "➕ Nouveau produit"}</h3>

      {erreur && <div className="alerte-erreur">{erreur}</div>}

      <div className="champ">
        <label>Nom du produit *</label>
        <input
          type="text"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          placeholder="Ex: Riz vary be"
          required
        />
      </div>

      <div className="champ">
        <label>Catégorie *</label>
        <select
          value={form.categorie}
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
          required
        >
          <option value="">-- Choisir --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="ligne-deux">
        <div className="champ">
          <label>Prix de vente (Ar) *</label>
          <input
            type="number"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            placeholder="Ex: 2500"
            min="1"
            required
          />
        </div>

        <div className="champ">
          <label>Prix d'achat (Ar) *</label>
          <input
            type="number"
            value={form.prix_achat}
            onChange={(e) => setForm({ ...form, prix_achat: e.target.value })}
            placeholder="Ex: 1800"
            min="0"
            required
          />
        </div>
      </div>

      <div className="champ">
        <label>Stock *</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Ex: 100"
            min="0"
            required
          />
      </div>

      <div className="champ">
        <label>Unité *</label>
        <select
          value={form.unite}
          onChange={(e) => setForm({ ...form, unite: e.target.value })}
        >
          {unites.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="boutons-form">
        <button type="submit" className="btn-primaire" disabled={envoi}>
          {envoi ? "Enregistrement..." : produit ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" className="btn-secondaire" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
    
  )
}

// ============================================================
// TODO EXERCICE FRONTEND 3 : Compléter FormulaireVente
// - Sélectionner un produit dans la liste
// - Saisir une quantité
// - Appeler POST /api/ventes
// - Afficher le total calculé en temps réel
// - Afficher un message de succès avec le total de la vente
// ============================================================
function FormulaireVente({ produits, onSuccess }) {
  const [form, setForm] = useState({ produit_id: "", quantite: 1 })
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(null)
  const [erreur, setErreur] = useState(null)

  const produitSelectionne = produits.find((p) => p.id === form.produit_id)
  const total = produitSelectionne ? produitSelectionne.prix * form.quantite : 0

  const venteProduit = async (produitData) => {
    const res = await fetch("http://localhost:5000/api/ventes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produitData),
    });

    if (!res.ok) throw new Error("Erreur ajout");

    return await res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnvoi(true)
    setErreur(null)
    setSucces(null)


    // TODO : envoyer la vente à POST /api/ventes
    // Afficher le message de succès avec le total

    setEnvoi(false)
  }

  return (
    <form onSubmit={handleSubmit} className="formulaire-vente">
      <h3>🛒 Enregistrer une vente</h3>

      {succes && <div className="alerte-succes">{succes}</div>}
      {erreur && <div className="alerte-erreur">{erreur}</div>}

      <div className="champ">
        <label>Produit *</label>
        <select
          value={form.produit_id}
          onChange={(e) => setForm({ ...form, produit_id: e.target.value })}
          required
        >
          <option value="">-- Choisir un produit --</option>
          {produits
            .filter((p) => p.stock > 0)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} — {p.prix.toLocaleString()} Ar/{p.unite} (stock: {p.stock})
              </option>
            ))}
        </select>
      </div>

      <div className="champ">
        <label>Quantité *</label>
        <input
          type="number"
          value={form.quantite}
          onChange={(e) => setForm({ ...form, quantite: parseInt(e.target.value) || 1 })}
          min="1"
          max={produitSelectionne?.stock || 9999}
          required
        />
      </div>

      {produitSelectionne && (
        <div className="apercu-total">
          💰 Total : <strong>{total.toLocaleString()} Ar</strong>
        </div>
      )}

      <button type="submit" className="btn-vente" disabled={envoi || !form.produit_id}>
        {envoi ? "Traitement..." : "Confirmer la vente"}
      </button>
    </form>
  )
}

// ============================================================
// TODO EXERCICE FRONTEND 4 : Compléter TableauDeBord
// Afficher les stats retournées par GET /api/dashboard
// ============================================================
function TableauDeBord() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO : fetch GET /api/dashboard et mettre à jour stats
  }, [])

  if (loading) return <div className="chargement">Chargement des statistiques...</div>
  if (!stats) return null

  return (
    <div className="tableau-de-bord">
      <h3>📊 Tableau de bord</h3>
      {/* TODO : afficher les stats (nb produits, ruptures, CA total, etc.) */}
    </div>
  )
}

// ============================================================
// COMPOSANT CARTE PRODUIT
// ============================================================
function CarteProduit({ produit, onEdit, onDelete, onVendre }) {
  const estEnRupture = produit.stock === 0
  const stockFaible = produit.stock > 0 && produit.stock < 10

  return (
    <div className={`carte-produit ${estEnRupture ? "rupture" : ""} ${stockFaible ? "stock-faible" : ""}`}>
      <div className="carte-entete">
        <span className="badge-categorie">{produit.categorie}</span>
        {estEnRupture && <span className="badge-rupture">Rupture</span>}
        {stockFaible && <span className="badge-faible">Stock faible</span>}
      </div>
      <h4 className="carte-nom">{produit.nom}</h4>
      <div className="carte-prix">{produit.prix.toLocaleString()} Ar<span>/{produit.unite}</span></div>
      <div className="carte-stock">
        📦 Stock : <strong>{produit.stock} {produit.unite}</strong>
      </div>
      <div className="carte-actions">
        <button onClick={() => onVendre(produit)} className="btn-vendre" disabled={estEnRupture}>
          🛒 Vendre
        </button>
        <button onClick={() => onEdit(produit)} className="btn-edit">✏️</button>
        <button onClick={() => onDelete(produit.id)} className="btn-delete">🗑️</button>
      </div>
    </div>
  )
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function App() {
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

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return
    // TODO EXERCICE : appeler DELETE /api/produits/:id puis refetch()
  }

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
          <button className={vue === "produits" ? "actif" : ""} onClick={() => setVue("produits")}>
            📦 Produits
          </button>
          <button className={vue === "ventes" ? "actif" : ""} onClick={() => setVue("ventes")}>
            🛒 Ventes
          </button>
          <button className={vue === "dashboard" ? "actif" : ""} onClick={() => setVue("dashboard")}>
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

