from difflib import SequenceMatcher
import numpy as np
from app.core.logging import logger

_text_model = None
_model_failed = False

def get_text_model():
    global _text_model, _model_failed
    if _model_failed:
        return None
    if _text_model is None:
        try:
            logger.info("Lazy loading SentenceTransformer model ('all-MiniLM-L6-v2')...")
            from sentence_transformers import SentenceTransformer
            _text_model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load SentenceTransformer model: {e}")
            _model_failed = True
            return None
    return _text_model

def compute_text_similarity(text1: str, text2: str) -> float:
    model = get_text_model()
    if model is not None:
        try:
            embeddings = model.encode([text1, text2])
            vec1 = embeddings[0]
            vec2 = embeddings[1]
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            if norm1 == 0 or norm2 == 0:
                return 0.0
            similarity = float(np.dot(vec1, vec2) / (norm1 * norm2))
            return max(0.0, min(1.0, similarity))
        except Exception as e:
            logger.error(f"Error computing SentenceTransformer similarity: {e}")
            
    # Fallback heuristic string similarity using SequenceMatcher + word overlap
    t1_lower = text1.lower()
    t2_lower = text2.lower()
    seq_sim = SequenceMatcher(None, t1_lower, t2_lower).ratio()
    
    words1 = set(t1_lower.split())
    words2 = set(t2_lower.split())
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    jaccard_sim = len(intersection) / len(union) if union else 0.0
    
    return float(max(seq_sim, jaccard_sim))
