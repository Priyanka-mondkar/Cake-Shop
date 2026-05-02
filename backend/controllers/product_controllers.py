from flask import jsonify
from models.product_model import get_all_products, get_products_by_category

def fetch_products():
    try:
        products = get_all_products()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# 🔥 NEW FUNCTION
def fetch_products_by_category(category_id):
    try:
        products = get_products_by_category(category_id)
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



# -------------admin product----------
from flask import Blueprint, request, jsonify
from config.db import get_db

admin_product_bp = Blueprint("admin_product", __name__)

# ================= GET ALL PRODUCTS =================
@admin_product_bp.route("/admin/products", methods=["GET"])
def get_products():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products ORDER BY id DESC")
    products = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify({"products": products}), 200




# ================ add product admin----------------
@admin_product_bp.route("/admin/add-product", methods=["POST"])
def add_product():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    name = data.get("name")
    price = data.get("price")
    weight = data.get("weight")
    category = data.get("category")
    type_ = data.get("type")

    if not name or not price:
        return jsonify({"error": "Name and Price required"}), 400

    db = get_db()
    cursor = db.cursor()

    image = "images/default.png"   # 🔥 default image

    cursor.execute("""
        INSERT INTO products (name, image, price, weight, category, type)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, image, price, weight, category, type_))

    db.commit()

    return jsonify({"message": "Product added successfully"})



# ================= DELETE PRODUCT =================
@admin_product_bp.route("/admin/products/<int:id>", methods=["DELETE"])
def delete_product(id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM products WHERE id=%s", (id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Product deleted"}), 200