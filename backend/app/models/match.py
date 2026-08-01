from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("lost_items.id"), nullable=False)
    found_item_id = Column(Integer, ForeignKey("found_items.id"), nullable=False)
    text_similarity = Column(Float, nullable=False, default=0.0)
    image_similarity = Column(Float, nullable=False, default=0.0)
    confidence_score = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="pending")  # pending, confirmed, rejected
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    lost_item = relationship("LostItem", back_populates="matches")
    found_item = relationship("FoundItem", back_populates="matches")
    notifications = relationship("Notification", back_populates="match", cascade="all, delete-orphan")
