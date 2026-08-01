import os
from PIL import Image
import numpy as np
import cv2
from app.core.logging import logger

_clip_model = None
_clip_preprocess = None
_clip_tokenizer = None
_clip_failed = False

def get_image_model():
    global _clip_model, _clip_preprocess, _clip_tokenizer, _clip_failed
    if _clip_failed:
        return None, None, None
    if _clip_model is None:
        try:
            logger.info("Lazy loading OpenCLIP model ('ViT-B-32')...")
            import open_clip
            import torch
            model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
            tokenizer = open_clip.get_tokenizer('ViT-B-32')
            model.eval()
            _clip_model = model
            _clip_preprocess = preprocess
            _clip_tokenizer = tokenizer
            logger.info("OpenCLIP model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load OpenCLIP model: {e}")
            _clip_failed = True
            return None, None, None
    return _clip_model, _clip_preprocess, _clip_tokenizer

def compute_image_similarity(img_path1: str | None, img_path2: str | None) -> float:
    if not img_path1 or not img_path2:
        return 0.0
    if not os.path.exists(img_path1) or not os.path.exists(img_path2):
        return 0.0

    model, preprocess, _ = get_image_model()
    if model is not None and preprocess is not None:
        try:
            import torch
            image1 = preprocess(Image.open(img_path1).convert("RGB")).unsqueeze(0)
            image2 = preprocess(Image.open(img_path2).convert("RGB")).unsqueeze(0)
            with torch.no_grad():
                feat1 = model.encode_image(image1)
                feat2 = model.encode_image(image2)
                feat1 /= feat1.norm(dim=-1, keepdim=True)
                feat2 /= feat2.norm(dim=-1, keepdim=True)
                similarity = (feat1 @ feat2.T).item()
                return float(max(0.0, min(1.0, similarity)))
        except Exception as e:
            logger.error(f"Error computing OpenCLIP image similarity: {e}")

    # Fallback OpenCV color histogram similarity
    try:
        img1 = cv2.imread(img_path1)
        img2 = cv2.imread(img_path2)
        if img1 is None or img2 is None:
            return 0.0
        
        hist1 = cv2.calcHist([img1], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
        hist2 = cv2.calcHist([img2], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
        cv2.normalize(hist1, hist1)
        cv2.normalize(hist2, hist2)
        
        score = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
        return float(max(0.0, min(1.0, score)))
    except Exception as e:
        logger.error(f"Error computing fallback image histogram similarity: {e}")
        return 0.0
