import { useState, useEffect } from "react"
const API_BASE = "http://localhost:5000/api";

export default function FormulaireProduit({ produit = null, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nom: produit?.nom || "",
    categorie: produit?.categorie || "",
    prix: produit?.prix || "",
    prix_achat: produit?.prix_achat || "",
    stock: produit?.stock || "",
    unite: produit?.unite || "kg",
  });
  useEffect(() => {
  if (produit) {
    setForm({
      nom: produit.nom || "",
      categorie: produit.categorie || "",
      prix: produit.prix || "",
      prix_achat: produit.prix_achat || "",
      stock: produit.stock || "",
      unite: produit.unite || "kg",
    });
  }
}, [produit]);

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(null);

  const categories = ["Céréales","Huiles","Épicerie","Boissons","Hygiène","Produits laitiers","Conserves","Autre"];
  const unites = ["kg","litre","pièce","paquet","boîte","sachet"];

  const addProduit = async (produitData) => {
    const res = await fetch(`${API_BASE}/produits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produitData),
    });

    if (!res.ok) throw new Error("Erreur ajout");

    return await res.json();
  };

  const updateProduit = async (id, produitData) => {
    const res = await fetch(`${API_BASE}/produits/${id}`, {
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
          <option key="default" value="">-- Choisir --</option>
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