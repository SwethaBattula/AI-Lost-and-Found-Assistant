from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.match import MatchResponse

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    match_id: int
    email_sent: bool
    sent_at: datetime
    match: MatchResponse | None = None

    model_config = ConfigDict(from_attributes=True)
