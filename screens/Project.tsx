import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { StackNavigationProp } from "@react-navigation/stack";
import gql from "graphql-tag";
import * as React from "react";
import { useQuery } from "react-apollo";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Dropdown, Text } from "react-native-magnus";
import ProjectHeader from "../components/ProjectHeader";
import { MainView, ScrollView, View } from "../components/Themed";
import UserContainer from "../components/UserContainer";
import { StageColor } from "../constants/Constants";

type Data = {
  project: {
    dbId: number;
    userId: number;
    name: string;
    currentState: string;
    description: string;
    hashtags: string[];
    amountCollected: number;
    goal: number;
  };
};
type Navigation = StackNavigationProp<any>;

function Screen({ data, navigation }: { data: Data; navigation: Navigation }) {
  const dropdownRef = React.createRef();
  return (
    <View>
      <ProjectHeader dbId={data.project.dbId} navigation={navigation} />

      <ScrollView>
        <MainView>
          <Div w="60%" mt="lg" alignItems="center">
            <Div row>
              <UserContainer
                navigation={navigation}
                dbId={data.project.userId}
              />

              <Div>
                <Div row>
                  <Text
                    ml="lg"
                    fontSize="4xl"
                    fontFamily="latinmodernroman-bold"
                    fontWeight="bold"
                  >
                    {data.project.name}
                  </Text>

                  <Div
                    alignSelf="flex-start"
                    ml="xs"
                    bg={StageColor[data.project.currentState]}
                    rounded="md"
                    px="xs"
                  >
                    <Text color="white" fontSize="xs">
                      {data.project.currentState}
                    </Text>
                  </Div>
                </Div>
                <Text
                  mx="lg"
                  lineHeight={20}
                  fontSize="xl"
                  fontFamily="latinmodernroman-bold"
                  color="gray600"
                >
                  {data.project.description}
                </Text>
                {data.project.hashtags?.map((h) => (
                  <Text
                    mx="lg"
                    fontSize="md"
                    fontFamily="latinmodernroman-bold"
                    color="blue600"
                  >
                    {" #"}
                    {h}
                  </Text>
                ))}
              </Div>
            </Div>
          </Div>
          <Div row w="90%" mt="xl" justifyContent="space-between">
            <TouchableOpacity
              // @ts-expect-error
              onPress={() => dropdownRef.current.open()}
            >
              <Div>
                <Text fontSize="lg">
                  <Text fontSize="lg" fontWeight="bold">
                    Stage 3:{" "}
                  </Text>
                  Detective Comics #33
                </Text>
                <MultiSlider
                  trackStyle={{ backgroundColor: "#bdc3c7" }}
                  selectedStyle={{ backgroundColor: "#90B44B" }}
                  touchDimensions={{
                    height: 0,
                    width: 0,
                    borderRadius: 0,
                    slipDisplacement: 0,
                  }}
                  markerStyle={{
                    borderRadius: 0,
                    width: 7,
                    backgroundColor: "#90B44B",
                  }}
                  values={[5]}
                  sliderLength={150}
                />
              </Div>
            </TouchableOpacity>
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
        </MainView>
      </ScrollView>

      <Dropdown
        // @ts-expect-error
        ref={dropdownRef}
        title={
          <Div alignSelf="center" mb="sm">
            <Text fontSize="2xl" fontWeight="bold">
              {data.project.name} - Stages
            </Text>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        {/* @ts-expect-error */}
        <Dropdown.Option py="lg" px="xl">
          <Text fontSize="xl" fontWeight="bold">
            Stage 1:{" "}
          </Text>
          <Text fontSize="xl">Detective Comics #33</Text>
          <Div position="absolute" right={0}>
            <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
              $700
            </Text>
          </Div>
        </Dropdown.Option>
      </Dropdown>
    </View>
  );
}

type Props = {
  navigation: Navigation;
  route: { params: { dbId: number } };
};

export default function Render(props: Props) {
  const query = gql`
    query Project($dbId: Int!) {
      project(dbId: $dbId) {
        dbId
        name
        userId
        name
        currentState
        description
        amountCollected
        goal
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.route.params.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Screen data={data} navigation={props.navigation} />;
}
