from config.db import get_db

def get_all_products():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")
    data = cursor.fetchall()

    cursor.close()
    db.close()

    return data


# 🔥 NEW FUNCTION
def get_products_by_category(category_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE category_id=%s", (category_id,))
    return cursor.fetchall()