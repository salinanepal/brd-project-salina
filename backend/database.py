import os
import bcrypt
import mysql.connector as MyConn
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return MyConn.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        autocommit=False
    )

# AUTH

def register_user(name: str, email: str, password: str) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            raise ValueError("An account with this email already exists. Please sign in instead.")

        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name.strip(), email.strip(), password_hash)
        )
        conn.commit()
        return {"id": cur.lastrowid, "name": name.strip(), "email": email.strip()}

    except ValueError:
        raise
    except Error:
        conn.rollback()
        raise
    finally:
        conn.close()


def login_user(email: str, password: str) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, email, password_hash FROM users WHERE email = %s", (email,))
        existing: dict | None = cur.fetchone()  # type: ignore[assignment]

        if not existing:
            raise ValueError("No account found with this email. Please register first.")

        stored_hash: str = existing["password_hash"]
        if not bcrypt.checkpw(password.encode(), stored_hash.encode()):
            raise ValueError("Incorrect password.")

        return {"id": existing["id"], "name": existing["name"], "email": existing["email"]}

    finally:
        conn.close()


#USERS

def get_users():
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, email FROM users ORDER BY name")
        return cur.fetchall()
    finally:
        conn.close()


def delete_user(user_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
        conn.commit()
    except Error:
        conn.rollback()
        raise
    finally:
        conn.close()


#GOALS

def create_goal(title: str, target_amount: float, created_by: int, target_date=None):
    conn = get_connection()
    try:
        cur = conn.cursor()
        clean_title = title.strip()

        cur.execute(
            "SELECT id FROM goals WHERE LOWER(TRIM(title)) = LOWER(%s) AND status='active'",
            (clean_title,)
        )
        if cur.fetchone():
            raise Exception("An active goal with this title already exists.")

        cur.execute(
            "INSERT INTO goals (title, target_amount, status, created_by, target_date) VALUES (%s, %s, 'active', %s, %s)",
            (clean_title, target_amount, created_by, target_date)
        )
        conn.commit()
        return cur.lastrowid
    finally:
        conn.close()


def get_goal(goal_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM goals WHERE id = %s", (goal_id,))
        row: dict | None = cur.fetchone()  # type: ignore[assignment]
        if row is None:
            return None
        row["target_amount"] = float(row["target_amount"])
        return row
    finally:
        conn.close()


def get_all_goals() -> list:
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT
                g.id,
                g.title,
                g.target_amount,
                g.status,
                g.target_date,
                u.name AS created_by_name,
                COALESCE(SUM(c.amount), 0) AS total_raised
            FROM goals g
            LEFT JOIN contributions c ON c.goal_id = g.id
            LEFT JOIN users u ON u.id = g.created_by
            GROUP BY g.id, u.name
            ORDER BY g.id DESC
        """)
        rows = cur.fetchall()
        for row in rows:
            r: dict = row  # type: ignore[assignment]
            r["target_amount"] = float(r["target_amount"])
            r["total_raised"] = float(r["total_raised"])
            if r.get("target_date"):
                r["target_date"] = r["target_date"].isoformat()
        return rows
    finally:
        conn.close()


def delete_goal(goal_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM goals WHERE id=%s", (goal_id,))
        conn.commit()
    except Error:
        conn.rollback()
        raise
    finally:
        conn.close()


#CONTRIBUTIONS

def add_contribution(user_id: int, goal_id: int, amount: float):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO contributions (user_id, goal_id, amount) VALUES (%s, %s, %s)",
            (user_id, goal_id, amount),
        )

        # Auto-complete goal if target reached
        cur.execute("""
            UPDATE goals
            SET status = 'completed'
            WHERE id = %s
            AND (
                SELECT COALESCE(SUM(amount), 0)
                FROM contributions
                WHERE goal_id = %s
            ) >= target_amount
        """, (goal_id, goal_id))

        conn.commit()
        return cur.lastrowid
    except Error:
        conn.rollback()
        raise
    finally:
        conn.close()


def get_goal_summary(goal_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)

        # Main summary
        cur.execute("""
            SELECT
                g.id                    AS goal_id,
                g.title,
                g.target_amount,
                g.status,
                g.target_date,
                u.name                  AS created_by_name,
                COALESCE(SUM(c.amount), 0) AS total_raised,
                COUNT(c.id)             AS contribution_count,
                ROUND(
                    CASE
                        WHEN g.target_amount > 0
                        THEN COALESCE(SUM(c.amount), 0) / g.target_amount * 100
                        ELSE 0
                    END, 2
                ) AS percent_complete
            FROM goals g
            LEFT JOIN contributions c ON c.goal_id = g.id
            LEFT JOIN users u ON u.id = g.created_by
            WHERE g.id = %s
            GROUP BY g.id, u.name
        """, (goal_id,))

        result: dict | None = cur.fetchone()  # type: ignore[assignment]
        if not result:
            return None

        # Leaderboard
        cur.execute("""
            SELECT
                u.id,
                u.name,
                COALESCE(SUM(c.amount), 0) AS total_contributed,
                COUNT(c.id)                AS num_contributions
            FROM users u
            INNER JOIN contributions c ON c.user_id = u.id AND c.goal_id = %s
            GROUP BY u.id
            ORDER BY total_contributed DESC
        """, (goal_id,))
        result["contributors"] = cur.fetchall()

        # Recent activity
        cur.execute("""
            SELECT c.id, u.name, c.amount, c.created_at
            FROM contributions c
            JOIN users u ON u.id = c.user_id
            WHERE c.goal_id = %s
            ORDER BY c.created_at DESC
            LIMIT 10
        """, (goal_id,))
        recent = cur.fetchall()

        # Type coercions
        for key in ("target_amount", "total_raised", "percent_complete"):
            result[key] = float(result[key] or 0)

        if result.get("target_date"):
            result["target_date"] = result["target_date"].isoformat()

        for row in result["contributors"]:
            r: dict = row  # type: ignore[assignment]
            r["total_contributed"] = float(r["total_contributed"])

        for row in recent:
            r: dict = row  # type: ignore[assignment]
            r["amount"] = float(r["amount"])
            r["created_at"] = r["created_at"].isoformat()

        result["recent_contributions"] = recent
        return result

    finally:
        conn.close()