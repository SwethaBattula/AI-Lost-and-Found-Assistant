from sqlalchemy.orm import Session
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
from app.models.match import Match
from app.models.notification import Notification
from app.services.ai.matching_service import compute_item_match_scores
from app.services.email_service import send_match_email
from app.core.config import settings
from app.core.logging import logger

def run_match_for_lost_item(db: Session, lost_item: LostItem) -> list[Match]:
    """
    Compares a single lost item against all candidate found items and creates match records.
    """
    found_items = db.query(FoundItem).all()
    created_matches = []

    for found_item in found_items:
        # Check if match record already exists for this pair
        existing = db.query(Match).filter(
            Match.lost_item_id == lost_item.id,
            Match.found_item_id == found_item.id
        ).first()

        if existing:
            continue

        text_sim, img_sim, confidence = compute_item_match_scores(
            lost_title=lost_item.item_name,
            lost_description=lost_item.description,
            lost_location=lost_item.location,
            lost_image_path=lost_item.image_path,
            found_title=found_item.item_name,
            found_description=found_item.description,
            found_location=found_item.location,
            found_image_path=found_item.image_path
        )

        match_record = Match(
            lost_item_id=lost_item.id,
            found_item_id=found_item.id,
            text_similarity=text_sim,
            image_similarity=img_sim,
            confidence_score=confidence,
            status="pending"
        )
        db.add(match_record)
        db.commit()
        db.refresh(match_record)
        created_matches.append(match_record)

        # Trigger notification if confidence exceeds configured threshold
        if confidence >= settings.AI_CONFIDENCE_THRESHOLD:
            _notify_owner(db, match_record, lost_item, found_item)

    return created_matches

def run_match_for_found_item(db: Session, found_item: FoundItem) -> list[Match]:
    """
    Compares a single found item against all candidate lost items and creates match records.
    """
    lost_items = db.query(LostItem).all()
    created_matches = []

    for lost_item in lost_items:
        existing = db.query(Match).filter(
            Match.lost_item_id == lost_item.id,
            Match.found_item_id == found_item.id
        ).first()

        if existing:
            continue

        text_sim, img_sim, confidence = compute_item_match_scores(
            lost_title=lost_item.item_name,
            lost_description=lost_item.description,
            lost_location=lost_item.location,
            lost_image_path=lost_item.image_path,
            found_title=found_item.item_name,
            found_description=found_item.description,
            found_location=found_item.location,
            found_image_path=found_item.image_path
        )

        match_record = Match(
            lost_item_id=lost_item.id,
            found_item_id=found_item.id,
            text_similarity=text_sim,
            image_similarity=img_sim,
            confidence_score=confidence,
            status="pending"
        )
        db.add(match_record)
        db.commit()
        db.refresh(match_record)
        created_matches.append(match_record)

        if confidence >= settings.AI_CONFIDENCE_THRESHOLD:
            _notify_owner(db, match_record, lost_item, found_item)

    return created_matches

def _notify_owner(db: Session, match_record: Match, lost_item: LostItem, found_item: FoundItem):
    owner = lost_item.owner
    if not owner:
        return

    # Check if notification already sent
    existing_notif = db.query(Notification).filter(
        Notification.match_id == match_record.id,
        Notification.user_id == owner.id
    ).first()

    if existing_notif:
        return

    sent_success = send_match_email(
        owner_email=owner.email,
        owner_name=owner.full_name,
        lost_item_name=lost_item.item_name,
        found_item_name=found_item.item_name,
        found_location=found_item.location,
        confidence_score=match_record.confidence_score
    )

    notif = Notification(
        user_id=owner.id,
        match_id=match_record.id,
        title=f"🎉 Potential Match Found: {lost_item.item_name}",
        message=f"Your '{lost_item.item_name}' may have been found! The item has been received by the Lost & Found Office. Please visit the office to verify ownership and collect it.",
        notification_type="potential_match",
        is_read=False,
        email_sent=sent_success
    )
    db.add(notif)
    db.commit()
