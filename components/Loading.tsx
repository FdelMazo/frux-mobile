import * as React from "react";
import { Linking, TouchableOpacity } from "react-native";
import { Button, Div, Icon, Input, Text, Image } from "react-native-magnus";

const Component = () => {
  const [wakeup, setWakeup] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setWakeup(true);
    }, 3000);
  }, []);

  return wakeup ? (
    <Div justifyContent="center" h="100%">
      <Image h="40%" source={require("../assets/images/loading.png")} />
      <Div mt="md" alignItems="center">
        <Text>Oops! It appears that our server is still sleeping!</Text>
        <Text>Just wait a few minutes and we'll be right back with you!</Text>
      </Div>
      <Div position="absolute" bottom={0} p="xl" mx="xl">
        <Text fontSize="sm">
          If you see this problem for longer than 5 minutes, please
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://github.com/camidvorkin/frux-app-server");
            }}
          >
            <Text color="fruxgreen">contact us!</Text>
          </TouchableOpacity>
        </Text>
      </Div>
    </Div>
  ) : null;
};
export default Component;
