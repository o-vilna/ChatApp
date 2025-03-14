import {
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { useState, useEffect } from "react";

const Chat = ({ route }) => {
  // State to store messages
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Initial messages in the chat
    setMessages([
      {
        _id: 1,
        text: `${route.params.name} joined the chat`, // System message when a user joins
        createdAt: new Date(),
        system: true, // Indicates a system message
      },
      {
        _id: 2,
        text: "Welcome to the chat", // Welcome message
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any", // User avatar
        },
      },
    ]);
  }, []);

  // Function to send messages
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: route.params.backgroundColor }} // Background color is passed via params
    >
      <GiftedChat
        messages={messages} // Pass the messages array to the component
        onSend={(messages) => onSend(messages)} // Handle sending messages
        user={{
          _id: 1, // ID of the current user
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
