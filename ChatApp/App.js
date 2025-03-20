import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Alert, View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";

// Import Firebase
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Start from "./components/Start";
import Chat from "./components/Chat";

// Add Error Boundaries to ignore Firestore network errors
LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components",
  'Warning: A props object containing a "key" prop is being spread into JSX',
  "Error: The internet connection appears to be offline", // Ignore offline errors
  "FirebaseError: [code=unavailable]", // Ignore Firestore offline errors
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
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevConnectionState = useRef(null);

  // Function to safely handle Firestore network operations
  const updateFirestoreNetwork = async (isConnected) => {
    try {
      if (isConnected === false) {
        await disableNetwork(db);
      } else if (isConnected === true) {
        await enableNetwork(db);
      }
    } catch (error) {
      console.error("Firestore network error:", error);
    }
  };

  useEffect(() => {
    // Initialize network detection
    let unsubscribe;

    const setupNetworkDetection = async () => {
      try {
        // Check initial connection state
        const initialState = await NetInfo.fetch();
        const isInitiallyConnected = initialState.isConnected === true;
        setIsConnected(isInitiallyConnected);

        // Set initial previous state
        prevConnectionState.current = isInitiallyConnected;
        await updateFirestoreNetwork(isInitiallyConnected);

        // Subscribe to network state updates
        unsubscribe = NetInfo.addEventListener((state) => {
          const newConnectionState = state.isConnected === true;

          // Only update and show alerts if there's an actual change from the previous known state
          if (newConnectionState !== prevConnectionState.current) {
            setIsConnected(newConnectionState);
            updateFirestoreNetwork(newConnectionState);

            // Only show alerts if it's not the first detection (initial state was set)
            if (prevConnectionState.current !== null) {
              if (newConnectionState) {
                Alert.alert("Connection Restored", "You're back online");
              } else {
                Alert.alert("Connection Lost", "You're now offline");
              }
            }

            // Update previous state reference
            prevConnectionState.current = newConnectionState;
          }
        });
      } catch (error) {
        console.error("Network detection setup error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    setupNetworkDetection();

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Create Chat component with explicit network state
  const ChatWrapper = useCallback(
    (props) => <Chat isConnected={isConnected} db={db} {...props} />,
    [isConnected]
  );

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initializing app...</Text>
      </View>
    );
  }

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
          component={ChatWrapper}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
