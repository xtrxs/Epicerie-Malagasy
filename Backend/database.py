import mysql.connector

def get_cursor(dictionary=False):
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="gestion_stocks"
    )
    cursor = db.cursor(dictionary=dictionary)
    return db, cursor

db, cursor = get_cursor(dictionary=True)