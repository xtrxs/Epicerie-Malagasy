from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_cursor

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
    resultat = cursor.fetchall()

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

    produit = cursor.fetchone()

    cursor.close()
    db.close()

    if not produit:
        return jsonify({"error": "Produit non trouvé"}), 404

    return jsonify(produit)

@app.route("/api/produits", methods=["POST"])
def add_produit():

    data = request.get_json()
    db, cursor = get_cursor()

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
    db, cursor = get_cursor()

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

