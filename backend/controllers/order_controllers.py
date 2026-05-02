# controllers/order_controllers.py
from flask import Blueprint, request, jsonify
from config.db import get_db

order_bp = Blueprint('order_bp', __name__)

@order_bp.route("/order", methods=["POST"])
def create_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No data received"}), 400

        # 🔹 Personal Info
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")

        # 🔹 Delivery Info
        delivery_type = data.get("delivery_type")
        if delivery_type == "Pickup":
            address = "Store Pickup"
            city = "Store"
            zip_code = None
            delivery_type = "Pickup"
        else:
            address = data.get("address")
            city = data.get("city")
            zip_code = data.get("zip")
            if not address or not city:
                return jsonify({"status": "error", "message": "Address & City required for delivery"}), 400

        # 🔹 Payment Info
        payment_method = data.get("payment_method")
        # total_amount = data.get("total")
        total_amount = data.get("total_amount")
        if payment_method == "Card":
            final_payment_status = "Paid (Online)"
        else:
            final_payment_status = "Cash on Delivery"

        # 🔹 DB Connection
        db = get_db()
        if db is None:
            return jsonify({"status": "error", "message": "Database connection failed"}), 500

        cursor = db.cursor()

        query = """
        INSERT INTO orders
        (user_id, name, email, phone, address, city, zip_code, delivery_type, payment_method, total_amount, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            data.get("user_id"),   # ✅ add this
            name, email, phone,
            address, city, zip_code,
            delivery_type, final_payment_status,
            total_amount,
            "Placed"
        )
        cursor.execute(query, values)
        db.commit()

        order_id = cursor.lastrowid
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Order placed successfully",
            "order_id": order_id
        }), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500