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

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  const colors = {
    black: "#090C08",
    purple: "#474056",
    grey: "#8A95A5",
    green: "#B9C6AE",
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
          />

          <View style={styles.colorSelector}>
            <Text style={styles.colorSelectorTitle}>
              Choose Background Color:
            </Text>
            <View style={styles.colorOptions}>
              {Object.entries(colors).map(([key, color]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    backgroundColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setBackgroundColor(color)}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Chat", {
                name: name || "Anonymous User",
                backgroundColor: backgroundColor,
              });
            }}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
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
