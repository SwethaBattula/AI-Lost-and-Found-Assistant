from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
from app.models.match import Match
from app.models.notification import Notification
from app.schemas.match import MatchResponse
from app.schemas.user import UserResponse
from app.auth.dependencies import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Workflow"])

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Retrieve global platform statistics for administrator dashboard.
    """
    pending_matches = db.query(Match).filter(Match.status.in_(["pending", "under_review"])).count()
    ready_for_collection = db.query(Match).filter(Match.status == "ready_for_collection").count()
    collected_cases = db.query(Match).filter(Match.status.in_(["confirmed", "collected"])).count()
    rejected_matches = db.query(Match).filter(Match.status == "rejected").count()

    total_lost_items = db.query(LostItem).count()
    total_found_items = db.query(FoundItem).count()
    total_registered_users = db.query(User).count()

    return {
        "pending_matches": pending_matches,
        "ready_for_collection": ready_for_collection,
        "collected_cases": collected_cases,
        "rejected_matches": rejected_matches,
        "total_lost_items": total_lost_items,
        "total_found_items": total_found_items,
        "total_registered_users": total_registered_users
    }

@router.get("/matches", response_model=List[MatchResponse])
def get_all_matches_for_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List all system matches for administrator review.
    """
    return db.query(Match).order_by(Match.created_at.desc()).all()

@router.put("/matches/{match_id}/approve", response_model=MatchResponse)
def approve_match(
    match_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Approve match and set status to 'ready_for_collection'.
    Automatically notifies the lost item owner.
    """
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    match.status = "ready_for_collection"

    # Create notification for owner
    lost_item = match.lost_item
    if lost_item and lost_item.owner_id:
        notif = Notification(
            user_id=lost_item.owner_id,
            match_id=match.id,
            title="Item Ready For Collection",
            message="Your item has been verified. Please collect it from the Lost & Found Office.",
            notification_type="ready_for_collection",
            is_read=False,
            email_sent=False
        )
        db.add(notif)

    db.commit()
    db.refresh(match)
    return match

@router.put("/matches/{match_id}/reject", response_model=MatchResponse)
def reject_match(
    match_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Reject match and set status to 'rejected'.
    Automatically notifies the lost item owner.
    """
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    match.status = "rejected"

    lost_item = match.lost_item
    if lost_item and lost_item.owner_id:
        notif = Notification(
            user_id=lost_item.owner_id,
            match_id=match.id,
            title="AI Match Rejected",
            message="AI match rejected after administrator review.",
            notification_type="rejected",
            is_read=False,
            email_sent=False
        )
        db.add(notif)

    db.commit()
    db.refresh(match)
    return match

@router.get("/collections", response_model=List[MatchResponse])
def get_ready_for_collection_matches(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List all matches currently ready for collection.
    """
    return db.query(Match).filter(Match.status == "ready_for_collection").order_by(Match.created_at.desc()).all()

@router.put("/matches/{match_id}/collect", response_model=MatchResponse)
def mark_match_as_collected(
    match_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Mark match status as 'confirmed' (Collected).
    Automatically notifies the lost item owner.
    """
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    match.status = "confirmed"

    lost_item = match.lost_item
    if lost_item and lost_item.owner_id:
        notif = Notification(
            user_id=lost_item.owner_id,
            match_id=match.id,
            title="Collection Completed",
            message="Collection completed. Thank you for using AI Lost & Found.",
            notification_type="collection_completed",
            is_read=False,
            email_sent=False
        )
        db.add(notif)

    db.commit()
    db.refresh(match)
    return match

@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List all registered users in the platform (Read Only).
    """
    return db.query(User).order_by(User.created_at.desc()).all()
