export default function Ruptures({ ruptures }) {
  if (!ruptures || ruptures.length === 0)
     return <div>Aucune rupture.</div>;

  return (
    <div>
      {ruptures.map((prod, idx) => (
        <div key={idx} className="rupture-item">
          <strong>{prod.nom}</strong> <br />
          {prod.categorie} - {prod.quantite} {prod.unite || "unités"}
        </div>
      ))}
    </div>
  );
}