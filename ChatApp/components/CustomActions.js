import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userId,
  name,
}) => {
  const actionSheet = useActionSheet();

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userId}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      // Очищення URI для iOS
      const cleanedURI =
        Platform.OS === "ios" ? imageURI.replace("file://", "") : imageURI;
      const uniqueRefString = generateReference(cleanedURI);
      const newUploadRef = ref(storage, uniqueRefString);

      const fetchResponse = await fetch(cleanedURI);
      const blob = await fetchResponse.blob();

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
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // Use ImagePicker API
    let result = await ImagePicker.launchImageLibraryAsync();

    // Generate unique reference
    const uniqueRefString = generateReference(result.assets[0].uri);

    // Upload to Firebase Storage
    await uploadAndSendImage(result.assets[0].uri);

    // Send message with image
    onSend({ image: result.assets[0].uri });
  };

  const takePhoto = async () => {
    // Ask permission
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    // Use Camera API
    let result = await ImagePicker.launchCameraAsync();

    // Generate unique reference and upload
    await uploadAndSendImage(result.assets[0].uri);
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    // Get location
    const location = await Location.getCurrentPositionAsync({});

    // Send message with location
    onSend({
      location: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
    });
  };

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="Communication options"
      accessibilityHint="Choose to send an image, take a photo, or share your location"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
