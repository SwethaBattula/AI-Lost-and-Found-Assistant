from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.lost_items import router as lost_items_router
from app.api.found_items import router as found_items_router
from app.api.matches import router as matches_router
from app.api.notifications import router as notifications_router
from app.api.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(lost_items_router)
api_router.include_router(found_items_router)
api_router.include_router(matches_router)
api_router.include_router(notifications_router)
api_router.include_router(admin_router)
