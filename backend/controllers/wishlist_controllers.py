from flask import Blueprint, request, jsonify
from config.db import get_db

wishlist_bp = Blueprint("wishlist", __name__)

# ✅ ADD TO WISHLIST
@wishlist_bp.route("/wishlist", methods=["POST"])
def add_to_wishlist():
    data = request.get_json()

    name = data.get("name")
    image = data.get("image")

    db = get_db()
    cursor = db.cursor()

    query = "INSERT INTO wishlist (product_name, image) VALUES (%s, %s)"
    cursor.execute(query, (name, image))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Added to wishlist"}), 201


# ✅ GET ALL WISHLIST
@wishlist_bp.route("/wishlist", methods=["GET"])
def get_wishlist():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM wishlist")
    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)


# ✅ DELETE ITEM
@wishlist_bp.route("/wishlist/<int:id>", methods=["DELETE"])
def delete_wishlist_item(id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM wishlist WHERE id = %s", (id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Item removed"})