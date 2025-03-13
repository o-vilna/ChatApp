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

## License
This project is licensed under the MIT License.

