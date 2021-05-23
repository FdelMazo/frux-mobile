import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import { useAuth } from "../auth";
import NotificationsList from "./NotificationsList";

type Props = {
  img: string;
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
      h={300}
    >
      <Drawer direction="right" ref={notificationsRef}>
        <NotificationsList />
      </Drawer>

      {user && (
        <Div alignSelf="flex-end">
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
    </Div>
  );
}
