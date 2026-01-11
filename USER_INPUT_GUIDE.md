# OSINT Platform - How to Use With Your Own Data

## ✅ System NOW Works With Real User Inputs!

The system has been enhanced to accept and process YOUR actual data instead of just using demos.

## 🎯 What Can You Input?

### 1. **API Keys** (Navigate to "API Keys" in menu)
Configure your own API keys to enable real data collection:

**Free APIs (No Credit Card):**
- ✅ Twitter/X API - developer.twitter.com
- ✅ IP Geolocation - ipgeolocation.io (1000 free/month)
- ✅ IP-API - ip-api.com (completely free)

**Paid APIs:**
- Instagram API (via Facebook)
- Have I Been Pwned ($3.50/month)
- LinkedIn API

### 2. Social Media OSINT

**You can search by:**
- ✅ **Username**: Enter any username (e.g., `johndoe`, `tech_guru`)
- ✅ **Email**: Search for accounts linked to an email
- ✅ **Profile URL**: Paste full URL like `https://instagram.com/username`

**Input Examples:**
```
Username: elonmusk
Email: someone@example.com
URL: https://twitter.com/username
```

**What Happens:**
- System validates your input
- Sends request to backend
- Shows real data if API keys configured
- Shows realistic mock data for demo if no API keys

### 3. Steganography Analyzer

**You can upload:**
- ✅ YOUR OWN IMAGES (PNG, JPEG, BMP)
- ✅ Any image up to 10MB
- ✅ Drag & drop or browse

**What It Analyzes:**
- LSB (Least Significant Bit) patterns
- DCT (Frequency domain) analysis
- Chi-Square statistical tests
- Visual anomalies

**Real Output:**
- Confidence scores based on actual image data
- Heatmap showing suspicious regions
- Extracted hidden data if found

### 4. Reverse OSINT

**Automatic Tracking:**
- ✅ Automatically tracks ALL visitors
- ✅ Stores real IP addresses
- ✅ Real geolocation data
- ✅ Device fingerprinting

**No input needed** - just browse the app and check "Reverse OSINT" tab!

##Input Validation

### Username Validation ✓
- Must be 3-30 characters
- Only letters, numbers, dots, underscores
- No @ symbol needed

###Email Validation ✓
- Must be valid  email format
- Checks for @  and domain

### URL Validation ✓
- Accepts Instagram, Twitter, Facebook, LinkedIn, TikTok URLs
- Automatically extracts username

### Image Validation ✓
- File type checking (PNG, JPEG, BMP)
- Size limit: 10MB
- Format verification

## 🔄 Mock Data vs Real Data

**Current Behavior:**

1. **Without API Keys** → Realistic mock data for demonstration
2. **With API Keys** → Real data from actual APIs

**How to Check:**
- Look for "Using Mock Data" indicator
- Check API Keys page for configured services

## 📝 Step-by-Step Example

### Example 1: Search Instagram Profile

1. Click "Social Media OSINT" in menu
2. Select "Instagram" platform
3. Choose search type: "Username"
4. Enter: `nasa` (or any public username)
5. Click "Scan Profile"
6. View results with exposure metrics

### Example 2: Analyze Image for Hidden Data

1. Click "Steganography" in menu
2. Prepare an image file
3. Drag & drop OR click to browse
4. Click "Analyze for Hidden Data"
5. View detection results and heatmap

### Example 3: Track Visitors

1. Click "Reverse OSINT" in menu
2. View automatically collected visitor data
3. Check threat levels
4. Review visitor map

## 🚀 Production Ready Features

✅ **Input validation on all forms**
✅ **Error handling with user-friendly messages**
✅ **Real-time feedback**
✅ **API key configuration UI**
✅ **Automatic fallback to mock data**
✅ **Works without any API keys**

## 💡 Tips

1. **Start without API keys** - See how it works with mock data
2. **Add free API keys** - Get real Twitter/geolocation data
3. **Upload test images** - See stego detection in action
4. **Browse the app** - Automatically populate reverse OSINT

## ⚠️ Important Notes

- **API Keys stored in browser localStorage** (Demo only - use backend in production)
- **Mock data is realistic** - Perfect for presentations/demos
- **Real APIs have rate limits** - Check provider documentation
- **All inputs are validated** - You'll see helpful error messages

## 🎉 Ready to Use!

The system is NOW fully functional with user inputs. Try it out!

1. Start backend: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `npm run dev`
3. Navigate to any feature
4. Enter YOUR data
5. See results!

**No API keys? No problem!** The system works perfectly with mock data for demonstrations.
