"""
Database service for OSINT platform using SQLAlchemy with SQLite.
Easily upgradeable to PostgreSQL/Supabase by changing the connection string.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, JSON, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from pathlib import Path

# Database setup
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "osint_data.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Models
class User(Base):
    """User profiles with authentication"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    social_accounts = relationship("SocialMediaAccount", back_populates="user")
    osint_scans = relationship("OSINTCollection", back_populates="user")
    stego_analyses = relationship("SteganographyResult", back_populates="user")
    

class SocialMediaAccount(Base):
    """Linked social media accounts for OSINT monitoring"""
    __tablename__ = "social_media_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    platform = Column(String, nullable=False)  # instagram, twitter, facebook, etc.
    username = Column(String, nullable=False)
    profile_url = Column(String)
    connected_at = Column(DateTime, default=datetime.utcnow)
    last_scanned = Column(DateTime)
    is_active = Column(Boolean, default=True)
    extra_data = Column(JSON)  # Store additional platform-specific data
    
    user = relationship("User", back_populates="social_accounts")


class OSINTCollection(Base):
    """OSINT scan results and collections"""
    __tablename__ = "osint_collections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    collection_type = Column(String, nullable=False)  # social_media, email_scan, metadata_extraction
    target = Column(String, nullable=False)  # email, username, profile URL
    platform = Column(String)  # Platform if social media scan
    
    # Results
    data = Column(JSON)  # Main collection data
    metadata_extracted = Column(JSON)  # GPS, device info, timestamps
    risk_score = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="osint_scans")


class ReverseOSINTLog(Base):
    """Track visitors and potential threat actors"""
    __tablename__ = "reverse_osint_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Visitor info
    ip_address = Column(String, nullable=False, index=True)
    user_agent = Column(String)
    device_fingerprint = Column(String, index=True)
    
    # Geolocation
    country = Column(String)
    city = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Access info
    accessed_resource = Column(String)  # What they tried to access
    request_method = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Threat assessment
    is_suspicious = Column(Boolean, default=False)
    threat_level = Column(String)  # LOW, MEDIUM, HIGH, CRITICAL
    threat_indicators = Column(JSON)  # List of suspicious behaviors
    
    # Tracking
    session_id = Column(String, index=True)
    visit_count = Column(Integer, default=1)


class SteganographyResult(Base):
    """Steganography analysis results"""
    __tablename__ = "steganography_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    
    # Image info
    file_path = Column(String, nullable=False)
    file_name = Column(String)
    file_size = Column(Integer)
    
    # Analysis results
    has_hidden_data = Column(Boolean, default=False)
    confidence_score = Column(Float)
    detection_method = Column(String)  # LSB, DCT, Chi-Square, etc.
    
    # Extracted data
    extracted_text = Column(Text)
    extracted_coordinates = Column(String)
    extracted_files = Column(JSON)
    statistical_analysis = Column(JSON)
    
    # Visualization
    heatmap_path = Column(String)
    
    # Timestamp
    analyzed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="stego_analyses")


