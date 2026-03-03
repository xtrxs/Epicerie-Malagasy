import { useEffect, useState } from "react"

function HistoriqueVentes() {
  const [ventes, setVentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  const fetchVentes = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/ventes")
      if (!res.ok) throw new Error("Erreur chargement ventes")
      const data = await res.json()
      setVentes(data)
    } catch (err) {
      setErreur("Impossible de charger les ventes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVentes()
  }, [])

  if (loading) return <p>Chargement des ventes...</p>
  if (erreur) return <p style={{ color: "red" }}>{erreur}</p>

  return (
    <div>
      <h2>Historique des ventes</h2>

      {ventes.length === 0 ? (
        <p>Aucune vente enregistrée.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Total (€)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente) => (
              <tr key={vente.id}>
                <td>{vente.id}</td>
                <td>{vente.produit_nom}</td>
                <td>{vente.quantite}</td>
                <td>{vente.total}</td>
                <td>
                  {new Date(vente.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default HistoriqueVentes