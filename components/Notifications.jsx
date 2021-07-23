import * as React from "react";
import { Button, Collapse, Div, Drawer, Icon, Text } from "react-native-magnus";

function Component({ data, navigation }) {
  const notificationsRef = React.createRef();

  return (
    <>
      <Div position="absolute" right={5} top={30}>
        <Button
          bg={undefined}
          onPress={() => {
            if (notificationsRef.current) {
              notificationsRef.current.open();
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
      </Div>

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
