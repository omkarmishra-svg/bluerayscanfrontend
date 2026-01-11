from fastapi import APIRouter, HTTPException, Query
from app.services.osint_aggregator import osint_aggregator
from app.services.profile_service import profile_service
from app.services.risk_scoring import risk_engine
from pydantic import EmailStr
import asyncio

router = APIRouter()

@router.get("/search")
async def email_search(email: EmailStr, user_id: str = "demo"):
    """
    Enhanced search: Uses Aggregator + Risk Scoring + Profile Context.
    This fulfills the requirement of linking accounts for different users.
    """
    # 1. Fetch Profile Context
    profile = profile_service.get_profile(user_id)
    
    # 2. Perform Full Intelligence Aggregation
    intel_report = await osint_aggregator.get_full_intel_report(email)
    
    # 3. Calculate Contextual Risk Score for this search
    risk_report = risk_engine.calculate_score(
        deepfake_confidence=0.0, # Pure OSINT search has no media component
        breach_count=intel_report.get("breach_intelligence", {}).get("breach_count", 0),
        footprint_count=len(intel_report.get("digital_footprint", [])),
        metadata_risk=10.0 # Baseline OSINT risk
    )
    
    return {
        "status": "success",
        "email": email,
        "profile": profile,
        "digital_footprint": intel_report["digital_footprint"],
        "breach_intelligence": intel_report["breach_intelligence"],
        "risk_intelligence": risk_report,
        "summary": {
            "total_accounts_found": len(intel_report["digital_footprint"]),
            "privacy_risk_score": risk_report["score"],
            "privacy_harm_level": risk_report["severity"],
            "data_breach_detected": intel_report["breach_intelligence"]["is_pwned"]
        }
    }
