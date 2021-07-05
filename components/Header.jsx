import { gql } from "@apollo/client";
import { useMutation } from "@apollo/react-hooks";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  Div,
  Icon,
  Image,
  Input,
  Overlay,
  Text,
} from "react-native-magnus";
import { AppIcons } from "../constants/Constants";
import { loggingOut, useAuth } from "../services/auth";
import Notifications from "./Notifications";

function Component(props) {
  const { icon, title, onPress, mutations, navigation, data } = props;
  const [createProjectOverlay, setCreateProjectOverlay] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectDescription, setNewProjectDescription] = React.useState("");
  const [projectError, setProjectError] = React.useState("");
  const [newProjectGoal, setNewProjectGoal] = React.useState(500);

  React.useEffect(() => {
    if (data?.mutateProject?.dbId)
      navigation.navigate("ProjectScreen", {
        dbId: data.mutateProject.dbId,
      });
  }, [data?.mutateProject?.dbId]);

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
              onPress={() => {
                setCreateProjectOverlay(true);
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

      <Overlay visible={createProjectOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Create New Project
        </Text>
        <Div>
          <Input
            w="65%"
            mt="md"
            value={newProjectName}
            onChangeText={setNewProjectName}
            placeholder="Name"
          />
          <Input
            w="65%"
            mt="md"
            value={newProjectDescription}
            onChangeText={setNewProjectDescription}
            placeholder="Description"
          />

          <Div m="md">
            <Text fontSize="5xl" color="fruxgreen">
              {"$"}
              {newProjectGoal}
            </Text>
            <MultiSlider
              trackStyle={{ backgroundColor: "#bdc3c7" }}
              selectedStyle={{ backgroundColor: "#90B44B" }}
              markerStyle={{
                backgroundColor: "#90B44B",
              }}
              values={[newProjectGoal]}
              sliderLength={200}
              onValuesChange={(v) => {
                setNewProjectGoal(Math.floor(v));
              }}
              step={50}
              max={5000}
            />
          </Div>
        </Div>
        {projectError !== "" && (
          <Text color="red" textAlign="right" m="md">
            {projectError}
          </Text>
        )}
        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setCreateProjectOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={async () => {
              if (
                !newProjectName ||
                !newProjectDescription ||
                !newProjectGoal
              ) {
                return setProjectError("You must specify all fields!");
              }

              setCreateProjectOverlay(false);
              await mutations?.createProject({
                variables: {
                  name: newProjectName,
                  goal: newProjectGoal,
                  description: newProjectDescription,
                },
              });
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Create
          </Button>
        </Div>
      </Overlay>

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

export default function Render(props) {
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
  const [createProject, { data, loading, error }] = useMutation(
    createProjectMutation
  );

  return <Component mutations={{ createProject }} {...props} data={data} />;
}
