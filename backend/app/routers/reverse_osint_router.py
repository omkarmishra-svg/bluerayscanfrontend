"""
Reverse OSINT API Router
"""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.reverse_osint import reverse_osint

router = APIRouter()


class HoneypotRequest(BaseModel):
    honeypot_type: str
    data: dict


@router.post("/track")
async def track_visitor(request: Request):
    """
    Track a visitor (called automatically by middleware).
    
    This endpoint logs visitor information for reverse OSINT.
    """
    
    try:
        # Extract request data
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        path = str(request.url.path)
        method = request.method
        
        request_data = {
            "ip": client_ip,
            "user_agent": user_agent,
            "path": path,
            "method": method
        }
        
        # Log visitor
        result = await reverse_osint.log_visitor(request_data)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tracking error: {str(e)}")


@router.get("/visitors")
async def get_visitor_logs(limit: int = 100, suspicious_only: bool = False):
    """
    Get visitor logs.
    
    Args:
        limit: Maximum number of logs to return  
        suspicious_only: Only return suspicious visitors
    """
    
    try:
        from app.services.database import db_service
        
        logs = db_service.get_visitor_logs(limit=limit, suspicious_only=suspicious_only)
        
        visitors = []
        for log in logs:
            visitors.append({
                "id": log.id,
                "ip_address": log.ip_address,
                "user_agent": log.user_agent,
                "fingerprint": log.device_fingerprint,
                "country": log.country,
                "city": log.city,
                "accessed": log.accessed_resource,
                "timestamp": log.timestamp.isoformat(),
                "is_suspicious": log.is_suspicious,
                "threat_level": log.threat_level
            })
        
        return {
            "total_visitors": len(visitors),
            "visitors": visitors
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval error: {str(e)}")


@router.get("/map")
async def get_visitor_map(hours: int = 24, limit: int = 100):
    """
    Get visitor data formatted for map visualization.
    
    Args:
        hours: Time window in hours
        limit: Maximum number of visitors
    """
    
    try:
        result = await reverse_osint.get_visitor_map_data(limit=limit, hours=hours)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Map data error: {str(e)}")


@router.get("/threats")
async def get_threat_actors(min_score: int = 50):
    """
    Get identified threat actors.
    
    Args:
        min_score: Minimum threat score to include
    """
    
    try:
        threat_actors = await reverse_osint.get_threat_actors(min_threat_score=min_score)
        
        return {
            "total_threat_actors": len(threat_actors),
            "threat_actors": threat_actors
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Threat retrieval error: {str(e)}")


@router.post("/honeypot")
async def create_honeypot(request: HoneypotRequest):
    """
    Create a honeypot data point.
    
    Args:
        honeypot_type: Type of honeypot (fake_email, fake_credential, etc.)
        data: Honeypot data
    """
    
    try:
        result = await reverse_osint.create_honeypot(
            honeypot_type=request.honeypot_type,
            data=request.data
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Honeypot creation error: {str(e)}")


@router.get("/stats")
async def get_reverse_osint_stats():
    """
    Get overall reverse OSINT statistics.
    """
    
    try:
        from app.services.database import db_service
        from datetime import datetime, timedelta
        
        # Get visitor data
        all_visitors = db_service.get_visitor_logs(limit=1000)
        recent_visitors = [v for v in all_visitors if v.timestamp > datetime.utcnow() - timedelta(hours=24)]
        
        suspicious_count = sum(1 for v in all_visitors if v.is_suspicious)
        unique_ips = len(set(v.ip_address for v in all_visitors))
        countries = list(set(v.country for v in all_visitors if v.country))
        
        # Threat levels
        critical = sum(1 for v in all_visitors if v.threat_level == "CRITICAL")
        high = sum(1 for v in all_visitors if v.threat_level == "HIGH")
        medium = sum(1 for v in all_visitors if v.threat_level == "MEDIUM")
        low = sum(1 for v in all_visitors if v.threat_level == "LOW")
        
        return {
            "total_visitors": len(all_visitors),
            "recent_visitors_24h": len(recent_visitors),
            "unique_ips": unique_ips,
            "suspicious_visitors": suspicious_count,
            "countries_detected": len(countries),
            "threat_levels": {
                "critical": critical,
                "high": high,
                "medium": medium,
                "low": low
            },
            "top_countries": countries[:10]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats retrieval error: {str(e)}")
