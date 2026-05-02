from flask import Blueprint, jsonify, request
import mysql.connector

orders_bp = Blueprint("orders", __name__)

# ===== DB CONNECTION =====
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="darshu1209",
        database="sweetora"
    )

# ==========================================
# 🔥 CREATE ORDER (CORS + OPTIONS FIXED)
# ==========================================
@orders_bp.route("/orders", methods=["POST", "OPTIONS"])
def create_order():

    # 🔥 CORS preflight fix
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json

    user_id = data.get("user_id")
    total_amount = data.get("total_amount")
    items = data.get("items")

    # 🔴 validation
    if not user_id or not total_amount or not items:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        order_query = """
            INSERT INTO orders 
            (user_id, name, email, phone, address, city, zip_code, delivery_type, payment_method, total_amount)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

      
        cursor.execute(order_query, (
            user_id,
            data.get("name"),
            data.get("email"),
            data.get("phone"),
            data.get("address"),
            data.get("city"),
            data.get("zip"),
            data.get("delivery_type"),
            data.get("payment_method"),
            total_amount
        ))

        order_id = cursor.lastrowid  # 🔥 important

        # 2️⃣ Insert order items
        for item in items:
            if not item.get("product_id"):
                raise Exception("product_id missing in item")

            item_query = """
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(item_query, (
                order_id,
                item["product_id"],
                item["quantity"],
                item["price"]
            ))

        db.commit()

        return jsonify({
            "status": "success",
            "order_id": order_id
        })

    except Exception as e:
        db.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        db.close()


# ==========================================
# 🔥 GET USER ORDERS
# ==========================================
@orders_bp.route("/orders/user/<int:user_id>", methods=["GET"])
def get_orders(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT 
            o.order_id,
            o.status AS order_status,
            o.total_amount,
            o.created_at,
            oi.quantity,
            oi.price,
            p.name AS product_name,
            p.image
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = %s
            ORDER BY o.order_id DESC
            """

    cursor.execute(query, (user_id,))
    orders = cursor.fetchall()

    db.close()

    return jsonify(orders)


# ==========================================
# 🔥 CANCEL ORDER
# ==========================================
@orders_bp.route("/orders/cancel/<int:order_id>", methods=["PUT"])
def cancel_order(order_id):

    db = get_db()
    cursor = db.cursor()

    try:
        query = "UPDATE orders SET status = 'Cancelled' WHERE order_id = %s"
        cursor.execute(query, (order_id,))
        db.commit()

        return jsonify({"message": "Order Cancelled Successfully ❌"})

    except Exception as e:
        db.rollback()
        return jsonify({"message": str(e)}), 500

    finally:
        db.close()




# ==========================================
# 🔥 ADMIN - GET ALL ORDERS
# ==========================================
@orders_bp.route("/orders/admin", methods=["GET"])
def get_all_orders():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT * FROM orders ORDER BY order_id DESC
    """

    cursor.execute(query)
    orders = cursor.fetchall()

    db.close()

    return jsonify(orders)



# ==========================================
# 🔥 ADMIN - UPDATE ORDER STATUS
# ==========================================
@orders_bp.route("/orders/status/<int:order_id>", methods=["PUT"])
def update_order_status(order_id):

    data = request.json
    status = data.get("status")

    db = get_db()
    cursor = db.cursor()

    try:
        query = "UPDATE orders SET status = %s WHERE order_id = %s"
        cursor.execute(query, (status, order_id))
        db.commit()

        return jsonify({"status": "success"})

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)})

    finally:
        db.close()