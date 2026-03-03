from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_cursor
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ============================================================
# ROUTES PRODUITS
# ============================================================

@app.route("/api/produits", methods=["GET"])
def get_produits():

    categorie = request.args.get("categorie")
    recherche = request.args.get("recherche")

    db, cursor = get_cursor()

    sql = "SELECT * FROM produits WHERE 1=1"
    values = []

    if categorie:
        sql += " AND categorie LIKE %s"
        values.append(f"%{categorie}%")

    if recherche:
        sql += " AND nom LIKE %s"
        values.append(f"%{recherche}%")

    cursor.execute(sql, values)

    colonnes = [col[0] for col in cursor.description]
    resultat = [
        dict(zip(colonnes, row))
        for row in cursor.fetchall()
    ]

    cursor.close()
    db.close()

    return jsonify(resultat)

@app.route("/api/produits/<int:produit_id>", methods=["GET"])
def get_produit(produit_id):

    db, cursor = get_cursor()

    cursor.execute(
        "SELECT * FROM produits WHERE id=%s",
        (produit_id,)
    )

    row = cursor.fetchone()

    if not row:
        cursor.close()
        db.close()
        return jsonify({"error": "Produit non trouvé"}), 404

    # transformation en objet JSON
    colonnes = [col[0] for col in cursor.description]
    produit = dict(zip(colonnes, row))

    cursor.close()
    db.close()

    return jsonify(produit)

@app.route("/api/produits", methods=["POST"])
def add_produit():

    data = request.get_json()
    db, cursor = get_cursor(dictionary=True)

    sql = """
        INSERT INTO produits
        (nom, categorie, prix, prix_achat, stock, unite)
        VALUES (%s,%s,%s,%s,%s,%s)
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
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Produit ajouté"}), 201

@app.route("/api/produits/<int:produit_id>", methods=["PUT"])
def modifier_produit(produit_id):

    data = request.get_json()
    db, cursor = get_cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM produits WHERE id=%s",
        (produit_id,)
    )
    produit = cursor.fetchone()

    if not produit:
        cursor.close()
        db.close()
        return jsonify({"error": "Produit non trouvé"}), 404

    sql = """
        UPDATE produits
        SET nom=%s,
            categorie=%s,
            prix=%s,
            prix_achat=%s,
            stock=%s,
            unite=%s
        WHERE id=%s
    """

    values = (
        data.get("nom", produit["nom"]),
        data.get("categorie", produit["categorie"]),
        data.get("prix", produit["prix"]),
        data.get("prix_achat", produit["prix_achat"]),
        data.get("stock", produit["stock"]),
        data.get("unite", produit["unite"]),
        produit_id
    )

    cursor.execute(sql, values)
    db.commit()

    cursor.execute("SELECT * FROM produits WHERE id=%s", (produit_id,))
    produit_modifie = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify(produit_modifie)

@app.route("/api/produits/<int:produit_id>", methods=["DELETE"])
def supprimer_produit(produit_id):

    db, cursor = get_cursor()

    cursor.execute(
        "SELECT * FROM produits WHERE id=%s",
        (produit_id,)
    )

    produit = cursor.fetchone()

    if not produit:
        cursor.close()
        db.close()
        return jsonify({"message": "Produit non trouvé"}), 404

    cursor.execute(
        "DELETE FROM produits WHERE id=%s",
        (produit_id,)
    )
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Produit supprimé avec succès"})


# ============================================================
# ROUTES VENTES
# ============================================================

@app.route("/api/ventes", methods=["POST"])
def enregistrer_vente():
    db, cursor = get_cursor(dictionary=True)
    data = request.get_json()
    produit_id = data.get("produit_id")
    quantite = data.get("quantite")

    # Vérification des champs
    if not produit_id or not quantite:
        return jsonify({"error": "Produit et quantité requis"}), 400

    # Récupérer le produit
    cursor.execute("SELECT * FROM produits WHERE id = %s", (produit_id,))
    produit = cursor.fetchone()

    if not produit:
        return jsonify({"error": "Produit introuvable"}), 404

    if quantite > produit["stock"]:
        return jsonify({"error": f"Stock insuffisant ({produit['stock']} disponible)"}), 400

    # Calculer total
    prix_unitaire = produit["prix"]
    total = prix_unitaire * quantite

    # Créer l’enregistrement dans ventes
    cursor.execute(
        "INSERT INTO ventes (produit_id, quantite, prix_unitaire, total, date_vente) VALUES (%s, %s, %s, %s, %s)",
        (produit_id, quantite, prix_unitaire, total, datetime.now())
    )

    # Mettre à jour le stock du produit
    nouveau_stock = produit["stock"] - quantite
    cursor.execute(
        "UPDATE produits SET stock = %s WHERE id = %s",
        (nouveau_stock, produit_id)
    )

    db.commit()

    # Retour JSON pour React
    return jsonify({
        "message": "Vente enregistrée avec succès",
        "produit": produit["nom"],
        "quantite": quantite,
        "total": total,
        "stock_restant": nouveau_stock
    }), 201
    pass


@app.route("/api/ventes", methods=["GET"])
def get_ventes():
    db, cursor = get_cursor(dictionary=True)

    cursor.execute("""
        SELECT v.id,
               p.nom AS produit,
               v.quantite,
               v.prix_unitaire,
               v.total,
               v.date_vente
        FROM ventes v
        JOIN produits p ON v.produit_id = p.id
        ORDER BY v.date_vente DESC
    """)

    ventes = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(ventes), 200
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

