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

export const notificationHandshake = async (user_id) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  await fetch(`http://192.168.1.100:5500/user/${user_id}`, {
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
