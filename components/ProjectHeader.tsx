import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import { useAuth } from "../auth";
import NotificationsList from "./NotificationsList";
import { TopicContainer } from "./TopicContainer";

type Props = {
  img: string;
  topic: string;
};

export function ProjectHeader(props: Props) {
  const notificationsRef = React.createRef();
  const { user } = useAuth();
  return (
    <Div
      alignItems="center"
      justifyContent="flex-start"
      bgImg={{
        uri: props.img,
      }}
      h={200}
    >
      <Drawer direction="right" ref={notificationsRef}>
        <NotificationsList />
      </Drawer>

      {user && (
        <Div position="absolute" right={5} top={30}>
          <Button
            bg={undefined}
            onPress={() => {
              if (notificationsRef.current) {
                notificationsRef.current.open();
              }
            }}
          >
            <Icon name="notifications" color="black" fontFamily="Ionicons" />
          </Button>
        </Div>
      )}

      <Div position="absolute" right={0} bottom={0}>
        <TopicContainer name="Books" showName={false} />
      </Div>
    </Div>
  );
}
