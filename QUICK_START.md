# OSINT Platform - Quick Start Guide

## Running the Application

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install sqlalchemy pillow numpy scipy requests aiohttp geoip2 python-magic exifread

# Start the backend server
uvicorn app.main:app --reload
```

Backend will run on: `http://localhost:8000`

### 2. Frontend Setup

```bash
# In the root directory
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Using the System

### 1. Configure API Keys (Optional)

Navigate to **API Keys** in the menu to configure your API keys. Without keys, the system uses realistic mock data.

**Free API Keys You Can Get:**
- Twitter API: https://developer.twitter.com/
- IP Geolocation: https://ipgeolocation.io/ (1000 free requests/month)
- Have I Been Pwned: https://haveibeenpwned.com/API/Key

### 2. Social Media OSINT

**Test it with:**
- Username: `demo_user` or any username
- Try different platforms
- Use Email search or Profile URL options

**What it does:**
- Scans social media profiles
- Extracts metadata (GPS, device info)
- Calculates exposure risk
- Identifies privacy concerns

### 3. Steganography Detection

**Test it with:**
- Upload any image (PNG, JPEG, BMP)
- System analyzes for hidden data
- View extraction results and heatmaps

**What it detects:**
- Hidden text messages
- GPS coordinates
- Binary data
- Statistical anomalies

### 4. Reverse OSINT

**Automatic tracking:**
- Every visitor is logged automatically
- View visitor map in real-time
- Check threat actor profiles
- Monitor access patterns

## User Input Options

### Social Media Monitor
- **Username**: Enter without @ symbol
- **Email**: Searches accounts linked to email
- **Profile URL**: Paste full social media URL

### Steganography
- **Upload**: Drag & drop or click to browse
- **Supported**: PNG, JPEG, BMP images
- **Max size**: 10MB

### Reverse OSINT
- **Automatic**: No input needed
- **View**: Real-time visitor data
- **Filter**: By threat level

## Troubleshooting

### Backend won't start
```bash
# Try reinstalling dependencies
pip install --upgrade -r requirements.txt
```

### Frontend errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### No data showing
- Without API keys, system uses mock data
- Check browser console for errors
- Ensure backend is running

## Mock vs Real Data

**Current Status**: System uses realistic mock data for demonstration

**To Use Real Data**:
1. Add API keys in API Keys configuration
2. Backend will automatically use real APIs when available
3. Falls back to mock data if API fails or no key provided

## Features Status

✅ **Working with User Input:**
- All features accept real user inputs
- Input validation implemented
- Error handling in place
- Mock data for testing without APIs

✅ **Ready for Production:**
- Add API keys
- System automatically switches to real APIs
- Database persists all data
- Reverse OSINT tracks real visitors

## Support

Check `walkthrough.md` for detailed documentation of all features.
