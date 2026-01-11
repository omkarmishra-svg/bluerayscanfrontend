# API Keys Setup Guide - Step by Step

## 🚀 Quick Start (5 Minutes)

### Step 1: .env File Banao

```bash
# Backend folder mein jao
cd backend

# .env.example ko copy karke .env banao
copy .env.example .env
```

**Windows PowerShell mein:**
```powershell
Copy-Item .env.example .env
```

**Ab `backend/.env` file edit karo** (VS Code mein open karo)

---

## 📝 Step 2: API Keys Collect Karo

### Option A: FREE APIs (Recommended for Testing) ✅

#### 1. **Twitter API** (FREE)
**Kaise milega:**
1. [https://developer.twitter.com/](https://developer.twitter.com/) pe jao
2. "Sign up" karo (apne Twitter account se)
3. "Create Project" → "Create App"
4. App naam do (e.g., "My OSINT Tool")
5. API Key aur Secret copy karo

**Time:** 5-10 minutes

**.env mein add karo:**
```env
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
```

---

#### 2. **IP Geolocation API** (FREE - 1000 requests/month)
**Kaise milega:**
1. [https://ipgeolocation.io/](https://ipgeolocation.io/) pe jao
2. "Sign Up Free" click karo
3. Email verify karo
4. Dashboard pe API key dikhega

**Time:** 2 minutes

**.env mein add karo:**
```env
IP_GEOLOCATION_API_KEY=your_api_key_here
```

---

#### 3. **IP-API** (Completely FREE - no signup needed!)
**Already enabled!** No API key needed, automatic fallback hai.

---

### Option B: PAID APIs (For Production)

#### 4. **Instagram API**
**Requirement:** Facebook Developer Account + Business Page

**Steps:**
1. [https://developers.facebook.com/](https://developers.facebook.com/) pe jao
2. "Create App" → "Business" type select karo
3. Instagram Basic Display add karo
4. App Review ke liye apply karo (takes time)

**.env mein add karo:**
```env
INSTAGRAM_API_KEY=your_app_id
INSTAGRAM_API_SECRET=your_app_secret
```

**Cost:** Free for basic, Business features paid
**Time:** 1-2 weeks for approval

---

#### 5. **Have I Been Pwned** ($3.50/month)
**Steps:**
1. [https://haveibeenpwned.com/API/Key](https://haveibeenpwned.com/API/Key) pe jao
2. Payment karo ($3.50/month)
3. API key immediately milega

**.env mein add karo:**
```env
HIBP_API_KEY=your_hibp_key
```

---

#### 6. **LinkedIn API**
**Note:** Very strict approval process

**Steps:**
1. [https://www.linkedin.com/developers/](https://www.linkedin.com/developers/) pe jao
2. "Create App" 
3. Business justification chahiye
4. Approval process lengthy hai

**.env mein add karo:**
```env
LINKEDIN_API_KEY=your_client_id
LINKEDIN_API_SECRET=your_client_secret
```

**Time:** Weeks to months for approval

---

## ✅ Step 3: .env File Complete Karo

Apki final `backend/.env` file aisi dikhni chahiye:

```env
# Database
DATABASE_URL=sqlite:///./osint_data.db

# Twitter (FREE - RECOMMENDED)
TWITTER_API_KEY=AaBbCc123XyZ...
TWITTER_API_SECRET=XxYyZz789AbC...
TWITTER_ACCESS_TOKEN=1234567890-AbCdEf...

# Instagram (OPTIONAL - Paid/Business)
INSTAGRAM_API_KEY=
INSTAGRAM_API_SECRET=

# Facebook (OPTIONAL)
FACEBOOK_API_KEY=
FACEBOOK_API_SECRET=

# LinkedIn (OPTIONAL - Hard to get)
LINKEDIN_API_KEY=
LINKEDIN_API_SECRET=

# TikTok (OPTIONAL)
TIKTOK_API_KEY=

# OSINT Services
HIBP_API_KEY=
VIRUSTOTAL_API_KEY=
SHODAN_API_KEY=
HUNTER_IO_API_KEY=

# Geolocation (FREE - RECOMMENDED)
IP_GEOLOCATION_API_KEY=abc123xyz456...
IPAPI_KEY=
IPINFO_TOKEN=
MAXMIND_LICENSE_KEY=

# Security
SECRET_KEY=your-secret-key-change-this-in-production

# Upload Directory
UPLOAD_DIR=uploads

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🎯 Step 4: System Test Karo

### Backend Test:
```bash
cd backend
python -c "from app.services.api_key_manager import api_key_manager; print('✓ API Keys loaded:', api_key_manager.get_available_services())"
```

**Expected Output:**
```
✓ API Keys loaded: ['twitter', 'ip_geolocation']
```

### Full System Start:
```bash
# Backend
uvicorn app.main:app --reload

# New terminal mein frontend
cd ..
npm run dev
```

---

## 📊 Priority Order (Recommended)

### Must Have (FREE):
1. ✅ **IP Geolocation** - Reverse OSINT ke liye
2. ✅ **Twitter API** - Social media scanning

### Nice to Have (FREE):
3. ✅ **IP-API** - Backup geolocation (already works)

### Optional (PAID):
4. ⭐ **Have I Been Pwned** - Email breach checking ($3.50/month)
5. ⭐ **Instagram API** - If you have Facebook Business
6. ⭐ **LinkedIn API** - Very hard to get, skip for now

---

## 🔥 Quickest Setup (2 Minutes)

**Sirf ye 2 karo:**

1. **Twitter API:**
   - Go to: https://developer.twitter.com/
   - Sign up → Create App
   - Copy API Key & Secret

2. **IP Geolocation:**
   - Go to: https://ipgeolocation.io/
   - Sign up free
   - Copy API Key

3. **Add to .env:**
```env
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
IP_GEOLOCATION_API_KEY=your_key
```

**Done! ✅** System ab real data use karega!

---

## 🤔 Common Issues

### Issue 1: "API Key Invalid"
**Solution:**
- Check for extra spaces in .env
- Make sure no quotes around keys
- Verify key is active on provider dashboard

### Issue 2: "Module 'python-dotenv' not found"
**Solution:**
```bash
pip install python-dotenv
```

### Issue 3: Rate Limit Exceeded
**Solution:**
- Free tiers have limits
- System automatically uses mock data as fallback
- Wait or upgrade plan

---

## 💡 Pro Tips

1. **Start Small:** Sirf Twitter aur IP Geolocation se start karo
2. **Mock Data Works:** Bina API keys ke bhi system chalega (demo data)
3. **Check Dashboard:** API provider ki dashboard pe usage dekho
4. **Keep SECRET_KEY Secret:** Production mein strong key use karo
5. **Never Commit .env:** Ye file Git mein mat daalo

---

## ✅ Verification Checklist

- [ ] `.env` file created in `backend/` folder
- [ ] At least 1 API key added
- [ ] No syntax errors in .env
- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Check "API Keys" page in UI for status

---

## 🎉 Ready!

Ab aapka system real API keys ke saath ready hai!

**Test karo:**
1. Frontend pe jao
2. "Social Media OSINT" → Twitter username search
3. "Reverse OSINT" → Visitor tracking with geolocation

**Questions?** Check console for errors or API key status.
