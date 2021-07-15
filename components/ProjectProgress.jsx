import { gql } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Drawer, Image, Overlay, Text } from "react-native-magnus";
import Colors from "../constants/Colors";
import { toDollars } from "../services/helpers";

export default function Component({ data, mutations, created }) {
  const [stages, setStages] = React.useState([]);
  React.useEffect(() => {
    const _stages = async () => {
      const x = await Promise.all(
        data.project.stages.edges.map(async (s) => ({
          title: s.node.title,
          description: s.node.description,
          goal: await toDollars(s.node.goal),
        }))
      );
      setStages(x);
    };
    _stages();
  }, [data.project.stages]);

  const [shownStage, setShownStage] = React.useState(0);
  const [stageOverlay, setStageOverlay] = React.useState(false);
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
      if (amountCollectedDollars >= accum + s.goal) {
        accum += s.goal;
        r = stages.indexOf(s);
      }
    }
    setCurrentStage(r + 1);
  }, [data.project.amountCollected]);

  const drawerRef = React.createRef();

  if (data.project.currentState === "CREATED") return null;
  return (
    <>
      <Div my="lg" w="90%">
        <TouchableOpacity
          onPress={() => {
            if (drawerRef.current) {
              drawerRef.current.open();
            }
          }}
        >
          <Div row justifyContent="space-between">
            <Div>
              <Text fontSize="lg">
                <Text fontSize="lg" fontWeight="bold">
                  Stage #{currentStage}:{" "}
                </Text>
                {stages[currentStage]?.title}
              </Text>
              <MultiSlider
                selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                enabledOne={false}
                values={[
                  (data.project.amountCollected / data.project.goal) * 10,
                ]}
                sliderLength={150}
              />
            </Div>
            <Div>
              <Text mx="md" fontSize="5xl" color="fruxgreen" textAlign="right">
                {"$"}
                {amountCollectedDollars}
              </Text>
              <Text
                mx="md"
                lineHeight={20}
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                Out of ${goalDollars}
              </Text>
            </Div>
          </Div>
        </TouchableOpacity>
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
                      i <= currentStage
                        ? i < currentStage
                          ? require("../assets/images/stage.png")
                          : require("../assets/images/current-stage.png")
                        : require("../assets/images/no-stage.png")
                    }
                  />
                  <Text mx="md" w="55%" fontWeight="bold">
                    {s.title}
                  </Text>
                </Div>

                <Text mx="md" fontSize="2xl" color="fruxgreen">
                  ${s.goal}
                </Text>
              </Div>
            </TouchableOpacity>
          ))}
        </Div>
      </Drawer>

      <Overlay visible={stageOverlay} key={shownStage}>
        <Div row justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Stage #{shownStage}: {stages[shownStage]?.title}
          </Text>
          <Div row>
            {shownStage < currentStage ? (
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
            )}
          </Div>
        </Div>

        {!!stages[shownStage]?.description && (
          <Text w="80%" color="gray700" fontSize="lg">
            {stages[shownStage]?.description}
          </Text>
        )}

        <Div row alignSelf="flex-end" my="md">
          <Button
            onPress={() => {
              setStageOverlay(false);
            }}
            mx="sm"
            p="md"
            borderWidth={1}
            borderColor="fruxgreen"
            bg={undefined}
            color="fruxgreen"
          >
            {!!stages[shownStage]?.title && "Close"}
          </Button>
        </Div>
      </Overlay>
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectProgress on Project {
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
