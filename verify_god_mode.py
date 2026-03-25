import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

print("--- Verifying God Mode ---")
if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not set.")
    exit(1)

supabase = create_client(url, key)

try:
    # Try to list users (Requires Service Key)
    # The 'auth' namespace administration usually requires the service_role key
    print("Attempting to list users (Admin Action)...")
    users = supabase.auth.admin.list_users()
    print(f"Success! Found {len(users)} users.")
    for u in users[:3]:
        print(f" - {u.email} ({u.id})")

    print("\nGod Mode Verified: You have full Admin access.")
except Exception as e:
    print(f"\nFailed: {e}")
