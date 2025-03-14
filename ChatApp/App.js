import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";

// Ігнорувати конкретні попередження
LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components",
  'Warning: A props object containing a "key" prop is being spread into JSX',
]);

// import the screens we want to navigate
import Start from "./components/Start";
import Chat from "./components/Chat";

// create the navigator
const Stack = createNativeStackNavigator();

// The app's main Chat component that renders the chat UI
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
