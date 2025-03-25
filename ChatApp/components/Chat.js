import {
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
  Text,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

// Welcome message shown when no messages are loaded
const WELCOME_MESSAGE = {
  _id: "system-welcome",
  text: "Welcome to the chat app! This message will appear when no messages are found.",
  createdAt: new Date(),
  system: true,
};

/**
 * Chat screen component handling messages, media sharing, and offline functionality
 * @param {Object} props Component props
 * @param {Object} props.route Navigation route object
 * @param {Object} props.navigation Navigation object
 * @param {Object} props.db Firestore database instance
 * @param {boolean} props.isConnected Network connection status
 * @param {Object} props.storage Firebase storage instance
 */
const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { userId, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(true);
  const [forceOffline, setForceOffline] = useState(false);

  // Direct network detection
  useEffect(() => {
    let netInfoUnsubscribe;

    const setupDirectNetworkDetection = () => {
      netInfoUnsubscribe = NetInfo.addEventListener((state) => {
        setForceOffline(state.isConnected === false);
      });

      // Check immediately
      NetInfo.fetch().then((state) => {
        setForceOffline(state.isConnected === false);
      });
    };

    setupDirectNetworkDetection();

    return () => {
      if (netInfoUnsubscribe) {
        netInfoUnsubscribe();
      }
    };
  }, []);

  // Combined offline detection (from props AND direct detection)
  const isReallyOffline = isConnected === false || forceOffline === true;

  // Debug connection state changes
  const prevConnected = useRef(isConnected);

  useEffect(() => {
    if (prevConnected.current !== isConnected) {
      prevConnected.current = isConnected;
    }

    // Automatically load cached messages when offline
    if (isReallyOffline) {
      loadCachedMessages();
    }
  }, [isConnected, forceOffline]);

  /**
   * Loads cached messages from AsyncStorage
   * @returns {Promise<void>}
   */
  const loadCachedMessages = async () => {
    try {
      setIsLoading(true);
      const cachedMessages = await AsyncStorage.getItem("messages");

      if (cachedMessages) {
        const parsedMessages = JSON.parse(cachedMessages);
        setMessages(
          Array.isArray(parsedMessages) && parsedMessages.length > 0
            ? parsedMessages
            : [WELCOME_MESSAGE]
        );
      }
    } catch (error) {
      console.error("Cache loading error:", error);
      setMessages([WELCOME_MESSAGE]);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up Firestore listener or load cached messages
  useEffect(() => {
    let unsubscribe = null;
    setIsLoading(true);

    const setupFirestore = async () => {
      if (!isReallyOffline) {
        try {
          const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
              const newMessages = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const message = {
                  _id: doc.id,
                  text: data.text,
                  createdAt: data.createdAt
                    ? data.createdAt.toDate()
                    : new Date(),
                  user: {
                    _id: data.user._id,
                    name: data.user.name,
                  },
                };

                // add image
                if (data.image) {
                  message.image = data.image;
                }

                // add location
                if (data.location) {
                  message.location = data.location;
                }

                return message;
              });

              setMessages(
                newMessages.length === 0 ? [WELCOME_MESSAGE] : newMessages
              );
              AsyncStorage.setItem("messages", JSON.stringify(newMessages));
              setIsLoading(false);
            },
            (error) => {
              console.error("Firestore error:", error);
              loadCachedMessages();
            }
          );
        } catch (error) {
          console.error("Error setting up listener:", error);
          loadCachedMessages();
        }
      } else {
        await loadCachedMessages();
      }
    };

    setupFirestore();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected, forceOffline]);

  /**
   * Handles sending messages
   * @param {Array|Object} newMessages - New message(s) to send
   */
  const onSend = useCallback(
    async (newMessages = []) => {
      if (isReallyOffline) {
        Alert.alert("Offline Mode", "Cannot send messages while offline");
        return;
      }

      try {
        const message = Array.isArray(newMessages)
          ? newMessages[0]
          : newMessages;
        const messageToSend = {
          _id: message._id || Math.round(Math.random() * 1000000),
          text: message.text || "",
          createdAt: serverTimestamp(),
          user: { _id: userId, name: name },
          ...(message.image && { image: message.image }),
          ...(message.location && { location: message.location }),
        };

        await addDoc(collection(db, "messages"), messageToSend);
      } catch (error) {
        console.error("Message send error:", error);
        Alert.alert("Error", "Failed to send message");
      }
    },
    [isConnected, forceOffline, userId, name]
  );

  // Force hide input toolbar when offline
  const renderInputToolbar = useCallback(
    (props) => {
      // Directly check network state each time
      try {
        NetInfo.fetch().then((state) => {
          if (state.isConnected === false) {
            setForceOffline(true);
          }
        });
      } catch (error) {
        setForceOffline(true);
      }

      // 1. Check our combined offline state
      if (isReallyOffline) {
        return null;
      }

      // 2. Check props directly as another safeguard
      if (isConnected === false) {
        return null;
      }

      // 3. Check direct state as third safeguard
      if (forceOffline) {
        return null;
      }

      // All checks passed, render the toolbar
      return <InputToolbar {...props} />;
    },
    [isConnected, forceOffline, isReallyOffline]
  );

  const renderCustomActions = (props) => {
    return (
      <CustomActions
        {...props}
        storage={storage}
        userId={userId}
        name={name}
        onSend={onSend}
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const fetchResponse = await fetch(imageURI);
      const blob = await fetchResponse.blob();

      // add metadata
      const metadata = {
        contentType: "image/jpeg",
        customMetadata: {
          userId: userId,
          timestamp: new Date().toISOString(),
        },
      };

      await uploadBytes(newUploadRef, blob, metadata);
      const imageURL = await getDownloadURL(newUploadRef);

      onSend({
        image: imageURL,
        text: "",
        user: {
          _id: userId,
          name: name,
        },
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", "Failed to upload image. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissions?.granted) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.5,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.canceled) {
          await uploadAndSendImage(result.assets[0].uri);
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    } catch (error) {
      console.error("Error in pickImage:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // complete override of GiftedChat for offline mode
  if (isReallyOffline || isConnected === false || forceOffline) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <GiftedChat
          messages={messages}
          user={{
            _id: userId,
            name: name,
          }}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: "#000" },
                left: { backgroundColor: "#FFF" },
              }}
            />
          )}
          renderInputToolbar={() => null}
          onSend={() => {
            Alert.alert("Offline Mode", "Cannot send messages while offline");
          }}
          placeholder="Offline Mode"
        />
      </SafeAreaView>
    );
  }

  // Standard render for online mode
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: userId,
          name: name,
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: "#000" },
              left: { backgroundColor: "#FFF" },
            }}
          />
        )}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        placeholder="Type a message..."
        textInputProps={{
          accessible: true,
          accessibilityLabel: "Message input field",
          accessibilityHint: "Enter your message text here",
        }}
        sendButtonProps={{
          accessible: true,
          accessibilityLabel: "Send button",
          accessibilityHint: "Tap to send your message",
        }}
      />
    </SafeAreaView>
  );
};

export default Chat;
