"""
Social Media OSINT API Router
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from app.services.social_media_osint import social_media_osint
from app.services.database import db_service

router = APIRouter()


class SocialMediaScanRequest(BaseModel):
    platform: str
    username: str
    deep_scan: bool = True
    user_id: str = "demo"


@router.post("/scan")
async def scan_social_profile(request: SocialMediaScanRequest):
    """
    Scan a social media profile for OSINT data.
    
    Args:
        platform: Social media platform (instagram, twitter, facebook, linkedin, tiktok)
        username: Username to scan
        deep_scan: Extract detailed metadata from posts
        user_id: User performing the scan
    """
    
    try:
        # Perform scan
        result = await social_media_osint.scan_profile(
            platform=request.platform,
            username=request.username,
            deep_scan=request.deep_scan
        )
        
        if result.get("status") != "success":
            raise HTTPException(status_code=400, detail=result.get("error", "Scan failed"))
        
        # Log to database
        db_service.log_osint_collection(
            user_id=request.user_id,
            collection_type="social_media",
            target=request.username,
            platform=request.platform,
            data=result,
            metadata=result.get("metadata_summary"),
            risk_score=result.get("exposure_metrics", {}).get("exposure_score", 0)
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {str(e)}")


@router.get("/search")
async def search_username(username: str, user_id: str = "demo"):
    """
    Search for a username across all supported platforms.
    
    Args:
        username: Username to search
        user_id: User performing the search
    """
    
    try:
        result = await social_media_osint.search_username_across_platforms(username)
        
        # Log search
        db_service.log_osint_collection(
            user_id=user_id,
            collection_type="username_search",
            target=username,
            data=result,
            risk_score=result.get("platforms_found", 0) * 10
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@router.get("/platforms")
async def get_supported_platforms():
    """
    Get list of supported social media platforms.
    """
    
    from app.services.api_key_manager import api_key_manager
    
    available_platforms = api_key_manager.get_social_media_services()
    
    return {
        "supported_platforms": ["instagram", "twitter", "facebook", "linkedin", "tiktok"],
        "available_with_api_keys": available_platforms,
        "status": "operational"
    }


@router.post("/connect")
async def connect_social_account(
    user_id: str,
    platform: str,
    username: str,
    profile_url: Optional[str] = None
):
    """
    Link a social media account to user profile for ongoing monitoring.
    
    Args:
        user_id: User ID
        platform: Social media platform
        username: Username on the platform
        profile_url: Optional profile URL
    """
    
    try:
        # Ensure user exists
        db_service.get_or_create_user(user_id)
        
        # Add social account
        account = db_service.add_social_account(
            user_id=user_id,
            platform=platform,
            username=username,
            profile_url=profile_url
        )
        
        return {
            "status": "connected",
            "account": {
                "id": account.id,
                "platform": account.platform,
                "username": account.username,
                "connected_at": account.connected_at.isoformat()
            },
            "message": f"Successfully connected {platform} account: {username}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection error: {str(e)}")


@router.get("/history")
async def get_scan_history(user_id: str = "demo", limit: int = 50):
    """
    Get OSINT scan history for a user.
    
    Args:
        user_id: User ID
        limit: Maximum number of records to return
    """
    
    try:
        collections = db_service.get_osint_history(user_id, limit)
        
        history = []
        for collection in collections:
            history.append({
                "id": collection.id,
                "type": collection.collection_type,
                "target": collection.target,
                "platform": collection.platform,
                "risk_score": collection.risk_score,
                "timestamp": collection.created_at.isoformat()
            })
        
        return {
            "user_id": user_id,
            "total_scans": len(history),
            "history": history
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"History retrieval error: {str(e)}")
