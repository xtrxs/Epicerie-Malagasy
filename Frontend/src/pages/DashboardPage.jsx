import { useState, useEffect } from "react";

export default function TableauDeBord() {
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