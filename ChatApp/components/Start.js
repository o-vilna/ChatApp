import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  // State to store the user's name
  const [name, setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#090C08");

  // Available color options for background
  const colors = {
    black: "#090C08",
    purple: "#474056",
    grey: "#8A95A5",
    green: "#B9C6AE",
  };

  // Function for anonymous authentication and navigation to chat
  const signInUser = async () => {
    const auth = getAuth();
    try {
      const result = await signInAnonymously(auth);
      // After successful authentication, navigate to the chat screen
      navigation.navigate("Chat", {
        name: name || "User",
        backgroundColor: backgroundColor,
        userId: result.user.uid, // Pass user's uid
      });
    } catch (error) {
      console.log("Error signing in anonymously:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  // Function to select background color
  const selectBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  return (
    <ImageBackground
      source={require("../assets/background-image.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Chat App</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            accessible={true}
            accessibilityLabel="Name input field"
            accessibilityHint="Enter your name for the chat"
            accessibilityRole="text"
          />

          <View style={styles.colorSelector}>
            <Text style={styles.colorSelectorTitle}>
              Choose Background Color:
            </Text>
            <View style={styles.colorOptions}>
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: "#090C08" }]}
                onPress={() => selectBackgroundColor("#090C08")}
                accessible={true}
                accessibilityLabel="Black background color option"
                accessibilityHint="Select black as your chat background color"
              />
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: "#474056" }]}
                onPress={() => selectBackgroundColor("#474056")}
                accessible={true}
                accessibilityLabel="Dark purple background color option"
                accessibilityHint="Select dark purple as your chat background color"
              />
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: "#8A95A5" }]}
                onPress={() => selectBackgroundColor("#8A95A5")}
                accessible={true}
                accessibilityLabel="Grey background color option"
                accessibilityHint="Select grey as your chat background color"
              />
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: "#B9C6AE" }]}
                onPress={() => selectBackgroundColor("#B9C6AE")}
                accessible={true}
                accessibilityLabel="Green background color option"
                accessibilityHint="Select green as your chat background color"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={signInUser}
            accessible={true}
            accessibilityLabel="Start chatting"
            accessibilityHint="Tap to go to the chat screen"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Adjust keyboard behavior for iOS */}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: "white",
    width: "88%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  textInput: {
    height: 50,
    borderColor: "#757083",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
  },
  colorSelector: {
    marginBottom: 20,
  },
  colorSelectorTitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#757083",
  },
  button: {
    backgroundColor: "#757083",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Start;
