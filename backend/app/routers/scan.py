from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from app.services.storage import storage_service
from app.services.profile_service import profile_service
from app.services.osint_aggregator import osint_aggregator
from app.services.risk_scoring import risk_engine
from app.services.websocket_manager import manager
from app.ml.image_detector import detector
import os

router = APIRouter()

async def perform_comprehensive_intelligence(analysis_result: dict, user_id: str, local_path: str):
    """
    Shared logic to aggregate OSINT data, calculate risk, and trigger alerts.
    """
    # 1. Fetch Linked Profile Assets
    profile = profile_service.get_profile(user_id)
    target_email = next((a["value"] for a in profile["assets"] if a["type"] == "email"), "demo_user@bluerayscan.io")
    
    # 2. Integrate OSINT & Risk Scoring
    osint_data = await osint_aggregator.get_full_intel_report(target_email)
    
    # Calculate Risk Score
    risk_report = risk_engine.calculate_score(
        deepfake_confidence=analysis_result.get("score", 0.0),
        breach_count=osint_data.get("breach_intelligence", {}).get("breach_count", 0),
        footprint_count=len(osint_data.get("digital_footprint", [])),
        metadata_risk=75.0 if analysis_result.get("label") == "FAKE" else 15.0
    )

    # 3. Real-Time Alert Trigger
    if analysis_result.get("label") == "FAKE" or risk_report.get("score", 0) > 70:
        try:
            alert_payload = {
                "type": "THREAT_ALERT",
                "severity": risk_report.get("severity", "HIGH"),
                "message": f"Deepfake/Risk detected for {profile['name']}: {analysis_result.get('explanation', 'Unknown threat')}",
                "confidence": analysis_result.get("score", 0),
                "risk_score": risk_report.get("score", 0),
                "image_url": analysis_result.get("heatmap_url", "")
            }
            await manager.broadcast(alert_payload)
            print(f"Alert broadcasted for {user_id}!")
        except Exception as e:
            print(f"Failed to broadcast alert: {e}")

    return {
        "profile": profile,
        "osint": osint_data,
        "risk_intelligence": risk_report
    }

@router.post("/scan")
async def scan_media(file: UploadFile = File(...), user_id: str = "demo"):
    """Enhanced Image Scan with Intelligence."""
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    storage_result = await storage_service.save_file(file)
    
    # 1. ML Analysis
    try:
        if detector.model_loaded:
             analysis_result = detector.predict(storage_result['local_path'])
        else:
             analysis_result = detector.mock_predict(storage_result['local_path'])
    except Exception as e:
        print(f"ML Failed: {e}")
        analysis_result = {"label": "FAKE", "score": 95.0, "explanation": "Fallback Analysis Triggered"}

    # Process heatmap
    if "heatmap" in analysis_result and analysis_result["heatmap"]:
         filename = os.path.basename(analysis_result["heatmap"])
         analysis_result["heatmap_url"] = f"/uploads/{filename}"

    # 2. Intelligence Gathering
    intel_report = await perform_comprehensive_intelligence(analysis_result, user_id, storage_result['local_path'])

    return {
        "status": "success",
        "file_info": storage_result,
        "analysis": analysis_result,
        **intel_report,
        # UI Compatibility
        "prediction": analysis_result.get("label", "UNKNOWN"),
        "confidence": analysis_result.get("score", 0.0),
        "heatmap": analysis_result.get("heatmap_url", ""),
        "explanation": analysis_result.get("explanation", "Analysis complete"),
        "risk_score": intel_report["risk_intelligence"]["score"]
    }

@router.post("/scan/video")
async def scan_video(file: UploadFile = File(...), user_id: str = "demo"):
    """Enhanced Video Intelligence Scan."""
    storage_result = await storage_service.save_file(file)
    analysis = detector.predict_video(storage_result['local_path'])
    intel_report = await perform_comprehensive_intelligence(analysis, user_id, storage_result['local_path'])
    
    return {
        "status": "success", 
        "analysis": analysis, 
        **intel_report,
        "prediction": analysis.get('label', 'UNKNOWN'), 
        "confidence": analysis.get('score', 0),
        "explanation": analysis.get('explanation', "Video analysis completed."),
        "risk_score": intel_report["risk_intelligence"]["score"]
    }

@router.post("/scan/audio")
async def scan_audio(file: UploadFile = File(...), user_id: str = "demo"):
    """Enhanced Audio Intelligence Scan."""
    storage_result = await storage_service.save_file(file)
    analysis = detector.predict_audio(storage_result['local_path'])
    intel_report = await perform_comprehensive_intelligence(analysis, user_id, storage_result['local_path'])
    
    return {
        "status": "success", 
        "analysis": analysis, 
        **intel_report,
        "prediction": analysis.get('label', 'UNKNOWN'), 
        "confidence": analysis.get('score', 0),
        "explanation": analysis.get('explanation', "Audio spectral analysis completed."),
        "risk_score": intel_report["risk_intelligence"]["score"]
    }

@router.post("/profile/link")
async def link_social_asset(user_id: str, asset_type: str, asset_value: str, label: str = ""):
    """Link a new social media or email asset to the user profile."""
    profile = profile_service.link_asset(user_id, asset_type, asset_value, label)
    return {
        "status": "success",
        "message": f"Linked {asset_type} asset to {user_id}",
        "profile": profile
    }

@router.get("/profile")
async def get_user_profile(user_id: str = "demo"):
    """Fetch the current user profile and linked assets."""
    return profile_service.get_profile(user_id)
