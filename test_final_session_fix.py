import os
import sys
import asyncio
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

async def run_session_fix_test():
    print("========================================================================")
    print("    AI LOST & FOUND ASSISTANT - STARTUP SESSION FIX VERIFICATION TEST   ")
    print("========================================================================")

    import httpx
    from app.main import app
    from app.database.init_db import init_db
    from app.core.config import settings

    init_db()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://127.0.0.1:8000") as client:
        # Step 1: Verify Fresh Login Required (No auto-restored credentials)
        print("[1/3] Verifying fresh startup login behavior...")
        me_unauth = await client.get("/auth/me")
        assert me_unauth.status_code == 401, "Fresh unauthenticated request must return 401 Unauthorized"
        print("  [OK] Unauthenticated request correctly rejected with 401 Unauthorized.")

        # Step 2: Authenticate Student Session
        print("[2/3] Authenticating student session...")
        email = f"session_test_{int(datetime.utcnow().timestamp())}@example.com"
        reg_res = await client.post("/auth/register", json={
            "full_name": "Session Tester",
            "email": email,
            "password": "Password123!"
        })
        assert reg_res.status_code == 201

        login_res = await client.post("/auth/login", json={
            "email": email,
            "password": "Password123!"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("  [OK] Student authenticated & session token issued.")

        # Step 3: Verify Authenticated Me Endpoint
        print("[3/3] Verifying authenticated profile endpoint...")
        me_auth = await client.get("/auth/me", headers=headers)
        assert me_auth.status_code == 200
        assert me_auth.json()["email"] == email
        print("  [OK] Authenticated profile verified successfully.")

    print("\n========================================================================")
    print("      STARTUP SESSION FIX VERIFICATION TEST PASSED CLEANLY!             ")
    print("========================================================================")

if __name__ == "__main__":
    asyncio.run(run_session_fix_test())
