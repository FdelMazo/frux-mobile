import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { StackNavigationProp } from "@react-navigation/stack";
import gql from "graphql-tag";
import * as React from "react";
import { MutationFunction, useMutation, useQuery } from "react-apollo";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  Div,
  Dropdown,
  Fab,
  Icon,
  Text,
  Overlay,
} from "react-native-magnus";
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

function Screen({
  data,
  navigation,
  mutations,
}: {
  data: Data;
  navigation: Navigation;
  mutations: Record<string, MutationFunction<any>>;
}) {
  const [sponsorOverlay, setSponsorOverlay] = React.useState(false);
  const [toSponsor, setToSponsor] = React.useState(0.05 * data.project.goal);
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
                  values={[
                    (data.project.amountCollected / data.project.goal) * 10,
                  ]}
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

      <Fab bg="fruxgreen" h={40} w={40} p={10} fontSize="2xl">
        <Button
          p={0}
          bg={undefined}
          underlayColor="gray"
          alignSelf="flex-end"
          onPress={() => setSponsorOverlay(true)}
        >
          <Div rounded="sm" bg="white" p="sm">
            <Text fontSize="md">Seed</Text>
          </Div>
          <Icon
            name="wallet"
            color="fruxgreen"
            fontFamily="AntDesign"
            h={45}
            w={45}
            fontSize="xl"
            rounded="circle"
            ml="lg"
            bg="white"
          />
        </Button>
        <Button p={0} bg={undefined} underlayColor="gray" alignSelf="flex-end">
          <Div rounded="sm" bg="white" p="sm">
            <Text fontSize="md">Fav</Text>
          </Div>
          <Icon
            name="hearto"
            color="fruxgreen"
            fontSize="xl"
            fontFamily="AntDesign"
            h={45}
            w={45}
            rounded="circle"
            ml="lg"
            bg="white"
          />
        </Button>
      </Fab>

      <Overlay visible={sponsorOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          How much do you want to chip in?
        </Text>
        <Div alignSelf="center">
          <MultiSlider
            trackStyle={{ backgroundColor: "#bdc3c7" }}
            selectedStyle={{ backgroundColor: "#90B44B" }}
            enabledOne={false}
            markerStyle={{
              borderRadius: 0,
              width: 7,
              backgroundColor: "#90B44B",
            }}
            values={[
              Math.floor(
                (data.project.amountCollected / data.project.goal) * 10
              ),
              Math.floor(
                ((data.project.amountCollected + toSponsor) /
                  data.project.goal) *
                  10
              ),
            ]}
            onValuesChange={(v) => {
              setToSponsor(
                Math.floor(
                  v[1] * 0.1 * data.project.goal - data.project.amountCollected
                )
              );
            }}
            step={0.5}
            sliderLength={250}
          />
        </Div>
        <Div>
          <Div row>
            <Text mx="md" fontSize="5xl" color="gray600">
              {"$"}
              {data.project.amountCollected}
            </Text>
            <Text mx="md" fontSize="5xl" color="fruxgreen">
              {"+ $"}
              {toSponsor}
            </Text>
          </Div>

          <Text
            mx="md"
            lineHeight={20}
            fontSize="xl"
            fontFamily="latinmodernroman-bold"
            color="gray600"
          >
            With a goal of ${data.project.goal}
          </Text>
        </Div>
        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            fontSize="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setSponsorOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              mutations.invest({
                variables: {
                  investedAmount: toSponsor,
                  idProject: data.project.dbId,
                },
              });
              setSponsorOverlay(false);
            }}
            mx="sm"
            fontSize="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Seed
          </Button>
        </Div>
      </Overlay>
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

  const investMutation = gql`
    mutation Invest($idProject: Int!, $investedAmount: Float!) {
      mutateInvestProject(
        idProject: $idProject
        investedAmount: $investedAmount
      ) {
        id
      }
    }
  `;
  const [invest] = useMutation(investMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.route.params.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return (
    <Screen data={data} navigation={props.navigation} mutations={{ invest }} />
  );
}
