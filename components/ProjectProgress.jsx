import { gql } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Drawer, Image, Overlay, Text } from "react-native-magnus";
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

  const [shownStage, setShownStage] = React.useState(0);
  const [stageOverlay, setStageOverlay] = React.useState(false);

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
                  Stage 3:{" "}
                </Text>
                StageName
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
                {data.project.amountCollected}
              </Text>
              <Text
                mx="md"
                lineHeight={20}
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                Out of ${data.project.goal}
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
            <Div row>
              {false && (
                <Text>Si complete el goal, mostrarlo todo en verde</Text>
              )}
              <Text fontSize="3xl" fontWeight="bold" color="fruxgreen">
                {/* // Esto deberia ser lo que ya se pago $ */}
                {stages[shownStage]?.goal}
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="gray600">
                /${stages[shownStage]?.goal}
              </Text>
            </Div>
          )}
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
