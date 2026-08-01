from app.database.session import engine, Base
# Import all models to ensure they are registered on Base.metadata
from app.models.user import User  # noqa
from app.models.lost_item import LostItem  # noqa
from app.models.found_item import FoundItem  # noqa
from app.models.match import Match  # noqa
from app.models.notification import Notification  # noqa
from app.core.logging import logger

def init_db():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
