import * as React from "react";
import { Collapse, Div, Icon, Image, Text } from "react-native-magnus";
import { MainView, View } from "../components/Themed";

const Component = ({ errors }) => {
  return (
    <View>
      <MainView>
        <Div justifyContent="space-between" h="100%">
          <Div>
            <Image
              resizeMode="contain"
              h={350}
              source={require("../assets/images/error.png")}
            />
            <Div mt="md" alignItems="center">
              <Text fontSize="xl" fontWeight="bold">
                Oops! We had some Frux Errors!
              </Text>
            </Div>

            {errors
              .filter((e) => e)
              .map((e) => (
                <Collapse
                  borderWidth={1}
                  borderColor="fruxred"
                  rounded="md"
                  m="md"
                >
                  <Collapse.Header
                    bg={undefined}
                    suffix={
                      <Icon
                        mx="xl"
                        name="chevron-down"
                        fontFamily="Feather"
                        position="absolute"
                        right={0}
                        color="fruxred"
                      />
                    }
                    activeSuffix={
                      <Icon
                        mx="xl"
                        name="chevron-up"
                        fontFamily="Feather"
                        position="absolute"
                        right={0}
                        color="fruxred"
                      />
                    }
                  >
                    <Div flexDir="column" w="80%">
                      {e.networkError.result.errors.map((err) => (
                        <Div row my="xs">
                          <Icon
                            color="fruxred"
                            name="hair-cross"
                            fontFamily="Entypo"
                            mx="md"
                          />
                          <Text color="fruxred">{err.message}</Text>
                        </Div>
                      ))}
                    </Div>
                  </Collapse.Header>
                  <Collapse.Body py="sm">
                    <Text fontSize="sm">{JSON.stringify(e)}</Text>
                  </Collapse.Body>
                </Collapse>
              ))}
          </Div>
        </Div>
      </MainView>
    </View>
  );
};
export default Component;
