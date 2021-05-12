import * as React from "react";

import { Collapse, Div, Icon, Text } from "react-native-magnus";

const NotificationsList = ({ data }: { data?: any }) => {
  return (
    <>
      <Text m={20} fontSize="4xl" textAlign="right" fontWeight="bold">
        Notifications{" "}
        <Icon
          fontSize="3xl"
          name="notifications"
          color="black"
          fontFamily="Ionicons"
        />
      </Text>
      <Div m={20}>
        {data.notifications.map((n) => (
          <>
            <Collapse>
              <Collapse.Header
                active
                bg={undefined}
                borderWidth={1}
                color="black"
                fontSize="md"
                p="xl"
                px="none"
                suffix={
                  <Icon
                    px="xl"
                    name="chevron-down"
                    fontFamily="Feather"
                    position="absolute"
                    right={0}
                    color="black"
                  />
                }
                activeSuffix={
                  <Icon
                    px="xl"
                    name="chevron-up"
                    fontFamily="Feather"
                    position="absolute"
                    right={0}
                    color="black"
                  />
                }
              >
                <Div>
                  <Text>
                    {n.timestamp}
                    <br />
                    {n.title.toUpperCase()}
                  </Text>
                </Div>
              </Collapse.Header>
              <Collapse.Body pb="xl">
                <Text>{n.body}</Text>
              </Collapse.Body>
            </Collapse>
          </>
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
