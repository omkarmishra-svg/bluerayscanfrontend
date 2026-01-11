"""
Social Media OSINT Service - Comprehensive digital footprint analysis.
Supports Instagram, Twitter, Facebook, LinkedIn, and TikTok.
Extracts metadata including GPS, device info, timestamps, and network graphs.
"""

import asyncio
import random
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from app.services.api_key_manager import api_key_manager


class SocialMediaOSINT:
    """Comprehensive social media scraping and analysis"""
    
    def __init__(self):
        self.supported_platforms = ["instagram", "twitter", "facebook", "linkedin", "tiktok"]
    
    async def scan_profile(self, platform: str, username: str, deep_scan: bool = True) -> Dict:
        """
        Scan a social media profile and extract all available data.
        
        Args:
            platform: Social media platform (instagram, twitter, facebook, etc.)
            username: Username or profile identifier
            deep_scan: If True, extract detailed metadata from posts
        
        Returns:
            Dict containing profile data, posts, and metadata
        """
        platform = platform.lower()
        
        if platform not in self.supported_platforms:
            return {"error": f"Unsupported platform: {platform}"}
        
        # Check API availability
        if not api_key_manager.has_key(platform):
            return await self._mock_scan_profile(platform, username, deep_scan)
        
        # Route to appropriate scanner
        if platform == "instagram":
            return await self._scan_instagram(username, deep_scan)
        elif platform == "twitter":
            return await self._scan_twitter(username, deep_scan)
        elif platform == "facebook":
            return await self._scan_facebook(username, deep_scan)
        elif platform == "linkedin":
            return await self._scan_linkedin(username, deep_scan)
        elif platform == "tiktok":
            return await self._scan_tiktok(username, deep_scan)
    
    async def _scan_instagram(self, username: str, deep_scan: bool) -> Dict:
        """Scan Instagram profile (requires Instagram Graph API or instaloader)"""
        await asyncio.sleep(0.5)  # Simulate API call
        
        # In production, use instaloader or Instagram Graph API
        # For now, return realistic mock data
        return await self._mock_scan_profile("instagram", username, deep_scan)
    
    async def _scan_twitter(self, username: str, deep_scan: bool) -> Dict:
        """Scan Twitter/X profile (requires Twitter API v2)"""
        await asyncio.sleep(0.5)
        
        # In production, use tweepy with Twitter API v2
        return await self._mock_scan_profile("twitter", username, deep_scan)
    
    async def _scan_facebook(self, username: str, deep_scan: bool) -> Dict:
        """Scan Facebook profile (requires Facebook Graph API)"""
        await asyncio.sleep(0.5)
        
        # In production, use Facebook Graph API
        return await self._mock_scan_profile("facebook", username, deep_scan)
    
    async def _scan_linkedin(self, username: str, deep_scan: bool) -> Dict:
        """Scan LinkedIn profile (requires LinkedIn API)"""
        await asyncio.sleep(0.5)
        
        # In production, use LinkedIn API
        return await self._mock_scan_profile("linkedin", username, deep_scan)
    
    async def _scan_tiktok(self, username: str, deep_scan: bool) -> Dict:
        """Scan TikTok profile (requires TikTok API)"""
        await asyncio.sleep(0.5)
        
        # In production, use TikTok API
        return await self._mock_scan_profile("tiktok", username, deep_scan)
    
    async def _mock_scan_profile(self, platform: str, username: str, deep_scan: bool) -> Dict:
        """
        Mock scanner for demonstration.
        In production, replace with actual API calls.
        """
        
        # Generate realistic mock data
        posts = []
        total_posts = random.randint(50, 500) if deep_scan else random.randint(10, 50)
        
        for i in range(min(total_posts, 20)):  # Limit to 20 for demo
            post_date = datetime.utcnow() - timedelta(days=random.randint(1, 365))
            
            post = {
                "id": f"{platform}_{username}_post_{i}",
                "type": random.choice(["photo", "video", "text", "story"]),
                "caption": self._generate_mock_caption(),
                "timestamp": post_date.isoformat(),
                "likes": random.randint(10, 10000),
                "comments": random.randint(0, 500),
                "shares": random.randint(0, 100),
                "url": f"https://{platform}.com/{username}/post/{i}",
            }
            
            # Add metadata if deep scan
            if deep_scan:
                post["metadata"] = self._extract_metadata(platform, post)
            
            posts.append(post)
        
        # Profile summary
        profile = {
            "platform": platform,
            "username": username,
            "profile_url": f"https://{platform}.com/{username}",
            "display_name": f"{username.capitalize()} (Demo)",
            "bio": "Sample bio for demonstration purposes",
            "followers": random.randint(100, 100000),
            "following": random.randint(50, 5000),
            "total_posts": total_posts,
            "posts_scanned": len(posts),
            "account_created": (datetime.utcnow() - timedelta(days=random.randint(365, 2000))).isoformat(),
            "verified": random.choice([True, False]),
            "profile_picture": f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
            "location": random.choice(["New York, USA", "London, UK", "Tokyo, Japan", "Mumbai, India", "Not specified"]),
        }
        
        # Extract aggregate metadata
        metadata_summary = self._analyze_metadata_patterns(posts) if deep_scan else {}
        
        # Calculate exposure metrics
        exposure = self._calculate_exposure_metrics(profile, posts)
        
        return {
            "status": "success",
            "platform": platform,
            "username": username,
            "profile": profile,
            "posts": posts,
            "metadata_summary": metadata_summary,
            "exposure_metrics": exposure,
            "scan_timestamp": datetime.utcnow().isoformat(),
            "deep_scan": deep_scan
        }
    
    def _extract_metadata(self, platform: str, post: Dict) -> Dict:
        """Extract metadata from a post"""
        metadata = {
            "has_location": random.choice([True, False]),
            "has_device_info": random.choice([True, False]),
            "has_exif_data": post["type"] == "photo" and random.choice([True, False]),
        }
        
        # Location data
        if metadata["has_location"]:
            locations = [
                {"lat": 40.7128, "lon": -74.0060, "name": "New York City, USA"},
                {"lat": 51.5074, "lon": -0.1278, "name": "London, UK"},
                {"lat": 35.6762, "lon": 139.6503, "name": "Tokyo, Japan"},
                {"lat": 19.0760, "lon": 72.8777, "name": "Mumbai, India"},
                {"lat": 37.7749, "lon": -122.4194, "name": "San Francisco, USA"},
            ]
            location = random.choice(locations)
            metadata["location"] = location
            metadata["gps_coordinates"] = f"{location['lat']}, {location['lon']}"
        
        # Device information
        if metadata["has_device_info"]:
            devices = [
                {"brand": "Apple", "model": "iPhone 14 Pro", "os": "iOS 17.1"},
                {"brand": "Samsung", "model": "Galaxy S23", "os": "Android 14"},
                {"brand": "Google", "model": "Pixel 8", "os": "Android 14"},
                {"brand": "Apple", "model": "iPhone 13", "os": "iOS 16.5"},
            ]
            metadata["device"] = random.choice(devices)
        
        # EXIF data for photos
        if metadata["has_exif_data"]:
            metadata["exif"] = {
                "camera_make": random.choice(["Canon", "Nikon", "Sony", "Apple"]),
                "camera_model": random.choice(["EOS R5", "D850", "A7 III", "iPhone 14 Pro"]),
                "focal_length": f"{random.randint(24, 200)}mm",
                "iso": random.choice([100, 200, 400, 800, 1600]),
                "exposure_time": f"1/{random.choice([60, 125, 250, 500, 1000])}",
                "f_stop": f"f/{random.choice([1.8, 2.8, 4.0, 5.6, 8.0])}",
            }
        
        # Network information
        metadata["tagged_users"] = random.randint(0, 5)
        metadata["hashtags"] = random.randint(0, 15)
        
        return metadata
    
    def _analyze_metadata_patterns(self, posts: List[Dict]) -> Dict:
        """Analyze patterns across all posts metadata"""
        
        locations_found = []
        devices_found = []
        posting_hours = []
        
        for post in posts:
            if "metadata" in post:
                meta = post["metadata"]
                
                # Collect locations
                if meta.get("has_location") and "location" in meta:
                    locations_found.append(meta["location"]["name"])
                
                # Collect devices
                if meta.get("has_device_info") and "device" in meta:
                    device_str = f"{meta['device']['brand']} {meta['device']['model']}"
                    devices_found.append(device_str)
                
                # Posting time patterns
                if "timestamp" in post:
                    post_time = datetime.fromisoformat(post["timestamp"])
                    posting_hours.append(post_time.hour)
        
        # Calculate patterns
        unique_locations = list(set(locations_found))
        unique_devices = list(set(devices_found))
        most_common_hour = max(set(posting_hours), key=posting_hours.count) if posting_hours else 0
        
        return {
            "total_locations_exposed": len(locations_found),
            "unique_locations": unique_locations,
            "location_frequency": {loc: locations_found.count(loc) for loc in unique_locations},
            "devices_used": unique_devices,
            "most_active_hour": most_common_hour,
            "posting_pattern": "Regular" if len(posting_hours) > 10 else "Sporadic",
            "privacy_risk": "HIGH" if len(unique_locations) > 3 else "MEDIUM" if len(unique_locations) > 0 else "LOW"
        }
    
    def _calculate_exposure_metrics(self, profile: Dict, posts: List[Dict]) -> Dict:
        """Calculate exposure and privacy metrics"""
        
        total_engagement = sum(post.get("likes", 0) + post.get("comments", 0) + post.get("shares", 0) for post in posts)
        avg_engagement = total_engagement / len(posts) if posts else 0
        
        # Calculate exposure score (0-100)
        exposure_score = 0
        
        # Profile visibility
        if profile.get("followers", 0) > 1000:
            exposure_score += 20
        elif profile.get("followers", 0) > 100:
            exposure_score += 10
        
        # Post frequency
        if profile.get("total_posts", 0) > 500:
            exposure_score += 15
        elif profile.get("total_posts", 0) > 100:
            exposure_score += 10
        
        # Public information
        if profile.get("location") != "Not specified":
            exposure_score += 15
        
        # Metadata exposure (check if posts have location data)
        posts_with_location = sum(1 for p in posts if p.get("metadata", {}).get("has_location", False))
        if posts_with_location > 5:
            exposure_score += 20
        elif posts_with_location > 0:
            exposure_score += 10
        
        # Engagement level
        if avg_engagement > 100:
            exposure_score += 20
        elif avg_engagement > 10:
            exposure_score += 10
        
        return {
            "exposure_score": min(exposure_score, 100),
            "exposure_level": "HIGH" if exposure_score > 70 else "MEDIUM" if exposure_score > 40 else "LOW",
            "total_engagement": total_engagement,
            "average_engagement": round(avg_engagement, 2),
            "visibility_reach": profile.get("followers", 0) * 10,  # Estimated reach
            "posts_with_location": posts_with_location,
            "posts_with_device_info": sum(1 for p in posts if p.get("metadata", {}).get("has_device_info", False)),
            "privacy_concerns": self._identify_privacy_concerns(profile, posts)
        }
    
    def _identify_privacy_concerns(self, profile: Dict, posts: List[Dict]) -> List[str]:
        """Identify specific privacy concerns"""
        concerns = []
        
        if profile.get("location") != "Not specified":
            concerns.append("Home location publicly visible in profile")
        
        posts_with_location = sum(1 for p in posts if p.get("metadata", {}).get("has_location", False))
        if posts_with_location > 5:
            concerns.append(f"{posts_with_location} posts contain GPS coordinates")
        
        posts_with_device = sum(1 for p in posts if p.get("metadata", {}).get("has_device_info", False))
        if posts_with_device > 3:
            concerns.append(f"{posts_with_device} posts reveal device information")
        
        if profile.get("followers", 0) > 10000:
            concerns.append("Large follower count increases impersonation risk")
        
        if not profile.get("verified", False):
            concerns.append("Unverified account - higher risk of impersonation")
        
        return concerns
    
    def _generate_mock_caption(self) -> str:
        """Generate realistic mock captions"""
        captions = [
            "Great day out! #fun #memories",
            "New project launching soon 🚀",
            "Coffee and coding ☕️💻",
            "Beautiful sunset today 🌅",
            "Team meeting went well! 👍",
            "Exploring new places ✈️",
            "Weekend vibes 😎",
            "Throwback to last summer",
            "Grateful for this moment 🙏",
            "Making progress every day 💪"
        ]
        return random.choice(captions)
    
    async def search_username_across_platforms(self, username: str) -> Dict:
        """Search for a username across all supported platforms"""
        results = {}
        
        for platform in self.supported_platforms:
            try:
                result = await self.scan_profile(platform, username, deep_scan=False)
                if result.get("status") == "success":
                    results[platform] = {
                        "found": True,
                        "profile_url": result["profile"]["profile_url"],
                        "followers": result["profile"].get("followers", 0),
                        "posts": result["profile"].get("total_posts", 0)
                    }
                else:
                    results[platform] = {"found": False}
            except Exception as e:
                results[platform] = {"found": False, "error": str(e)}
        
        return {
            "username": username,
            "platforms_found": sum(1 for r in results.values() if r.get("found", False)),
            "total_platforms_checked": len(self.supported_platforms),
            "results": results,
            "scan_timestamp": datetime.utcnow().isoformat()
        }


# Global instance
social_media_osint = SocialMediaOSINT()
