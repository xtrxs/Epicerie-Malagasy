import { useState, useEffect } from "react";
import { getProduits } from "./services/produitsApi";

export default function useProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getProduits();
      setProduits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { produits, loading, error, refetch, setProduits };
}