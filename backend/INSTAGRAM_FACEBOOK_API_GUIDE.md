# Instagram & Facebook API Setup Guide

## ⚠️ Important Information

**Instagram and Facebook APIs are both managed by Meta (Facebook).**

- Instagram API requires a **Facebook Business Account**
- Both use the **Facebook Developer Portal**
- Process is more complex than Twitter
- May require **App Review** (takes time)

---

## 🚀 Step-by-Step Guide

### Step 1: Create Facebook Developer Account

1. **Go to:** https://developers.facebook.com/
2. **Click:** "Get Started" (top right)
3. **Login** with your Facebook account
4. **Complete registration:**
   - Choose "Developer" as account type
   - Accept terms and conditions
   - Verify email if needed

**Time:** 5 minutes

---

### Step 2: Create a New App

1. **Go to:** https://developers.facebook.com/apps
2. **Click:** "Create App" button
3. **Select Use Case:**
   - ✅ Choose: **"Other"** → **"Business"**
   - (Don't choose Consumer or Gaming)
4. **Click:** "Next"

5. **Fill App Details:**
   ```
   App Name: OSINT Security Platform
   App Contact Email: your-email@example.com
   ```
6. **Click:** "Create App"
7. **Complete Security Check** (CAPTCHA)

**Time:** 5 minutes

---

### Step 3: Get Facebook API Keys

#### Option A: Basic Facebook Graph API

1. **In your app dashboard:**
   - Go to **Settings → Basic**
   - You'll see:
     - **App ID** (this is your API Key)
     - **App Secret** (click "Show" to reveal)

2. **Copy these:**
   ```
   App ID: 1234567890123456
   App Secret: abcdef1234567890abcdef1234567890
   ```

3. **Add to .env file:**
   ```env
   FACEBOOK_API_KEY=1234567890123456
   FACEBOOK_API_SECRET=abcdef1234567890abcdef1234567890
   ```

**Status:** ✅ Ready for basic use (limited access)

---

### Step 4: Get Instagram API Access

#### Prerequisites:
- Facebook Business Page (required)
- Instagram Business/Creator Account
- Instagram account connected to Facebook Page

#### Steps:

1. **Create Facebook Business Page** (if you don't have):
   - Go to: https://www.facebook.com/pages/create
   - Create a basic business page
   - Name: "OSINT Research" (or anything)

2. **Convert Instagram to Business Account:**
   - Open Instagram app
   - Go to: Settings → Account → Switch to Professional Account
   - Choose "Business"
   - Connect to your Facebook Page

3. **Add Instagram Product to App:**
   - In Facebook Developer Dashboard
   - Click **"Add Products"** (left sidebar)
   - Find **"Instagram"** product
   - Click **"Set Up"**
   - Choose **"Instagram Basic Display"** or **"Instagram Graph API"**

4. **Instagram Basic Display Setup:**
   - Click "Create New App"
   - Fill in:
     ```
     Display Name: OSINT Platform
     Valid OAuth Redirect URIs: https://localhost:8000/callback
     Deauthorize Callback URL: https://localhost:8000/deauth
     Data Deletion Request URL: https://localhost:8000/delete
     ```
   - Click "Save Changes"

5. **Get Instagram App ID and Secret:**
   - Go to: Basic Display → Settings
   - Copy:
     - **Instagram App ID**
     - **Instagram App Secret**

6. **Add to .env:**
   ```env
   INSTAGRAM_API_KEY=your_instagram_app_id
   INSTAGRAM_API_SECRET=your_instagram_app_secret
   ```

**Time:** 15-20 minutes

---

### Step 5: Configure App Permissions

1. **In Facebook App Dashboard:**
   - Go to **App Review → Permissions and Features**
   
2. **Request Permissions** (if needed):
   - `public_profile` (usually approved instantly)
   - `pages_read_engagement` (for Facebook Pages)
   - `instagram_basic` (for Instagram Basic Display)
   - `instagram_manage_insights` (for analytics)

3. **For Public Data Access:**
   - Most basic permissions are auto-approved
   - Advanced permissions need App Review

---

### Step 6: App Review (If Needed)

**When is App Review needed?**
- If you want to access data beyond your own accounts
- If you need advanced permissions
- For production/public use

**How to Submit:**
1. Go to **App Review → Requests**
2. Click **"Add Items"**
3. Select permissions you need
4. Provide:
   - **App Description**: Use same as Twitter (security research)
   - **Screenshots**: Show how you'll use the data
   - **Privacy Policy URL**: Create a basic one
   - **Use Case Explanation**: Security research, public data only

**Timeline:** 3-7 days for review

---

## 🎯 Quick Setup (Development Mode)

**For testing without App Review:**

1. **Development Mode** (automatically enabled for new apps)
   - Your app can access YOUR OWN Instagram/Facebook data
   - Can test with your account
   - Limited to 5 test users

2. **Add Test Users:**
   - Go to **Roles → Test Users**
   - Add your Instagram account
   - Add team members if needed

3. **This is enough for:**
   - Testing the platform
   - Demonstrations
   - Development

**Later:** Submit for App Review when ready for production

---

## 📋 Complete .env Example

After getting all keys:

```env
# Facebook & Instagram (Same Developer Account)
FACEBOOK_API_KEY=1234567890123456
FACEBOOK_API_SECRET=abcdef1234567890abcdef1234567890
INSTAGRAM_API_KEY=9876543210987654
INSTAGRAM_API_SECRET=zyxwvu0987654321zyxwvu0987654321
```

---

## ✅ Verification

### Test Facebook API:
```bash
curl -X GET "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"
```

### Test Instagram API:
```bash
curl -X GET "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN"
```

---

## 🔥 Common Issues

### Issue 1: "App Not Setup for Instagram Basic Display"
**Solution:**
- Make sure you added Instagram product to your app
- Configure redirect URIs correctly
- Connect Instagram Business account

### Issue 2: "Permission Denied"
**Solution:**
- Check App Review status
- Ensure app is in correct mode (Development vs Live)
- Verify user is added as Test User

### Issue 3: "Invalid OAuth Redirect URI"
**Solution:**
- Add your callback URLs in App settings
- Use exact URLs (including https/http)

### Issue 4: "Instagram Account Not Connected"
**Solution:**
- Connect Instagram to Facebook Business Page first
- Switch Instagram to Business/Creator account
- Re-link in Facebook settings

---

## 💡 Important Notes

### Free Tier Limitations:
- ✅ Basic profile data
- ✅ Your own account data
- ✅ Development/testing
- ❌ Limited public data access without review
- ❌ Rate limits apply

### Production Requirements:
- Business verification (for some features)
- Privacy Policy URL
- Terms of Service URL
- App Review approval
- Valid business use case

---

## 🎯 Recommended Approach

### For Now (Testing):
1. ✅ Get Facebook App ID + Secret (instant)
2. ✅ Stay in Development Mode
3. ✅ Test with your own accounts
4. ✅ Use for demonstrations

### For Production:
1. Create privacy policy
2. Submit for App Review
3. Get permissions approved
4. Switch to Live Mode

---

## 📱 Alternative: Instagram Basic Display vs Graph API

### Instagram Basic Display (Easier):
- ✅ Easier to set up
- ✅ Basic profile info
- ✅ Media (photos/videos)
- ❌ Limited insights
- **Good for:** Personal use, testing

### Instagram Graph API (Advanced):
- Requires Business Account
- More data access
- Better for analytics
- Needs App Review
- **Good for:** Production, business use

**Recommendation:** Start with Basic Display

---

## 🚀 Quick Start Checklist

- [ ] Create Facebook Developer account
- [ ] Create new app (Business type)
- [ ] Get App ID and Secret
- [ ] Add to .env file
- [ ] (Optional) Add Instagram product
- [ ] (Optional) Connect Instagram Business account
- [ ] Get Instagram App ID and Secret
- [ ] Add to .env file
- [ ] Test with your account
- [ ] Submit for review (when ready for production)

---

## ⏱️ Time Estimate

- **Basic Setup:** 10-15 minutes
- **With Instagram:** 20-30 minutes
- **App Review:** 3-7 days (if needed)

---

## 🆘 Need Help?

- Facebook Developer Docs: https://developers.facebook.com/docs/
- Instagram API Docs: https://developers.facebook.com/docs/instagram-api
- Support: https://developers.facebook.com/support/

---

## ✨ Pro Tips

1. **Start Simple:** Just get Facebook API first, add Instagram later
2. **Development Mode:** Perfect for testing, no review needed
3. **Test Users:** Add yourself as test user
4. **Rate Limits:** Be aware of API call limits
5. **Keep Updated:** Meta frequently updates their APIs

---

Ready to start? Begin with Step 1! 🎉

**Note:** Without App Review, you can still test with your own accounts - perfect for demonstrations!
