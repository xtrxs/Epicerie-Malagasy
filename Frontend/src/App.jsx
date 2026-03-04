// import { useState, useEffect } from "react"

// const API_BASE = "http://localhost:5000/api"

// function useProduits() {
//   const [produits, setProduits] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const fetchProduits = async () => {
//     // TODO : compléter cette fonction
//     setLoading(true)
//     try {
//       // ...fetch...
//        const response = await fetch(`${API_BASE}/produits`);

//       // vérifier si erreur serveur
//       if (!response.ok) {
//         throw new Error("Impossible de récupérer les produits");
//       }

//       // convertir en JSON
//       const data = await response.json();

//       // sauvegarder dans le state
//       setProduits(data);
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchProduits()
//   }, [])

//   return { produits, loading, error, refetch: fetchProduits }
// }

// function FormulaireProduit({ produit = null, onSuccess, onCancel }) {
//   const [form, setForm] = useState({
//     nom: produit?.nom || "",
//     categorie: produit?.categorie || "",
//     prix: produit?.prix || "",
//     prix_achat: produit?.prix_achat || "",
//     stock: produit?.stock || "",
//     unite: produit?.unite || "kg",
//   });
//   useEffect(() => {
//   if (produit) {
//     setForm({
//       nom: produit.nom || "",
//       categorie: produit.categorie || "",
//       prix: produit.prix || "",
//       prix_achat: produit.prix_achat || "",
//       stock: produit.stock || "",
//       unite: produit.unite || "kg",
//     });
//   }
// }, [produit]);

//   const [envoi, setEnvoi] = useState(false);
//   const [erreur, setErreur] = useState(null);

//   const categories = ["Céréales","Huiles","Épicerie","Boissons","Hygiène","Produits laitiers","Conserves","Autre"];
//   const unites = ["kg","litre","pièce","paquet","boîte","sachet"];

//   const addProduit = async (produitData) => {
//     const res = await fetch(`${API_BASE}/produits`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(produitData),
//     });

//     if (!res.ok) throw new Error("Erreur ajout");

//     return await res.json();
//   };

//   const updateProduit = async (id, produitData) => {
//     const res = await fetch(`${API_BASE}/produits/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(produitData),
//     });

//     if (!res.ok) throw new Error("Erreur modification");

//     return await res.json();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setEnvoi(true);
//     setErreur(null);

//     try {
//       const produitData = {
//         nom: form.nom,
//         categorie: form.categorie,
//         prix: Number(form.prix),
//         prix_achat: Number(form.prix_achat),
//         stock: Number(form.stock),
//         unite: form.unite,
//       };
//       let data;
//       if (produit) {
//         data = await updateProduit(produit.id, produitData);
//       }
//       else {
//         data = await addProduit(produitData);
//       }
//       onSuccess(data);

//     } catch (err) {
//       setErreur(err.message);
//     } finally {
//       setEnvoi(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="formulaire-produit">
//       <h3>{produit ? "✏️ Modifier le produit" : "➕ Nouveau produit"}</h3>

//       {erreur && <div className="alerte-erreur">{erreur}</div>}

//       <div className="champ">
//         <label>Nom du produit *</label>
//         <input
//           type="text"
//           value={form.nom}
//           onChange={(e) => setForm({ ...form, nom: e.target.value })}
//           placeholder="Ex: Riz vary be"
//           required
//         />
//       </div>

//       <div className="champ">
//         <label>Catégorie *</label>
//         <select
//           value={form.categorie}
//           onChange={(e) => setForm({ ...form, categorie: e.target.value })}
//           required
//         >
//           <option key="default" value="">-- Choisir --</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>
//       </div>

//       <div className="ligne-deux">
//         <div className="champ">
//           <label>Prix de vente (Ar) *</label>
//           <input
//             type="number"
//             value={form.prix}
//             onChange={(e) => setForm({ ...form, prix: e.target.value })}
//             placeholder="Ex: 2500"
//             min="1"
//             required
//           />
//         </div>

//         <div className="champ">
//           <label>Prix d'achat (Ar) *</label>
//           <input
//             type="number"
//             value={form.prix_achat}
//             onChange={(e) => setForm({ ...form, prix_achat: e.target.value })}
//             placeholder="Ex: 1800"
//             min="0"
//             required
//           />
//         </div>
//       </div>

