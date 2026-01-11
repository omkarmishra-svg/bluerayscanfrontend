import math

class RiskScoringEngine:
    """
    Proprietary algorithm to calculate the Digital Exposure Risk Score (0-100).
    Weights:
    - Deepfake Confidence: 40%
    - Data Breaches: 30%
    - Footprint Exposure: 20%
    - Metadata/Forensics: 10%
    """
    
    def calculate_score(self, 
                        deepfake_confidence: float, 
                        breach_count: int, 
                        footprint_count: int, 
                        metadata_risk: float = 0.0) -> dict:
        
        # 1. Deepfake Component (40%)
        # Sigmoid-like scaling for confidence
        df_score = deepfake_confidence * 0.4
        
        # 2. Breach Component (30%)
        # Every breach adds risk, capping at 10+ breaches
        breach_impact = min(breach_count * 10, 100) * 0.3
        
        # 3. Footprint Exposure (20%)
        # More accounts found = higher exposure
        footprint_impact = min(footprint_count * 2, 100) * 0.2
        
        # 4. Metadata/Forensics (10%)
        meta_impact = metadata_risk * 0.1
        
        total_score = df_score + breach_impact + footprint_impact + meta_impact
        # Ensure it stays within [0, 100]
        final_score = min(max(round(total_score, 1), 0), 100)
        
        # Determine Severity
        severity = "LOW"
        if final_score > 70:
            severity = "CRITICAL"
        elif final_score > 40:
            severity = "MEDIUM"
        elif final_score > 15:
            severity = "LOW"
        else:
            severity = "NEGLIGIBLE"
            
        return {
            "score": final_score,
            "severity": severity,
            "breakdown": {
                "deepfake_threat": round(df_score, 1),
                "breach_exposure": round(breach_impact, 1),
                "footprint_visibility": round(footprint_impact, 1),
                "metadata_risk": round(meta_impact, 1)
            }
        }

risk_engine = RiskScoringEngine()
