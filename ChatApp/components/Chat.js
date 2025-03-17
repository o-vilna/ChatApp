import {
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { userId, name, backgroundColor } = route.params;
  // State to store messages
  const [messages, setMessages] = useState([]);

  // Create a listener for Firestore
  useEffect(() => {
    // Create a query to the messages collection, sort by creation time (descending order)
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    // Subscribe to collection updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert data from Firestore to a format that GiftedChat understands
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });
      setMessages(newMessages);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Function to send messages
  const onSend = (newMessages = []) => {
    const message = newMessages[0];
    // Save the message to Firestore
    addDoc(collection(db, "messages"), {
      _id: message._id,
      text: message.text,
      createdAt: serverTimestamp(), // Use server timestamp
      user: {
        _id: userId,
        name: name,
      },
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: backgroundColor }} // Background color is passed via params
    >
      <GiftedChat
        messages={messages} // Pass the messages array to the component
        onSend={(messages) => onSend(messages)} // Handle sending messages
        user={{
          _id: userId, // User ID from route.params
          name: name, // User name from route.params
        }}
        // Customize message appearance
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: "#000" }, // Current user's messages (black background)
              left: { backgroundColor: "#FFF" }, // Other users' messages (white background)
            }}
          />
        )}
        placeholder="Type a message..." // Placeholder text in the input field
        // Accessibility settings for the input field
        textInputProps={{
          accessible: true,
          accessibilityLabel: "Message input field",
          accessibilityHint: "Enter your message text here",
        }}
        // Accessibility settings for the send button
        sendButtonProps={{
          accessible: true,
          accessibilityLabel: "Send button",
          accessibilityHint: "Tap to send your message",
        }}
        alwaysShowSend // Always show the send button
        // Handle keyboard behavior for iOS and Android
        renderInputToolbar={(props) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS - padding, Android - height
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Offset for proper display
          >
            <InputToolbar {...props} />
          </KeyboardAvoidingView>
        )}
      />
    </SafeAreaView>
  );
};

export default Chat;
