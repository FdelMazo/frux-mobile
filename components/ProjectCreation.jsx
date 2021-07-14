import { gql } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import {
  Button,
  Div,
  Drawer,
  Icon,
  Image,
  Input,
  Overlay,
  Text,
} from "react-native-magnus";
import Colors from "../constants/Colors";

export default function Component({ data, mutations, created }) {
  const [stages, setStages] = React.useState([]);
  React.useEffect(() => {
    setStages(
      data.project.stages.edges.map((s) => ({
        title: s.node.title,
        description: s.node.description,
        goal: s.node.goal,
      }))
    );
  }, [data.project.stages]);

  const [shownStageNewName, setShownStageNewName] = React.useState("");
  const [shownStageNewDescription, setShownStageNewDescription] =
    React.useState("");
  const [shownStageNewGoal, setShownStageNewGoal] = React.useState(0);
  const [errors, setErrors] = React.useState("");
  const [shownStage, setShownStage] = React.useState(0);
  const [stageOverlay, setStageOverlay] = React.useState(false);
  const [finishOverlay, setFinishOverlay] = React.useState(false);

  const drawerRef = React.createRef();

  const addStage = () => {
    const newStages = [...stages, { title: "", description: "", goal: 0 }];
    setStages(newStages);
  };

  if (data.project.currentState !== "CREATED") return null;
  return !created ? (
    <Div my="lg" w="75%" justifyContent="center" alignItems="center">
      <Text textAlign="center" color="fruxgreen">
        This project is still giving its first steps. You won't be able to fund
        it until it enters it's{" "}
        <Text color="fruxgreen" fontWeight="bold">
          Funding
        </Text>{" "}
        phase.
      </Text>
      <Text my="sm" color="fruxgreen">
        Why don't you come back a little bit later?
      </Text>
    </Div>
  ) : (
    <>
      <Div row my="lg" w="90%" justifyContent="space-between">
        <Button
          block
          w="45%"
          bg="white"
          onPress={() => {
            if (drawerRef.current) {
              drawerRef.current.open();
            }
          }}
          borderColor="fruxgreen"
          color="fruxgreen"
          borderWidth={1}
          prefix={
            <Icon
              left={0}
              color="fruxgreen"
              position="absolute"
              name="add"
              fontSize="lg"
              fontFamily="Ionicons"
            />
          }
        >
          Project Stages
        </Button>
        <Button
          block
          w="45%"
          bg="white"
          onPress={() => {
            setFinishOverlay(true);
          }}
          borderColor="fruxgreen"
          color="fruxgreen"
          borderWidth={1}
          suffix={
            <Icon
              right={0}
              color="fruxgreen"
              position="absolute"
              name="checkmark"
              fontSize="lg"
              fontFamily="Ionicons"
            />
          }
        >
          Finish Set Up
        </Button>
      </Div>

      <Drawer ref={drawerRef}>
        <Div my="xl" mx="lg">
          {stages.map((s, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setShownStage(i);
                setStageOverlay(true);
              }}
            >
              <Div row justifyContent="space-between" my="md">
                <Div row>
                  <Image
                    w={40}
                    h={40}
                    source={
                      !!s.title
                        ? require("../assets/images/stage.png")
                        : require("../assets/images/no-stage.png")
                    }
                  />
                  <Text mx="md" w="55%" fontWeight="bold">
                    {s.title || `Stage #${i}`}
                  </Text>
                </Div>

                <Text mx="md" fontSize="2xl" color="fruxgreen">
                  ${s.goal}
                </Text>
              </Div>
            </TouchableOpacity>
          ))}
          {(!stages.length || !!stages[stages.length - 1]?.title) && (
            <Button
              m="2xl"
              block
              bg="white"
              onPress={() => addStage()}
              borderColor="fruxgreen"
              color="fruxgreen"
              borderWidth={1}
              prefix={
                <Icon
                  left={0}
                  color="fruxgreen"
                  position="absolute"
                  name="add"
                  fontSize="lg"
                  fontFamily="Ionicons"
                />
              }
            >
              Add Stage
            </Button>
          )}
        </Div>
      </Drawer>

      <Overlay visible={stageOverlay}>
        <Div row justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Stage #{shownStage}
            {!!stages[shownStage]?.title
              ? `: ${stages[shownStage]?.title}`
              : ""}
          </Text>
          {!!stages[shownStage]?.goal && (
            <Text fontSize="3xl" fontWeight="bold" color="fruxgreen">
              ${stages[shownStage]?.goal}
            </Text>
          )}
        </Div>

        {created && !stages[shownStage]?.title && (
          <>
            <Text>
              This are your project stages, where you determine how much money
              you need for each partial goal of your project.
            </Text>
            <Text color="fruxred">
              Keep in mind, you{" "}
              <Text color="fruxred" fontWeight="bold">
                won't
              </Text>{" "}
              be able to change this data later.
            </Text>
          </>
        )}

        {!!stages[shownStage]?.description && (
          <Text w="80%" color="gray700" fontSize="lg">
            {stages[shownStage]?.description}
          </Text>
        )}

        {!stages[shownStage]?.title && (
          <Div>
            <Input
              w="80%"
              mt="md"
              value={shownStageNewName}
              onChangeText={setShownStageNewName}
              placeholder="Title"
            />
          </Div>
        )}
        {!stages[shownStage]?.description && (
          <Div>
            <Input
              w="80%"
              mt="md"
              value={shownStageNewDescription}
              onChangeText={setShownStageNewDescription}
              placeholder="Description"
            />
          </Div>
        )}

        {!stages[shownStage]?.goal && (
          <Div m="md">
            <Text fontSize="5xl" color="fruxgreen">
              {"$"}
              {shownStageNewGoal || 0}
            </Text>
            <MultiSlider
              selectedStyle={{ backgroundColor: Colors.fruxgreen }}
              markerStyle={{
                backgroundColor: Colors.fruxgreen,
              }}
              values={[shownStageNewGoal]}
              sliderLength={200}
              onValuesChange={(v) => {
                setShownStageNewGoal(Math.floor(v));
              }}
              step={50}
              max={500}
            />
          </Div>
        )}

        {errors !== "" && (
          <Text color="fruxred" textAlign="right" m="md">
            {errors}
          </Text>
        )}

        <Div row alignSelf="flex-end" my="md">
          <Button
            onPress={() => {
              setErrors("");
              setShownStageNewName("");
              setShownStageNewDescription("");
              setShownStageNewGoal(0);
              setStageOverlay(false);
            }}
            mx="sm"
            p="md"
            borderWidth={1}
            borderColor="fruxgreen"
            bg={undefined}
            color="fruxgreen"
          >
            {!!stages[shownStage]?.title ? "Close" : "Cancel"}
          </Button>
          {!stages[shownStage]?.title && (
            <Button
              onPress={async () => {
                if (
                  !shownStageNewName ||
                  !shownStageNewDescription ||
                  !shownStageNewGoal
                ) {
                  return setErrors("You must specify all fields!");
                }

                mutations.mutateProjectStage({
                  variables: {
                    idProject: data.project.dbId,
                    title: shownStageNewName,
                    description: shownStageNewDescription,
                    goal: shownStageNewGoal,
                  },
                });
                setErrors("");
                setShownStageNewName("");
                setShownStageNewDescription("");
                setShownStageNewGoal(0);
                setStageOverlay(false);
              }}
              mx="sm"
              p="md"
              bg="fruxgreen"
              color="white"
            >
              Create Stage
            </Button>
          )}
        </Div>
      </Overlay>

      <Overlay visible={finishOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Finish Set Up
        </Text>

        <Text>
          By finishing this setup you'll enter the{" "}
          <Text color="fruxgreen">Funding</Text> phase of your project, where
          people will be available to add funds to your project.
        </Text>
        <Text color="fruxred">
          Keep in mind, you{" "}
          <Text color="fruxred" fontWeight="bold">
            won't
          </Text>{" "}
          be able to change neither the project stages, nor the title after
          this!
        </Text>

        <Div row alignSelf="flex-end" my="md">
          <Button
            onPress={() => {
              setFinishOverlay(false);
            }}
            mx="sm"
            p="md"
            borderWidth={1}
            borderColor="fruxgreen"
            bg={undefined}
            color="fruxgreen"
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              mutations.mutateSeerProject({
                variables: {
                  idProject: data.project.dbId,
                },
              });
              setFinishOverlay(false);
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Confirm
          </Button>
        </Div>
      </Overlay>
    </>
  );
}

Component.fragments = {
  stage: gql`
    fragment ProjectCreation_stage on ProjectStage {
      id
      title
      description
      goal
    }
  `,
  project: gql`
    fragment ProjectCreation_project on Project {
      seerId
      stages {
        edges {
          node {
            id
            currentState
            title
            description
            goal
          }
        }
      }
    }
  `,
};
