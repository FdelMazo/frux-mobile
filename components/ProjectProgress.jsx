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
          dbId: s.node.dbId,
          fundsReleased: s.node.fundsReleased || undefined,
          title: s.node.title,
          description: s.node.description,
          goal: s.node.goal,
          goalDollars: await toDollars(s.node.goal),
          creationDate: s.node.creationDate,
        }))
      );
      x.sort(
        (s1, s2) => new Date(s1?.creationDate) - new Date(s2?.creationDate)
      );
      setStages(x);
    };
    _stages();
  }, [data.project.stages]);

  const supervisedByUser = React.useMemo(() => {
    if (!data.profile || !data.project.seer) return false;
    return data.project.seer.dbId === data.profile.dbId;
  }, [data.project.seer, data.profile]);

  const [showProjectInDollars, setShowProjectInDollars] = React.useState(true);

  const [shownStageNewName, setShownStageNewName] = React.useState("");
  const [shownStageNewDescription, setShownStageNewDescription] =
    React.useState("");
  const [shownStageNewGoal, setShownStageNewGoal] = React.useState(0);
  const [shownStageNewGoalDollars, setShownStageNewGoalDollars] =
    React.useState(0);

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
        r += 1;
      } else break;
    }
    setCurrentStage(r + 1);
  }, [stages, data.project.amountCollected]);

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
                  <Div maxW="70%" row>
                    <Text fontSize="lg" fontWeight="bold">
                      Stage #{currentStage}:{"  "}
                    </Text>
                    <Text fontSize="lg">{stages[currentStage]?.title}</Text>
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
                      : `${data.project.goal.toFixed(4)} ETH`}
                  </Text>
                )}
              </Div>
            </TouchableOpacity>
          </>
        )}
      </Div>

      <Drawer ref={drawerRef}>
        <Div my="xl" mx="lg">
          {stages.map((s, i) => {
            let img = undefined;
            if (data.project.currentState === "CREATED") {
              if (!s.title) img = require("../assets/images/no-stage.png");
              else img = require("../assets/images/stage.png");
            }
            if (data.project.currentState === "FUNDING") {
              if (i < currentStage) img = require("../assets/images/stage.png");
              else if (i === currentStage)
                img = require("../assets/images/current-stage.png");
              else img = require("../assets/images/no-stage.png");
            }
            if (data.project.currentState === "IN_PROGRESS") {
              if (s.fundsReleased) img = require("../assets/images/seer.png");
              else img = require("../assets/images/no-seer.png");
            }
            if (data.project.currentState === "COMPLETE") {
              img = require("../assets/images/stage.png");
            }

            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setShownStage(i);
                  setStageOverlay(true);
                }}
              >
                <Div row justifyContent="space-between" my="md">
                  <Div maxW="40%" row>
                    <Image w={35} h={35} source={img} />
                    <Text fontSize="sm" mx="md" fontWeight="bold">
                      {s.title || `Stage #${i}`}
                    </Text>
                  </Div>

                  <Text mx="md" fontSize="xl" color="fruxgreen">
                    {showProjectInDollars
                      ? `\$${s.goalDollars || 0}`
                      : `${s.goal} ETH`}
                  </Text>
                </Div>
              </TouchableOpacity>
            );
          })}
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
          <Text maxW="45%" fontSize="xl" fontWeight="bold">
            Stage #{shownStage}
            {!!stages[shownStage]?.title
              ? `: ${stages[shownStage]?.title}`
              : ""}
          </Text>
          <Div row maxW="50%">
            {data.project.currentState === "FUNDING" && (
              <>
                {shownStage < currentStage ? (
                  <>
                    <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
                      {stages[shownStage]?.goal} ETH
                    </Text>
                  </>
                ) : (
                  <>
                    {shownStage === currentStage ? (
                      <>
                        <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
                          {stages.reduce((acc, v, i) => {
                            if (i < shownStage) {
                              acc -= v.goal;
                            }
                            return acc;
                          }, data.project.amountCollected)}
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color="gray600">
                          /{stages[shownStage]?.goal} ETH
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text fontSize="xl" fontWeight="bold" color="gray600">
                          {stages[shownStage]?.goal} ETH
                        </Text>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {!!stages[shownStage]?.goal &&
              data.project.currentState !== "FUNDING" && (
                <Text fontSize="xl" color={"fruxgreen"}>
                  {stages[shownStage]?.goal} ETH
                </Text>
              )}
          </Div>
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

        {supervisedByUser && data.project.currentState === "IN_PROGRESS" && (
          <Div my="sm">
            <Text fontSize="sm">
              {stages[shownStage]?.fundsReleased
                ? "You already released the funds for this stage. The creator thanks you a lot! (probably)"
                : "As the project supervisor, you get to decide when this project gets the funds to start developing a new stage. Keep in mind that releasing the funds for a stage also releases the funds for every previous stage."}
            </Text>
          </Div>
        )}

        {!stages[shownStage]?.title && (
          <Div>
            <Input
              mt="md"
              maxLength={35}
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
              multiline
              maxLength={124}
              numberOfLines={3}
              textAlignVertical="top"
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
                  setShownStageNewGoal(parseFloat(v[0].toFixed(4)));
                }}
                onValuesChangeFinish={async () => {
                  let dollars = await toDollars(shownStageNewGoal);
                  setShownStageNewGoalDollars(dollars);
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
          {supervisedByUser &&
            !stages[shownStage]?.fundsReleased &&
            data.project.currentState === "IN_PROGRESS" && (
              <Button
                onPress={() => {
                  mutations.mutateCompleteStage({
                    variables: {
                      idProject: data.project.dbId,
                      idStage: shownStage + 1,
                    },
                  });
                  setStageOverlay(false);
                }}
                mx="sm"
                p="md"
                bg="fruxgreen"
                color="white"
              >
                Release Funds
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
      fundsReleased
      description
      creationDate
      goal
    }
  `,
  project: gql`
    fragment ProjectProgress_project on Project {
      id
      amountCollected
      goal
      currentState
      seer {
        id
        dbId
      }
      stages {
        edges {
          node {
            id
            fundsReleased
            title
            creationDate
            description
            goal
          }
        }
      }
    }
  `,
  user: gql`
    fragment ProjectProgress_user on User {
      id
      dbId
    }
  `,
};
