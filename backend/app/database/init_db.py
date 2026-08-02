from sqlalchemy import text
from app.database.session import engine, Base, SessionLocal
from app.models.user import User  # noqa
from app.models.lost_item import LostItem  # noqa
from app.models.found_item import FoundItem  # noqa
from app.models.match import Match  # noqa
from app.models.notification import Notification  # noqa
from app.auth.password import hash_password
from app.core.config import settings
from app.core.logging import logger

def init_db():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Lightweight SQLite migrations for newly added columns
    with engine.connect() as conn:
        # 1. 'role' column on users table
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'student'"))
            conn.commit()
            logger.info("Added missing 'role' column to users table.")
        except Exception:
            pass

        # 2. 'status' column on found_items table
        try:
            conn.execute(text("ALTER TABLE found_items ADD COLUMN status VARCHAR(50) DEFAULT 'found_reported'"))
            conn.commit()
            logger.info("Added missing 'status' column to found_items table.")
        except Exception:
            pass

        # 3. 'title' column on notifications table
        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN title VARCHAR(255)"))
            conn.commit()
        except Exception:
            pass

        # 4. 'message' column on notifications table
        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN message TEXT"))
            conn.commit()
        except Exception:
            pass

        # 5. 'notification_type' column on notifications table
        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN notification_type VARCHAR(50) DEFAULT 'potential_match'"))
            conn.commit()
        except Exception:
            pass

        # 6. 'is_read' column on notifications table
        try:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT 0"))
            conn.commit()
        except Exception:
            pass

    logger.info("Database tables initialized successfully.")

    # Seed Default Administrator User if not existing
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            logger.info(f"Seeding default administrator account: {settings.ADMIN_EMAIL}")
            admin_user = User(
                full_name="System Administrator",
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            logger.info("Default administrator account seeded successfully.")
        elif admin_user.role != "admin":
            admin_user.role = "admin"
            db.commit()
            logger.info("Updated existing user to administrator role.")
    except Exception as e:
        logger.error(f"Error seeding administrator account: {e}")
        db.rollback()
    finally:
        db.close()
