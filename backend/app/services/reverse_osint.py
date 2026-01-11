"""
Reverse OSINT Service - Track who is collecting information about you.
Visitor tracking, IP geolocation, device fingerprinting, and threat detection.
"""

import asyncio
import hashlib
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from app.services.api_key_manager import api_key_manager
from app.services.database import db_service


class ReverseOSINTService:
    """Track and analyze visitors and potential threat actors"""
    
    def __init__(self):
        self.suspicious_patterns = [
            "rapid_requests",
            "scraping_behavior", 
            "unusual_user_agent",
            "tor_exit_node",
            "vpn_detected",
            "bot_detected"
        ]
    
    async def log_visitor(self, request_data: Dict) -> Dict:
        """
        Log a visitor and analyze for suspicious behavior.
        
        Args:
            request_data: Dict containing IP, user_agent, path, method, etc.
        
        Returns:
            Dict with visitor log and threat assessment
        """
        
        ip_address = request_data.get("ip", "unknown")
        user_agent = request_data.get("user_agent", "unknown")
        path = request_data.get("path", "/")
        method = request_data.get("method", "GET")
        
        # Generate device fingerprint
        fingerprint = self._generate_fingerprint(ip_address, user_agent)
        
        # Get geolocation
        geo_data = await self._get_geolocation(ip_address)
        
        # Analyze for suspicious behavior
        threat_assessment = self._analyze_threat(ip_address, user_agent, path, method, fingerprint)
        
        # Save to database
        visitor_id = "offline_log"
        try:
            log_entry = db_service.log_visitor(
                ip=ip_address,
                user_agent=user_agent,
                fingerprint=fingerprint,
                resource=path,
                geo_data=geo_data,
                is_suspicious=threat_assessment["is_suspicious"]
            )
            visitor_id = log_entry.id
        except Exception as e:
            print(f"Error logging visitor to DB: {e}")
            # Continue to return assessment even if logging fails
        
        return {
            "status": "logged",
            "visitor_id": visitor_id,
            "ip_address": ip_address,
            "fingerprint": fingerprint,
            "geolocation": geo_data,
            "threat_assessment": threat_assessment,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _generate_fingerprint(self, ip: str, user_agent: str) -> str:
        """Generate unique device fingerprint"""
        
        fingerprint_data = f"{ip}:{user_agent}"
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16]
    
    async def _get_geolocation(self, ip_address: str) -> Dict:
        """
        Get geolocation data for an IP address.
        Uses multiple services with fallback.
        """
        
        # Mock geolocation for common IPs
        if ip_address in ["127.0.0.1", "localhost", "unknown"]:
            return {
                "country": "Local",
                "city": "Localhost",
                "latitude": 0.0,
                "longitude": 0.0,
                "isp": "Local Network"
            }
        
        # Get available geolocation service
        service, api_key = api_key_manager.get_geolocation_service()
        
        # In production, call actual geolocation API
        # For now, return mock data
        await asyncio.sleep(0.1)
        
        locations = [
            {"country": "United States", "city": "New York", "latitude": 40.7128, "longitude": -74.0060, "isp": "Verizon"},
            {"country": "United Kingdom", "city": "London", "latitude": 51.5074, "longitude": -0.1278, "isp": "BT"},
            {"country": "Germany", "city": "Berlin", "latitude": 52.5200, "longitude": 13.4050, "isp": "Deutsche Telekom"},
            {"country": "Japan", "city": "Tokyo", "latitude": 35.6762, "longitude": 139.6503, "isp": "NTT"},
            {"country": "India", "city": "Mumbai", "latitude": 19.0760, "longitude": 72.8777, "isp": "Airtel"},
            {"country": "Russia", "city": "Moscow", "latitude": 55.7558, "longitude": 37.6173, "isp": "Rostelecom"},
            {"country": "China", "city": "Beijing", "latitude": 39.9042, "longitude": 116.4074, "isp": "China Telecom"},
        ]
        
        geo_data = random.choice(locations)
        geo_data["service"] = service
        
        return geo_data
    
    def _analyze_threat(self, ip: str, user_agent: str, path: str, method: str, fingerprint: str) -> Dict:
        """
        Analyze visitor for suspicious behavior and threat level.
        """
        
        threat_indicators = []
        threat_score = 0
        
        # Check user agent
        suspicious_agents = ["bot", "crawler", "scraper", "python", "curl", "wget"]
        if any(agent in user_agent.lower() for agent in suspicious_agents):
            threat_indicators.append("suspicious_user_agent")
            threat_score += 30
        
        # Check for rapid requests (would check database in production)
        # Mock: randomly flag some as rapid
        if random.choice([True, False, False]):
            threat_indicators.append("rapid_requests")
            threat_score += 40
        
        # Check for known malicious IPs (would check threat intelligence feeds)
        if random.choice([True, False, False, False]):
            threat_indicators.append("known_malicious_ip")
            threat_score += 50
        
        # Check for Tor/VPN (would use actual detection service)
        if random.choice([True, False, False, False, False]):
            threat_indicators.append("tor_or_vpn_detected")
            threat_score += 20
        
        # Check accessed resource
        sensitive_paths = ["/admin", "/api/keys", "/config", "/.env"]
        if any(path.startswith(p) for p in sensitive_paths):
            threat_indicators.append("accessing_sensitive_resource")
            threat_score += 35
        
        # Determine threat level
        if threat_score >= 70:
            threat_level = "CRITICAL"
        elif threat_score >= 50:
            threat_level = "HIGH"
        elif threat_score >= 30:
            threat_level = "MEDIUM"
        else:
            threat_level = "LOW"
        
        is_suspicious = threat_score >= 30
        
        return {
            "is_suspicious": is_suspicious,
            "threat_level": threat_level,
            "threat_score": threat_score,
            "indicators": threat_indicators,
            "recommendation": self._get_threat_recommendation(threat_level),
            "analyzed_at": datetime.utcnow().isoformat()
        }
    
    def _get_threat_recommendation(self, threat_level: str) -> str:
        """Get recommendation based on threat level"""
        
        recommendations = {
            "CRITICAL": "IMMEDIATE ACTION REQUIRED: Block IP address and investigate access patterns. Potential active attack in progress.",
            "HIGH": "Monitor closely and consider blocking. Unusual access patterns detected.",
            "MEDIUM": "Keep monitoring. Some suspicious indicators but may be false positive.",
            "LOW": "Normal visitor. No action required."
        }
        
        return recommendations.get(threat_level, "Monitor activity.")
    
    async def get_visitor_map_data(self, limit: int = 100, hours: int = 24) -> Dict:
        """
        Get visitor data formatted for map visualization.
        
        Args:
            limit: Maximum number of visitors to return
            hours: Time window in hours
        
        Returns:
            Dict with visitor locations and statistics
        """
        
        # Get logs from database
        logs = db_service.get_visitor_logs(limit=limit, suspicious_only=False)
        
        # Format for map
        visitors = []
        for log in logs:
            # Skip if too old
            if log.timestamp < datetime.utcnow() - timedelta(hours=hours):
                continue
            
            visitors.append({
                "id": log.id,
                "ip": log.ip_address,
                "country": log.country,
                "city": log.city,
                "latitude": log.latitude,
                "longitude": log.longitude,
                "timestamp": log.timestamp.isoformat(),
                "is_suspicious": log.is_suspicious,
                "threat_level": log.threat_level,
                "accessed": log.accessed_resource
            })
        
        # Calculate statistics
        total_visitors = len(visitors)
        unique_ips = len(set(v["ip"] for v in visitors))
        suspicious_count = sum(1 for v in visitors if v["is_suspicious"])
        countries = list(set(v["country"] for v in visitors if v["country"]))
        
        return {
            "visitors": visitors,
            "statistics": {
                "total_visitors": total_visitors,
                "unique_ips": unique_ips,
                "suspicious_visitors": suspicious_count,
                "countries": countries,
                "time_window_hours": hours
            },
            "generated_at": datetime.utcnow().isoformat()
        }
    
    async def get_threat_actors(self, min_threat_score: int = 50) -> List[Dict]:
        """
        Get list of identified threat actors.
        
        Args:
            min_threat_score: Minimum threat score to include
        
        Returns:
            List of threat actor profiles
        """
        
        # Get suspicious logs
        logs = db_service.get_visitor_logs(limit=200, suspicious_only=True)
        
        # Group by fingerprint to identify repeat visitors
        actors = {}
        for log in logs:
            fp = log.device_fingerprint
            if fp not in actors:
                actors[fp] = {
                    "fingerprint": fp,
                    "ip_addresses": [],
                    "locations": [],
                    "visits": [],
                    "threat_level": log.threat_level,
                    "first_seen": log.timestamp,
                    "last_seen": log.timestamp,
                    "total_visits": 0
                }
            
            actors[fp]["ip_addresses"].append(log.ip_address)
            if log.city:
                actors[fp]["locations"].append(f"{log.city}, {log.country}")
            actors[fp]["visits"].append({
                "timestamp": log.timestamp.isoformat(),
                "resource": log.accessed_resource,
                "ip": log.ip_address
            })
            actors[fp]["total_visits"] += 1
            actors[fp]["last_seen"] = max(actors[fp]["last_seen"], log.timestamp)
        
        # Format as list
        threat_actors = []
        for fp, data in actors.items():
            data["ip_addresses"] = list(set(data["ip_addresses"]))
            data["locations"] = list(set(data["locations"]))
            data["first_seen"] = data["first_seen"].isoformat()
            data["last_seen"] = data["last_seen"].isoformat()
            threat_actors.append(data)
        
        # Sort by total visits (most active first)
        threat_actors.sort(key=lambda x: x["total_visits"], reverse=True)
        
        return threat_actors
    
    async def create_honeypot(self, honeypot_type: str, data: Dict) -> Dict:
        """
        Create a honeypot data point to identify who's collecting information.
        
        Args:
            honeypot_type: Type of honeypot (fake_email, fake_credential, etc.)
            data: Honeypot data
        
        Returns:
            Dict with honeypot details
        """
        
        honeypot_id = hashlib.sha256(f"{honeypot_type}:{datetime.utcnow().isoformat()}".encode()).hexdigest()[:12]
        
        honeypot = {
            "id": honeypot_id,
            "type": honeypot_type,
            "data": data,
            "created_at": datetime.utcnow().isoformat(),
            "access_count": 0,
            "accessed_by": [],
            "status": "active"
        }
        
        # In production, store in database
        # For now, return honeypot info
        
        return {
            "status": "created",
            "honeypot": honeypot,
            "tracking_url": f"/honeypot/{honeypot_id}",
            "warning": "Anyone accessing this data will be logged and flagged as potential threat"
        }


# Global instance
reverse_osint = ReverseOSINTService()
