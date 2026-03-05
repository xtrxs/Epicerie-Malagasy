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
      <div className="dashboard">
        <div className="head">
          <div>
            <h2>📊 Tableau de bord</h2>
            <p>Vue d'ensemble en temps réel de votre épicerie</p>
          </div>
          <div className="tableau-gauche">
            <button className="btn-refresh" onClick={refresh}>↻ Actualiser</button>
          </div>
        </div>

        <div className="cards">
          <div className="card green">
            <div className="icon">📦</div>
            <StatCard title="TOTAL PRODUITS" value={data.totalProduits} subtitle="références en catalogue" color="green"/>
          </div>

          <div className="card red">
            <div className="icon">⚠️</div>
          <StatCard title="RUPTURES DE STOCK" value={data.ruptures} subtitle="produits à 0 en stock" color="red"/>
          </div>

          <div className="card orange">
            <div className="icon">📉</div>
            <StatCard title="STOCKS FAIBLES" value={data.stocksFaibles} subtitle="moins de 10 unités" color="orange"/>
          </div>

          <div className="card blue">
            <div className="icon">💰</div>
            <StatCard title="CHIFFRE D'AFFAIRES" value={`${data.chiffreAffaires} Ar`} subtitle="0 transaction" color="blue"/>
          </div>

          <div className="card purple">
            <div className="icon">🏪</div>
            <StatCard title="VALEUR DU STOCK" value={`${data.valeurStock} Ar`} subtitle="prix vente × quantités" color="purple"/>
          </div>

          <div className="card blue">
            <div className="icon">📈</div>
            <StatCard title="MARGE BRUTE TOTALE" value={`${data.margeBrute} Ar`} subtitle={`Taux : 0% du CA`} color="blue"/>
          </div>

          <div className="card orange">
            <div className="icon">🏅</div>
            <StatCard title="PRODUIT + VENDU" value={data.produitPlusVendu || "-"} subtitle="Aucune vente encore" color="orange"/>
          </div>
          
        </div>

        <div className="bottom-sections">

          <div className="panel">
            <h4>📊 Top ventes par produit</h4>
            <div className="">
              <TopVentes topVentes={data.topVentes} />
            </div>
            <div className="bar">
              <div className="bar-fill"></div>
            </div>

          </div>

          <div className="panel">
            <h4>🚨 Produits en rupture de stock</h4>
            <div className="rupture-item">
              <Ruptures ruptures={data.rupturesList} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}