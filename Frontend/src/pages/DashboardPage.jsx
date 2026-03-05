import useDashboard from "../hooks/useDashboard";
import StatCard from "../components/StatCard";
import TopVentes from "../components/TopVentes";
import Ruptures from "../components/Ruptures";

export default function TableauDeBord() {
  const { data, loading, refresh } = useDashboard();

  if (loading) return <div>Chargement des statistiques...</div>;
  if (!data) return <div>Impossible de récupérer les données.</div>;

  return (
    <div className="main">
      <div className="main">
       <div>
          <h3>📊 Tableau de bord</h3>
          <p>Vue d'ensemble en temps réel de votre épicerie</p>
        </div>
        <div>
          <button onClick={refresh}>Rafraîchir</button>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard title="TOTAL PRODUITS" value={data.totalProduits} subtitle="références en catalogue" color="green"/>
        <StatCard title="RUPTURES DE STOCK" value={data.ruptures} subtitle="produits à 0 en stock" color="red"/>
        <StatCard title="STOCKS FAIBLES" value={data.stocksFaibles} subtitle="moins de 10 unités" color="orange"/>
        <StatCard title="CHIFFRE D'AFFAIRES" value={`${data.chiffreAffaires} Ar`} subtitle="0 transaction" color="blue"/>
        <StatCard title="VALEUR DU STOCK" value={`${data.valeurStock} Ar`} subtitle="prix vente × quantités" color="purple"/>
        <StatCard title="MARGE BRUTE TOTALE" value={`${data.margeBrute} Ar`} subtitle={`Taux : 0% du CA`} color="blue"/>
        <StatCard title="PRODUIT + VENDU" value={data.produitPlusVendu || "-"} subtitle="Aucune vente encore" color="orange"/>
      </div>

      <div className="details-grid">
        <div className="top-ventes">
          <h4>📊 Top ventes par produit</h4>
          <TopVentes topVentes={data.topVentes} />
        </div>

        <div className="ruptures-stock">
          <h4>🚨 Produits en rupture de stock</h4>
          <Ruptures ruptures={data.rupturesList} />
        </div>
      </div>
    </div>
  );
}