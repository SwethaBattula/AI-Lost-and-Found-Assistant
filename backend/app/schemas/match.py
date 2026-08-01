from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.lost_item import LostItemResponse
from app.schemas.found_item import FoundItemResponse

class MatchStatusUpdate(BaseModel):
    status: str  # pending, confirmed, rejected

class MatchResponse(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    text_similarity: float
    image_similarity: float
    confidence_score: float
    status: str
    created_at: datetime
    lost_item: LostItemResponse | None = None
    found_item: FoundItemResponse | None = None

    model_config = ConfigDict(from_attributes=True)