//       <div className="champ">
//         <label>Stock *</label>
//           <input
//             type="number"
//             value={form.stock}
//             onChange={(e) => setForm({ ...form, stock: e.target.value })}
//             placeholder="Ex: 100"
//             min="0"
//             required
//           />
//       </div>

//       <div className="champ">
//         <label>Unité *</label>
//         <select
//           value={form.unite}
//           onChange={(e) => setForm({ ...form, unite: e.target.value })}
//         >
//           {unites.map((u) => <option key={u} value={u}>{u}</option>)}
//         </select>
//       </div>

//       <div className="boutons-form">
//         <button type="submit" className="btn-primaire" disabled={envoi}>
//           {envoi ? "Enregistrement..." : produit ? "Modifier" : "Ajouter"}
//         </button>
//         <button type="button" className="btn-secondaire" onClick={onCancel}>
//           Annuler
//         </button>
//       </div>
//     </form>
    
//   )
// }

// // Ventes //

// function FormulaireVente({ produits = [], onSuccess }) {
//   const [form, setForm] = useState({ produit_id: "", quantite: 1 });
//   const [envoi, setEnvoi] = useState(false);
//   const [succes, setSucces] = useState(null);
//   const [erreur, setErreur] = useState(null);

//   // Convertir form.produit_id en nombre pour trouver le produit
//   const produitSelectionne = produits?.find(
//   (p) => String(p?.id) === String(form.produit_id)
// );
//   const total = produitSelectionne
//   ? Number(produitSelectionne.prix ?? 0) * Number(form.quantite)
//   : 0;

//   const venteProduit = async (produitData) => {
//     const res = await fetch("http://localhost:5000/api/ventes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(produitData),
//     });

//     if (!res.ok) throw new Error("Erreur ajout");
//     return await res.json();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setEnvoi(true);
//     setErreur(null);
//     setSucces(null);

//     try {
//       const data = await venteProduit({
//         produit_id: Number(form.produit_id),
//         quantite: Number(form.quantite),
//       });

//       setSucces(`✅ Vente enregistrée ! Total : ${total.toLocaleString()} Ar`);
//       setForm({ produit_id: "", quantite: 1 });

//       if (onSuccess) onSuccess(data);
//     } catch (err) {
//       setErreur("❌ Une erreur est survenue lors de la vente");
//     } finally {
//       setEnvoi(false);
//     }
//   };

//   // Filtrer uniquement les produits en stock
//   const produitsEnStock = Array.isArray(produits)
//   ? produits.filter((p) => Number(p.stock ?? 0) > 0)
//   : [];

//   return (
//     <form onSubmit={handleSubmit} className="formulaire-vente">
//       <h3>🛒 Enregistrer une vente</h3>

//       {succes && <div className="alerte-succes">{succes}</div>}
//       {erreur && <div className="alerte-erreur">{erreur}</div>}

//       <div className="champ">
//         <label>Produit *</label>
//         <select
//           value={form.produit_id}
//           onChange={(e) =>
//             setForm({ ...form, produit_id: e.target.value })
//           }
//           required
//         >
//           <option value="">-- Choisir un produit --</option>

//           {produitsEnStock.map((p, index) => (
//             <option
//               key={`produit-${p.id}`}
//               value={String(p.id)}
//             >
//               {p.nom ?? "Sans nom"} — {(p.prix ?? 0).toLocaleString()} Ar
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="champ">
//         <label>Quantité *</label>
//         <input
//           type="number"
//           value={form.quantite}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               quantite: parseInt(e.target.value) || 1,
//             })
//           }
//           min="1"
//           max={produitSelectionne?.stock || 9999}
//           required
//         />
//       </div>

//       {produitSelectionne && (
//         <div className="apercu-total">
//           💰 Total : <strong>{total.toLocaleString()} Ar</strong>
//         </div>
//       )}

//       <button
//         type="submit"
//         className="btn-vente"
//         disabled={envoi || !form.produit_id}
//       >
//         {envoi ? "Traitement..." : "Confirmer la vente"}
//       </button>
//     </form>
//   );
// }

// function HistoriqueVentes() {
//   const [ventes, setVentes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [erreur, setErreur] = useState(null)

