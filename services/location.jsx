import { googleMapsConfig } from "../constants/Config";
import * as Location from "expo-location";

export const useCurrentLocation = async () => {
  await Location.setGoogleApiKey(googleMapsConfig.GOOGLE_APIKEY);
  await Location.requestForegroundPermissionsAsync();
  const userLocation = await Location.getCurrentPositionAsync();
  return userLocation.coords;
};
