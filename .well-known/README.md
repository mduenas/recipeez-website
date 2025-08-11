# Deep Linking Configuration Files

These files enable deep linking for the Recipeez app on both Android and iOS platforms.

## Files

### 1. `assetlinks.json` (Android App Links)
This file allows Android to verify that your app is authorized to handle `https://recipeez.app` URLs.

### 2. `apple-app-site-association` (iOS Universal Links)
This file allows iOS to verify that your app is authorized to handle `https://recipeez.app` URLs.

## Setup Instructions

### Step 1: Get Required Values

#### For Android (`assetlinks.json`):

1. **Get SHA256 Fingerprints** for both debug and release keys:

   **Debug key** (for testing):
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA256
   ```

   **Release key** (for production):
   ```bash
   keytool -list -v -keystore YOUR_RELEASE_KEYSTORE.jks -alias YOUR_ALIAS | grep SHA256
   ```

2. Copy the SHA256 value (format: `XX:XX:XX:XX:...`) and replace:
   - `REPLACE_WITH_YOUR_DEBUG_SHA256` with your debug SHA256
   - `REPLACE_WITH_YOUR_RELEASE_SHA256` with your release SHA256

#### For iOS (`apple-app-site-association`):

1. **Get your Team ID**:
   - Log in to [Apple Developer Portal](https://developer.apple.com)
   - Go to Membership
   - Copy your Team ID (10-character string like `ABCDE12345`)

2. Replace `TEAMID` with your actual Team ID in the file

3. **Verify your Bundle ID**:
   - The file includes both `com.markduenas.recipes` and `com.markduenas.recipesapp`
   - Remove the one you're not using

### Step 2: Deploy to Your Web Server

These files must be hosted on `https://recipeez.app` at these exact URLs:

1. **Android**: `https://recipeez.app/.well-known/assetlinks.json`
2. **iOS**: `https://recipeez.app/.well-known/apple-app-site-association`

**Important Requirements:**
- Files must be served over HTTPS
- Files must be served with correct MIME types:
  - `assetlinks.json`: `application/json`
  - `apple-app-site-association`: `application/json` (no file extension!)
- Files must be accessible without redirects
- No authentication should be required to access these files

### Step 3: Update Your App

Once the files are deployed, update the share URL generation back to HTTPS:

In `FirebaseRecipeSharingRepository.kt`:
```kotlin
private fun generateShareUrl(recipeId: String): String {
    // Change back to HTTPS once domain verification is complete
    return "https://recipeez.app/shared/$recipeId"
}
```

### Step 4: Test

#### Android Testing:
1. Install your app
2. Clear app defaults: Settings → Apps → Recipeez → Open by default → Clear defaults
3. Click a `https://recipeez.app/shared/...` link
4. Your app should appear in the app chooser or open directly

To verify your assetlinks.json is correct:
```bash
# Google provides a testing tool:
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://recipeez.app&relation=delegate_permission/common.handle_all_urls
```

#### iOS Testing:
1. Install your app
2. Click a `https://recipeez.app/shared/...` link
3. Your app should open directly (no chooser on iOS)

To verify your apple-app-site-association:
```bash
# Apple provides a validation tool:
https://search.developer.apple.com/appsearch-validation-tool/

# Or use curl to check if file is accessible:
curl https://recipeez.app/.well-known/apple-app-site-association
```

## Troubleshooting

### Android Issues:
- Ensure SHA256 fingerprints match exactly (case-sensitive)
- Check that package name in assetlinks.json matches your app
- App Links only work on Android 6.0+ (API 23+)
- Use `adb shell pm get-app-links com.markduenas.recipes` to check status

### iOS Issues:
- Ensure Team ID is correct (check Apple Developer Portal)
- Bundle ID must match exactly
- Universal Links only work on iOS 9.0+
- Check device logs in Xcode for "swcd" process errors
- After deploying, you may need to reinstall the app

## Alternative: Custom URL Scheme

If you can't set up domain verification immediately, the app is already configured to use `recipeez://` custom scheme which works without domain verification:
- Share URL: `recipeez://shared/{recipeId}`
- Works immediately on both platforms
- No server configuration required
- Less seamless user experience (shows app chooser)