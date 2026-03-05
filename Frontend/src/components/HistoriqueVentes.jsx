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
      console.log("VENTES API:", data);
      setVentes(Array.isArray(data) ? data : []);
    } catch (err) {
      setErreur("Impossible de charger les ventes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await fetchVentes();
    };

    if (mounted) load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Chargement des ventes...</p>
  if (erreur) return <p style={{ color: "red" }}>{erreur}</p>

  return (
    <div className="panel">
      <div className="hh">
        <h3>📋 Historique des ventes</h3>
      </div>

      <div className="">
        {ventes.length === 0 ? (
          <p>Aucune vente enregistrée.</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Total (Ar)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ventes.map((vente) => (
                <tr key={`vente-${vente.id || vente.date_vente}`}>
                  <td>{vente.id}</td>
                  <td>{vente.produit}</td>
                  <td>{vente.quantite}</td>
                  <td>{vente.total}</td>
                  <td>
                    {vente.date_vente
                      ? new Date(vente.date_vente).toLocaleString("fr-FR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
  
}

export default HistoriqueVentes