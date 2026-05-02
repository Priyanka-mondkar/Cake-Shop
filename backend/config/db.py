# import mysql.connector
# from mysql.connector import Error

# host = "localhost"
# db   = "sweetora"
# user = "root"
# password = "darshu1209"

# def get_db():
#     try:
#         connection = mysql.connector.connect(
#             host=host,
#             database=db,
#             user=user,
#             password=password,
#             charset="utf8"
#         )

#         # ✅ Optional check (thevla ahe, delete nahi kelay)
#         if connection.is_connected():
#             # print("Database is connected")  # ❌ optional (comment kelay)
#             return connection

#     except Error as e:
#         print("Database connection failed:", e)
#         return None


# # ✅ NEW (add kelay)
# def close_db(connection, cursor=None):
#     try:
#         if cursor:
#             cursor.close()
#         if connection:
#             connection.close()
#     except:
#         pass
import mysql.connector
from mysql.connector import Error

host = "localhost"
db   = "sweetora"
user = "root"
password = "darshu1209"

def get_db():
    try:
        connection = mysql.connector.connect(
            host=host,
            database=db,
            user=user,
            password=password,
            charset="utf8"
        )

        if connection.is_connected():
            return connection

    except Error as e:
        print("Database connection failed:", e)
        return None


def close_db(connection, cursor=None):
    try:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    except:
        pass

# ❌ direct call avoid kara (comment kelay)
# get_db()

import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    image TEXT
)
""")

conn.commit()
conn.close()

print("Wishlist table created ✅")