class APIKeyStore(Base):
    """Secure storage for API keys and credentials"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, unique=True, nullable=False, index=True)
    api_key = Column(String, nullable=False)
    api_secret = Column(String)  # For OAuth services
    rate_limit = Column(Integer)  # Requests per hour
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime)
    is_active = Column(Boolean, default=True)
    extra_data = Column(JSON)  # Additional service-specific data
    created_at = Column(DateTime, default=datetime.utcnow)


class RiskAssessment(Base):
    """Risk assessment history"""
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    
    # Overall risk
    overall_score = Column(Float, nullable=False)
    risk_level = Column(String)  # LOW, MEDIUM, HIGH, CRITICAL
    
    # Category scores
    social_media_exposure = Column(Float)
    data_breach_risk = Column(Float)
    deepfake_threat = Column(Float)
    steganography_risk = Column(Float)
    reverse_osint_threat = Column(Float)
    
    # Recommendations
    recommendations = Column(JSON)
    actions_taken = Column(JSON)
    
    # Timestamp
    assessed_at = Column(DateTime, default=datetime.utcnow)


# Database service class
class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        Base.metadata.create_all(bind=engine)
        self.SessionLocal = SessionLocal
    
    def get_db(self):
        """Get database session"""
        db = self.SessionLocal()
        try:
            return db
        finally:
            pass  # Session will be closed by caller
    
    def get_or_create_user(self, user_id: str, email: str = None):
        """Get existing user or create new one"""
        db = self.get_db()
        try:
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                user = User(user_id=user_id, email=email)
                db.add(user)
                db.commit()
                db.refresh(user)
            return user
        finally:
            db.close()
    
    def add_social_account(self, user_id: str, platform: str, username: str, profile_url: str = None):
        """Link a social media account"""
        db = self.get_db()
        try:
            account = SocialMediaAccount(
                user_id=user_id,
                platform=platform,
                username=username,
                profile_url=profile_url
            )
            db.add(account)
            db.commit()
            db.refresh(account)
            return account
        finally:
            db.close()
    
    def log_osint_collection(self, user_id: str, collection_type: str, target: str, 
                            data: dict, metadata: dict = None, risk_score: float = 0.0, platform: str = None):
        """Log an OSINT collection"""
        db = self.get_db()
        try:
            collection = OSINTCollection(
                user_id=user_id,
                collection_type=collection_type,
                target=target,
                platform=platform,
                data=data,
                metadata_extracted=metadata,
                risk_score=risk_score
            )
            db.add(collection)
            db.commit()
            db.refresh(collection)
            return collection
        finally:
            db.close()
    
    def log_visitor(self, ip: str, user_agent: str, fingerprint: str, 
                   resource: str, geo_data: dict = None, is_suspicious: bool = False):
        """Log a visitor for reverse OSINT"""
        db = self.get_db()
        try:
            log = ReverseOSINTLog(
                ip_address=ip,
                user_agent=user_agent,
                device_fingerprint=fingerprint,
                accessed_resource=resource,
                is_suspicious=is_suspicious,
                country=geo_data.get("country") if geo_data else None,
                city=geo_data.get("city") if geo_data else None,
                latitude=geo_data.get("latitude") if geo_data else None,
                longitude=geo_data.get("longitude") if geo_data else None
            )
            db.add(log)
            db.commit()
            db.refresh(log)
            return log
        finally:
            db.close()
    
    def save_stego_result(self, user_id: str, file_path: str, file_name: str,
                         has_hidden_data: bool, confidence: float, method: str,
                         extracted_text: str = None, extracted_coords: str = None):
        """Save steganography analysis result"""
        db = self.get_db()
        try:
            result = SteganographyResult(
                user_id=user_id,
                file_path=file_path,
                file_name=file_name,
                has_hidden_data=has_hidden_data,
                confidence_score=confidence,
                detection_method=method,
                extracted_text=extracted_text,
                extracted_coordinates=extracted_coords
            )
            db.add(result)
            db.commit()
            db.refresh(result)
            return result
        finally:
            db.close()
    
    def get_visitor_logs(self, limit: int = 100, suspicious_only: bool = False):
        """Get visitor logs for reverse OSINT dashboard"""
        db = self.get_db()
        try:
            query = db.query(ReverseOSINTLog)
            if suspicious_only:
                query = query.filter(ReverseOSINTLog.is_suspicious == True)
            logs = query.order_by(ReverseOSINTLog.timestamp.desc()).limit(limit).all()
            return logs
        finally:
            db.close()
    
    def get_social_accounts(self, user_id: str):
        """Get all social media accounts for a user"""
        db = self.get_db()
        try:
            accounts = db.query(SocialMediaAccount).filter(
                SocialMediaAccount.user_id == user_id,
                SocialMediaAccount.is_active == True
            ).all()
            return accounts
        finally:
            db.close()
    
    def get_osint_history(self, user_id: str, limit: int = 50):
        """Get OSINT collection history"""
        db = self.get_db()
        try:
            collections = db.query(OSINTCollection).filter(
                OSINTCollection.user_id == user_id
            ).order_by(OSINTCollection.created_at.desc()).limit(limit).all()
            return collections
        finally:
            db.close()


# Global instance
db_service = DatabaseService()
