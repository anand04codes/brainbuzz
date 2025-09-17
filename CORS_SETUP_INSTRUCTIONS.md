# Firebase Storage CORS Configuration Setup

## Problem
Firebase Storage is blocking requests from localhost:3000 due to CORS policy.

## Solution
Apply the CORS configuration to your Firebase Storage bucket.

## Method 1: Using Google Cloud Console (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to Storage > Buckets
3. Find your bucket: `brainbuzz-7bed8.firebasestorage.app`
4. Go to the Permissions tab
5. Click "Add" under CORS configuration
6. Copy and paste the contents of `storage-cors.json`:
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://brainbuzz-7bed8.web.app", "https://brainbuzz-7bed8.firebaseapp.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "x-goog-meta-userid", "Content-Length", "Accept-Encoding", "X-CSRF-Token"]
  }
]
```
7. Save the configuration

## Method 2: Using gsutil (If Google Cloud SDK is installed)
```bash
gsutil cors set storage-cors.json gs://brainbuzz-7bed8.firebasestorage.app
```

## Method 3: Using Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: brainbuzz-7bed8
3. Go to Storage
4. Click on the gear icon (Settings)
5. Go to CORS tab
6. Add the CORS configuration from `storage-cors.json`

## Verification
After applying CORS configuration:
1. Restart your React development server
2. Try uploading a profile picture
3. Check browser console for CORS errors
4. The upload should work without CORS errors
