from datetime import datetime
from sqlalchemy import text
from app.database.session import engine, Base, SessionLocal
from app.models.user import User
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
from app.models.match import Match
from app.models.notification import Notification
from app.auth.password import hash_password
from app.core.config import settings
from app.core.logging import logger

def init_db():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Lightweight SQLite migrations for newly added columns
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'student'"))
            conn.commit()
            logger.info("Added missing 'role' column to users table.")
        except Exception:
            pass

        try:
            conn.execute(text("ALTER TABLE found_items ADD COLUMN status VARCHAR(50) DEFAULT 'found_reported'"))
            conn.commit()
            logger.info("Added missing 'status' column to found_items table.")
        except Exception:
            pass

        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN title VARCHAR(255)"))
            conn.commit()
        except Exception:
            pass

        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN message TEXT"))
            conn.commit()
        except Exception:
            pass

        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN notification_type VARCHAR(50) DEFAULT 'potential_match'"))
            conn.commit()
        except Exception:
            pass

        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT 0"))
            conn.commit()
        except Exception:
            pass

    logger.info("Database tables initialized successfully.")

    db = SessionLocal()
    try:
        # Seed Default Administrator User if not existing
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            logger.info(f"Seeding default administrator account: {settings.ADMIN_EMAIL}")
            admin_user = User(
                full_name="Lost & Found Office",
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            logger.info("Default administrator account seeded successfully.")
        elif admin_user.role != "admin":
            admin_user.role = "admin"
            db.commit()

        # Automatic One-Time Demo Seeding if Lost Items count is 0
        if db.query(LostItem).count() == 0:
            logger.info("Empty database detected. Seeding realistic campus demo dataset...")

            # 1. Demo Student Users
            harish = db.query(User).filter(User.email == "harish@gmail.com").first()
            if not harish:
                harish = User(
                    full_name="Harish",
                    email="harish@gmail.com",
                    password_hash=hash_password("Password123!"),
                    role="student"
                )
                db.add(harish)

            megha = db.query(User).filter(User.email == "megha@gmail.com").first()
            if not megha:
                megha = User(
                    full_name="Megha",
                    email="megha@gmail.com",
                    password_hash=hash_password("Password123!"),
                    role="student"
                )
                db.add(megha)

            rahul = db.query(User).filter(User.email == "rahul@gmail.com").first()
            if not rahul:
                rahul = User(
                    full_name="Rahul",
                    email="rahul@gmail.com",
                    password_hash=hash_password("Password123!"),
                    role="student"
                )
                db.add(rahul)

            db.commit()
            db.refresh(harish)
            db.refresh(megha)
            db.refresh(rahul)

            # 2. Demo Lost Items
            lost_wallet = LostItem(
                owner_id=harish.id,
                item_name="Blue Leather Wallet",
                category="Wallets & Cards",
                description="Navy blue leather folding wallet containing student ID and transit card.",
                date_lost=datetime.utcnow(),
                location="Library 2nd Floor"
            )
            db.add(lost_wallet)

            lost_macbook = LostItem(
                owner_id=rahul.id,
                item_name="Silver Macbook Pro",
                category="Electronics",
                description="Silver 14-inch M2 Macbook Pro in a grey protective sleeve.",
                date_lost=datetime.utcnow(),
                location="Student Union Hall"
            )
            db.add(lost_macbook)

            db.commit()
            db.refresh(lost_wallet)
            db.refresh(lost_macbook)

            # 3. Demo Found Items
            found_wallet = FoundItem(
                finder_id=megha.id,
                item_name="Blue Leather Wallet",
                category="Wallets & Cards",
                description="Navy blue leather wallet turned in at Library help desk.",
                date_found=datetime.utcnow(),
                location="Library 2nd Floor",
                status="item_received"
            )
            db.add(found_wallet)

            found_macbook = FoundItem(
                finder_id=megha.id,
                item_name="Silver Macbook Pro",
                category="Electronics",
                description="Silver Macbook Pro turned in at Student Union desk.",
                date_found=datetime.utcnow(),
                location="Student Union Hall",
                status="item_received"
            )
            db.add(found_macbook)

            db.commit()
            db.refresh(found_wallet)
            db.refresh(found_macbook)

            # 4. Demo Matches
            match_wallet = Match(
                lost_item_id=lost_wallet.id,
                found_item_id=found_wallet.id,
                text_similarity=0.98,
                image_similarity=0.92,
                confidence_score=0.95,
                status="waiting_for_pickup"
            )
            db.add(match_wallet)

            match_macbook = Match(
                lost_item_id=lost_macbook.id,
                found_item_id=found_macbook.id,
                text_similarity=0.95,
                image_similarity=0.89,
                confidence_score=0.92,
                status="collected"
            )
            db.add(match_macbook)

            db.commit()
            db.refresh(match_wallet)
            db.refresh(match_macbook)

            # 5. Demo Notifications
            notif_harish = Notification(
                user_id=harish.id,
                match_id=match_wallet.id,
                title="🎉 Potential Match Found: Blue Leather Wallet",
                message="Your 'Blue Leather Wallet' has been matched! The item has been received by the Lost & Found Office. Please visit the office to verify ownership and collect it.",
                notification_type="potential_match",
                is_read=False,
                email_sent=False
            )
            db.add(notif_harish)

            notif_rahul = Notification(
                user_id=rahul.id,
                match_id=match_macbook.id,
                title="Collection Completed",
                message="Item collected at Lost & Found Office. Case closed.",
                notification_type="collection_completed",
                is_read=True,
                email_sent=False
            )
            db.add(notif_rahul)

            db.commit()
            logger.info("Automatic demo dataset seeded successfully!")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
