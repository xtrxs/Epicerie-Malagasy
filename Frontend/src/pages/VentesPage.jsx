import FormulaireVente from "../components/FormulaireVente";
import HistoriqueVentes from "../components/HistoriqueVentes";
import useProduits from "../hooks/useProduits";
import { useState } from "react";

export default function VentesPage() {
  const { produits, fetchProduits } = useProduits();
  const [refresh] = useState(0)
  return (
    <div className="vue-ventes">
      <FormulaireVente
        produits={produits}
        onVenteSuccess={fetchProduits}
      />
      <div className="main">
        <HistoriqueVentes key={refresh} />
      </div>
      
    </div>
  );
}