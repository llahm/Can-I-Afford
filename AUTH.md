# AUTH.md — Security & Three Attacks Verification
- **Attack 1 (Signed-out write)**: Blocked in `app/api/calculations/route.js` via `if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });`
- **Attack 2 (Other user record ID)**: Blocked in `app/api/calculations/route.js` via `if (record.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });`
- **Attack 3 (Crafted return link)**: Blocked in `app/signin/page.jsx` via `const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";`