import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import { useAuth } from "../auth";
import NotificationsList from "./NotificationsList";
import { TopicContainer } from "./TopicContainer";

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
        <TopicContainer
          name="Tech"
          img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fcogwheel-gear-mechanism-icon-black-minimalist-icon-isolated-on-white-vector-id858148342%3Fk%3D6%26m%3D858148342%26s%3D170667a%26w%3D0%26h%3D9IjQ2MmVS2a0MS8qNQR-l4Gz5foaX1ILVtlYmp6DMak%3D&f=1&nofb=1"
        />
      </Div>
    </Div>
  );
}
