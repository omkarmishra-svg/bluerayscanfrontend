# 🚀 Quick Start Guide - Digital Shadow Mapper

## ⚡ Get Running in 2 Minutes

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/digital-shadow-mapper.git
cd digital-shadow-mapper

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173`

---

## 🔑 Demo Login

Use these credentials to explore the platform:

```
Email: demo@osint.com
Password: Demo@123!
MFA Code: 123456
```

---

## 📋 First Steps After Login

### 1. Explore the Dashboard
- View real-time activity feed
- Check system statistics
- Monitor active scans

### 2. Try Deepfake Analysis
- Navigate to "Deepfake Analysis"
- Upload a sample image/video
- View AI-powered analysis results

### 3. Check Digital Footprint
- Go to "Digital Footprint"
- See timeline of activities
- Review exposure metrics

### 4. Monitor Risks
- Open "Risk Monitor"
- Check threat levels
- Review active alerts

### 5. Configure Scans
- Visit "Scan Config"
- Set up automated monitoring
- Create custom rules

---

## 🎨 Key Features to Try

### Authentication Flow
1. **Welcome Screen**: Matrix-style animations
2. **Login**: Multi-factor authentication
3. **Sign Up**: Password strength meter
4. **Forgot Password**: Recovery flow

### Main Platform
1. **Dashboard**: Real-time overview
2. **Deepfake Analyzer**: AI-powered detection
3. **Digital Footprint**: Timeline tracking
4. **Risk Monitor**: Threat assessment
5. **Reports**: Analytics & exports
6. **Settings**: Customization
7. **About**: Platform information

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests
npm run test:e2e     # End-to-end tests

# Code Quality
npm run lint         # Run linter
npm run format       # Format code
```

---

## 📱 Mobile Testing

### Quick Mobile View
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Reload page

### Real Device Testing
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Visit `http://YOUR_IP:5173` on mobile
3. Accept certificate warnings (dev only)

---

## 🎯 Navigation Shortcuts

| Page | Shortcut | Description |
|------|----------|-------------|
| Dashboard | D | Main overview |
| Deepfake | F | AI analysis |
| Footprint | T | Timeline view |
| Risk Monitor | R | Threat alerts |
| Scan Config | S | Settings |
| Reports | P | Analytics |
| Settings | , | Preferences |
| About | I | Information |

---

## 🎨 Customization

### Change Theme Colors
Edit `/styles/globals.css`:

```css
:root {
  --primary: 14 165 233;    /* Cyber Blue */
  --secondary: 139 92 246;  /* Purple */
  --accent: 16 185 129;     /* Green */
}
```

### Modify Animations
Edit `/components/auth/AnimatedBackground.tsx`:

```typescript
const particleCount = 80;  // Reduce for performance
const maxDistance = 150;   // Connection distance
```

---

## 🔒 Security Notes

### Demo Mode
- Uses mock data
- No real API calls
- Safe for testing
- No data persistence

### Production Checklist
- [ ] Set up real database
- [ ] Configure API keys
- [ ] Enable HTTPS
- [ ] Set up authentication backend
- [ ] Configure rate limiting
- [ ] Enable monitoring
- [ ] Set up backups

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear build cache
rm -rf dist .vite

# Rebuild
npm run build
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Fix auto-fixable issues
npm run lint --fix
```

---

## 📚 Learning Resources

### Documentation
- [Full README](./README.md)
- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Project Overview](./PROJECT_OVERVIEW.md)
- [Reviews & Future Scope](./REVIEWS_AND_FUTURE_SCOPE.md)

### Video Tutorials
- Getting Started (5 min)
- Authentication Deep Dive (15 min)
- OSINT Techniques (20 min)
- Deepfake Detection (25 min)

### Community
- GitHub Discussions
- Discord Server
- Twitter @ShadowMapperAI

---

## 🎓 Sample Workflows

### Workflow 1: Quick Scan
```
1. Login to dashboard
2. Go to "Scan Config"
3. Click "New Scan"
4. Select platforms
5. Set keywords
6. Click "Start Scan"
7. View results in Dashboard
```

### Workflow 2: Deepfake Analysis
```
1. Navigate to "Deepfake Analysis"
2. Upload media file
3. Select analysis type
4. Click "Analyze"
5. Review confidence score
6. Export detailed report
```

### Workflow 3: Risk Assessment
```
1. Open "Risk Monitor"
2. Review current threats
3. Click on alert for details
4. Take recommended actions
5. Mark as resolved
```

---

## 💡 Pro Tips

### Performance
- Use Chrome/Edge for best performance
- Close unused tabs
- Enable hardware acceleration
- Use production build for demos

### Development
- Use React DevTools extension
- Enable source maps for debugging
- Use Vite's HMR for instant updates
- Keep dependencies updated

### Security
- Never commit API keys
- Use environment variables
- Enable MFA on all accounts
- Regular security audits

---

## 📞 Need Help?

### Quick Help
- Check [README.md](./README.md)
- Browse [GitHub Issues](https://github.com/yourusername/digital-shadow-mapper/issues)
- Join [Discord](https://discord.gg/digitalshadowmapper)

### Report Issues
1. Check existing issues first
2. Provide error messages
3. Include browser/OS info
4. Share reproduction steps

### Contact
- Email: support@osint.com
- Twitter: @ShadowMapperAI
- GitHub: @digitalshadowmapper

---

## 🎉 What's Next?

### Immediate
- [ ] Explore all features
- [ ] Try different test scenarios
- [ ] Customize theme/settings
- [ ] Read full documentation

### Short-term
- [ ] Set up backend (Supabase)
- [ ] Integrate real APIs
- [ ] Deploy to production
- [ ] Share with team

### Long-term
- [ ] Custom ML models
- [ ] Mobile apps
- [ ] Enterprise features
- [ ] Community contributions

---

## ⭐ Show Your Support

If you find this project useful:
- ⭐ Star the repository
- 🐦 Share on social media
- 📝 Write a review
- 🤝 Contribute code
- 💬 Join discussions

---

**Happy Mapping! 🛡️**

*Making the digital world safer, one footprint at a time.*

---

Last Updated: December 19, 2024
