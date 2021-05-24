import * as React from "react";

import { Collapse, Div, Icon, Text } from "react-native-magnus";

const NotificationsList = ({ data }: { data?: any }) => {
  return (
    <>
      <Div mt={20} mx={10} flexDir="row" justifyContent="space-between">
        <Text
          fontSize="3xl"
          fontFamily="latinmodernroman-bold"
          fontWeight="bold"
        >
          Notifications{" "}
        </Text>
        <Icon
          fontSize="2xl"
          name="notifications"
          color="black"
          fontFamily="Ionicons"
        />
      </Div>
      <Div my={20} mx={10}>
        {data.notifications.map((n) => (
          <Div>
            <Collapse>
              <Collapse.Header
                active
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
    </>
  );
};

export default function RenderProfile(props: any) {
  const mockedData = {
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

  return <NotificationsList data={mockedData} {...props} />;
}
