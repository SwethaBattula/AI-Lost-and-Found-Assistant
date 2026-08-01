import os
import sys
import io
import asyncio
from datetime import datetime
from PIL import Image

# Add app to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

def create_dummy_image_bytes(filename: str = "test.png") -> tuple[str, io.BytesIO, str]:
    img = Image.new("RGB", (100, 100), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return (filename, buf, "image/png")

async def run_tests_async():
    print("==================================================")
    print("   AI LOST & FOUND ASSISTANT - BACKEND TEST RUN   ")
    print("==================================================")
    
    import httpx
    from app.main import app
    from app.database.init_db import init_db
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Database Initialization
        print("[1/13] Initializing Database...")
        init_db()
        print("  [OK] Database initialized successfully.")

        # 2. OpenAPI / Swagger Check
        print("[2/13] Checking OpenAPI / Swagger documentation schema...")
        res = await client.get("/openapi.json")
        assert res.status_code == 200, f"OpenAPI schema failed: {res.text}"
        paths = res.json().get("paths", {})
        assert "/auth/register" in paths
        assert "/auth/login" in paths
        assert "/auth/me" in paths
        assert "/lost-items/" in paths
        assert "/found-items/" in paths
        assert "/matches/" in paths
        assert "/notifications/" in paths
        print(f"  [OK] All {len(paths)} API endpoints visible in Swagger documentation.")

        # 3. User Registration
        print("[3/13] Testing User Registration (Argon2)...")
        email1 = "alice@example.com"
        email2 = "bob@example.com"
        
        res1 = await client.post("/auth/register", json={
            "full_name": "Alice Smith",
            "email": email1,
            "password": "SecurePassword123!"
        })
        assert res1.status_code == 201, f"Registration failed: {res1.text}"
        print(f"  [OK] User Alice registered (ID: {res1.json()['id']}).")

        res2 = await client.post("/auth/register", json={
            "full_name": "Bob Jones",
            "email": email2,
            "password": "BobSecurePassword456!"
        })
        assert res2.status_code == 201, f"Registration failed: {res2.text}"
        print(f"  [OK] User Bob registered (ID: {res2.json()['id']}).")

        # Duplicate registration test
        res_dup = await client.post("/auth/register", json={
            "full_name": "Alice Duplicate",
            "email": email1,
            "password": "Password123!"
        })
        assert res_dup.status_code == 400
        print("  [OK] Duplicate email registration prevented cleanly.")

        # 4. User Login
        print("[4/13] Testing User Login & JWT Token Generation...")
        login_res1 = await client.post("/auth/login", json={
            "email": email1,
            "password": "SecurePassword123!"
        })
        assert login_res1.status_code == 200, f"Login failed: {login_res1.text}"
        alice_token = login_res1.json()["access_token"]
        assert alice_token, "No access token returned"
        print("  [OK] Alice logged in successfully. JWT Token acquired.")

        login_res2 = await client.post("/auth/login", json={
            "email": email2,
            "password": "BobSecurePassword456!"
        })
        assert login_res2.status_code == 200, f"Login failed: {login_res2.text}"
        bob_token = login_res2.json()["access_token"]
        print("  [OK] Bob logged in successfully. JWT Token acquired.")

        # 5. Protected Routes
        print("[5/13] Testing Protected Route (/auth/me)...")
        headers_alice = {"Authorization": f"Bearer {alice_token}"}
        headers_bob = {"Authorization": f"Bearer {bob_token}"}
        
        me_res = await client.get("/auth/me", headers=headers_alice)
        assert me_res.status_code == 200
        assert me_res.json()["email"] == email1
        print(f"  [OK] Protected route /auth/me authenticated for {me_res.json()['full_name']}.")

        # 6. Lost Item CRUD & Image Upload
        print("[6/13] Testing Lost Item CRUD & Image Upload...")
        fname, fbuf, ftype = create_dummy_image_bytes("lost_wallet.png")
        
        lost_data = {
            "item_name": "Black Leather Wallet",
            "category": "Wallets & Cards",
            "description": "Black leather bifold wallet with credit cards and driver's license lost near Central Park.",
            "date_lost": datetime.utcnow().isoformat(),
            "location": "Central Park, NY"
        }
        
        res_lost = await client.post(
            "/lost-items/",
            data=lost_data,
            files={"image": (fname, fbuf.getvalue(), ftype)},
            headers=headers_alice
        )
        assert res_lost.status_code == 201, f"Lost item creation failed: {res_lost.text}"
        lost_item = res_lost.json()
        lost_id = lost_item["id"]
        assert lost_item["image_path"].startswith("/uploads/lost/")
        print(f"  [OK] Lost item created with ID {lost_id}. Image stored at {lost_item['image_path']}.")

        # List Lost Items
        res_list_lost = await client.get("/lost-items/", headers=headers_alice)
        assert res_list_lost.status_code == 200
        assert len(res_list_lost.json()) >= 1
        print("  [OK] Lost items list retrieved.")

        # 7. Found Item CRUD & Image Upload
        print("[7/13] Testing Found Item CRUD & Image Upload...")
        fname2, fbuf2, ftype2 = create_dummy_image_bytes("found_wallet.png")
        
        found_data = {
            "item_name": "Leather Wallet Black",
            "category": "Wallets & Cards",
            "description": "Found a black leather wallet containing cards near Central Park bench.",
            "date_found": datetime.utcnow().isoformat(),
            "location": "Central Park, NY"
        }
        
        res_found = await client.post(
            "/found-items/",
            data=found_data,
            files={"image": (fname2, fbuf2.getvalue(), ftype2)},
            headers=headers_bob
        )
        assert res_found.status_code == 201, f"Found item creation failed: {res_found.text}"
        found_item = res_found.json()
        found_id = found_item["id"]
        assert found_item["image_path"].startswith("/uploads/found/")
        print(f"  [OK] Found item created with ID {found_id}. Image stored at {found_item['image_path']}.")

        # 8. AI Match Processing
        print("[8/13] Testing AI Matching & Similarity Computation...")
        matches_res = await client.get("/matches/", headers=headers_alice)
        assert matches_res.status_code == 200
        matches = matches_res.json()
        assert len(matches) >= 1, "Expected at least 1 match record created automatically"
        match = matches[0]
        print(f"  [OK] Match record generated automatically (Match ID: {match['id']}).")
        print(f"    - Text Similarity: {match['text_similarity']}")
        print(f"    - Image Similarity: {match['image_similarity']}")
        print(f"    - Confidence Score: {match['confidence_score']}")
        print(f"    - Status: {match['status']}")

        # 9. Match Status Update
        print("[9/13] Testing Match Status Update...")
        match_id = match["id"]
        status_res = await client.put(f"/matches/{match_id}/status", json={"status": "confirmed"}, headers=headers_alice)
        assert status_res.status_code == 200
        assert status_res.json()["status"] == "confirmed"
        print(f"  [OK] Match ID {match_id} status updated to 'confirmed'.")

        # 10. Manual Matching Trigger
        print("[10/13] Testing Manual Matching Sweep Trigger...")
        trigger_res = await client.post("/matches/trigger-matching", headers=headers_alice)
        assert trigger_res.status_code == 200
        print(f"  [OK] Matching sweep triggered: {trigger_res.json()['message']}")

        # 11. Notifications Check
        print("[11/13] Testing Notifications Retrieval...")
        notif_res = await client.get("/notifications/", headers=headers_alice)
        assert notif_res.status_code == 200
        print(f"  [OK] Notifications retrieved successfully ({len(notif_res.json())} notifications).")

        # 12. Email Service Configuration Validation
        print("[12/13] Validating Email Service Configuration...")
        from app.services.email_service import send_match_email
        email_ok = send_match_email("test@example.com", "Test User", "Lost Keys", "Found Keys", "Library", 0.85)
        assert email_ok is True
        print("  [OK] Email notification service validated cleanly.")

        # 13. Clean Deletions
        print("[13/13] Testing Item Updates & Deletions...")
        up_res = await client.put(f"/lost-items/{lost_id}", json={"item_name": "Black Leather Bifold Wallet"}, headers=headers_alice)
        assert up_res.status_code == 200
        assert up_res.json()["item_name"] == "Black Leather Bifold Wallet"
        print(f"  [OK] Lost item ID {lost_id} updated.")

        del_res = await client.delete(f"/lost-items/{lost_id}", headers=headers_alice)
        assert del_res.status_code == 204
        print(f"  [OK] Lost item ID {lost_id} deleted successfully.")

    print("\n==================================================")
    print("   ALL 13 VERIFICATION TESTS PASSED SUCCESSFULLY! ")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_tests_async())
