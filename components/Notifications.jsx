import * as Notifications from "expo-notifications";
import * as React from "react";
import {
  Badge,
  Button,
  Collapse,
  Div,
  Drawer,
  Icon,
  Snackbar,
  Text,
} from "react-native-magnus";
import {
  clearNotifications,
  getNotificationsCount,
} from "../services/notifications";

function Component({ data, navigation }) {
  const notificationsRef = React.createRef();
  const [badge, setBadge] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const snackbarRef = React.createRef();

  React.useEffect(() => {
    const badgeCount = async () => {
      const count = await getNotificationsCount();
      setBadge(count > 0);
    };
    badgeCount();
  }, []);

  React.useEffect(() => {
    if (!snackbarRef.current) return null;
    const snackbar = snackbarRef.current;
    const subscription = Notifications.addNotificationReceivedListener(
      (notif) => {
        console.log(notif);
        setBadge(true);
        if (snackbar) {
          snackbar.show(
            <Button
              block
              justifyContent="flex-start"
              onPress={() => {
                navigation.navigate("ProjectScreen", {
                  dbId: notif.request.content.data.projectId,
                });
              }}
              bg={undefined}
              py={0}
              px={0}
              w="100%"
            >
              <Icon
                mx="md"
                name="checkcircle"
                color="white"
                fontSize="md"
                fontFamily="AntDesign"
              />
              <Text color="white" fontSize="md" fontWeight="bold">
                {notif.request.content.title}
              </Text>
            </Button>,
            { duration: 3000 }
          );
        }
      }
    );
    return () => subscription.remove();
  }, [snackbarRef]);

  return (
    <>
      <Div position="absolute" right={5} top={30}>
        <Badge right={5} top={5} bg={badge ? "fruxred" : undefined}>
          <Button
            bg={undefined}
            onPress={() => {
              if (notificationsRef.current) {
                notificationsRef.current.open();
                clearNotifications();
                setBadge(false);
              }
            }}
          >
            <Icon
              name="notifications"
              fontSize="2xl"
              color="black"
              fontFamily="Ionicons"
            />
          </Button>
        </Badge>
      </Div>
      <Snackbar
        ref={snackbarRef}
        fontWeight="bold"
        bg="fruxgreen"
        color="white"
      />
      <Drawer direction="right" ref={notificationsRef}>
        <Div my="xl" mx="lg" row justifyContent="space-between">
          <Text fontSize="3xl" fontFamily="latinmodernroman-bold">
            Notifications
          </Text>
          <Icon
            fontSize="2xl"
            name="notifications"
            color="black"
            fontFamily="Ionicons"
          />
        </Div>
        <Div mx="lg">
          {data.notifications.map((n) => (
            <Div key={n.title}>
              <Collapse>
                <Collapse.Header bg={undefined} borderWidth={1}>
                  <Div>
                    <Text fontSize="xs">{n.timestamp}</Text>
                    <Text fontSize="xs">{n.title.toUpperCase()}</Text>
                  </Div>
                </Collapse.Header>
                <Collapse.Body>
                  <Text fontSize="xs">{n.body}</Text>
                </Collapse.Body>
              </Collapse>
            </Div>
          ))}
        </Div>
      </Drawer>
    </>
  );
}

export default function Render(props) {
  const data = {
    notifications: [
      {
        timestamp: "May 21",
        title: "Escalectrix personal board arena",
        body: "Escalectrix personal board arena has moved to Complete!",
      },
      {
        timestamp: "May 20",
        title: "Dragon ball coffee mugs",
        body: "JDSanto started sponsoring your project!",
      },
      {
        timestamp: "May 12",
        title: "Tomatometer",
        body: "Vorkin is watching your project.",
      },
    ],
  };
  return <Component data={data} navigation={props.navigation} />;
}
