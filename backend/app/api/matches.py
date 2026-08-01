from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.match import Match
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
from app.schemas.match import MatchResponse, MatchStatusUpdate
from app.auth.dependencies import get_current_user
from app.services.match_service import run_match_for_lost_item, run_match_for_found_item
from app.core.exceptions import EntityNotFoundException

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.get("/", response_model=List[MatchResponse])
def list_matches(
    min_confidence: float = 0.0,
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List matches for items owned/found by the current user.
    """
    # Join with LostItem and FoundItem to restrict to user items
    user_lost_ids = [item.id for item in db.query(LostItem.id).filter(LostItem.owner_id == current_user.id).all()]
    user_found_ids = [item.id for item in db.query(FoundItem.id).filter(FoundItem.finder_id == current_user.id).all()]

    query = db.query(Match).filter(
        (Match.lost_item_id.in_(user_lost_ids)) | (Match.found_item_id.in_(user_found_ids))
    )

    if min_confidence > 0:
        query = query.filter(Match.confidence_score >= min_confidence)
    if status_filter:
        query = query.filter(Match.status == status_filter)

    return query.order_by(Match.confidence_score.desc()).all()

@router.get("/{match_id}", response_model=MatchResponse)
def get_match(match_id: int, db: Session = Depends(get_db)):
    """
    Get match details by ID.
    """
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise EntityNotFoundException("Match", match_id)
    return match

@router.put("/{match_id}/status", response_model=MatchResponse)
def update_match_status(
    match_id: int,
    status_in: MatchStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update match status ('pending', 'confirmed', 'rejected').
    """
    valid_statuses = {"pending", "confirmed", "rejected"}
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{status_in.status}'. Allowed values: {', '.join(valid_statuses)}"
        )

    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise EntityNotFoundException("Match", match_id)

    match.status = status_in.status
    db.commit()
    db.refresh(match)
    return match

@router.post("/trigger-matching", status_code=status.HTTP_200_OK)
def trigger_all_matching(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Manually trigger AI matching sweep for all existing lost items against found items.
    """
    lost_items = db.query(LostItem).all()
    total_new_matches = 0
    for lost_item in lost_items:
        new_matches = run_match_for_lost_item(db, lost_item)
        total_new_matches += len(new_matches)

    return {
        "message": f"Matching sweep completed successfully.",
        "new_matches_created": total_new_matches
    }
