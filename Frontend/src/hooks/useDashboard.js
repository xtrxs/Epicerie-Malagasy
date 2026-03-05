import { useState, useEffect } from "react";

export default function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/dashboard");

      if (!res.ok) {
        throw new Error("Erreur serveur : " + res.status);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erreur fetchDashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { data, loading, error, refresh: fetchDashboard };
}