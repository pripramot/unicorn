import os

files = [
    'assets/js/main.acf45739.js',
    'en/assets/js/main.57a7a0ec.js',
]

for f in files:
    if not os.path.exists(f):
        print(f'SKIP: {f}')
        continue
    with open(f, 'rb') as fh:
        data = fh.read()

    changed = False

    # === Replace module 7702 (Supabase client) ===
    # Find the module boundaries
    marker_start = b'7702(e,t,n){"use strict"'
    idx = data.find(marker_start)
    if idx >= 0:
        # Find the end of module 7702 - it ends right before },1513 or the next module
        # The module pattern is: 7702(e,t,n){...},NEXT_MODULE
        # Find the next module start after 7702
        rest = data[idx:]
        # Find ",r)}" which ends the supabase createClient call, then the next module
        supabase_end = rest.find(b'",r)}')
        if supabase_end >= 0:
            old_module = rest[:supabase_end + 5]  # include ",r)}"
            # New dummy module
            new_module = (
                b'7702(e,t,n){"use strict";n.d(t,{N:()=>a});'
                b'const a={auth:{getSession:async()=>({data:{session:null},error:null}),'
                b'onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}}),signOut:async()=>({})}}'
                b'}'
            )
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
        # module 7120 ends right before module 7702
        marker_7702 = b',7702(e,t,n){"use strict"'
        end_7120 = data.find(marker_7702, idx2)
        if end_7120 < 0:
            # Try without comma prefix
            marker_7702 = b'7702(e,t,n){"use strict"'
            end_7120 = data.find(marker_7702, idx2)

        if end_7120 > idx2:
            old_7120 = data[idx2:end_7120]
            new_7120 = (
                b'7120(e,t,n){"use strict";n.d(t,{A:()=>l,O:()=>s});'
                b'var r=n(6540),o=n(4848);'
                b'const i=(0,r.createContext)({session:null,user:null,loading:!1,signOut:async()=>{}}),'
                b's=({children:e})=>(0,o.jsx)(i.Provider,{value:{session:null,user:null,loading:!1,'
                b'signOut:async()=>{}},children:e}),l=()=>(0,r.useContext)(i)}'
            )
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

print("Done!")
