from db import get_connection

conn = get_connection()

if conn and conn.is_connected():
    print("Connected successfully")
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE()")
    print(cursor.fetchone())
    cursor.close()
    conn.close()
else:
    print("Connection failed")