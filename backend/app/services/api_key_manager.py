"""
API Key Manager for centralized management of external service credentials.
Supports multiple services with rate limiting and usage tracking.
"""

import os
from typing import Optional, Dict
from datetime import datetime, timedelta
import json


class APIKeyManager:
    """Manages API keys for various external services"""
    
    def __init__(self):
        self.keys = {}
        self.usage_tracker = {}
        self.rate_limits = {}
        self._load_keys()
    
    def _load_keys(self):
        """Load API keys from environment variables and config"""
        
        # Social Media APIs
        self.keys["instagram"] = os.getenv("INSTAGRAM_API_KEY", "demo_instagram_key")
        self.keys["facebook"] = os.getenv("FACEBOOK_API_KEY", "demo_facebook_key")
        self.keys["twitter"] = os.getenv("TWITTER_API_KEY", "demo_twitter_key")
        self.keys["linkedin"] = os.getenv("LINKEDIN_API_KEY", "demo_linkedin_key")
        self.keys["tiktok"] = os.getenv("TIKTOK_API_KEY", "demo_tiktok_key")
        
        # OSINT Services
        self.keys["hibp"] = os.getenv("HIBP_API_KEY", "")  # Have I Been Pwned
        self.keys["virustotal"] = os.getenv("VIRUSTOTAL_API_KEY", "")
        self.keys["shodan"] = os.getenv("SHODAN_API_KEY", "")
        self.keys["hunter_io"] = os.getenv("HUNTER_IO_API_KEY", "")  # Email finder
        
        # Geolocation Services
        self.keys["ipgeolocation"] = os.getenv("IP_GEOLOCATION_API_KEY", "")
        self.keys["ipapi"] = os.getenv("IPAPI_KEY", "")
        self.keys["maxmind"] = os.getenv("MAXMIND_LICENSE_KEY", "")
        
        # Alternative: Use free services as fallback
        self.keys["ipapi_free"] = "free"  # ip-api.com is free for non-commercial
        self.keys["ipinfo_free"] = os.getenv("IPINFO_TOKEN", "")  # Free tier available
        
        # Set rate limits (requests per hour)
        self.rate_limits = {
            "instagram": 200,
            "facebook": 200,
            "twitter": 300,
            "linkedin": 100,
            "tiktok": 100,
            "hibp": 1500,  # Free tier
            "virustotal": 4,  # Free tier is very limited
            "shodan": 100,
            "ipgeolocation": 1000,
            "ipapi": 1000,
            "ipapi_free": 45,  # Per minute, but we track per hour
            "ipinfo_free": 50000,  # Per month
        }
        
        # Initialize usage tracker
        for service in self.keys.keys():
            self.usage_tracker[service] = {
                "count": 0,
                "reset_time": datetime.utcnow() + timedelta(hours=1)
            }
    
    def get_key(self, service: str) -> Optional[str]:
        """Get API key for a service"""
        return self.keys.get(service)
    
    def has_key(self, service: str) -> bool:
        """Check if API key exists and is not empty"""
        key = self.keys.get(service)
        return key is not None and key != ""
    
    def track_usage(self, service: str) -> bool:
        """
        Track API usage and check rate limits.
        Returns True if request is allowed, False if rate limit exceeded.
        """
        if service not in self.usage_tracker:
            return True
        
        tracker = self.usage_tracker[service]
        
        # Reset counter if time has passed
        if datetime.utcnow() > tracker["reset_time"]:
            tracker["count"] = 0
            tracker["reset_time"] = datetime.utcnow() + timedelta(hours=1)
        
        # Check rate limit
        rate_limit = self.rate_limits.get(service, float('inf'))
        if tracker["count"] >= rate_limit:
            return False  # Rate limit exceeded
        
        # Increment counter
        tracker["count"] += 1
        return True
    
    def get_usage_stats(self, service: str) -> Dict:
        """Get usage statistics for a service"""
        if service not in self.usage_tracker:
            return {"count": 0, "limit": self.rate_limits.get(service, 0), "resets_in": 0}
        
        tracker = self.usage_tracker[service]
        reset_seconds = (tracker["reset_time"] - datetime.utcnow()).total_seconds()
        
        return {
            "count": tracker["count"],
            "limit": self.rate_limits.get(service, 0),
            "resets_in_seconds": max(0, int(reset_seconds)),
            "resets_in_minutes": max(0, int(reset_seconds / 60))
        }
    
    def get_available_services(self) -> Dict[str, bool]:
        """Get list of services and their availability"""
        available = {}
        for service, key in self.keys.items():
            has_key = key is not None and key != ""
            within_limit = self.track_usage(service) if has_key else False
            # Rollback the tracking since this is just a check
            if has_key and service in self.usage_tracker:
                self.usage_tracker[service]["count"] -= 1
            available[service] = has_key and within_limit
        return available
    
    def get_social_media_services(self) -> list:
        """Get list of available social media scraping services"""
        social_platforms = ["instagram", "facebook", "twitter", "linkedin", "tiktok"]
        return [s for s in social_platforms if self.has_key(s)]
    
    def get_geolocation_service(self) -> tuple:
        """
        Get the best available geolocation service.
        Returns (service_name, api_key)
        """
        # Priority order
        geo_services = [
            "ipgeolocation",
            "ipapi",
            "maxmind",
            "ipinfo_free",
            "ipapi_free"  # Free fallback
        ]
        
        for service in geo_services:
            if self.has_key(service) and self.track_usage(service):
                return (service, self.keys[service])
        
        # Return free service as last resort
        return ("ipapi_free", "free")
    
    def set_key(self, service: str, api_key: str, rate_limit: int = None):
        """Dynamically set an API key"""
        self.keys[service] = api_key
        if rate_limit:
            self.rate_limits[service] = rate_limit
        if service not in self.usage_tracker:
            self.usage_tracker[service] = {
                "count": 0,
                "reset_time": datetime.utcnow() + timedelta(hours=1)
            }
    
    def clear_usage(self, service: str = None):
        """Clear usage statistics for a service or all services"""
        if service:
            if service in self.usage_tracker:
                self.usage_tracker[service]["count"] = 0
                self.usage_tracker[service]["reset_time"] = datetime.utcnow() + timedelta(hours=1)
        else:
            for svc in self.usage_tracker:
                self.usage_tracker[svc]["count"] = 0
                self.usage_tracker[svc]["reset_time"] = datetime.utcnow() + timedelta(hours=1)
    
    def get_credentials(self, service: str) -> Dict:
        """Get full credentials for a service (for OAuth services)"""
        credentials = {
            "api_key": self.keys.get(service),
            "api_secret": None,
            "access_token": None
        }
        
        # Check for OAuth credentials in environment
        if service in ["twitter", "facebook", "linkedin"]:
            credentials["api_secret"] = os.getenv(f"{service.upper()}_API_SECRET")
            credentials["access_token"] = os.getenv(f"{service.upper()}_ACCESS_TOKEN")
        
        return credentials
    
    def export_config(self) -> str:
        """Export current configuration as JSON"""
        config = {
            "services": list(self.keys.keys()),
            "available": [k for k, v in self.keys.items() if v and v != ""],
            "rate_limits": self.rate_limits,
            "usage": {
                k: {"count": v["count"], "limit": self.rate_limits.get(k, 0)}
                for k, v in self.usage_tracker.items()
            }
        }
        return json.dumps(config, indent=2)


# Global instance
api_key_manager = APIKeyManager()


# Helper functions for quick access
def get_api_key(service: str) -> Optional[str]:
    """Quick access to get API key"""
    return api_key_manager.get_key(service)


def check_rate_limit(service: str) -> bool:
    """Quick access to check rate limit"""
    return api_key_manager.track_usage(service)


def get_available_platforms() -> Dict[str, bool]:
    """Quick access to get available platforms"""
    return api_key_manager.get_available_services()
