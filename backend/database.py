import os
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
def create_user(name:str, email:str) -> int:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO users (name, email) VALUES (%s, %s)",
            (name, email),
        )
        conn.commit()
        return cur.lastrowid # type: ignore[return-value]
    except Error:
        conn.rollback()
        raise

    finally:
        conn.close()

def get_users():
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, email FROM users ORDER BY name")
        return cur.fetchall()
    finally:
        conn.close()

def create_goal(title:str, target_amount:float) ->int:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO goals (title, target_amount) VALUES (%s, %s)",
            (title, target_amount),
        )
        conn.commit()
        return cur.lastrowid  # type: ignore[return-value]
    except Error:
        conn.rollback()
        raise
    finally:
        conn.close()
        

def get_goal(goal_id:int):
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM goals where id = %s",(goal_id,))
        row = cur.fetchone()
        if row is None:
            return None
        row["target_amount"] = float(row["target_amount"]) # type: ignore[assignment]
        return row
        
    finally:
        conn.close()

def get_all_goals() ->list:
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM goals ORDER BY id DESC")
        rows = cur.fetchall()
        for row in rows:
            r: dict = row  # type: ignore[assignment]
            r["target_amount"] = float(r["target_amount"])
        return rows
    finally:
        conn.close()

def add_contribution(user_id: int, goal_id: int, amount: float):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO contributions (user_id, goal_id, amount) VALUES (%s, %s, %s)",
            (user_id, goal_id, amount),  
        )
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
        cur.execute("""
            SELECT
                g.id                                       AS goal_id,
                g.title,
                g.target_amount,
                COALESCE(SUM(c.amount), 0)                AS total_raised,
                COUNT(c.id)                               AS contribution_count,
               ROUND(
                    CASE
                        WHEN g.target_amount > 0
                        THEN COALESCE(SUM(c.amount), 0) / g.target_amount * 100
                        ELSE 0
                    END,
                2) AS percent_complete
            FROM goals g
            LEFT JOIN contributions c ON c.goal_id = g.id
            WHERE g.id = %s
            GROUP BY g.id
        """, (goal_id,))
 
        result = cur.fetchone()
        if not result:
            return None
        summary: dict = result  # type: ignore[assignment]

        # QUERY 2: Per-user totals (for the leaderboard)
        # Groups contributions by user and sums each person's total
        cur.execute("""
            SELECT
                u.id,
                u.name,
                COALESCE(SUM(c.amount), 0) AS total_contributed,
                COUNT(c.id)                AS num_contributions
            FROM users u
            INNER JOIN contributions c
                    ON c.user_id = u.id AND c.goal_id = %s
            GROUP BY u.id
            ORDER BY total_contributed DESC
        """, (goal_id,))
 
        summary["contributors"] = cur.fetchall()
 
        #QUERY 3: Recent activity feed (last 10)
        cur.execute("""
            SELECT
                c.id,
                u.name,
                c.amount,
                c.created_at
            FROM contributions c
            JOIN users u ON u.id = c.user_id
            WHERE c.goal_id = %s
            ORDER BY c.created_at DESC
            LIMIT 10
        """, (goal_id,))
 
        recent = cur.fetchall()

        for key in ("target_amount", "total_raised", "percent_complete"):
            summary[key] = float(summary[key] or 0)
 
        for row in summary["contributors"]:
            r: dict = row  # type: ignore[assignment]
            r["total_contributed"] = float(r["total_contributed"])
 
        for row in recent:
            r: dict = row  # type: ignore[assignment]
            r["amount"] = float(r["amount"])
            r["created_at"] = r["created_at"].isoformat()
 
        summary["recent_contributions"] = recent
        return summary
 
    finally:
        conn.close()
def delete_user(user_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM users WHERE id=%s",
            (user_id,)
        )

        conn.commit()

    except Error:
        conn.rollback()
        raise

    finally:
        conn.close()

def delete_goal(goal_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM goals WHERE id=%s",
            (goal_id,)
        )

        conn.commit()

    except Error:
        conn.rollback()
        raise

    finally:
        conn.close()

