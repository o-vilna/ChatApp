import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Start from "./components/Start";
import Chat from "./components/Chat";

// Ignore unnecessary warnings in the console
LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components",
  'Warning: A props object containing a "key" prop is being spread into JSX',
]);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbZGlKIi3o8tNYUiHAcSdshqp-lw3ILBI",
  authDomain: "chatapp-ca486.firebaseapp.com",
  projectId: "chatapp-ca486",
  storageBucket: "chatapp-ca486.firebasestorage.app",
  messagingSenderId: "271174903513",
  appId: "1:271174903513:web:81ab085d2ee6eae72080c8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get Firestore database instance
const auth = getAuth(app); // Initialize Firebase Authentication

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ title: "Welcome to Chat App" }}
        />
        <Stack.Screen
          name="Chat"
          component={(props) => <Chat db={db} {...props} />}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
