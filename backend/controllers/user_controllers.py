from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from config.db import get_db
import os

UPLOAD_FOLDER = "uploads"

# 🔥 folder नसला तर create होईल
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# ================= SIGNUP =================
signup_bp = Blueprint("signup", __name__)

@signup_bp.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")   # ✅ NEW (default user)

    if not name or not email or not password:
        return jsonify({"error": "name, email and password required"}), 400

    hashed_password = generate_password_hash(password)

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("SELECT user_id FROM users WHERE email=%s", (email,))
        
        if cursor.fetchone():
            return jsonify({"error": "Email already exists"}), 409

        cursor.execute(
            "INSERT INTO users (name,email,password,role) VALUES (%s,%s,%s,%s)",
            (name,email,hashed_password,role)
        )

        db.commit()

        return jsonify({"message": "Signup successful"}), 201

    except Exception as e:
        print("SIGNUP ERROR:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()


# ================= SIGNIN =================
signin_bp = Blueprint("signin", __name__)

@signin_bp.route("/signin", methods=["POST"])
def signin():

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        print("LOGIN USER:", user)  # ✅ DEBUG

        if user and check_password_hash(user["password"], password):

            return jsonify({
                "message": "Login successful",
                "role": user["role"],   # ✅ IMPORTANT
                "user": {
                        "id": user["user_id"],
                        "name": user["name"],   # ✅ ADD THIS
                        "email": user["email"]
                        }
            }), 200

        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"error": "Login failed"}), 500

    finally:
        cursor.close()
        db.close()


# ================= LOGOUT =================
logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logout successful"}), 200


# ================= PROFILE =================
profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/auth/profile", methods=["GET"])
def get_profile():

    # user_id = request.headers.get("user_id")
    user_id = request.headers.get("user_id") or request.headers.get("User-Id")

    if not user_id:
        return jsonify({"error": "User ID missing"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE user_id=%s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": user}), 200

# ================= UPDATE PROFILE =================
update_profile_bp = Blueprint("update_profile", __name__)

@update_profile_bp.route("/auth/profile", methods=["PUT"])
def update_profile():
    try:
        # 🔥 FIX: proper header read
        user_id = request.headers.get("user_id") or request.headers.get("User-Id")

        print("BACKEND USER ID:", user_id)  # DEBUG

        if not user_id:
            return jsonify({"error": "User ID missing"}), 400

        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")

        flat = request.form.get("flat")
        area = request.form.get("area")
        city = request.form.get("city")
        state = request.form.get("state")
        pincode = request.form.get("pincode")

        avatar = request.files.get("avatar")
        avatar_url = None

        if avatar:
            filename = avatar.filename

            filepath = os.path.join(UPLOAD_FOLDER, filename)

            avatar.save(filepath)   # ✅ file save

            avatar_url = f"http://127.0.0.1:5000/uploads/{filename}"

    
            db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
        UPDATE users SET name=%s,email=%s,phone=%s,
        flat=%s,area=%s,city=%s,state=%s,pincode=%s,
        avatar = COALESCE(%s, avatar)
        WHERE user_id=%s
        """, (name,email,phone,flat,area,city,state,pincode,avatar_url,user_id))

        db.commit()

        cursor.execute("SELECT * FROM users WHERE user_id=%s", (user_id,))
        user = cursor.fetchone()

        cursor.close()
        db.close()

        return jsonify({"user": user}), 200

    except Exception as e:
        print("PROFILE UPDATE ERROR:", e)
        return jsonify({"error": str(e)}), 500
# ================= CONTACT =================
contact_bp = Blueprint("contact", __name__)

@contact_bp.route("/contact", methods=["POST"])
def send_message():

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    subject = data.get("subject")
    message = data.get("message")

    if not name or not email or not phone or not subject or not message:
        return jsonify({"error": "All fields are required"}), 400

    db = get_db()
    cursor = db.cursor()

    query = """
    INSERT INTO contact_messages
    (name, email, phone, subject, message)
    VALUES (%s,%s,%s,%s,%s)
    """

    cursor.execute(query, (name, email, phone, subject, message))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Message sent successfully"}), 201

# ================= REVIEWS =================
reviews_bp = Blueprint("reviews", __name__)

@reviews_bp.route("/reviews", methods=["POST"])
def add_review():

    data = request.get_json()

    user_id = data.get("user_id")
    name = data.get("name")
    email = data.get("email") 
    message = data.get("message")
    rating = data.get("rating")
    avatar = data.get("avatar")

    if not name or not message or not rating:
        return jsonify({"error": "All fields required"}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO reviews (user_id, name, email, message, rating, avatar)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (user_id, name, email, message, rating, avatar))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Review added"}), 201

# 🔥 GET ALL REVIEWS (GET)
@reviews_bp.route("/reviews", methods=["GET"])
def get_reviews():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM reviews ORDER BY review_id DESC")
    reviews = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify({"reviews": reviews}), 200







# ================= ADMIN GET USERS =================
admin_users_bp = Blueprint("admin_users", __name__)

@admin_users_bp.route("/admin/users", methods=["GET"])
def get_all_users():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT user_id, name, email, phone, role, created_at
        FROM users
        ORDER BY user_id DESC
    """)

    users = cursor.fetchall()

    # date string convert
    for u in users:
        if u["created_at"]:
            u["created_at"] = str(u["created_at"])

    cursor.close()
    db.close()

    return jsonify({"users": users}), 200


# ================= DELETE USER admin =================
@admin_users_bp.route("/admin/user/<int:id>", methods=["DELETE"])
def delete_user(id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM users WHERE user_id=%s", (id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "User deleted successfully"}), 200




from flask import Blueprint, jsonify, request
from config.db import get_db

admin_feedback_bp = Blueprint("admin_feedback", __name__)

# 🔥 GET ALL FEEDBACK (ADMIN)
@admin_feedback_bp.route("/admin/feedback", methods=["GET"])
def get_all_feedback():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM reviews ORDER BY review_id DESC")
    feedbacks = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify({"feedbacks": feedbacks}), 200


# 🔥 DELETE FEEDBACK
@admin_feedback_bp.route("/admin/feedback/<int:id>", methods=["DELETE"])
def delete_feedback(id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM reviews WHERE review_id=%s", (id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Feedback deleted"}), 200











from flask import Blueprint, jsonify
from config.db import get_db

admin_messages_bp = Blueprint("admin_messages", __name__)

# 🔥 GET ALL CONTACT MESSAGES
@admin_messages_bp.route("/admin/messages", methods=["GET"])
def get_all_messages():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM contact_messages ORDER BY message_id DESC")
    messages = cursor.fetchall()

    # 🔥 convert date
    for m in messages:
        if m["created_at"]:
            m["created_at"] = str(m["created_at"])

    cursor.close()
    db.close()

    return jsonify({"messages": messages}), 200


# 🔥 DELETE MESSAGE
@admin_messages_bp.route("/admin/messages/<int:id>", methods=["DELETE"])
def delete_message(id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM contact_messages WHERE message_id=%s", (id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Message deleted successfully"}), 200