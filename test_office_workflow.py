import os
import sys
import asyncio
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

async def run_office_workflow_test():
    print("========================================================================")
    print("    AI LOST & FOUND ASSISTANT - OFFICE SUPERVISION WORKFLOW TEST        ")
    print("========================================================================")

    import httpx
    from app.main import app
    from app.database.init_db import init_db
    from app.core.config import settings

    init_db()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://127.0.0.1:8000") as client:
        # Step 1: Admin Login
        print("[1/7] Authenticating as Lost & Found Office Admin...")
        admin_login = await client.post("/auth/login", json={
            "email": settings.ADMIN_EMAIL,
            "password": settings.ADMIN_PASSWORD
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("  [OK] Office Admin logged in.")

        # Step 2: Register Owner Student & Finder Student
        print("[2/7] Registering Owner and Finder Students...")
        owner_email = f"owner_{int(datetime.utcnow().timestamp())}@example.com"
        finder_email = f"finder_{int(datetime.utcnow().timestamp())}@example.com"

        await client.post("/auth/register", json={
            "full_name": "Alice Owner",
            "email": owner_email,
            "password": "Password123!"
        })
        owner_login = await client.post("/auth/login", json={"email": owner_email, "password": "Password123!"})
        owner_token = owner_login.json()["access_token"]
        owner_headers = {"Authorization": f"Bearer {owner_token}"}

        await client.post("/auth/register", json={
            "full_name": "Bob Finder",
            "email": finder_email,
            "password": "Password123!"
        })
        finder_login = await client.post("/auth/login", json={"email": finder_email, "password": "Password123!"})
        finder_token = finder_login.json()["access_token"]
        finder_headers = {"Authorization": f"Bearer {finder_token}"}
        print("  [OK] Owner & Finder students registered.")

        # Step 3: Owner Reports Lost Item
        print("[3/7] Owner reporting Lost Item...")
        lost_res = await client.post("/lost-items/", data={
            "item_name": "Silver Macbook Pro",
            "category": "Electronics",
            "description": "Silver 14-inch Macbook Pro lost near Student Union",
            "date_lost": datetime.utcnow().isoformat(),
            "location": "Student Union Hall"
        }, headers=owner_headers)
        assert lost_res.status_code == 201
        lost_id = lost_res.json()["id"]

        # Step 4: Finder Reports Found Item & Submits to Office
        print("[4/7] Finder reporting Found Item & Submitting to Office...")
        found_res = await client.post("/found-items/", data={
            "item_name": "Silver Macbook Pro",
            "category": "Electronics",
            "description": "Silver 14-inch Macbook Pro found near Student Union",
            "date_found": datetime.utcnow().isoformat(),
            "location": "Student Union Hall"
        }, headers=finder_headers)
        assert found_res.status_code == 201
        found_id = found_res.json()["id"]

        mark_res = await client.put(f"/found-items/{found_id}/mark-received", headers=finder_headers)
        assert mark_res.status_code == 200
        assert mark_res.json()["status"] == "item_received"
        print("  [OK] Found item status updated to 'item_received'.")

        # Step 5: Verify Immediate Owner Notification for Pickup at Office
        print("[5/7] Verifying Immediate AI Match & Owner Office Pickup Notification...")
        owner_notifs = await client.get("/notifications/", headers=owner_headers)
        assert owner_notifs.status_code == 200
        notifs_list = owner_notifs.json()
        assert len(notifs_list) > 0
        latest_notif = notifs_list[0]
        assert "Lost & Found Office" in latest_notif["message"]
        print("  [OK] Immediate AI match notification delivered to owner directing to Office.")

        # Step 6: Office Admin Reviews Office Inventory
        print("[6/7] Office Admin Reviewing Office Inventory...")
        inventory_res = await client.get("/admin/inventory", headers=admin_headers)
        assert inventory_res.status_code == 200
        inv_list = inventory_res.json()
        assert any(item["id"] == found_id for item in inv_list)
        print("  [OK] Found item appears in Office Inventory.")

        # Step 7: Office Admin Handover (Case Closed)
        print("[7/7] Office Admin Marking Case as Handed Over (Case Closed)...")
        admin_matches_res = await client.get("/admin/matches", headers=admin_headers)
        assert admin_matches_res.status_code == 200
        matches = admin_matches_res.json()
        target_match = next((m for m in matches if m["lost_item_id"] == lost_id and m["found_item_id"] == found_id), None)
        assert target_match is not None, "Match pair missing"
        match_id = target_match["id"]

        handover_res = await client.put(f"/admin/matches/{match_id}/handover", headers=admin_headers)
        assert handover_res.status_code == 200
        assert handover_res.json()["status"] == "handed_over"
        print("  [OK] Match status updated to 'handed_over' (Case Closed).")

    print("\n========================================================================")
    print("      OFFICE SUPERVISION WORKFLOW TEST PASSED SUCCESSFULLY!            ")
    print("========================================================================")

if __name__ == "__main__":
    asyncio.run(run_office_workflow_test())
