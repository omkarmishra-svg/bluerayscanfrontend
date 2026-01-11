import uuid

class ProfileService:
    """
    Manages user profiles and linked social/digital assets.
    Instead of a traditional login, users link multiple gmail/social accounts
    which are then tracked by the OSINT aggregator.
    """
    def __init__(self):
        # Database of linked assets for demo purposes
        # Format: { "user_id": { "assets": [ { "type": "gmail", "value": "...", "linked_at": "..." } ] } }
        self._profiles = {
            "demo": {
                "name": "Alex Investigator",
                "assets": [
                    {"type": "email", "value": "alex@investigator.io", "label": "Work Email"},
                    {"type": "github", "value": "alex-dev", "label": "GitHub Portfolio"},
                    {"type": "twitter", "value": "@alex_osint", "label": "Primary Social"}
                ]
            },
            "founder_alpha": {
                "name": "Sarah Startup",
                "assets": [
                    {"type": "email", "value": "sarah@startup.co", "label": "Corporate Email"},
                    {"type": "linkedin", "value": "sarah-startup-ceo", "label": "LinkedIn Profile"}
                ]
            }
        }

    def get_profile(self, user_id: str) -> dict:
        return self._profiles.get(user_id, self._profiles["demo"])

    def link_asset(self, user_id: str, asset_type: str, asset_value: str, label: str = ""):
        if user_id not in self._profiles:
            self._profiles[user_id] = {"name": f"User_{user_id}", "assets": []}
        
        self._profiles[user_id]["assets"].append({
            "type": asset_type,
            "value": asset_value,
            "label": label or asset_type.capitalize()
        })
        return self._profiles[user_id]

profile_service = ProfileService()
