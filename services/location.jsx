import * as Location from "expo-location";
import { googleMapsConfig } from "../constants/Config";

export const useCurrentLocation = async () => {
  await Location.setGoogleApiKey(googleMapsConfig.GOOGLE_APIKEY);
  const { status: existingStatus } =
    await Location.getBackgroundPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Location.requestForegroundPermissionsAsync();
    finalStatus = status;
  }
  const userLocation = await Location.getCurrentPositionAsync();
  return userLocation.coords;
};

export const getAddressName = async (coords) => {
  const address = await Location.reverseGeocodeAsync(coords);
  return address[0].district + ", " + address[0].region;
};
