import { NOTIFICATIONS_ENDPOINT } from "@env";
import * as Notifications from "expo-notifications";

export const notificationHandshake = async (user_id) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });

  await fetch(NOTIFICATIONS_ENDPOINT + `/user/${user_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      token,
    }),
  });
};
