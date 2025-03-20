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

// Welcome message shown when no messages are loaded
const WELCOME_MESSAGE = {
  _id: "system-welcome",
  text: "Welcome to the chat app! This message will appear when no messages are found.",
  createdAt: new Date(),
  system: true,
};

const Chat = ({ route, navigation, db, isConnected }) => {
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

  const loadCachedMessages = async () => {
    try {
      setIsLoading(true);
      const cachedMessages = await AsyncStorage.getItem("messages");

      if (cachedMessages) {
        const parsedMessages = JSON.parse(cachedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      } else {
        setMessages([WELCOME_MESSAGE]);
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
                return {
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
              });

              if (newMessages.length === 0) {
                setMessages([WELCOME_MESSAGE]);
              } else {
                setMessages(newMessages);
              }

              // Cache messages for offline use
              AsyncStorage.setItem(
                "messages",
                JSON.stringify(newMessages)
              ).catch((error) => console.error("Caching error:", error));

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
        // We're offline, load cached messages
        await loadCachedMessages();
      }
    };

    setupFirestore();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isConnected, forceOffline]);

  // Send message handler
  const onSend = useCallback(
    async (newMessages = []) => {
      // Explicitly check for offline mode
      if (isReallyOffline) {
        Alert.alert("Offline Mode", "Cannot send messages while offline");
        return;
      }

      try {
        const message = newMessages[0];

        await addDoc(collection(db, "messages"), {
          _id: message._id,
          text: message.text,
          createdAt: serverTimestamp(),
          user: {
            _id: userId,
            name: name,
          },
        });
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

  // EXTREME FAILSAFE - complete override of GiftedChat for offline mode
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
          renderInputToolbar={() => null} // FORCE NULL IN OFFLINE MODE
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
