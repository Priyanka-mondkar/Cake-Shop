from flask import Blueprint
from controllers.product_controllers import fetch_products
from controllers.product_controllers import fetch_products_by_category

product_bp = Blueprint("product_bp", __name__)

@product_bp.route("/products", methods=["GET"])
def get_products():
    return fetch_products()

# 🔥 BY CATEGORY (IMPORTANT)
@product_bp.route("/products/category/<int:category_id>", methods=["GET"])
def get_by_category(category_id):
    return fetch_products_by_category(category_id)