import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import { loggingOut, useAuth } from "../auth";
import Notifications from "./Notifications";
import { AppIcons } from "../constants/Constants";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/react-hooks";
import { MutationFunction } from "@apollo/react-common";

type Props = {
  icon: string;
  title: string;
  onPress?: any;
  mutations?: Record<string, MutationFunction<any>>;
  data?: any;
  navigation: StackNavigationProp<any>;
};

function Component(props: Props) {
  const { icon, title, onPress, mutations, navigation, data } = props;

  // @ts-expect-error
  const { user } = useAuth();

  return (
    <Div
      alignItems="center"
      bgImg={require("../assets/images/forest.jpg")}
      p="2xl"
      h={200}
    >
      {user && (
        <>
          <Notifications navigation={navigation} />
          <Div position="absolute" right={0} bottom={0}>
            <Button bg={undefined} onPress={() => loggingOut()}>
              <Icon
                name="sign-out"
                color="red"
                fontFamily="Octicons"
                fontSize="2xl"
              />
            </Button>
          </Div>
          <Div position="absolute" bottom={0}>
            <Button
              bg="fruxgreen"
              borderColor="black"
              borderWidth={1}
              p="xs"
              mb="sm"
              onPress={async () => {
                await mutations?.createProject({
                  variables: {
                    name: "New Project",
                    goal: 1000,
                    description: "Description",
                  },
                });

                navigation.navigate("ProjectScreen", {
                  dbId: data.mutateProject.dbId,
                });
              }}
            >
              <Icon
                name="add"
                color="white"
                fontFamily="Ionicons"
                fontSize="2xl"
              />
            </Button>
          </Div>
        </>
      )}
      <Text fontSize="5xl" fontFamily="latinmodernroman-bold" fontWeight="bold">
        {title}
      </Text>
      <TouchableOpacity activeOpacity={onPress ? 0.2 : 1} onPress={onPress}>
        {icon === "logo" ? (
          <Image
            h={50}
            w={50}
            borderWidth={2}
            borderColor="black"
            rounded="circle"
            source={require("../assets/images/logo.png")}
          />
        ) : (
          <Icon
            m="md"
            bg="fruxbrown"
            h={50}
            w={50}
            rounded="circle"
            name={AppIcons[icon].name}
            color="fruxgreen"
            borderWidth={2}
            fontSize="2xl"
            fontFamily={AppIcons[icon].fontFamily}
          />
        )}
      </TouchableOpacity>
    </Div>
  );
}

export default function Render(props: Props) {
  const createProjectMutation = gql`
    mutation createProjectMutation(
      $description: String!
      $goal: Int!
      $name: String!
    ) {
      mutateProject(description: $description, goal: $goal, name: $name) {
        dbId
      }
    }
  `;
  const [createProject, { data, error }] = useMutation(createProjectMutation);

  return <Component mutations={{ createProject }} {...props} data={data} />;
}
