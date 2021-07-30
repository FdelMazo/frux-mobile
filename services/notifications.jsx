import { NOTIFICATIONS_ENDPOINT } from "@env";
import * as Notifications from "expo-notifications";
Notifications.setNotificationChannelAsync("default", {
  name: "default",
  importance: Notifications.AndroidImportance.DEFAULT,
});

export const getNotificationsCount = async () => {
  return Notifications.getBadgeCountAsync();
};

export const clearNotifications = async () => {
  return Notifications.setBadgeCountAsync(0);
};

export const notificationHandshake = async (userId) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  await fetch(NOTIFICATIONS_ENDPOINT + `/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      token,
    }),
  });
};

export const getAllNotifications = async (userId) => {
  const notifs = await fetch(
    NOTIFICATIONS_ENDPOINT + `/user/${userId}/notifications`
  ).then((res) => res.json());

  return notifs;
};
