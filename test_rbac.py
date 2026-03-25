import os
import ast
from dotenv import load_dotenv
from supabase import create_client
import pg8000.native
import time
import json

# Consolidate imports and setup to make test standalone
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
DB_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD")
DB_HOST = os.getenv("SUPABASE_DB_HOST")
DB_USER = os.getenv("SUPABASE_DB_USER", "postgres")
DB_PORT = int(os.getenv("SUPABASE_DB_PORT", "5432"))

supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

def query_sql(query: str, **params) -> str:
    if not DB_PASSWORD:
        return "Error: SUPABASE_DB_PASSWORD not set."
    try:
        conn = pg8000.native.Connection(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database="postgres",
            ssl_context=True
        )
        results = conn.run(query, **params)
        conn.close()
        return str(results)
    except Exception as e:
        return f"SQL Error: {str(e)}"

def admin_create_user(email: str, password: str, role: str = "user") -> str:
    if not supabase:
        return "Error: Supabase Service Key not configured."
    try:
        user = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {"role": role}
        })
        user_id = user.user.id

        # Explicit Profile Creation
        profile_data = {
            "id": user_id,
            "email": email,
            "role": role,
            "profile_settings": {"theme": "light", "notifications": True}
        }
        supabase.table("profiles").upsert(profile_data).execute()

        return f"Successfully created user {email} with role {role} (ID: {user_id})"
    except Exception as e:
        return f"Error creating user: {str(e)}"

def admin_update_role(email: str, new_role: str) -> str:
    try:
        # 1. Get User ID by Email
        res = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if not res.data:
            return f"Error: User {email} not found in profiles."

        user_id = res.data['id']

        # 2. Update Role
        response = supabase.table("profiles").update({"role": new_role}).eq("id", user_id).execute()
        return f"Updated role for {email} to {new_role}. Result: {str(response.data)}"
    except Exception as e:
        return f"Error updating role: {str(e)}"

def update_profile_settings(user_id: str, settings_json: str) -> str:
    if not supabase:
        return "Error: Supabase Service Key not configured."
    try:
        settings = json.loads(settings_json)
        response = supabase.table("profiles").update({"profile_settings": settings}).eq("id", user_id).execute()
        return f"Updated settings for {user_id}: {str(response.data)}"
    except Exception as e:
        return f"Error updating settings: {str(e)}"


def test_rbac_flow():
    print("--- Starting RBAC Test ---")

    # 1. Create a Test User (Standard User)
    test_email = f"test_user_{int(time.time())}@example.com"
    print(f"\n1. Creating User: {test_email}")
    res = admin_create_user(test_email, "password123", "user")
    print(res)

    if "Error" in res:
        print("Failed to create user. Aborting.")
        return

    # Extract ID (simple parse for now)
    try:
        user_id = res.split("(ID: ")[1].split(")")[0]
    except Exception:
        # Fallback to parameterized query
        raw = query_sql("SELECT id FROM profiles WHERE email = :email", email=test_email)
        user_id = ast.literal_eval(raw)[0][0]

    # 2. Verify Profile Creation
    print(f"\n2. Verifying Profile for {user_id}...")
    profile = query_sql("SELECT role, email FROM profiles WHERE id = :uid", uid=user_id)
    print(f"Profile Data: {profile}")

    # 3. Create Super Admin
    admin_email = f"admin_{int(time.time())}@example.com"
    print(f"\n3. Creating Super Admin: {admin_email}")
    res_admin = admin_create_user(admin_email, "securepass", "super_admin")
    print(res_admin)

    # 4. Update Settings
    print(f"\n4. Updating Settings for {test_email}...")
    settings = json.dumps({"theme": "dark", "menu": "compact", "notifications": False})
    res_update = update_profile_settings(user_id, settings)
    print(f"Update Result: {res_update}")

    # Verify Settings
    settings_check = query_sql(
        "SELECT profile_settings FROM profiles WHERE id = :uid", uid=user_id
    )
    print(f"Settings in DB: {settings_check}")

    print("\n--- Test Complete ---")


if __name__ == "__main__":
    test_rbac_flow()
