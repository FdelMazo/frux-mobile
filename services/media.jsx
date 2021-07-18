import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/app";
import "firebase/storage";

export const uploadImage = async () => {
  const { status: existingStatus } =
    await ImagePicker.getMediaLibraryPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    finalStatus = status;
  }
  const image = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1,
  });

  // Idea from NachoRaik/tu2bo-mobileapp
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", image.uri, true);
    xhr.send(null);
  });

  const id = Math.random().toString(36).substring(7);
  const ref = firebase.storage().ref().child(id);
  await ref.put(blob);
  blob.close();

  return id;
};

export const getImageUri = async (id) => {
  const uri = await firebase.storage().ref().child(id).getDownloadURL();
  return uri;
};
