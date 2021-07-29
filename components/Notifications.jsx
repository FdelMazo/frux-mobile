import * as Notifications from "expo-notifications";
import * as React from "react";
import { ScrollView } from "react-native";
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
import { formatDateInput } from "../services/helpers";
import {
  clearNotifications,
  getAllNotifications,
  getNotificationsCount,
} from "../services/notifications";

export default function Component({ user_id, navigation }) {
  const notificationsRef = React.createRef();
  const [badge, setBadge] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const snackbarRef = React.createRef();

  const updateNotifications = async () => {
    const notifs = await getAllNotifications(user_id);
    setNotifications(notifs);
  };

  React.useEffect(() => {
    const badgeCount = async () => {
      const count = await getNotificationsCount();
      setBadge(count > 0);
    };

    badgeCount();
    updateNotifications();
  }, []);

  React.useEffect(() => {
    if (!snackbarRef.current) return null;
    const snackbar = snackbarRef.current;
    const subscription = Notifications.addNotificationReceivedListener(
      (notif) => {
        setBadge(true);
        updateNotifications();

        if (snackbar) {
          snackbar.show(
            <Button
              block
              justifyContent="flex-start"
              onPress={() => {
                navigation.navigate("ProjectScreen", {
                  dbId: notif.request.content.data.project_id,
                });
              }}
              bg={undefined}
              py={0}
              px={0}
              w="100%"
            >
              <Icon
                mx="md"
                name={
                  notif.request.content.data.chat ? "envelope" : "checkcircle"
                }
                color="white"
                fontSize="md"
                fontFamily={
                  notif.request.content.data.chat
                    ? "SimpleLineIcons"
                    : "AntDesign"
                }
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
        <ScrollView>
          <Div mx="lg">
            {notifications.map((n) => (
              <Div key={n.created_at}>
                <Collapse>
                  <Collapse.Header
                    underlayColor="gray200"
                    py="sm"
                    bg={undefined}
                    borderWidth={1}
                    rounded="sm"
                    m="xs"
                    activeSuffix={<></>}
                    suffix={<></>}
                  >
                    <Div w="100%">
                      <Div row w="100%" justifyContent="flex-end" my="xs">
                        <Icon
                          mr="sm"
                          name={n.chat ? "envelope" : "checkcircle"}
                          fontSize="sm"
                          color="gray700"
                          fontFamily={n.chat ? "SimpleLineIcons" : "AntDesign"}
                        />
                        <Text
                          mr="2xl"
                          textAlign="right"
                          fontSize="xs"
                          color="gray800"
                        >
                          {formatDateInput(new Date(n.created_at))}
                        </Text>
                      </Div>
                      <Text fontSize="md" mr="2xl">
                        {n.title}
                      </Text>
                    </Div>
                  </Collapse.Header>
                  <Collapse.Body
                    py={0}
                    px={0}
                    borderColor={"white"}
                    borderWidth={1}
                    rounded="sm"
                    mx="xs"
                  >
                    <Button
                      underlayColor="gray200"
                      bg={undefined}
                      onPress={() => {
                        notificationsRef.current.close();
                        navigation.navigate("ProjectScreen", {
                          dbId: n.project_id,
                        });
                      }}
                    >
                      <Text w="100%">{n.body}</Text>
                    </Button>
                  </Collapse.Body>
                </Collapse>
              </Div>
            ))}
            {!notifications.length && (
              <Collapse>
                <Collapse.Header
                  underlayColor="gray200"
                  py="sm"
                  bg={undefined}
                  borderWidth={1}
                  borderStyle="dashed"
                  borderColor="gray500"
                  rounded="sm"
                  m="xs"
                  activeSuffix={<></>}
                  suffix={<></>}
                >
                  <Div w="100%">
                    <Text fontSize="md" color="gray600">
                      Don't worry! You'll soon get lots of notifications! I
                      promise!
                    </Text>
                  </Div>
                </Collapse.Header>
              </Collapse>
            )}
          </Div>
        </ScrollView>
      </Drawer>
    </>
  );
}
