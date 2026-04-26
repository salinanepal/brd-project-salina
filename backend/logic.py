from db import get_connection
import mysql.connector
from mysql.connector import Error

def get_user_by_email(email: str):
    conn = get_connection()
    if conn is None:
        return None
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        return cur.fetchone()
    finally:
        conn.close()

def get_user_by_id(user_id: int):
    conn = get_connection()
    if conn is None:
        return None
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (user_id,))
        return cur.fetchone()
    finally:
        conn.close()
 
def create_user(name: str, email: str, password_hash: str) -> int:
    conn = get_connection()

    if conn is None:
        raise Exception("Database connection failed")

    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name, email, password_hash),
        )
        conn.commit()
        if cur.lastrowid is None:
            raise Exception("Failed to get inserted user ID")
        return cur.lastrowid
    except Error:
        conn.rollback()
        raise
    finally:
        conn.close()