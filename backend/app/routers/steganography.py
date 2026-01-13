"""
Steganography Detection API Router
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.steganography_detector import stego_detector
from app.services.storage import storage_service
from app.services.database import db_service
from app.services.reverse_osint import reverse_osint

router = APIRouter()


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...), user_id: str = "demo", extract_data: bool = True):
    """
    Analyze an image for steganography.
    
    Args:
        file: Image file to analyze
        user_id: User performing the analysis
        extract_data: Whether to attempt data extraction
    """
    
    try:
        # Save uploaded file
        storage_result = await storage_service.save_file(file)
        
        # Analyze for steganography
        result = await stego_detector.analyze_image(
            image_path=storage_result['local_path'],
            extract_data=extract_data
        )
        
        if result.get("status") != "success":
            raise HTTPException(status_code=400, detail=result.get("error", "Analysis failed"))
        
        # Save to database
        extracted_text = None
        extracted_coords = None
        if result.get("extracted_data"):
            extracted_text = result["extracted_data"].get("text")
            extracted_coords = result["extracted_data"].get("coordinates")
        
        db_service.save_stego_result(
            user_id=user_id,
            file_path=storage_result['local_path'],
            file_name=storage_result['filename'],
            has_hidden_data=result.get("has_hidden_data", False),
            confidence=result.get("confidence_score", 0),
            method=", ".join(result.get("detection_methods", {}).keys()),
            extracted_text=extracted_text,
            extracted_coords=extracted_coords
        )
        
        # Format heatmap URL
        if result.get("heatmap_path"):
            import os
            filename = os.path.basename(result["heatmap_path"])
            result["heatmap_url"] = f"/uploads/{filename}"
        
        # Reverse OSINT Correlation
        correlation = None
        if has_hidden_data:
            correlation = await reverse_osint.correlate_stego_data(result.get("extracted_data"))
        
        return {
            **result,
            "file_info": storage_result,
            "reverse_osint_correlation": correlation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@router.post("/extract")
async def extract_hidden_data(file: UploadFile = File(...), method: str = "auto"):
    """
    Extract hidden data from an image.
    
    Args:
        file: Image file
        method: Extraction method (auto, lsb, dct, etc.)
    """
    
    try:
        # Save uploaded file
        storage_result = await storage_service.save_file(file)
        
        # Analyze and extract
        result = await stego_detector.analyze_image(
            image_path=storage_result['local_path'],
            extract_data=True
        )
        
        if result.get("status") != "success":
            raise HTTPException(status_code=400, detail=result.get("error", "Extraction failed"))
        
        return {
            "status": "success",
            "file_name": storage_result['filename'],
            "extracted_data": result.get("extracted_data"),
            "confidence": result.get("confidence_score"),
            "methods_used": list(result.get("detection_methods", {}).keys())
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")


@router.get("/history")
async def get_analysis_history(user_id: str = "demo", limit: int = 50):
    """
    Get steganography analysis history.
    
    Args:
        user_id: User ID
        limit: Maximum number of records
    """
    
    try:
        from app.services.database import db_service
        db = db_service.get_db()
        
        try:
            from app.services.database import SteganographyResult
            results = db.query(SteganographyResult).filter(
                SteganographyResult.user_id == user_id
            ).order_by(SteganographyResult.analyzed_at.desc()).limit(limit).all()
            
            history = []
            for result in results:
                history.append({
                    "id": result.id,
                    "file_name": result.file_name,
                    "has_hidden_data": result.has_hidden_data,
                    "confidence": result.confidence_score,
                    "method": result.detection_method,
                    "analyzed_at": result.analyzed_at.isoformat(),
                    "extracted_text_preview": result.extracted_text[:100] if result.extracted_text else None
                })
            
            return {
                "user_id": user_id,
                "total_analyses": len(history),
                "history": history
            }
        
        finally:
            db.close()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"History retrieval error: {str(e)}")


@router.get("/methods")
async def get_detection_methods():
    """
    Get available steganography detection methods.
    """
    
    return {
        "methods": [
            {
                "name": "LSB",
                "description": "Least Significant Bit analysis",
                "best_for": "Simple image steganography"
            },
            {
                "name": "DCT",
                "description": "Discrete Cosine Transform analysis",
                "best_for": "JPEG steganography"
            },
            {
                "name": "Chi-Square",
                "description": "Statistical analysis",
                "best_for": "Detecting LSB embedding"
            },
            {
                "name": "Visual Analysis",
                "description": "Visual artifact detection",
                "best_for": "Identifying unusual patterns"
            }
        ],
        "supported_formats": ["PNG", "JPEG", "BMP", "TIFF"],
        "extraction_capabilities": ["Text", "Coordinates", "Binary data", "Files"]
    }
