from flask import Flask
from flask_cors import CORS
from models.user_models import create_users_table

from controllers.reservation_controllers import reservation_bp
from routes.product_routes import product_bp
from routes.category_routes import category_bp
from controllers.custom_order import custom_order_bp
from controllers.wishlist_controllers import wishlist_bp
from controllers.orders_controller import orders_bp
from controllers.user_controllers import reviews_bp
from controllers.cart_controller import cart_bp
from controllers.user_controllers import admin_users_bp
from controllers.user_controllers import admin_feedback_bp
from controllers.user_controllers import admin_messages_bp
from controllers.product_controllers import admin_product_bp
from controllers.user_controllers import signin_bp, signup_bp, logout_bp, profile_bp, update_profile_bp, contact_bp

app = Flask(__name__)

create_users_table()
# CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🔥 AUTH
app.register_blueprint(signin_bp, url_prefix="/api")
app.register_blueprint(signup_bp, url_prefix="/api")
app.register_blueprint(logout_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(update_profile_bp, url_prefix="/api")

# 🔥 FEATURES
app.register_blueprint(reservation_bp, url_prefix="/api")
app.register_blueprint(contact_bp, url_prefix="/api")
app.register_blueprint(product_bp, url_prefix="/api")
app.register_blueprint(category_bp, url_prefix="/api")
app.register_blueprint(custom_order_bp, url_prefix="/api")
app.register_blueprint(wishlist_bp, url_prefix="/api")
app.register_blueprint(cart_bp, url_prefix="/api")
# 🔥 ORDERS (IMPORTANT)
app.register_blueprint(orders_bp, url_prefix="/api")

# 🔥 REVIEWS
app.register_blueprint(reviews_bp)
app.register_blueprint(admin_feedback_bp, url_prefix="/api")
app.register_blueprint(admin_users_bp, url_prefix="/api")
# app.register_blueprint(admin_messages_bp, url_prefix="/api")
app.register_blueprint(admin_messages_bp, url_prefix="/api")
app.register_blueprint(admin_product_bp, url_prefix="/api")
# =============================
# FILE UPLOAD
# =============================
import os
from flask import send_from_directory

UPLOAD_FOLDER = "uploads"

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)




# =============================
# ADMIN DASHBOARD
# =============================
from flask import jsonify
# ✅ correct
from config.db import get_db   # ⚠️ IMPORTANT import

@app.route("/admin/stats", methods=["GET"])
def admin_stats():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # 🔹 Products
    cursor.execute("SELECT COUNT(*) AS total FROM products")
    products = cursor.fetchone()["total"]

    # 🔹 Users
    cursor.execute("SELECT COUNT(*) AS total FROM users")
    users = cursor.fetchone()["total"]

    # 🔹 Orders
    cursor.execute("SELECT COUNT(*) AS total FROM orders")
    orders = cursor.fetchone()["total"]

    # 🔹 Revenue (optional 🔥 powerful)
    cursor.execute("SELECT IFNULL(SUM(total_amount),0) AS total FROM orders")
    revenue = cursor.fetchone()["total"]

    cursor.close()
    db.close()

    return jsonify({
        "products": products,
        "users": users,
        "orders": orders,
        "revenue": revenue
    })

if __name__ == "__main__":
    app.run(debug=True)