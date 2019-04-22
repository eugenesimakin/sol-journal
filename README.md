<p align="center">
  <img alt="preview of page" src="https://raw.githubusercontent.com/gillkyle/images/master/hero-mixed.png" />
</p>
<h1 align="center">
  Sol Journal
</h1>

A simple, minimal, journaling platform that works offline and across all devices. Installable as a PWA on mobile devices for easy access on a phone, inspired by [JournalBook](https://github.com/trys/JournalBook)

## 🚀 Getting Started

Sol Journal uses firebase to support offline functionality and authentication, a new Firebase app will need to be setup with Firestore as a database, be sure to add documents for `users` and `entries`, as well as enabling email for user authentication.

Install dependencies:

```bash
npm install
```

or

```bash
yarn
```

Then configure a file in `.env` with the following keys from firebase:
```env
REACT_APP_FIREBASE_API_KEY=<BUNCHofRandomNumbersAndChars>
REACT_APP_DEV_AUTH_DOMAIN=<your-id.firebaseapp.com>
REACT_APP_DEV_DATABASE_URL=<https://your-id.firebaseapp.com>
REACT_APP_DEV_PROJECT_ID=<your-id>
```

Navigate into the project directory, and then launch the site with this command:

```bash
yarn develop
```

The site will be opened up in your default browser on http://localhost:3000

Edit code in the `/src`, save your changes, and they'll reload instantly in the browser.

## 🧐 Features

In the spirit of minimalism, key features are what are in place for a quick, lightweight journaling experience that can work across devices, including:

- 🔥 Authentication: Cloud firestore persists registered users to a users document and saved journal entries to an entries document
- 🎨 Dark Theme: the `src/styles/theme.js` file contains a set of colors and default styles that are applied to components with Emotion. A default light and dark theme are already in the file
- 🔍 Search: Full-text search of a user's entries stored in Firestore for quick access to past entries
- 🖥 Mobile Friendly: Designed to look great on mobile as well as desktop, with easy navigation on both
- 💡 PWA: Being a progressive web app makes it installable from Chrome/Safari on desktop, or be added to the homescreen on iOS/Android
- 🔌 Offline Support: Read/write when you're offline and let the updates happen when your connection is restored  

## 💫 Deploy

To create an optimized build of the site run this command:

```bash
yarn build
```

A `/build` folder will be assembled that can be deployed with this command:

```bash
firebase deploy
```
