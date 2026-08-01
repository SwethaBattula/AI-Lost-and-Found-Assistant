from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse

class FoundItemBase(BaseModel):
    item_name: str
    category: str
    description: str
    date_found: datetime
    location: str

class FoundItemCreate(FoundItemBase):
    pass

class FoundItemUpdate(BaseModel):
    item_name: str | None = None
    category: str | None = None
    description: str | None = None
    date_found: datetime | None = None
    location: str | None = None

class FoundItemResponse(FoundItemBase):
    id: int
    finder_id: int
    image_path: str | None = None
    created_at: datetime
    finder: UserResponse | None = None

    model_config = ConfigDict(from_attributes=True)
