
# AIKEYS Wallet Android App

A native Android WebView wrapper for the AIKEYS Wallet platform with auto-versioning, signing, and CI/CD.

## Features

- **WebView Wrapper**: Loads https://aikeys-hub.com with full JavaScript support  
- **Auto-versioning**: Daily increment based on Unix epoch + CI build number
- **Deep Links**: Handles `aikeys://` and `https://aikeys-hub.com/*` URLs
- **Offline Support**: Shows retry screen when network is unavailable
- **File Downloads**: Uses Android DownloadManager for file handling
- **Splash Screen**: Modern Android 12+ splash screen implementation
- **Signed Builds**: Production-ready APK and AAB with keystore signing

## Build Requirements

### For Signing (Required for Release)
Set these GitHub Secrets:
- `ANDROID_KEYSTORE_BASE64` - Base64 encoded keystore file
- `ANDROID_KEYSTORE_PASSWORD` - Keystore password  
- `ANDROID_KEY_ALIAS` - Key alias name
- `ANDROID_KEY_PASSWORD` - Key password

### For Play Store Upload (Optional)
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` - Service account JSON from Play Console
- `PLAY_TRACK` - Track: internal | alpha | beta | production (default: internal)
- `PLAY_RELEASE_STATUS` - Status: draft | inProgress | completed (default: draft)

## Auto-versioning Strategy

- **versionCode**: `daysSinceUnixEpoch * 100 + (buildNumber % 100)`
- **versionName**: `latestGitTag-commitCount`

This ensures:
- Unique version codes (no Play Store conflicts)  
- Up to 99 builds per day
- Human-readable version names
- Monotonically increasing for app updates

## Build Outputs

CI produces these artifacts:
- `AIKEYS-debug.apk` - Debug build (always built)
- `AIKEYS-release-signed.apk` - Signed release APK (if keystore provided)
- `AIKEYS-release.aab` - Signed App Bundle for Play Store (if keystore provided)

## Local Development

1. Install Android Studio and Android SDK
2. Clone the repository  
3. Open the `android/` folder in Android Studio
4. Build and run on emulator or device

## CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Builds debug APK on every push to main/master
2. Builds signed release APK/AAB if keystore secrets are configured
3. Uploads to Play Store internal track if service account is configured
4. Uses daily auto-versioning to prevent conflicts

## Deep Link Handling

The app handles these URL schemes:
- `aikeys://path` → loads `https://aikeys-hub.com/path`  
- `https://aikeys-hub.com/path` → loads directly in WebView
- External URLs → opens in system browser

## App Permissions

- `INTERNET` - Required for WebView  
- `ACCESS_NETWORK_STATE` - Check connectivity for offline screen
- `WRITE_EXTERNAL_STORAGE` - File downloads (scoped storage on API 29+)

## Production Checklist

- [ ] Add app icons to `res/mipmap-*/` folders
- [ ] Configure keystore and set GitHub secrets
- [ ] Test deep links and file downloads  
- [ ] Set up Play Store service account (optional)
- [ ] Update app colors and branding in `colors.xml`
- [ ] Test offline functionality
- [ ] Verify auto-versioning works correctly
