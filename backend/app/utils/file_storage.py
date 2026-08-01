import os
import uuid
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

def validate_image_file(file: UploadFile) -> str:
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return ext

async def save_upload_image(file: UploadFile, target_dir: str) -> str:
    ext = validate_image_file(file)
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    os.makedirs(target_dir, exist_ok=True)
    file_path = os.path.join(target_dir, unique_filename)
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
        
    # Return normalized relative path for URL access
    rel_folder = os.path.basename(target_dir)
    return f"/uploads/{rel_folder}/{unique_filename}"
