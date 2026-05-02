from flask import jsonify
from config.db import get_db

def get_categories():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM category")
    data = cursor.fetchall()

    return jsonify(data)