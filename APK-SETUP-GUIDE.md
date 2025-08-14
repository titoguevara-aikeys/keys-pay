# 📱 AIKEYS Wallet APK Setup Guide

## 🎯 Goal
Enable automatic APK downloads directly from email links using GitHub Actions and releases.

## 📋 Step-by-Step Setup

### 1. Export to GitHub
1. Go to GitHub → Connect to GitHub in your Lovable editor
2. Create a new repository or connect to existing one
3. Export your project to GitHub

### 2. Add Android Signing Secrets
In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add these 4 secrets:

#### Required Secrets:
- `ANDROID_KEYSTORE_BASE64` - Your keystore file encoded in base64
- `ANDROID_KEYSTORE_PASSWORD` - Password for your keystore
- `ANDROID_KEY_ALIAS` - Alias name for your signing key
- `ANDROID_KEY_PASSWORD` - Password for your signing key

#### How to Create a Keystore:
```bash
keytool -genkey -v -keystore aikeys-release.keystore -alias aikeys -keyalg RSA -keysize 2048 -validity 10000
```

#### Convert Keystore to Base64:
```bash
base64 -i aikeys-release.keystore -o keystore.txt
```

### 3. Update Repository URL
In `src/hooks/useGitHubReleases.ts`, replace:
```typescript
const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/releases');
```

With your actual GitHub repository:
```typescript
const response = await fetch('https://api.github.com/repos/yourusername/yourreponame/releases');
```

### 4. Trigger Build
1. Push any change to the `main` branch
2. GitHub Actions will automatically:
   - Build the Android APK
   - Sign it with your keystore
   - Create a GitHub release
   - Upload the APK as a release asset

### 5. Test Email Downloads
1. Go to `/mobile-app` on your website
2. Enter your email in the beta signup form
3. Check your email - it should now have a direct APK download link!

## 🔍 Troubleshooting

### APK Still Not Available?
1. Check GitHub Actions tab for build errors
2. Verify all 4 secrets are correctly set
3. Ensure you pushed to the `main` branch
4. Check that the repository URL in `useGitHubReleases.ts` is correct

### Build Failing?
1. Check GitHub Actions logs
2. Verify keystore secrets are valid
3. Ensure the keystore password and alias match

### Email Shows Web Link Instead of APK?
1. Verify GitHub releases exist at: `https://github.com/yourusername/yourrepo/releases`
2. Check that APK files are attached to the latest release
3. Confirm `useGitHubReleases.ts` has the correct repository URL

## 📱 What Users Will Get

### Before Setup:
- Email with web app link
- Message: "APK download will be available once GitHub releases are set up"

### After Setup:
- Email with direct APK download button
- Automatic updates when new releases are published
- File info (size, compatibility)

## 🚀 Advanced Features

Once setup is complete, you'll have:
- ✅ Automatic APK building on every push
- ✅ Signed releases ready for distribution
- ✅ Email integration with download links
- ✅ Version management with Git tags
- ✅ Optional Google Play Store uploads (with additional setup)

## 📞 Need Help?

If you run into issues:
1. Check the GitHub Actions logs
2. Verify your secrets are correctly formatted
3. Test the repository URL manually
4. Ensure your keystore is valid

The system is designed to work automatically once the initial setup is complete!