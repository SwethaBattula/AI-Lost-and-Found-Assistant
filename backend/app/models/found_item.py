from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class FoundItem(Base):
    __tablename__ = "found_items"

    id = Column(Integer, primary_key=True, index=True)
    finder_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_name = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    date_found = Column(DateTime, nullable=False)
    location = Column(String(255), nullable=False)
    image_path = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False, default="found_reported")  # found_reported, item_received
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    finder = relationship("User", back_populates="found_items")
    matches = relationship("Match", back_populates="found_item", cascade="all, delete-orphan")
