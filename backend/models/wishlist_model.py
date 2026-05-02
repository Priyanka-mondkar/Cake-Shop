import sqlite3

DB = "database.db"

def add_item(name, image):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    # duplicate check
    cursor.execute("SELECT * FROM wishlist WHERE product_name=?", (name,))
    existing = cursor.fetchone()

    if not existing:
        cursor.execute(
            "INSERT INTO wishlist (product_name, image) VALUES (?, ?)",
            (name, image)
        )
        conn.commit()

    conn.close()


def get_items():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM wishlist")
    rows = cursor.fetchall()

    conn.close()
    return [dict(row) for row in rows]


def delete_item(item_id):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM wishlist WHERE id=?", (item_id,))
    conn.commit()

    conn.close()