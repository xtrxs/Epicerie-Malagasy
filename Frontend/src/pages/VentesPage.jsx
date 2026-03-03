import FormulaireVente from "../components/FormulaireVente";
import useProduits from "../hooks/useProduits";

export default function VentesPage() {
  const { produits, fetchProduits } = useProduits();

  return (
    <div className="vue-ventes">
      <FormulaireVente
        produits={produits}
        onVenteSuccess={fetchProduits}
      />
    </div>
  );
}