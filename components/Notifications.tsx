import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { Button, Collapse, Div, Drawer, Icon, Text } from "react-native-magnus";

type Data = {
  notifications: {
    title: string;
    timestamp: string;
    body: string;
  }[];
};
type Navigation = StackNavigationProp<any>;

function Component({
  data,
  navigation,
}: {
  data: Data;
  navigation: Navigation;
}) {
  const notificationsRef = React.createRef();

  return (
    <>
      <Div position="absolute" right={5} top={30}>
        <Button
          bg={undefined}
          onPress={() => {
            if (notificationsRef.current) {
              // @ts-expect-error
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

      {/* @ts-expect-error */}
      <Drawer direction="right" ref={notificationsRef}>
        <Div my="xl" mx="lg" row justifyContent="space-between">
          <Text
            fontSize="3xl"
            fontFamily="latinmodernroman-bold"
            fontWeight="bold"
          >
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
                <Collapse.Header
                  bg={undefined}
                  borderWidth={1}
                  suffix={
                    <Icon
                      px="lg"
                      name="chevron-down"
                      fontFamily="Feather"
                      position="absolute"
                      right={0}
                      color="black"
                    />
                  }
                  activeSuffix={
                    <Icon
                      px="lg"
                      name="chevron-up"
                      fontFamily="Feather"
                      position="absolute"
                      right={0}
                      color="black"
                    />
                  }
                >
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

type Props = {
  navigation: Navigation;
};

export default function Render(props: Props) {
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
