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
import { toDollars } from "../services/helpers";
import FruxOverlay from "./FruxOverlay";
export default function Component({ data, mutations, created }) {
  const [stages, setStages] = React.useState([]);
  React.useEffect(() => {
    const _stages = async () => {
      const x = await Promise.all(
        data.project.stages.edges.map(async (s) => ({
          title: s.node.title,
          description: s.node.description,
          goal: s.node.goal,
          goalDollars: await toDollars(s.node.goal),
        }))
      );
      setStages(x);
    };
    _stages();
  }, [data.project.stages]);

  const [showProjectInDollars, setShowProjectInDollars] = React.useState(true);

  const [shownStageNewName, setShownStageNewName] = React.useState("");
  const [shownStageNewDescription, setShownStageNewDescription] =
    React.useState("");
  const [shownStageNewGoal, setShownStageNewGoal] = React.useState(0);
  const [shownStageNewGoalDollars, setShownStageNewGoalDollars] =
    React.useState(0);
  React.useEffect(() => {
    async function dollars() {
      let dollars = await toDollars(shownStageNewGoal);
      setShownStageNewGoalDollars(dollars);
    }
    dollars();
  }, [shownStageNewGoal]);

  const addStage = () => {
    const newStages = [...stages, { title: "", description: "", goal: 0 }];
    setStages(newStages);
  };

  const [shownStage, setShownStage] = React.useState(0);
  const [stageOverlay, setStageOverlay] = React.useState(false);
  const [finishOverlay, setFinishOverlay] = React.useState(false);
  const [errors, setErrors] = React.useState("");

  const [goalDollars, setGoalDollars] = React.useState(0);
  const [amountCollectedDollars, setAmountCollectedDollars] = React.useState(0);
  React.useEffect(() => {
    async function dollars() {
      let _goalDollars = await toDollars(data.project.goal);
      let _amountCollectedDollars = await toDollars(
        data.project.amountCollected
      );
      setGoalDollars(_goalDollars);
      setAmountCollectedDollars(_amountCollectedDollars);
    }
    dollars();
  }, [data.project.goal, data.project.amountCollected]);

  const [currentStage, setCurrentStage] = React.useState(-1);
  React.useEffect(() => {
    let r = -1;
    let accum = 0;
    for (let s of stages) {
      if (data.project.amountCollected >= accum + s.goal) {
        accum += s.goal;
        r = stages.indexOf(s);
      }
    }
    setCurrentStage(r + 1);
  }, [data.project.amountCollected]);

  const drawerRef = React.createRef();

  if (data.project.currentState === "CREATED" && !created) return null;
  return (
    <>
      <Div row justifyContent="space-between">
        <TouchableOpacity
          onPress={() => {
            if (drawerRef.current) {
              drawerRef.current.open();
            }
          }}
        >
          {data.project.currentState === "CREATED" && created ? (
            <Div
              p="lg"
              mx="lg"
              row
              rounded="md"
              borderColor="fruxgreen"
              borderWidth={1}
            >
              <Icon
                color="fruxgreen"
                name="add"
                mr="md"
                fontSize="lg"
                fontFamily="Ionicons"
              />
              <Text fontSize="lg" color="fruxgreen">
                Project Stages
              </Text>
            </Div>
          ) : (
            <Div>
              {data.project.currentState === "FUNDING" ? (
                <>
                  <Div row>
                    <Text fontSize="lg" fontWeight="bold">
                      Stage #{currentStage}:{"  "}
                    </Text>
                    <Text fontSize="lg" textAlign="right">
                      {stages[currentStage]?.title}
                    </Text>
                  </Div>
                  <MultiSlider
                    selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                    enabledOne={false}
                    values={[
                      (data.project.amountCollected / data.project.goal) * 10,
                    ]}
                    sliderLength={150}
                  />
                </>
              ) : (
                <>
                  <Div
                    p="lg"
                    mx="lg"
                    row
                    rounded="md"
                    borderColor="fruxgreen"
                    borderWidth={1}
                  >
                    <Image
                      w={25}
                      h={25}
                      source={require("../assets/images/stage.png")}
                    />
                    <Text fontSize="lg" color="fruxgreen">
                      Project Stages
                    </Text>
                  </Div>
                </>
              )}
            </Div>
          )}
        </TouchableOpacity>

        {data.project.currentState === "CREATED" && created ? (
          <TouchableOpacity
            onPress={() => {
              setFinishOverlay(true);
            }}
          >
            <Div
              p="lg"
              mx="lg"
              row
              rounded="md"
              borderColor="fruxgreen"
              borderWidth={1}
            >
              <Text fontSize="lg" color="fruxgreen">
                Finish Set Up
              </Text>
              <Icon
                ml="md"
                color="fruxgreen"
                name="checkmark"
                fontSize="lg"
                fontFamily="Ionicons"
              />
            </Div>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                setShowProjectInDollars(!showProjectInDollars);
              }}
            >
              <Div>
                <Text
                  mx="md"
                  fontSize="5xl"
                  color="fruxgreen"
                  textAlign="right"
                >
                  {showProjectInDollars
                    ? `\$${amountCollectedDollars}`
                    : `${data.project.amountCollected} ETH`}
                </Text>
                {data.project.currentState === "FUNDING" && (
                  <Text
                    mx="md"
                    lineHeight={20}
                    fontSize="xl"
                    fontFamily="latinmodernroman-bold"
                    color="gray600"
                  >
                    Out of{" "}
                    {showProjectInDollars
                      ? `\$${goalDollars}`
                      : `${data.project.goal} ETH`}
                  </Text>
                )}
              </Div>
            </TouchableOpacity>
          </>
        )}
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
                        ? i <= currentStage
                          ? i < currentStage
                            ? require("../assets/images/stage.png")
                            : require("../assets/images/current-stage.png")
                          : require("../assets/images/no-stage.png")
                        : require("../assets/images/no-stage.png")
                    }
                  />
                  <Text mx="md" fontWeight="bold">
                    {s.title || `Stage #${i}`}
                  </Text>
                </Div>

                <Text mx="md" fontSize="2xl" color="fruxgreen">
                  {showProjectInDollars
                    ? `\$${s.goalDollars || 0}`
                    : `${s.goal} ETH`}
                </Text>
              </Div>
            </TouchableOpacity>
          ))}
          {data.project.currentState === "CREATED" &&
            created &&
            (!stages.length || !!stages[stages.length - 1]?.title) && (
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

      <Overlay visible={stageOverlay} key={shownStage}>
        <Div row justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Stage #{shownStage}
            {!!stages[shownStage]?.title
              ? `: ${stages[shownStage]?.title}`
              : ""}
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
            {!!stages[shownStage]?.goal && (
              <Text fontSize="3xl" fontWeight="bold" color="fruxgreen">
                ${stages[shownStage]?.goal}
              </Text>
            )}

            {/* {data.project.currentState === "FUNDING" && shownStage < currentStage ? (
              <Text fontSize="3xl" fontWeight="bold" color="fruxgreen">
                ${stages[shownStage]?.goal}
              </Text>
            ) : (
              <>
                <Text fontSize="3xl" fontWeight="bold" color="fruxgreen">
                  $
                  {stages.reduce((acc, v, i) => {
                    if (i < shownStage) {
                      acc -= v.goal;
                    }
                    return acc;
                  }, amountCollectedDollars) > 0
                    ? stages.reduce((acc, v, i) => {
                        if (i < shownStage) {
                          acc -= v.goal;
                        }
                        return acc;
                      }, amountCollectedDollars)
                    : 0}
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="gray600">
                  /${stages[shownStage]?.goal}
                </Text>
              </>
            )} */}
          </Text>
        </Div>

        <Div my="md">
          {!stages[shownStage]?.title && (
            <>
              <Text>
                This are your project stages, where you determine how much money
                you need for each partial goal of your project.
              </Text>
              <Text color="fruxred">
                Keep in mind, you{" "}
                <Text color="fruxred" fontWeight="bold">
                  won't{" "}
                </Text>
                be able to change this data later.
              </Text>
            </>
          )}
        </Div>

        <Div>
          {!!stages[shownStage]?.description && (
            <Text maxW="80%" color="gray700" fontSize="lg">
              {stages[shownStage]?.description}
            </Text>
          )}
        </Div>

        <Div>
          {!stages[shownStage]?.title && (
            <Div>
              <Input
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
                mt="md"
                value={shownStageNewDescription}
                onChangeText={setShownStageNewDescription}
                placeholder="Description"
              />
            </Div>
          )}

          {!stages[shownStage]?.goal && (
            <Div m="md">
              <Div row>
                <Text fontSize="3xl" color="fruxgreen">
                  {""}
                  {shownStageNewGoal}
                  {" ETH"}
                </Text>
                <Text fontSize="lg" color="gray600">
                  {"    "}($
                  {shownStageNewGoalDollars})
                </Text>
              </Div>
              <Div justifyContent="center" alignItems="center">
                <MultiSlider
                  selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                  markerStyle={{
                    backgroundColor: Colors.fruxgreen,
                  }}
                  values={[0]}
                  sliderLength={250}
                  onValuesChange={(v) => {
                    setShownStageNewGoal(v[0].toFixed(4));
                  }}
                  step={0.0001}
                  max={0.2}
                />
              </Div>
            </Div>
          )}
          {errors !== "" && (
            <Text color="fruxred" textAlign="right" m="md">
              {errors}
            </Text>
          )}
        </Div>

        <Div row alignSelf="flex-end">
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

      <FruxOverlay
        visible={finishOverlay}
        title="Finish Set Up"
        body={
          <>
            <Text>
              By finishing this setup you'll enter the{" "}
              <Text color="fruxgreen">Funding</Text> phase of your project,
              where people will be available to add funds to your project.
            </Text>
            <Text color="fruxred">
              Keep in mind, you{" "}
              <Text color="fruxred" fontWeight="bold">
                won't
              </Text>{" "}
              be able to change neither the project stages, nor the title after
              this!
            </Text>
          </>
        }
        fail={{
          title: "Cancel",
          action: () => {
            setFinishOverlay(false);
          },
        }}
        success={{
          title: "Confirm",
          action: () => {
            mutations.mutateSeerProject({
              variables: {
                idProject: data.project.dbId,
              },
            });
            setFinishOverlay(false);
          },
        }}
      />
    </>
  );
}

Component.fragments = {
  stage: gql`
    fragment ProjectProgress_stage on ProjectStage {
      id
      title
      description
      goal
    }
  `,
  project: gql`
    fragment ProjectProgress_project on Project {
      id
      amountCollected
      goal
      currentState
      stages {
        edges {
          node {
            id
            title
            description
            goal
          }
        }
      }
    }
  `,
};
