from flask import Blueprint
from controllers.category_controller import get_categories

category_bp = Blueprint('category_bp', __name__)

@category_bp.route("/categories", methods=["GET"])
def categories():
    return get_categories()