import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

print("--- Checking Profiles Table via API ---")
try:
    # Try to select from profiles
    res = supabase.table("profiles").select("role").limit(1).execute()
    print("Success! 'role' column exists.")
    print(res)
except Exception as e:
    print(f"Failed to query profiles: {e}")
