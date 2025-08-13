# Keys Pay Mobile App

Production-ready mobile app for iOS and Android using Capacitor.

## Architecture

This mobile app is integrated into the main Keys Pay workspace and shares:
- Design tokens and theme system
- Authentication logic and API clients
- Backend services (Supabase, Circle, etc.)
- CI/CD pipelines

## Tech Stack

- **Framework**: React + TypeScript + Capacitor
- **Navigation**: React Router (shared with web)
- **State Management**: React Query + Context
- **UI Components**: Shadcn/ui (mobile-optimized)
- **Build System**: Vite + Capacitor CLI
- **Deployment**: Capacitor Cloud + App Store Connect + Google Play Console

## Getting Started

### Prerequisites
- Node.js 18+
- iOS development: macOS + Xcode 14+
- Android development: Android Studio + Android SDK

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Add mobile platforms:
```bash
npx cap add ios
npx cap add android
```

3. Build and sync:
```bash
npm run build
npx cap sync
```

4. Run on device/simulator:
```bash
# iOS
npx cap run ios

# Android
npx cap run android
```

### Development Workflow

1. Make changes to the React app
2. Build: `npm run build`
3. Sync: `npx cap sync`
4. Test on device/simulator

## Features

### Core Features
- ✅ User Authentication (email/phone OTP, biometrics)
- ✅ KYC/KYB verification (Sumsub integration)
- ✅ Multi-currency wallets
- ✅ P2P payments and transfers
- ✅ Fiat ↔ Crypto conversion
- ✅ Virtual and physical card management
- ✅ Transaction history and statements
- ✅ Family finance controls
- ✅ QR code payments
- ✅ Push notifications
- ✅ Biometric authentication
- ✅ Security center and monitoring

### Mobile-Specific Features
- 📱 Native haptic feedback
- 📱 Device information and security
- 📱 Biometric authentication (Touch ID/Face ID/Fingerprint)
- 📱 Push notifications
- 📱 QR code scanning
- 📱 Deep linking
- 📱 App state management
- 📱 Offline support

### Localization
- 🌍 English (default)
- 🌍 Arabic (RTL support)

### Regional Features
- 🇸🇦 Saudi Arabia (primary market)
- 🌍 Feature-gated for other EMEA regions

## Security

### Security Features
- 🔒 Jailbreak/root detection
- 🔒 Certificate pinning
- 🔒 Secure storage for sensitive data
- 🔒 Biometric authentication
- 🔒 Device binding
- 🔒 Session management
- 🔒 SAMA compliance

### Compliance
- SAMA (Saudi Arabian Monetary Authority) guidelines
- PCI DSS compliance
- GDPR compliance
- AML/KYC regulations

## Deployment

### App Store Submission

#### iOS (App Store Connect)
```bash
# Build for production
npm run build:ios

# Archive and upload
npx cap build ios --prod
```

#### Android (Google Play Console)
```bash
# Build for production
npm run build:android

# Generate signed APK/AAB
npx cap build android --prod
```

### Automated Deployment (CI/CD)

The app uses GitHub Actions for automated builds and deployments:

1. **Development**: Auto-deploy to TestFlight/Internal Testing on `develop` branch
2. **Staging**: Deploy to TestFlight Beta/Internal Testing on `staging` branch  
3. **Production**: Deploy to App Store/Play Store on release tags

## Configuration

### Environment Variables
```bash
# Shared with web app
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
STRIPE_PUBLIC_KEY=

# Mobile-specific
CAPACITOR_SERVER_URL=
ENABLE_LIVE_RELOAD=false
```

### Build Configurations

#### Development
- Live reload enabled
- Debug symbols included
- Development server URL

#### Staging  
- Production build
- TestFlight/Internal testing
- Staging API endpoints

#### Production
- Optimized build
- Production API endpoints
- App Store/Play Store ready

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Device Testing
- iOS Simulator
- Android Emulator
- Physical devices (recommended)

## Monitoring & Analytics

### Performance Monitoring
- Crash reporting
- Performance metrics
- User analytics
- Error tracking

### Security Monitoring
- Fraud detection
- Suspicious activity alerts
- Compliance reporting

## Support

### Documentation
- [Capacitor Docs](https://capacitorjs.com/docs)
- [React Native Bridge](https://capacitorjs.com/docs/basics/workflow)
- [Mobile Development Guide](../docs/mobile-development.md)

### Troubleshooting
- Check device logs: `npx cap run ios --livereload --external`
- Android debugging: `adb logcat`
- iOS debugging: Xcode Console

## Release Process

1. **Version Bump**: Update version in `package.json` and `capacitor.config.json`
2. **Build**: `npm run build:mobile`
3. **Test**: Run full test suite
4. **Tag**: Create release tag `v1.0.0`
5. **Deploy**: Automated deployment via GitHub Actions
6. **Submit**: Apps automatically submitted to stores
7. **Monitor**: Track deployment and user adoption

## Architecture Decisions

### Why Capacitor over React Native?
- Shared codebase with web app (95% code reuse)
- Faster development cycle
- Native plugin ecosystem
- Web-first approach with native enhancements

### State Management
- React Query for server state
- Context API for client state
- Shared with web application

### Navigation
- React Router (shared with web)
- Mobile-optimized navigation components
- Deep linking support

## Performance Optimizations

- Code splitting and lazy loading
- Image optimization and caching
- Offline-first data synchronization
- Native performance monitoring
- Memory usage optimization

## Future Roadmap

### Q1 2024
- [ ] Advanced biometric features
- [ ] Offline transaction support
- [ ] Enhanced QR scanning
- [ ] Widget support (iOS/Android)

### Q2 2024
- [ ] Apple Pay / Google Pay integration
- [ ] NFC payments
- [ ] Advanced analytics dashboard
- [ ] Multi-language support expansion

### Q3 2024
- [ ] AI-powered financial insights
- [ ] Advanced fraud detection
- [ ] Cross-border payment optimizations
- [ ] Enterprise features