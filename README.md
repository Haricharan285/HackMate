# ⚡ HackMate — Tinder for Hackathon Teammates

A full-stack frontend-only app built with **React + Firebase** (no Node/Express backend).

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `hackmate`)
3. Enable **Authentication → Sign-in method → Email/Password**
4. Create a **Firestore Database** (start in test mode for development)
5. Go to **Project Settings → Your apps → Add Web App**
6. Copy the `firebaseConfig` values

### 3. Add your Firebase config

Open `src/firebase/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Set up Firestore Security Rules

In the Firebase Console → Firestore → Rules, use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /swipes/{swipeId} {
      allow read, write: if request.auth != null;
    }
    match /matches/{matchId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run the app
```bash
npm run dev
```

---

## 📁 Project Structure

```
hackmate/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx               # Entry point
    ├── App.jsx                # Routes
    ├── index.css              # Global styles
    ├── firebase/
    │   ├── config.js          # Firebase init ← EDIT THIS
    │   ├── auth.js            # signUp / logIn / logOut
    │   └── firestore.js       # All Firestore operations
    ├── context/
    │   └── AuthContext.jsx    # Global auth state
    ├── components/
    │   ├── Navbar.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── LoginPage.jsx      # Sign in / Sign up
        ├── ProfileSetupPage.jsx
        ├── SwipePage.jsx      # Like / Pass + match detection
        └── MatchesPage.jsx    # View matches + LinkedIn links
```

---

## 🧱 Firestore Data Model

```
users/{userId}
  - id: string
  - name: string
  - bio: string
  - skills: string[]
  - linkedin: string

swipes/{autoId}
  - fromUser: userId
  - toUser: userId
  - action: "like" | "pass"
  - timestamp: Timestamp

matches/{autoId}
  - users: [userId1, userId2]
  - createdAt: Timestamp
```

---

## ✨ Features

- 🔐 Firebase Email/Password Auth with session persistence
- 👤 Profile creation with skills and LinkedIn
- 👆 Swipe cards (Like / Pass) with animation
- 💞 Mutual match detection — creates a match only when both users like each other
- 🚫 Already-swiped users are never shown again
- 🔗 LinkedIn links unlocked only after matching
- 📱 Responsive design

---

## 🔧 Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to Firebase Hosting, Vercel, or Netlify.