//   const fetchVentes = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch("http://localhost:5000/api/ventes")
//       if (!res.ok) throw new Error("Erreur chargement ventes")
//       const data = await res.json()
//       console.log("VENTES API:", data);
//       setVentes(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setErreur("Impossible de charger les ventes")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       await fetchVentes();
//     };

//     if (mounted) load();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) return <p>Chargement des ventes...</p>
//   if (erreur) return <p style={{ color: "red" }}>{erreur}</p>

//   return (
//     <div className="panel">
//       <div className="hh">
//         <h3>📋 Historique des ventes</h3>
//       </div>

//       <div className="">
//         {ventes.length === 0 ? (
//           <p>Aucune vente enregistrée.</p>
//         ) : (
//           <table border="1" cellPadding="8">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Produit</th>
//                 <th>Quantité</th>
//                 <th>Total (Ar)</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ventes.map((vente) => (
//                 <tr key={`vente-${vente.id || vente.date_vente}`}>
//                   <td>{vente.id}</td>
//                   <td>{vente.produit}</td>
//                   <td>{vente.quantite}</td>
//                   <td>{vente.total}</td>
//                   {/* <td>
//                     {new Date(vente.date_vente).toLocaleDateString("fr-FR", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </td> */}
//                   <td>
//                     {vente.date_vente
//                       ? new Date(vente.date_vente).toLocaleString("fr-FR")
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   )
  
// }

// // ============================================================
// // TODO EXERCICE FRONTEND 4 : Compléter TableauDeBord
// // Afficher les stats retournées par GET /api/dashboard
// // ============================================================

// function TableauDeBord() {
//   const [stats, setStats] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // TODO : fetch GET /api/dashboard et mettre à jour stats
//   }, [])

//   if (loading) return <div className="chargement">Chargement des statistiques...</div>
//   if (!stats) return null

//   return (
//     <div className="tableau-de-bord">
//       <h3>📊 Tableau de bord</h3>
//       {/* TODO : afficher les stats (nb produits, ruptures, CA total, etc.) */}
//     </div>
//   )
// }


// // ============================================================
// // COMPOSANT CARTE PRODUIT
// // ============================================================
// function CarteProduit({ produit, onEdit, onDelete, onVendre }) {
//   const estEnRupture = produit.stock === 0
//   const stockFaible = produit.stock > 0 && produit.stock < 10

//   return (
//     <div className={`carte-produit ${estEnRupture ? "rupture" : ""} ${stockFaible ? "stock-faible" : ""}`}>
//       <div className="carte-entete">
//         <span className="badge-categorie">{produit.categorie}</span>
//         {estEnRupture && <span className="badge-rupture">Rupture</span>}
//         {stockFaible && <span className="badge-faible">Stock faible</span>}
//       </div>
//       <h4 className="carte-nom">{produit.nom}</h4>
//       <div className="carte-prix">{produit.prix.toLocaleString()} Ar<span>/{produit.unite}</span></div>
//       <div className="carte-stock">
//         📦 Stock : <strong>{produit.stock} {produit.unite}</strong>
//       </div>
//       <div className="carte-actions">
//         <button onClick={() => onVendre(produit)} className="btn-vendre" disabled={estEnRupture}>
//           🛒 Vendre
//         </button>
//         <button onClick={() => onEdit(produit)} className="btn-edit">✏️</button>
//         <button onClick={() => onDelete(produit.id)} className="btn-delete">🗑️</button>
//       </div>
//     </div>
//   )
// }

// // ============================================================
// // COMPOSANT PRINCIPAL
// // ============================================================
// export default function App() {
//   const { produits, loading, error, refetch } = useProduits()
//   const [vue, setVue] = useState("produits") // "produits" | "ventes" | "dashboard"
//   const [modal, setModal] = useState(null) // null | "ajouter" | { produit }
//   const [recherche, setRecherche] = useState("")
//   const [categorieFiltre, setCategorieFiltre] = useState("")

//   const categories = [...new Set(produits.map((p) => p.categorie))]

