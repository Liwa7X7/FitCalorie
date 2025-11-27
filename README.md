# FitCalorie

A calorie-tracking and fitness application designed to help users monitor their daily intake, track progress, and stay consistent with their health goals.  
Built with a modern React Native stack, FitCalorie runs seamlessly on **iOS**, **Android**, and **Web**.

---

## Overview

FitCalorie provides a clean and scalable foundation for developing a complete fitness app.  
The project includes cross-platform support, structured navigation, TypeScript, and essential tools for building features such as:

- Daily calorie tracking  
- Meal logging  
- Fitness routines  
- Progress visualization  
- User goals & preferences  

You can extend the app with your own UI components, backend integrations, authentication, and advanced fitness features.

---

## Getting Started

Ensure you have **Node.js** and **Bun** installed.

### 1. Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd FitCalorie
2. Install dependencies
bash
Copier le code
bun i
3. Run the project (Web)
bash
Copier le code
bun run start-web
4. Run the project (Mobile)
bash
Copier le code
bun run start
Then open the project on:

iOS Simulator

Android Emulator

Expo Go on a real device

Or run directly:

bash
Copier le code
bun run start -- --ios
bun run start -- --android
Tech Stack
FitCalorie is built with:

React Native – Core mobile framework

Expo – Native tooling and runtime

Expo Router – File-based navigation

TypeScript – Strong typing and improved reliability

React Query – Server-state management

Lucide Icons – Modern and clean icon library

Testing the App
On a physical device
Install Expo Go (App Store / Google Play)

Run:

bash
Copier le code
bun run start
Scan the QR code displayed in your terminal or browser.

In a browser
bash
Copier le code
bun run start-web
Using emulators (Xcode / Android Studio required)
bash
Copier le code
bun run start -- --ios
bun run start -- --android
Deployment
FitCalorie is fully prepared for App Store and Google Play deployment using EAS.

iOS — App Store
bash
Copier le code
bun i -g @expo/eas-cli
eas build:configure
eas build --platform ios
eas submit --platform ios
Android — Google Play
bash
Copier le code
eas build --platform android
eas submit --platform android
Web Deployment
bash
Copier le code
eas build --platform web
eas hosting:configure
eas hosting:deploy
Alternative hosting options:

Vercel

Netlify

GitHub Pages

Features Included
Cross-platform compatibility (iOS / Android / Web)

File-based navigation with Expo Router

Tabs for main sections

Modal screens

TypeScript support

Local storage for app data

Clean vector icons

Directory Structure
txt
Copier le code
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── _layout.tsx
│   ├── modal.tsx
│   └── +not-found.tsx
├── assets/
│   └── images/
├── constants/
├── app.json
├── package.json
└── tsconfig.json
Custom Development Builds
Certain native features require a custom development build, including:

Biometrics (Face ID, Touch ID)

Native Google / Apple Sign-In

In-app purchases

Fitness SDK integrations

Background processing

Create a custom development build
bash
Copier le code
bun i -g @expo/eas-cli
eas build:configure
eas build --profile development --platform ios
eas build --profile development --platform android
bun start --dev-client
Troubleshooting
App not connecting to device?
Ensure the phone and computer are on the same WiFi network

Try tunnel mode:

bash
Copier le code
bun run start -- --tunnel
Build issues?
bash
Copier le code
bunx expo start --clear
rm -rf node_modules
bun install