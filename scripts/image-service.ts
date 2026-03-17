import { launchCameraAsync, launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { Alert } from "react-native";

export const ImageService = {
  async Camera() {
    const permissionResult = await requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }
    console.log("Camera function called");
    try {
      const result = await launchCameraAsync()
      if (result.canceled) {
        console.log("User cancelled camera")
      }

      if (!result.assets || result.assets.length === 0) {
        console.log("No image captured")
        return
      }

      const imageUri = result.assets[0].uri
      console.log("Captured image URI: ", imageUri)
      return imageUri

    } catch (error) { 
      Alert.alert('Camera Access Error', 'An error occurred while trying to access the camera. Please try again.')
      console.error(error);
    }
  },
  async Gallery() {
    console.log("Gallery function called");
    try {
      const result = await launchImageLibraryAsync()
      if (result.canceled) {
        console.log("User canceled gallery")
      }

      if (!result.assets || result.assets.length === 0) {
        console.log("No image selected")
        return
      }

      const imageUri = result.assets[0].uri
      console.log("Selected image URI: ", imageUri)
      return imageUri

    } catch (error) { 
      Alert.alert('Gallery Access Error', 'An error occurred while trying to access the gallery. Please try again.')
      console.error(error);
    }
  }
}