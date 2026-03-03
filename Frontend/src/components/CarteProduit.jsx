export default function CarteProduit({ produit, onEdit, onDelete, onVendre }) {
  const estEnRupture = produit.stock === 0
  const stockFaible = produit.stock > 0 && produit.stock < 10

  return (
    <div className={`carte-produit ${estEnRupture ? "rupture" : ""} ${stockFaible ? "stock-faible" : ""}`}>
      <div className="carte-entete">
        <span className="badge-categorie">{produit.categorie}</span>
        {estEnRupture && <span className="badge-rupture">Rupture</span>}
        {stockFaible && <span className="badge-faible">Stock faible</span>}
      </div>
      <h4 className="carte-nom">{produit.nom}</h4>
      <div className="carte-prix">{produit.prix.toLocaleString()} Ar<span>/{produit.unite}</span></div>
      <div className="carte-stock">
        📦 Stock : <strong>{produit.stock} {produit.unite}</strong>
      </div>
      <div className="carte-actions">
        <button onClick={() => onVendre(produit)} className="btn-vendre" disabled={estEnRupture}>
          🛒 Vendre
        </button>
        <button onClick={() => onEdit(produit)} className="btn-edit">✏️</button>
        <button onClick={() => onDelete(produit.id)} className="btn-delete">🗑️</button>
      </div>
    </div>
  )
}