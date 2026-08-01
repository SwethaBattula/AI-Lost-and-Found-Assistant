from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.lost_item import LostItem
from app.schemas.lost_item import LostItemResponse, LostItemUpdate
from app.auth.dependencies import get_current_user
from app.utils.file_storage import save_upload_image
from app.services.match_service import run_match_for_lost_item
from app.core.config import settings
from app.core.exceptions import EntityNotFoundException

router = APIRouter(prefix="/lost-items", tags=["Lost Items"])

@router.post("/", response_model=LostItemResponse, status_code=status.HTTP_201_CREATED)
async def create_lost_item(
    item_name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    date_lost: datetime = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a lost item entry with optional image upload (.jpg, .jpeg, .png).
    Automatically triggers AI match evaluation.
    """
    image_path = None
    if image and image.filename:
        image_path = await save_upload_image(image, settings.UPLOAD_LOST_DIR)

    lost_item = LostItem(
        owner_id=current_user.id,
        item_name=item_name,
        category=category,
        description=description,
        date_lost=date_lost,
        location=location,
        image_path=image_path
    )
    db.add(lost_item)
    db.commit()
    db.refresh(lost_item)

    # Trigger background match evaluation
    run_match_for_lost_item(db, lost_item)

    return lost_item

@router.get("/", response_model=List[LostItemResponse])
def list_lost_items(
    my_items_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve lost items list.
    """
    query = db.query(LostItem)
    if my_items_only:
        query = query.filter(LostItem.owner_id == current_user.id)
    return query.order_by(LostItem.created_at.desc()).all()

@router.get("/{item_id}", response_model=LostItemResponse)
def get_lost_item(item_id: int, db: Session = Depends(get_db)):
    """
    Get lost item details by ID.
    """
    item = db.query(LostItem).filter(LostItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("LostItem", item_id)
    return item

@router.put("/{item_id}", response_model=LostItemResponse)
def update_lost_item(
    item_id: int,
    item_in: LostItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update lost item details. (Owner only)
    """
    item = db.query(LostItem).filter(LostItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("LostItem", item_id)
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this item.")

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lost_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete lost item. (Owner only)
    """
    item = db.query(LostItem).filter(LostItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("LostItem", item_id)
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this item.")

    db.delete(item)
    db.commit()
    return None
