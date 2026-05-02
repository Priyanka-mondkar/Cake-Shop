from flask import Blueprint, request, jsonify
from config.db import get_db

custom_order_bp = Blueprint("custom_order", __name__)

@custom_order_bp.route("/custom-order", methods=["POST"])
def create_custom_order():

    data = request.get_json()

    flavor = data.get("flavor")
    size = data.get("size")
    shape = data.get("shape")
    custom_message = data.get("custom_message")
    reference_image = data.get("reference_image")
    customer_name = data.get("customer_name")
    db = get_db()
    cursor = db.cursor()

    query = """
    INSERT INTO custom_orders
    (flavor, size, shape, custom_message, reference_image, customer_name)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (flavor, size, shape, custom_message, reference_image, customer_name)

    cursor.execute(query, values)

    db.commit()
   
    order_id = cursor.lastrowid

    cursor.close()
    db.close()

    return jsonify({
        "message": "Custom order placed successfully",
        "order_id": order_id
    }), 201 





@custom_order_bp.route("/custom-orders", methods=["GET"])
def get_custom_orders():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM custom_orders ORDER BY id DESC")
    orders = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify({
        "orders": orders
    }), 200

@custom_order_bp.route("/custom-order/status/<int:id>", methods=["PUT"])
def update_status(id):

    data = request.get_json()
    status = data.get("status")

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "UPDATE custom_orders SET status=%s WHERE id=%s",
        (status, id)
    )

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Status updated"}), 200