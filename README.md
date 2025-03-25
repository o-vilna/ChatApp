# ChatApp
The app provide users with a chat interface and options to share images and their location.

## Objective
The goal of this project is to develop a mobile chat application using React Native.

## Technologies Used
- **React Native**: For building the mobile application.
- **Expo**: To simplify development and testing.
- **Google Firestore Database**: For storing chat messages.
- **Firebase Authentication**: For anonymous user authentication.
- **Firebase Cloud Storage**: For storing shared images.
- **Gifted Chat Library**: For implementing the chat interface.

## Features
### User Stories
- Users can enter a chat room by providing their name and selecting a background color.
- Users can send text messages to communicate.
- Users can send images from their phone’s gallery.
- Users can capture and send pictures using their device’s camera.
- Users can share their location with other participants.
- Users can access their chat history offline.
- The app supports screen readers for visually impaired users.

### Key Functionalities
- **User Authentication**: Anonymous login via Firebase Authentication.
- **Chat Interface**: Built using Gifted Chat for seamless messaging.
- **Media Sharing**: Users can send images from their gallery or take pictures.
- **Location Sharing**: Users can share their real-time location.
- **Offline Message Storage**: Chat messages are stored locally for offline access.
- **Firestore Database Integration**: Messages are stored in Firestore for real-time synchronization.

## Technical Requirements
- The app must be developed using **React Native** and **Expo**.
- The UI should adhere to the provided design specifications.
- Messages should be stored both locally and in Firestore.
- The app should support image storage in **Firebase Cloud Storage**.
- The chat should integrate a **map view** to display shared locations.
- The **Gifted Chat** library should be used for the messaging interface.
- Codebase should be well-commented and documented.

## Design Specifications
- **App Title**: Font size 45, weight 600, color #FFFFFF.
- **Input Fields**:
  - "Your name": Font size 16, weight 300, color #757083, 50% opacity.
  - "Choose background color": Font size 16, weight 300, color #757083, 100% opacity.
- **Color Options for Background**:
  - #090C08
  - #474056
  - #8A95A5
  - #B9C6AE
- **Start Chatting Button**: Font size 16, weight 600, color #FFFFFF, button color #757083.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd chat-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Expo development server:
   ```sh
   expo start
   ```
4. Run the app on a simulator or physical device.

## Deployment
To deploy the app, follow Expo’s documentation on building standalone apps for iOS and Android:
- [Expo Build Docs](https://docs.expo.dev/build/introduction/)

## Future Enhancements
- Implement push notifications for real-time message alerts.
- Add user profile pictures and customization options.
- Improve UI with animations and additional themes.
## Development Environment Setup

### Required Tools
1. Node.js (version 16.0 or newer)
2. Expo CLI: `npm install -g expo-cli`
3. Android Studio (for Android development)
   - Install Android Studio
   - Configure Android Virtual Device (AVD)
4. Xcode (for iOS development, Mac only)
   - Install from Mac App Store
   - Install iOS Simulator

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Anonymous authentication
3. Set up Firestore Database:
   - Create a new database
   - Start in test mode
4. Configure Storage:
   - Go to Storage > Get Started
   - Add these rules to Storage:
   ```javascript
  rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
   ```
5. Get Firebase Configuration:
   - Go to Project Settings
   - Copy the firebaseConfig object
   - Paste it in your App.js:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-domain.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.firebasestorage.app",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### Dependencies
```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.15",
    "@react-navigation/native-stack": "^7.2.1",
    "expo": "~52.0.38",
    "firebase": "^10.3.1",
    "react-native-gifted-chat": "2.4.0",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-native-community/netinfo": "11.4.1",
    "expo-location": "~18.0.8",
    "expo-image-picker": "~16.0.6",
    "react-native-maps": "1.18.0"
  }
}
```

### Troubleshooting
Common issues and solutions:
1. Image upload fails:
   - Check Firebase Storage rules
   - Verify storage bucket configuration
2. Location sharing not working:
   - Enable location services on device
   - Check location permissions in app settings
3. Offline mode issues:
   - Clear app cache
   - Check AsyncStorage implementation

## Testing
1. Clone this repository to a new directory
2. Follow all setup steps above
3. Test these features:
   - User authentication
   - Sending/receiving messages
   - Image upload (gallery and camera)
   - Location sharing
   - Offline functionality

## Project Structure
chat-app/
├── App.js # Main application file
├── components/ # React components
│ ├── Start.js # Start screen
│ ├── Chat.js # Chat screen
│ └── CustomActions.js# Custom actions component
├── assets/ # Images and icons
└── package.json # Project dependencies

## License
This project is licensed under the MIT License.

