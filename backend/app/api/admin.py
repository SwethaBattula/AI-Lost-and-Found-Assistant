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
from app.schemas.found_item import FoundItemResponse
from app.schemas.user import UserResponse
from app.auth.dependencies import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["Lost & Found Office Supervision"])

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Retrieve operational metrics for Lost & Found Office Supervision Dashboard.
    """
    active_cases = db.query(Match).filter(Match.status.in_(["pending", "under_review", "waiting_for_pickup", "ready_for_collection"])).count()
    new_lost_reports = db.query(LostItem).count()
    new_found_reports = db.query(FoundItem).filter(FoundItem.status == "found_reported").count()
    items_received = db.query(FoundItem).filter(FoundItem.status == "item_received").count()
    waiting_for_pickup = db.query(Match).filter(Match.status.in_(["waiting_for_pickup", "ready_for_collection"])).count()
    closed_cases = db.query(Match).filter(Match.status.in_(["confirmed", "handed_over"])).count()
    total_registered_users = db.query(User).count()

    return {
        "active_cases": active_cases,
        "new_lost_reports": new_lost_reports,
        "new_found_reports": new_found_reports,
        "items_received": items_received,
        "waiting_for_pickup": waiting_for_pickup,
        "closed_cases": closed_cases,
        "total_registered_users": total_registered_users
    }

@router.get("/matches", response_model=List[MatchResponse])
def get_all_matches_for_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List all system cases and matches for operational oversight.
    """
    return db.query(Match).order_by(Match.created_at.desc()).all()

@router.put("/matches/{match_id}/approve", response_model=MatchResponse)
def approve_match(
    match_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Update match status to 'waiting_for_pickup' (Ready for Student Pickup at Office).
    """
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    match.status = "waiting_for_pickup"

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

@router.put("/matches/{match_id}/handover", response_model=MatchResponse)
def mark_match_as_handed_over(
    match_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Mark item as physically handed over at Lost & Found Office (Case Closed).
    """
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    match.status = "handed_over"

    lost_item = match.lost_item
    if lost_item and lost_item.owner_id:
        notif = Notification(
            user_id=lost_item.owner_id,
            match_id=match.id,
            title="Collection Completed",
            message="Collection completed at Lost & Found Office. Thank you for using AI Lost & Found.",
            notification_type="collection_completed",
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
    Reject invalid match (Exception Override).
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
            title="Match Rejected",
            message="Match evaluated as invalid after office inspection.",
            notification_type="rejected",
            is_read=False,
            email_sent=False
        )
        db.add(notif)

    db.commit()
    db.refresh(match)
    return match

@router.get("/inventory", response_model=List[FoundItemResponse])
def get_office_inventory(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List physical inventory items currently held at the Lost & Found Office.
    """
    return db.query(FoundItem).order_by(FoundItem.created_at.desc()).all()

@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List all registered users in the platform (Read Only).
    """
    return db.query(User).order_by(User.created_at.desc()).all()
