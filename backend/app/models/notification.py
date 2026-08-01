from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    title = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    notification_type = Column(String(50), nullable=False, default="potential_match")
    is_read = Column(Boolean, nullable=False, default=False)
    email_sent = Column(Boolean, nullable=False, default=False)
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="notifications")
    match = relationship("Match", back_populates="notifications")
