from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.found_item import FoundItem
from app.schemas.found_item import FoundItemResponse, FoundItemUpdate
from app.auth.dependencies import get_current_user
from app.utils.file_storage import save_upload_image
from app.services.match_service import run_match_for_found_item
from app.core.config import settings
from app.core.exceptions import EntityNotFoundException

router = APIRouter(prefix="/found-items", tags=["Found Items"])

@router.post("/", response_model=FoundItemResponse, status_code=status.HTTP_201_CREATED)
async def create_found_item(
    item_name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    date_found: datetime = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a found item entry with optional image upload (.jpg, .jpeg, .png).
    Automatically triggers AI match evaluation.
    """
    image_path = None
    if image and image.filename:
        image_path = await save_upload_image(image, settings.UPLOAD_FOUND_DIR)

    found_item = FoundItem(
        finder_id=current_user.id,
        item_name=item_name,
        category=category,
        description=description,
        date_found=date_found,
        location=location,
        image_path=image_path,
        status="found_reported"
    )
    db.add(found_item)
    db.commit()
    db.refresh(found_item)

    # Trigger background match evaluation
    run_match_for_found_item(db, found_item)

    return found_item

@router.get("/", response_model=List[FoundItemResponse])
def list_found_items(
    my_items_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve found items list.
    """
    query = db.query(FoundItem)
    if my_items_only:
        query = query.filter(FoundItem.finder_id == current_user.id)
    return query.order_by(FoundItem.created_at.desc()).all()

@router.get("/{item_id}", response_model=FoundItemResponse)
def get_found_item(item_id: int, db: Session = Depends(get_db)):
    """
    Get found item details by ID.
    """
    item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("FoundItem", item_id)
    return item

@router.put("/{item_id}/mark-received", response_model=FoundItemResponse)
def mark_found_item_received(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark found item as physically received at the Lost & Found Office ('item_received').
    """
    item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("FoundItem", item_id)

    item.status = "item_received"
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=FoundItemResponse)
def update_found_item(
    item_id: int,
    item_in: FoundItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update found item details. (Finder or Admin)
    """
    item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("FoundItem", item_id)
    if item.finder_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this item.")

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_found_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete found item. (Finder or Admin)
    """
    item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
    if not item:
        raise EntityNotFoundException("FoundItem", item_id)
    if item.finder_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this item.")

    db.delete(item)
    db.commit()
    return None
