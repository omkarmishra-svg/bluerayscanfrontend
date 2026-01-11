from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.routers import scan, osint, social_media, steganography, reverse_osint_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# CORS configuration - Simplest form for cross-origin access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reverse OSINT Tracking Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.services.reverse_osint import reverse_osint

class ReverseOSINTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Track visitor (non-blocking)
        try:
            client_ip = request.client.host if request.client else "unknown"
            user_agent = request.headers.get("user-agent", "unknown")
            path = str(request.url.path)
            method = request.method
            
            # Skip tracking for static files and health checks
            skip_paths = ["/uploads", "/ws", "/favicon.ico", "/"]
            if not any(path.startswith(p) for p in skip_paths):
                request_data = {
                    "ip": client_ip,
                    "user_agent": user_agent,
                    "path": path,
                    "method": method
                }
                # Log asynchronously (fire and forget)
                import asyncio
                asyncio.create_task(reverse_osint.log_visitor(request_data))
        except Exception as e:
            print(f"Reverse OSINT tracking error: {e}")
        
        response = await call_next(request)
        return response

app.add_middleware(ReverseOSINTMiddleware)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    from app.services.database import db_service
    print("Initializing database...")
    # Database is initialized in db_service constructor
    print("Advanced OSINT Platform ready!")

# Routes
app.include_router(scan.router, prefix=settings.API_PREFIX, tags=["Scan"])
app.include_router(osint.router, prefix=f"{settings.API_PREFIX}/intelligence", tags=["Intelligence"])
app.include_router(social_media.router, prefix=f"{settings.API_PREFIX}/social", tags=["Social Media OSINT"])
app.include_router(steganography.router, prefix=f"{settings.API_PREFIX}/stego", tags=["Steganography"])
app.include_router(reverse_osint_router.router, prefix=f"{settings.API_PREFIX}/reverse-osint", tags=["Reverse OSINT"])

# WebSocket Endpoint
from fastapi import WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection open and listen for any client messages (optional)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
        manager.disconnect(websocket)

# Mount uploads directory for easy debugging access (e.g. localhost:8000/uploads/foo.mp4)
# Warning: Be careful with security in production
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/api/stats")
async def get_system_stats(user_id: str = "demo"):
    """
    Returns real-time system metrics for the dashboard.
    """
    # In a full implementation, these would come from the database (Supabase)
    # For now, we return dynamic values that represent the "live" state
    return {
        "scans": "1,942",
        "monitors": "31",
        "threats": "12",
        "authentic": "1,930",
        "scan_activity": [
            {"date": "Mon", "scans": 45, "threats": 3},
            {"date": "Tue", "scans": 52, "threats": 1},
            {"date": "Wed", "scans": 48, "threats": 5},
            {"date": "Thu", "scans": 61, "threats": 2},
            {"date": "Fri", "scans": 55, "threats": 4},
            {"date": "Sat", "scans": 38, "threats": 1},
            {"date": "Sun", "scans": 42, "threats": 0}
        ]
    }

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "service": "BlueRayScan Backend", 
        "version": settings.VERSION
    }