//   const produitsFiltres = produits.filter((p) => {
//     const matchRecherche = p.nom?.toLowerCase().includes(recherche.toLowerCase())
//     const matchCategorie = !categorieFiltre || p.categorie === categorieFiltre
//     return matchRecherche && matchCategorie
//   })
//     // TODO EXERCICE : appeler DELETE /api/produits/:id puis refetch()
//   const handleDelete = async (id) => {
//   try {
//     const res = await fetch(`${API_BASE}/produits/${id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       throw new Error("Erreur suppression");
//     }

//     // ✅ recharge la liste après suppression
//     refetch();

//   } catch (error) {
//     console.error(error);
//   }
// };

//   const handleSucces = () => {
//     setModal(null)
//     refetch()
//   }

//   const [refresh, setRefresh] = useState(0)

//   // console.log("PRODUITS APP:", produits);

//   return (
//     <div className="app">
//       {/* HEADER */}
//       <header className="header">
//         <div className="header-gauche">
//           <span className="logo">🌿</span>
//           <div>
//             <h1>Épicerie Malagasy</h1>
//             <p>Système de gestion des stocks</p>
//           </div>
//         </div>
//         <nav className="nav">
//           <button className={vue === "produits" ? "actif" : ""} onClick={() => setVue("produits")}>
//             📦 Produits
//           </button>
//           <button className={vue === "ventes" ? "actif" : ""} onClick={() => setVue("ventes")}>
//             🛒 Ventes
//           </button>
//           <button className={vue === "dashboard" ? "actif" : ""} onClick={() => setVue("dashboard")}>
//             📊 Dashboard
//           </button>
//         </nav>
//       </header>

//       <main className="main">
//         {/* VUE PRODUITS */}
//         {vue === "produits" && (
//           <>
//             <div className="barre-outils">
//               <input
//                 type="text"
//                 placeholder="🔍 Rechercher un produit..."
//                 value={recherche}
//                 onChange={(e) => setRecherche(e.target.value)}
//                 className="champ-recherche"
//               />
//               <select
//                 value={categorieFiltre}
//                 onChange={(e) => setCategorieFiltre(e.target.value)}
//                 className="filtre-categorie"
//               >
//                 <option key="default" value="">Toutes les catégories</option>
//                 {categories.map((c) => <option key={c} value={c}>{c}</option>)}
//               </select>
//               <button className="btn-ajouter" onClick={() => setModal("ajouter")}>
//                 + Ajouter un produit
//               </button>
//             </div>

//             {loading && <div className="chargement">Chargement des produits...</div>}
//             {error && <div className="alerte-erreur">Erreur : {error}</div>}

//             <div className="grille-produits">
//               {produitsFiltres.map((p) => (
//                 <CarteProduit
//                   key={p.id}
//                   produit={p}
//                   onEdit={(produit) => setModal({ produit })}
//                   onDelete={handleDelete}
//                   onVendre={(produit) => {
//                     setModal({ vente: true, produit })
//                   }}
//                 />
//               ))}
//               {!loading && produitsFiltres.length === 0 && (
//                 <p className="vide">Aucun produit trouvé.</p>
//               )}
//             </div>
//           </>
//         )}

//         {/* VUE VENTES */}
//         {vue === "ventes" && (
//           <div className="vue-ventes">
//             <FormulaireVente
//               produits={produits} 
//               onSuccess={() => setRefresh(prev => prev + 1)}
//             />
//             <HistoriqueVentes key={refresh} />
//           </div>
//         )}

//         {/* VUE DASHBOARD */}
//         {vue === "dashboard" && <TableauDeBord />}
//       </main>

//       {/* MODAL */}
//       {modal && (
//         <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
//           <div className="modal">
//             {modal === "ajouter" && (
//               <FormulaireProduit onSuccess={handleSucces} onCancel={() => setModal(null)} />
//             )}
//             {modal?.produit && !modal?.vente && (
//               <FormulaireProduit
//                 produit={modal.produit}
//                 onSuccess={handleSucces}
//                 onCancel={() => setModal(null)}
//               />
//             )}
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }




import { Routes, Route, Navigate } from "react-router-dom";
import ProduitsPage from "./pages/ProduitsPage.jsx";
import Header from "./components/Header.jsx";
import VentesPage from "./pages/VentesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Navigate to="/produits" replace />} />
        <Route path="/produits" element={<ProduitsPage />} />
        <Route path="/ventes" element={<VentesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}>Page non trouvée</div>} />
      </Routes>
    </>
  );
}
