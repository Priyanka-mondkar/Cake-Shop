from flask import Blueprint, request, jsonify
from  config.db import get_db

reservation_bp = Blueprint("reservation", __name__)

@reservation_bp.route("/reservation", methods=["POST"])
def create_reservation():

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    reservation_date = data.get("reservation_date")
    reservation_time = data.get("reservation_time")
    guests = data.get("guests")
    occasion = data.get("occasion")
    message = data.get("message")

    # Validation
    if not name or not email or not phone or not reservation_date or not reservation_time or not guests:
        return jsonify({"error": "Required fields missing"}), 400

    db = get_db()

    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()

    query = """
    INSERT INTO reservations
    (name, email, phone, reservation_date, reservation_time, guests, occasion, message)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        name,
        email,
        phone,
        reservation_date,
        reservation_time,
        guests,
        occasion,
        message
    )

    cursor.execute(query, values)

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Reservation booked successfully"}), 201



# get reservation admin
@reservation_bp.route("/reservations", methods=["GET"])
def get_reservations():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM reservations ORDER BY reservation_id DESC")
    reservations = cursor.fetchall()

    # 🔥 FIX: convert time/date to string
    for r in reservations:
        if r["reservation_date"]:
            r["reservation_date"] = str(r["reservation_date"])
        if r["reservation_time"]:
            r["reservation_time"] = str(r["reservation_time"])
        if r["created_at"]:
            r["created_at"] = str(r["created_at"])

    cursor.close()
    db.close()

    return jsonify({
        "reservations": reservations
    }), 200


# update_reservation status
@reservation_bp.route("/reservation/status/<int:id>", methods=["PUT"])
def update_reservation_status(id):

    data = request.get_json()
    status = data.get("status")

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
            "UPDATE reservations SET status=%s WHERE reservation_id=%s",
            (status, id)
    )

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Status updated"}), 200




@reservation_bp.route("/reservation/<int:id>", methods=["DELETE"])
def delete_reservation(id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM reservations WHERE reservation_id=%s",
        (id,)
    )

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Reservation deleted successfully"}), 200