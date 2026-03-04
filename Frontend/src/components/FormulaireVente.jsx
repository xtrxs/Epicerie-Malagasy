import { useState } from "react"

export default function FormulaireVente({ produits, onSuccess }) {
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
    
  try {
      const data = await venteProduit({
        produit_id: Number(form.produit_id),
        quantite: Number(form.quantite),
      })

      setSucces(`✅ Vente enregistrée ! Total : ${total} €`)
      setForm({ produit_id: "", quantite: 1 })

      if (onSuccess) onSuccess(data)

    } catch (err) {
      setErreur("❌ Une erreur est survenue lors de la vente")
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="main">
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
    </div>
  )
}