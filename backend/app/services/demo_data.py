"""
Central repository for demo/mock data used in hackathon demonstrations.
Provides realistic data when external APIs are unavailable or using mock keys.
"""

import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

class DemoDataService:
    """Provides realistic mock data for demo mode"""
    
    def __init__(self):
        self.demo_profiles = self._generate_demo_profiles()
        self.threat_scenarios = self._generate_threat_scenarios()
    
    def _generate_demo_profiles(self) -> List[Dict[str, Any]]:
        """Generate realistic user profiles for demo"""
        return [
            {
                "email": "demo_user@bluerayscan.io",
                "name": "Alex Chen",
                "username": "alexchen_official",
                "accounts": {
                    "twitter": "@alexchen_tech",
                    "instagram": "@alexchen.official",
                    "facebook": "alexchen.public",
                    "linkedin": "in/alexchen"
                }
            },
            {
                "email": "john.doe@example.com",
                "name": "John Doe",
                "username": "johndoe",
                "accounts": {
                    "twitter": "@johndoe",
                    "instagram": "@john_doe_photos"
                }
            }
        ]
    
    def _generate_threat_scenarios(self) -> List[Dict[str, Any]]:
        """Generate realistic threat scenarios for demo"""
        return [
            {
                "type": "deepfake_image",
                "severity": "HIGH",
                "description": "AI-generated facial manipulation detected",
                "confidence": 94.5,
                "source": "Instagram Story"
            },
            {
                "type": "data_breach",
                "severity": "CRITICAL",
                "description": "Email found in LinkedIn breach (2021)",
                "breach_count": 3,
                "exposed_data": ["emails", "passwords", "phone_numbers"]
            },
            {
                "type": "impersonation",
                "severity": "MEDIUM",
                "description": "Suspicious account using similar username",
                "platform": "Twitter",
                "fake_account": "@alex_chen_tech"
            }
        ]
    
    def get_virustotal_mock(self, file_hash: str) -> Dict[str, Any]:
        """Mock VirusTotal scan result"""
        is_malicious = random.choice([True, False, False, False])  # 25% malicious
        
        return {
            "data": {
                "attributes": {
                    "last_analysis_stats": {
                        "malicious": random.randint(2, 15) if is_malicious else 0,
                        "suspicious": random.randint(0, 3),
                        "undetected": random.randint(50, 70),
                        "harmless": random.randint(0, 5)
                    },
                    "last_analysis_results": {
                        "Avast": {"category": "malicious" if is_malicious else "undetected"},
                        "Kaspersky": {"category": "malicious" if is_malicious else "undetected"},
                        "Microsoft": {"category": "suspicious" if is_malicious else "undetected"},
                        "Sophos": {"category": "malicious" if is_malicious else "undetected"}
                    },
                    "reputation": -5 if is_malicious else 0,
                    "sha256": file_hash
                }
            },
            "mock": True
        }
    
    def get_shodan_mock(self, ip_address: str) -> Dict[str, Any]:
        """Mock Shodan IP lookup result"""
        return {
            "ip_str": ip_address,
            "country_name": random.choice(["United States", "United Kingdom", "Germany", "France", "India", "China"]),
            "city": random.choice(["New York", "London", "Berlin", "Paris", "Mumbai", "Beijing"]),
            "org": random.choice(["Amazon.com Inc.", "Google LLC", "Microsoft Corporation", "DigitalOcean LLC"]),
            "isp": random.choice(["Amazon", "Google Cloud", "Microsoft Azure", "DigitalOcean"]),
            "ports": random.sample([22, 80, 443, 8080, 3306, 5432, 27017], k=random.randint(1, 4)),
            "vulns": ["CVE-2021-44228"] if random.random() < 0.1 else [],  # 10% vulnerable
            "tags": random.sample(["cloud", "database", "vpn", "proxy"], k=random.randint(0, 2)),
            "mock": True
        }
    
    def get_hibp_mock(self, email: str) -> List[Dict[str, Any]]:
        """Mock Have I Been Pwned breach check"""
        breaches = [
            {
                "Name": "LinkedIn",
                "Title": "LinkedIn",
                "Domain": "linkedin.com",
                "BreachDate": "2021-04-06",
                "AddedDate": "2021-06-22",
                "ModifiedDate": "2021-06-22",
                "PwnCount": 700000000,
                "Description": "In April 2021, data scraped from 700M LinkedIn users was posted for sale online.",
                "DataClasses": ["Email addresses", "Full names", "Phone numbers", "Physical addresses"]
            },
            {
                "Name": "Adobe",
                "Title": "Adobe",
                "Domain": "adobe.com",
                "BreachDate": "2013-10-04",
                "AddedDate": "2013-12-04",
                "ModifiedDate": "2022-05-15",
                "PwnCount": 152445165,
                "Description": "In October 2013, 153 million Adobe accounts were breached.",
                "DataClasses": ["Email addresses", "Password hints", "Passwords", "Usernames"]
            },
            {
                "Name": "Dropbox",
                "Title": "Dropbox",
                "Domain": "dropbox.com",
                "BreachDate": "2012-07-01",
                "AddedDate": "2016-08-31",
                "ModifiedDate": "2016-08-31",
                "PwnCount": 68648009,
                "Description": "In mid-2012, Dropbox suffered a data breach which exposed the stored credentials of tens of millions of their customers.",
                "DataClasses": ["Email addresses", "Passwords"]
            }
        ]
        
        # Return random subset of breaches (0-3)
        if random.random() < 0.3:  # 30% chance of no breaches
            return []
        
        return random.sample(breaches, k=random.randint(1, min(3, len(breaches))))
    
    def get_hunter_io_mock(self, domain: str) -> Dict[str, Any]:
        """Mock Hunter.io email finder result"""
        return {
            "data": {
                "domain": domain,
                "disposable": False,
                "webmail": domain in ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"],
                "emails": [
                    {
                        "value": f"john.doe@{domain}",
                        "type": "personal",
                        "confidence": 92,
                        "sources": [
                            {"domain": "github.com", "uri": f"https://github.com/{domain}"},
                            {"domain": "linkedin.com", "uri": f"https://linkedin.com/company/{domain}"}
                        ]
                    },
                    {
                        "value": f"contact@{domain}",
                        "type": "generic",
                        "confidence": 87,
                        "sources": [{"domain": domain, "uri": f"https://{domain}/contact"}]
                    }
                ],
                "pattern": "{first}.{last}",
                "organization": domain.split('.')[0].title()
            },
            "mock": True
        }
    
    def get_social_media_mock(self, username: str, platform: str) -> Dict[str, Any]:
        """Mock social media profile data"""
        
        base_profiles = {
            "twitter": {
                "username": username,
                "display_name": username.replace("_", " ").title(),
                "followers": random.randint(100, 50000),
                "following": random.randint(50, 5000),
                "tweets": random.randint(500, 20000),
                "verified": random.choice([True, False, False, False]),
                "created_at": (datetime.now() - timedelta(days=random.randint(365, 3650))).isoformat(),
                "bio": f"Tech enthusiast | AI/ML | Digital privacy advocate",
                "location": random.choice(["San Francisco, CA", "New York, NY", "London, UK", "Berlin, Germany"]),
                "profile_image": f"https://i.pravatar.cc/200?u={username}",
                "recent_tweets": [
                    {"text": "Just launched a new project! Check it out 🚀", "likes": random.randint(10, 500), "timestamp": "2h ago"},
                    {"text": "Interesting developments in AI security...", "likes": random.randint(5, 200), "timestamp": "1d ago"}
                ]
            },
            "instagram": {
                "username": username,
                "full_name": username.replace("_", " ").title(),
                "followers": random.randint(500, 100000),
                "following": random.randint(100, 2000),
                "posts": random.randint(50, 1000),
                "verified": random.choice([True, False, False]),
                "bio": f"📸 Content creator | 🎨 Designer",
                "profile_pic": f"https://i.pravatar.cc/200?u={username}",
                "engagement_rate": round(random.uniform(2.5, 8.5), 2)
            },
            "facebook": {
                "username": username,
                "name": username.replace("_", " ").title(),
                "friends": random.randint(200, 5000),
                "likes": random.randint(50, 2000),
                "profile_picture": f"https://i.pravatar.cc/200?u={username}",
                "about": "Living life one day at a time",
                "hometown": random.choice(["New York", "Los Angeles", "Chicago", "Houston"])
            },
            "linkedin": {
                "username": username,
                "full_name": username.replace("_", " ").title(),
                "headline": random.choice([
                    "Software Engineer at Tech Corp",
                    "Product Manager | AI Enthusiast",
                    "Data Scientist | ML Researcher",
                    "Cybersecurity Analyst"
                ]),
                "connections": random.randint(500, 5000),
                "profile_url": f"https://linkedin.com/in/{username}",
                "location": random.choice(["San Francisco Bay Area", "New York City", "London Area", "Berlin Area"]),
                "industry": "Information Technology & Services"
            }
        }
        
        return {
            **base_profiles.get(platform.lower(), {}),
            "platform": platform,
            "found": True,
            "last_updated": datetime.now().isoformat(),
            "risk_indicators": random.randint(0, 3),
            "mock": True
        }
    
    def get_ip_geolocation_mock(self, ip: str) -> Dict[str, Any]:
        """Mock IP geolocation data"""
        cities = [
            {"city": " Francisco", "country": "United States", "region": "California", "lat": 37.7749, "lon": -122.4194},
            {"city": "New York", "country": "United States", "region": "New York", "lat": 40.7128, "lon": -74.0060},
            {"city": "London", "country": "United Kingdom", "region": "England", "lat": 51.5074, "lon": -0.1278},
            {"city": "Berlin", "country": "Germany", "region": "Berlin", "lat": 52.5200, "lon": 13.4050},
            {"city": "Tokyo", "country": "Japan", "region": "Tokyo", "lat": 35.6762, "lon": 139.6503},
        ]
        
        location = random.choice(cities)
        
        return {
            "ip": ip,
            "city": location["city"],
            "region": location["region"],
            "country": location["country"],
            "country_code": location["country"][:2].upper(),
            "latitude": location["lat"],
            "longitude": location["lon"],
            "timezone": random.choice(["America/Los_Angeles", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Tokyo"]),
            "isp": random.choice(["Comcast Cable", "AT&T Services", "Verizon", "Deutsche Telekom", "NTT Communications"]),
            "organization": random.choice(["Google LLC", "Amazon.com", "Microsoft Corporation", "Cloudflare Inc."]),
            "asn": f"AS{random.randint(1000, 99999)}",
            "mock": True
        }
    
    def get_reverse_osint_visitors(self) -> List[Dict[str, Any]]:
        """Mock reverse OSINT visitor tracking data"""
        visitors = []
        for i in range(random.randint(10, 30)):
            timestamp = datetime.now() - timedelta(minutes=random.randint(1, 1440))
            visitors.append({
                "id": f"visitor_{i}",
                "ip": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}",
                "user_agent": random.choice([
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
                    "Mozilla/5.0 (X11; Linux x86_64) Firefox/89.0"
                ]),
                "device": random.choice(["Desktop", "Mobile", "Tablet"]),
                "os": random.choice(["Windows", "macOS", "Linux", "iOS", "Android"]),
                "browser": random.choice(["Chrome", "Safari", "Firefox", "Edge"]),
                "country": random.choice(["US", "UK", "DE", "FR", "IN", "CN", "JP"]),
                "city": random.choice(["New York", "London", "Berlin", "Paris", "Mumbai"]),
                "timestamp": timestamp.isoformat(),
                "path": random.choice(["/api/scan", "/api/intelligence", "/", "/dashboard"]),
                "method": random.choice(["GET", "POST", "POST", "GET"]),
                "is_suspicious": random.random() < 0.1  # 10% suspicious
            })
        
        return sorted(visitors, key=lambda x: x["timestamp"], reverse=True)
    
    def get_steganography_mock(self, file_path: str) -> Dict[str, Any]:
        """Mock steganography detection result"""
        has_hidden_data = random.choice([True, False, False, False])  # 25% has hidden data
        
        result = {
            "file": file_path,
            "analysis_date": datetime.now().isoformat(),
            "techniques_detected": [],
            "confidence": 0,
            "hidden_data_found": has_hidden_data,
            "mock": True
        }
        
        if has_hidden_data:
            result["techniques_detected"] = random.sample(
                ["LSB (Least Significant Bit)", "DCT (Discrete Cosine Transform)", "Metadata Embedding"],
                k=random.randint(1, 2)
            )
            result["confidence"] = round(random.uniform(75.0, 95.0), 2)
            result["extracted_data"] = {
                "type": random.choice(["text", "file", "encrypted"]),
                "size_bytes": random.randint(100, 50000),
                "preview": "Secret message detected..." if random.random() < 0.5 else "[Encrypted data]"
            }
        else:
            result["confidence"] = round(random.uniform(85.0, 99.0), 2)
            result["message"] = "No hidden data detected. Image appears clean."
        
        return result

# Global instance
demo_data = DemoDataService()
