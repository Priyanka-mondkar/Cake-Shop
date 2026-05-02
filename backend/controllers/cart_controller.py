from flask import Blueprint, request, jsonify
import mysql.connector

cart_bp = Blueprint("cart", __name__)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="darshu1209",
        database="sweetora"
    )

# ==============================
# ADD TO CART
# ==============================
@cart_bp.route("/cart", methods=["POST"])
def add_to_cart():

    data = request.json

    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    db = get_db()
    cursor = db.cursor()

    try:
        # check already exists
        cursor.execute(
            "SELECT * FROM cart WHERE user_id=%s AND product_id=%s",
            (user_id, product_id)
        )
        existing = cursor.fetchone()

        if existing:
            cursor.execute(
                "UPDATE cart SET quantity = quantity + %s WHERE user_id=%s AND product_id=%s",
                (quantity, user_id, product_id)
            )
        else:
            cursor.execute(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                (user_id, product_id, quantity)
            )

        db.commit()

        return jsonify({"message": "Added to cart ✅"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()


# ==============================
# GET CART
# ==============================
@cart_bp.route("/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT c.cart_id, c.product_id, c.quantity, p.name, p.price, p.image
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s
    """

    cursor.execute(query, (user_id,))
    data = cursor.fetchall()

    db.close()

    return jsonify(data)


# ==============================
# DELETE ITEM
# ==============================
@cart_bp.route("/cart/<int:cart_id>", methods=["DELETE"])
def delete_item(cart_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM cart WHERE cart_id=%s", (cart_id,))
    db.commit()

    db.close()

    return jsonify({"message": "Item removed ❌"})



@cart_bp.route("/cart/clear/<int:user_id>", methods=["DELETE"])
def clear_cart(user_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM cart WHERE user_id=%s", (user_id,))
    db.commit()

    db.close()

    return jsonify({"message": "Cart cleared ✅"})