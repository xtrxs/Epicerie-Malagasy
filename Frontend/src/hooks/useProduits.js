import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api"

export default function useProduits() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduits = async () => {
    // TODO : compléter cette fonction
    setLoading(true)
    try {
      // ...fetch...
       const response = await fetch(`${API_BASE}/produits`);

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