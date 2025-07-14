# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `banktech-pro`
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console → Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

## Step 3: Enable Realtime Database

1. In Firebase Console → Realtime Database
2. Click "Create Database"
3. Choose "Start in test mode"
4. Select region: `us-central1`
5. Click "Done"

## Step 4: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (</>) 
4. Register app name: `banktech-pro`
5. Copy the config object

## Step 5: Update Config File

Replace the config in `src/firebase/config.js`:

```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 6: Test Authentication

1. Run `npm run dev`
2. Go to Sign In page
3. Try to create account with email/password
4. Check Firebase Console → Authentication → Users

## Step 7: Test Database

1. Add some transactions in the app
2. Check Firebase Console → Realtime Database
3. You should see data structure like:
```
{
  "transactions": {
    "user-id": {
      "transaction-id": {
        "nama": "Test Transaction",
        "tipeTransaksi": "Income",
        "nominal": 100000,
        "timestamp": 1234567890
      }
    }
  }
}
```

## 🎯 Features Now Available:

✅ **Task 1 - Login System:**
- Firebase Authentication
- Email/Password login
- Form validation
- Loading states
- Error handling

✅ **Task 2 - Dashboard with Context:**
- AuthContext with Firebase user
- Global state management
- Persistent login state
- Real-time user data

✅ **Task 3 - Transaction List:**
- Firebase Realtime Database
- Real-time data sync
- User preferences in Firebase
- Filtering and search
- Loading states

## 🔧 Next Steps:

1. Update Firebase config
2. Test authentication
3. Add sample transactions
4. Verify real-time sync works