from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# ============================================================
# BASE DE DONNÉES SIMULÉE (remplacer par SQLite ou PostgreSQL)
# ============================================================

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="gestion_stocks"
)
cursor = db.cursor(dictionary=True, buffered=True)

produits = []
ventes = []

# ============================================================
# ROUTES PRODUITS
# ============================================================

@app.route("/api/produits", methods=["GET"])
def get_produits():
    categorie = request.args.get("categorie")
    recherche = request.args.get("recherche")

    sql = "SELECT * FROM produits WHERE 1=1"
    values = []

    if categorie:
        sql += " AND categorie LIKE %s"
        values.append(f"%{categorie}%")

    if recherche:
        sql += " AND nom LIKE %s"
        values.append(f"%{recherche}%")

    cursor.execute(sql, values)
    resultat = cursor.fetchall()

    return jsonify(resultat), 200


@app.route("/api/produits/<string:produit_id>", methods=["GET"])
def get_produit(produit_id):
    # """
    # TODO EXERCICE 2 :
    # Retourner un produit par son ID.
    # Retourner une erreur 404 si non trouvé.
    # """
    # TODO : compléter cette fonction
    produit = next(
        (p for p in produits if p["id"] == produit_id), None
    )

    if produit is None:
        return jsonify({"error": "Produit non trouve"}), 404
    pass

# @app.route("/api/produits", methods=["POST"])
# def ajouter_produit():
#     # TODO EXERCICE 3 :
#     # Ajouter un nouveau produit.
#     # Données attendues (JSON) :
#     #   - nom (obligatoire)
#     #   - categorie (obligatoire)
#     #   - prix (obligatoire, > 0)
#     #   - prix_achat (obligatoire, >= 0 et < prix)
#     #   - stock (obligatoire, >= 0)
#     #   - unite (obligatoire)

#     # Retourner 201 avec le produit créé, ou 400 si données invalides.
    
#     # Récupérer JSON envoyé
#     data = request.get_json()
    
#     # TODO : valider les données
#     # TODO : créer le produit avec un id unique (uuid)
#     # TODO : ajouter à la liste et retourner 201

#     #Verifications des champs obligatoires
#     if not data or "nom" not in data:
#         return jsonify({"error": "Nom requis"}), 400
#     if not data or "categorie" not in data:
#         return jsonify({"error": "Categorie requis"}), 400
#     if not data or "prix" not in data:
#         return jsonify({"error": "Prix requis"}), 400
#     if not data or "prix_achat" not in data:
#         return jsonify({"error": "Prix_achat requis"}), 400
#     if not data or "stock" not in data:
#         return jsonify({"error": "Nombre de stock requis"}), 400
#     if not data or "unite" not in data:
#         return jsonify({"error": "Unite requis"}), 400

#     #Recuperations des valeurs avec défaut
#     nom = data["nom"]
#     categorie = data.get("categorie", "")
#     prix = data.get("prix", 0)
#     prix_achat = data.get("prix_achat", 0)
#     stock = data.get("stock", 0)
#     unite = data.get("unite", "")

#     # Validations
#     if prix < 0:
#         return jsonify({"error": "Prix doit être positif"}), 400

#     if prix_achat <= 0 :
#         return jsonify({"error": "Prix achat invalide"}), 400

#     if prix_achat > prix:
#         return jsonify({"error": "Prix achat > prix vente"}), 400

#     if stock <= 0:
#         return jsonify({"error": "Stock invalide"}), 400

#     # Créer produit
#     nouveau_produit = {
#         "id": str(uuid.uuid4()),
#         "nom": nom,
#         "categorie": categorie,
#         "prix": prix,
#         "prix_achat": prix_achat,
#         "stock": stock,
#         "unite": unite
#     }

#     # Sauvegarder
#     produits.append(nouveau_produit)

#     #Réponse API
#     return jsonify(nouveau_produit), 201
@app.route("/api/produits", methods=["POST"])
def add_produit():
    data = request.get_json()
    sql = """
    INSERT INTO produits (nom, categorie, prix, prix_achat, stock, unite)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        data["nom"],
        data["categorie"],
        data["prix"],
        data["prix_achat"],
        data["stock"],
        data["unite"]
    )
    cursor.execute(sql, values)
    db.commit()  # important sinon rien n’est sauvegardé
    return jsonify({"message": "Produit ajouté"}), 201

    pass


@app.route("/api/produits/<string:produit_id>", methods=["PUT"])
def modifier_produit(produit_id):
    # """
    # TODO EXERCICE 4 :
    # Modifier un produit existant (nom, prix, stock, categorie, unite).
    # Retourner 404 si non trouvé.
    # """
    data = request.get_json()

    # TODO : trouver le produit
    # TODO : mettre à jour les champs
    # TODO : retourner le produit mis à jour

    produit = next((p for p in produits if p["id"] == produit_id), None)
    if produit is None:
        return jsonify({"error": "Produit non trouvé"}), 404
    
    produit["nom"] = data.get("nom", produit["nom"])
    produit["categorie"] = data.get("categorie", produit["categorie"])
    produit["prix"] = data.get("prix", produit["prix"])
    produit["prix_achat"] = data.get("prix_achat", produit["prix_achat"])
    produit["stock"] = data.get("stock", produit["stock"])
    produit["unite"] = data.get("unite", produit["unite"])

    return jsonify(produit)

    pass


@app.route("/api/produits/<string:produit_id>", methods=["DELETE"])
def supprimer_produit(produit_id):
    """
    TODO EXERCICE 5 :
    Supprimer un produit par son ID.
    Retourner 404 si non trouvé, 200 avec message si supprimé.
    Bonus : empêcher la suppression si des ventes existent pour ce produit.
    """
    # TODO : compléter cette fonction
    global produits

    produit = next((p for p in produits if p["id"] == produit_id), None)

    if produit is None:
     return jsonify({"error": "Produit non trouvé"}), 404

    produits = [p for p in produits if p["id"] != produit_id]

    return jsonify({"message": "Produit supprimé"}), 200
    pass


# ============================================================
# ROUTES VENTES
# ============================================================

@app.route("/api/ventes", methods=["POST"])
def enregistrer_vente():
    """
    TODO EXERCICE 6 :
    Enregistrer une vente.
    Données attendues (JSON) :
      - produit_id
      - quantite (> 0)

    - Vérifier que le produit existe
    - Vérifier que le stock est suffisant
    - Déduire la quantité du stock
    - Enregistrer la vente avec : id, produit_id, quantite, prix_unitaire, total, date
    - Retourner 201 avec le détail de la vente
    """
    data = request.get_json()

    # TODO : compléter cette fonction
    pass


@app.route("/api/ventes", methods=["GET"])
def get_ventes():
    """
    TODO EXERCICE 7 :
    Retourner l'historique des ventes.
    Enrichir chaque vente avec le nom du produit.
    """
    # TODO : compléter cette fonction
    pass


# ============================================================
# ROUTE TABLEAU DE BORD
# ============================================================

@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    """
    TODO EXERCICE 8 (Bonus) :
    Retourner un résumé :
      - nombre total de produits
      - produits en rupture de stock (stock == 0)
      - chiffre d'affaires total (somme de toutes les ventes)
      - marge brute totale (somme des (prix - prix_achat) * quantite sur les ventes)
      - produit le plus vendu
      - valeur totale du stock (prix * stock pour chaque produit)
    """
    # TODO : compléter cette fonction
    pass


# ============================================================
# POINT D'ENTRÉE
# ============================================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)

