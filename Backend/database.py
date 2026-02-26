import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="gestion_stocks"
    )

def get_cursor():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    return db, cursor