import os
import sys
import asyncio
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

async def run_final_workflow_test():
    print("========================================================================")
    print("    AI LOST & FOUND ASSISTANT - FINAL WORKFLOW POLISH TEST              ")
    print("========================================================================")

    import httpx
    from app.main import app
    from app.database.init_db import init_db
    from app.core.config import settings

    init_db()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://127.0.0.1:8000") as client:
        # Step 1: Admin Login
        print("[1/5] Authenticating as Lost & Found Office Admin...")
        admin_login = await client.post("/auth/login", json={
            "email": settings.ADMIN_EMAIL,
            "password": settings.ADMIN_PASSWORD
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("  [OK] Office Admin logged in.")

        # Step 2: Register Owner and Finder Students
        print("[2/5] Registering Owner and Finder Students...")
        ts = int(datetime.utcnow().timestamp())
        owner_email = f"final_owner_{ts}@example.com"
        finder_email = f"final_finder_{ts}@example.com"

        await client.post("/auth/register", json={"full_name": "Final Owner", "email": owner_email, "password": "Password123!"})
        owner_login = await client.post("/auth/login", json={"email": owner_email, "password": "Password123!"})
        owner_token = owner_login.json()["access_token"]
        owner_headers = {"Authorization": f"Bearer {owner_token}"}

        await client.post("/auth/register", json={"full_name": "Final Finder", "email": finder_email, "password": "Password123!"})
        finder_login = await client.post("/auth/login", json={"email": finder_email, "password": "Password123!"})
        finder_token = finder_login.json()["access_token"]
        finder_headers = {"Authorization": f"Bearer {finder_token}"}

        # Step 3: Owner Lost Report & Finder Found Report
        print("[3/5] Creating Lost Report, Found Report, and Marking Item Received...")
        lost_res = await client.post("/lost-items/", data={
            "item_name": "Sony Wireless Headphones",
            "category": "Electronics",
            "description": "Black Sony WH-1000XM4 noise canceling headphones",
            "date_lost": datetime.utcnow().isoformat(),
            "location": "Library 2nd Floor"
        }, headers=owner_headers)
        assert lost_res.status_code == 201
        lost_id = lost_res.json()["id"]

        found_res = await client.post("/found-items/", data={
            "item_name": "Sony Wireless Headphones",
            "category": "Electronics",
            "description": "Black Sony WH-1000XM4 noise canceling headphones",
            "date_found": datetime.utcnow().isoformat(),
            "location": "Library 2nd Floor"
        }, headers=finder_headers)
        assert found_res.status_code == 201
        found_id = found_res.json()["id"]

        await client.put(f"/found-items/{found_id}/mark-received", headers=finder_headers)
        print("  [OK] Reports created & item marked as received at Office.")

        # Step 4: Verify AI Confidence Breakdown & Office Matches
        print("[4/5] Verifying Match Breakdown & Office Oversight API...")
        admin_matches_res = await client.get("/admin/matches", headers=admin_headers)
        assert admin_matches_res.status_code == 200
        matches = admin_matches_res.json()
        target_match = next((m for m in matches if m["lost_item_id"] == lost_id and m["found_item_id"] == found_id), None)
        assert target_match is not None
        assert "confidence_score" in target_match
        assert "text_similarity" in target_match
        assert "image_similarity" in target_match
        print(f"  [OK] Match found! Overall: {target_match['confidence_score']}, Text: {target_match['text_similarity']}")

        # Step 5: Mark Case as Collected (Case Closed)
        print("[5/5] Marking Match as Collected (Close Case)...")
        collect_res = await client.put(f"/admin/matches/{target_match['id']}/collect", headers=admin_headers)
        assert collect_res.status_code == 200
        assert collect_res.json()["status"] == "collected"
        print("  [OK] Case successfully updated to status 'collected'.")

    print("\n========================================================================")
    print("      FINAL WORKFLOW POLISH INTEGRATION TEST PASSED!                    ")
    print("========================================================================")

if __name__ == "__main__":
    asyncio.run(run_final_workflow_test())
