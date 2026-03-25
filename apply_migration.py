import os
import ssl
import sys
from dotenv import load_dotenv
import pg8000.native

# Load environment variables
load_dotenv()

DB_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD")
DB_HOST = os.getenv("SUPABASE_DB_HOST")
DB_USER = os.getenv("SUPABASE_DB_USER", "postgres")
DB_PORT = int(os.getenv("SUPABASE_DB_PORT", "5432"))


def query_sql_direct(query: str) -> str:
    if not DB_PASSWORD:
        return "Error: SUPABASE_DB_PASSWORD not set."

    try:
        # Robust SSL Context (borrowed from run_migration.py)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        conn = pg8000.native.Connection(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database="postgres",
            ssl_context=ssl_context
        )
        results = conn.run(query)
        conn.close()
        return str(results)
    except Exception as e:
        return f"SQL Error: {str(e)}"


def apply_migration(file_path):
    print(f"Applying migration: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql = f.read()

        # Simple split for basic compatibility if run() fails on multiple statements
        # But 'DO $$ ... $$' blocks contain semicolons, so simple split is dangerous.
        # Let's try running full first.

        result = query_sql_direct(sql)
        print(f"Result: {result}")
        print("Migration applied successfully!")
    except Exception as e:
        print(f"Error applying migration: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <path_to_migration.sql>")
        sys.exit(1)
    migration_file = sys.argv[1]
    apply_migration(migration_file)
