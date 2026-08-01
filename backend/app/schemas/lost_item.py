from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse

class LostItemBase(BaseModel):
    item_name: str
    category: str
    description: str
    date_lost: datetime
    location: str

class LostItemCreate(LostItemBase):
    pass

class LostItemUpdate(BaseModel):
    item_name: str | None = None
    category: str | None = None
    description: str | None = None
    date_lost: datetime | None = None
    location: str | None = None

class LostItemResponse(LostItemBase):
    id: int
    owner_id: int
    image_path: str | None = None
    created_at: datetime
    owner: UserResponse | None = None

    model_config = ConfigDict(from_attributes=True)
