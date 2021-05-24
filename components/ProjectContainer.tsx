import * as React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import NotificationsList from "./NotificationsList";

type Props = {
  // name: string;
  // img: string;
};

export function ProjectContainer(props: Props) {
  return (
    <TouchableHighlight
      onPress={() => {
        props.navigation.navigate("ProjectScreen", { name: "Batman Comics" });
      }}
      underlayColor="white"
    >
      <Div>
        <Div
          rounded="xl"
          h={150}
          w={250}
          bgImg={{
            uri: "https://static2.cbrimages.com/wordpress/wp-content/uploads/2021/01/batman-1-1940-header.jpg",
          }}
        >
          <Div
            bg="pink500"
            rounded="md"
            row
            flexWrap="wrap"
            px="md"
            m="lg"
            alignSelf="flex-start"
          >
            <Text color="white" fontSize="sm">
              In Progress
            </Text>
          </Div>
        </Div>
        <Div row alignItems="center">
          <Div flex={1}>
            <Text fontWeight="bold" fontSize="xl" mt="sm">
              Batman Comic
            </Text>
            <Text color="gray500" fontSize="sm">
              Art
            </Text>
          </Div>
          <Div row alignItems="center">
            <Text color="blue500" fontWeight="bold" fontSize="xl">
              $500
            </Text>
          </Div>
        </Div>
      </Div>
    </TouchableHighlight>
  );
}
