from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.match import MatchResponse

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    match_id: int
    title: str | None = None
    message: str | None = None
    notification_type: str = "potential_match"
    is_read: bool = False
    email_sent: bool
    sent_at: datetime
    match: MatchResponse | None = None

    model_config = ConfigDict(from_attributes=True)
