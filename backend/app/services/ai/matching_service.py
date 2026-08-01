import os
from app.services.ai.text_matcher import compute_text_similarity
from app.services.ai.image_matcher import compute_image_similarity
from app.core.config import settings

def compute_item_match_scores(
    lost_title: str,
    lost_description: str,
    lost_location: str,
    lost_image_path: str | None,
    found_title: str,
    found_description: str,
    found_location: str,
    found_image_path: str | None
) -> tuple[float, float, float]:
    """
    Computes (text_similarity, image_similarity, combined_confidence_score).
    """
    lost_text = f"{lost_title}. {lost_description}. Location: {lost_location}"
    found_text = f"{found_title}. {found_description}. Location: {found_location}"

    text_sim = compute_text_similarity(lost_text, found_text)

    # Convert relative web path (/uploads/lost/...) to absolute path for image inspection
    abs_lost_img = None
    if lost_image_path:
        rel_path = lost_image_path.lstrip("/")
        abs_lost_img = os.path.abspath(os.path.join(settings.UPLOAD_DIR, "..", rel_path))

    abs_found_img = None
    if found_image_path:
        rel_path = found_image_path.lstrip("/")
        abs_found_img = os.path.abspath(os.path.join(settings.UPLOAD_DIR, "..", rel_path))

    if abs_lost_img and abs_found_img and os.path.exists(abs_lost_img) and os.path.exists(abs_found_img):
        img_sim = compute_image_similarity(abs_lost_img, abs_found_img)
        confidence = 0.5 * text_sim + 0.5 * img_sim
    else:
        img_sim = 0.0
        confidence = text_sim

    return float(round(text_sim, 4)), float(round(img_sim, 4)), float(round(confidence, 4))
