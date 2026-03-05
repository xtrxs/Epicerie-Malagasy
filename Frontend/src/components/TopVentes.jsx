export default function TopVentes({ topVentes }) {

  if (!topVentes || topVentes.length === 0) {
    return <div>Aucune vente enregistrée.</div>;
  }

  return (  
    <ul>
      {topVentes.map((prod) => (
        <li key={prod.nom}>
          {prod.nom} - {prod.quantite} unités
        </li>
      ))}
    </ul>
  );
}