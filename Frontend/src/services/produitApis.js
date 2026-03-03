const API_BASE = "http://localhost:5000/api";

export const getProduits = async () => {
  const res = await fetch(`${API_BASE}/produits`);
  if (!res.ok) throw new Error("Impossible de récupérer les produits");
  return res.json();
};

export const addProduit = async (produit) => {
  const res = await fetch(`${API_BASE}/produits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produit),
  });
  if (!res.ok) throw new Error("Erreur ajout");
  return res.json();
};

export const updateProduit = async (id, produit) => {
  const res = await fetch(`${API_BASE}/produits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produit),
  });
  if (!res.ok) throw new Error("Erreur modification");
  return res.json();
};

export const deleteProduit = async (id) => {
  const res = await fetch(`${API_BASE}/produits/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur suppression");
  return res.json();
};

