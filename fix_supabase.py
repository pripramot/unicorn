import os
import re

# === Phase 1: Replace shared Supabase auth modules in main bundles ===
main_bundles = [
    'assets/js/main.acf45739.js',
    'en/assets/js/main.57a7a0ec.js',
]

for f in main_bundles:
    if not os.path.exists(f):
        print(f'SKIP: {f}')
        continue
    with open(f, 'rb') as fh:
        data = fh.read()

    changed = False

    # === Replace module 7702 (Supabase client) ===
    marker_start = b'7702(e,t,n){"use strict"'
    idx = data.find(marker_start)
    if idx >= 0:
        rest = data[idx:]
        supabase_end = rest.find(b'",r)}')
        if supabase_end >= 0:
            old_module = rest[:supabase_end + 5]
            new_module = b'7702(e,t,n){"use strict";n.d(t,{N:()=>a});const a={auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}}),signOut:async()=>({})}}}'
            data = data[:idx] + new_module + data[idx + len(old_module):]
            print(f'  Replaced module 7702 (Supabase client) in {f}')
            changed = True
        else:
            print(f'  Could not find end of module 7702 in {f}')
    else:
        print(f'  Module 7702 NOT FOUND in {f}')

    # === Replace module 7120 (auth context) ===
    marker_7120 = b'7120(e,t,n){"use strict"'
    idx2 = data.find(marker_7120)
    if idx2 >= 0:
        marker_7702 = b',7702(e,t,n){"use strict"'
        end_7120 = data.find(marker_7702, idx2)
        if end_7120 < 0:
            marker_7702 = b'7702(e,t,n){"use strict"'
            end_7120 = data.find(marker_7702, idx2)

        if end_7120 > idx2:
            old_7120 = data[idx2:end_7120]
            new_7120 = b'7120(e,t,n){"use strict";n.d(t,{A:()=>l,O:()=>s});var r=n(6540),o=n(4848);const i=(0,r.createContext)({session:null,user:null,loading:!1,signOut:async()=>{}}),s=({children:e})=>(0,o.jsx)(i.Provider,{value:{session:null,user:null,loading:!1,signOut:async()=>{}},children:e}),l=()=>(0,r.useContext)(i)}'
            data = data[:idx2] + new_7120 + data[end_7120:]
            print(f'  Replaced module 7120 (auth context) in {f}')
            changed = True
        else:
            print(f'  Could not find end of module 7120 in {f}')
    else:
        print(f'  Module 7120 NOT FOUND in {f}')

    if changed:
        with open(f, 'wb') as fh:
            fh.write(data)
        print(f'  SAVED: {f}')
    print()

# === Phase 2: Replace hardcoded createClient calls in page chunk bundles ===
# These chunks contain direct createClient(url, key) calls with hardcoded credentials.
SUPABASE_URL = 'https://lpaqjhrjuokvhsdegynn.supabase.co'
JWT_TOKEN = (
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    '.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYXFqaHJqdW9rdmhzZGVneW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjIxMzgsImV4cCI6MjA4MDIzODEzOH0'
    '.VtWNvXB8mMhOeg9GOwd3s6MjwxDjoMbS5cOW4wLe7WQ'
)

# Minimal stub for components using: auth, from, channel, removeChannel
SUPABASE_STUB = (
    '{auth:{getSession:async()=>({data:{session:null},error:null}),'
    'onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}}),'
    'signOut:async()=>({}),'
    'signInWithPassword:async()=>({data:null,error:{message:"Not configured"}})},'
    'from:()=>({select:()=>({eq:()=>Promise.resolve({data:[],error:null}),'
    'order:()=>Promise.resolve({data:[],error:null}),'
    'limit:()=>Promise.resolve({data:[],error:null})}),'
    'insert:()=>Promise.resolve({data:null,error:{message:"Not configured"}}),'
    'update:()=>Promise.resolve({data:null,error:{message:"Not configured"}}),'
    'delete:()=>Promise.resolve({data:null,error:{message:"Not configured"}})}),'
    'channel:()=>{const ch={on:function(){return this},subscribe:function(){return this},'
    'unsubscribe:function(){}};return ch},'
    'removeChannel:()=>{}}'
)

CRED_PATTERN = re.compile(
    r'\(0,\w+\.UU\)\("' + re.escape(SUPABASE_URL) + r'","' + re.escape(JWT_TOKEN) + r'"\)'
)

chunk_files = [
    'assets/js/37acbf14.a65388a4.js',
    'assets/js/81394e55.3781a275.js',
    'assets/js/25626d15.468afa10.js',
    'en/assets/js/37acbf14.a65388a4.js',
    'en/assets/js/81394e55.3781a275.js',
    'en/assets/js/25626d15.468afa10.js',
]

for f in chunk_files:
    if not os.path.exists(f):
        print(f'SKIP: {f}')
        continue
    content = open(f, encoding='utf-8').read()
    matches = list(CRED_PATTERN.finditer(content))
    if not matches:
        print(f'  No credentials in: {f}')
        continue
    new_content = CRED_PATTERN.sub(SUPABASE_STUB, content)
    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(new_content)
    print(f'  Replaced {len(matches)} credential(s) in {f}')
print()

# === Phase 3: Redact project URL from documentation pages ===
PLACEHOLDER_URL = 'https://your-project-ref.supabase.co'
doc_files = [
    'docs/aceso/supabase-setup/index.html',
    'en/docs/aceso/supabase-setup/index.html',
    'assets/js/fe0df626.3ac7e93a.js',
    'en/assets/js/fe0df626.adbe80ea.js',
]

for f in doc_files:
    if not os.path.exists(f):
        print(f'SKIP: {f}')
        continue
    content = open(f, encoding='utf-8').read()
    if SUPABASE_URL not in content:
        print(f'  No URL in: {f}')
        continue
    new_content = content.replace(SUPABASE_URL, PLACEHOLDER_URL)
    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(new_content)
    print(f'  Redacted project URL in: {f}')
print()

print("Done!")
