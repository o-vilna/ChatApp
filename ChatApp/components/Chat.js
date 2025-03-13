import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

const Chat = ({ route }) => {
  const { name, backgroundColor } = route.params;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Here will be chat content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
