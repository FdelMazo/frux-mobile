import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Collapse, Div, Dropdown, Icon, Text } from "react-native-magnus";
import ProjectHeader from "../components/ProjectHeader";
import { MainView, ScrollView, View } from "../components/Themed";
import UserContainer from "../components/UserContainer";

function Project({ data }) {
  const dropdownRef = React.createRef();
  return (
    <View>
      <ProjectHeader
        dbId={1}
        // topic={data.topic}
        // img="https://static2.cbrimages.com/wordpress/wp-content/uploads/2021/01/batman-1-1940-header.jpg"
      />

      <ScrollView>
        <MainView>
          <Div w="90%" mt={15}>
            <Div flexDir="row">
              <UserContainer dbId={7} />

              <Div>
                <Div row>
                  <Text
                    ml={15}
                    fontSize="5xl"
                    fontFamily="latinmodernroman-bold"
                    fontWeight="bold"
                  >
                    {/* {props.route.params.name} */}
                  </Text>
                  <Div
                    ml={5}
                    bg="pink500"
                    rounded="md"
                    px="sm"
                    alignSelf="center"
                  >
                    <Text color="white" fontSize="sm">
                      In Progress
                    </Text>
                  </Div>
                </Div>
                <Text
                  mx={15}
                  lineHeight={20}
                  fontSize="xl"
                  fontFamily="latinmodernroman-bold"
                  color="gray600"
                >
                  Restoration of old 1940's Batman Comics
                </Text>
                <Text
                  mx={15}
                  fontSize="md"
                  fontFamily="latinmodernroman-bold"
                  color="blue600"
                >
                  #batman #comics
                </Text>
              </Div>
            </Div>
          </Div>
          <Div row w="90%" mt={25} justifyContent="space-between">
            <Div>
              <Text mx={15} fontSize="5xl" color="fruxgreen">
                $1000
              </Text>
              <Text
                mx={15}
                lineHeight={20}
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                Out of $500000
              </Text>
            </Div>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => dropdownRef.current.open()}
            >
              <Div>
                <Div alignSelf="flex-end">
                  <Text>
                    <Text fontWeight="bold">Stage 3:</Text> Board
                  </Text>
                </Div>
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
                  step={1}
                  allowOverlap={false}
                  snapped={true}
                />
              </Div>
            </TouchableHighlight>
          </Div>
          <Div w="90%" row justifyContent="center">
            <Collapse w="50%" m={5}>
              <Collapse.Header
                active
                color="gray900"
                fontSize="md"
                p="xl"
                px="none"
                prefix={<Icon name="wallet" mr="md" color="gray400" />}
              >
                13 Sponsors
              </Collapse.Header>
              <Collapse.Body pb="xl">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis
                  laudantium, odio nulla recusandae labore pariatur in, vitae
                  corporis delectus repellendus.
                </Text>
              </Collapse.Body>
            </Collapse>
            <Collapse w="50%" m={5}>
              <Collapse.Header
                active
                color="gray900"
                fontSize="md"
                p="xl"
                px="none"
                prefix={<Icon name="wallet" mr="md" color="gray400" />}
              >
                35 Watchers
              </Collapse.Header>
              <Collapse.Body pb="xl">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis
                  laudantium, odio nulla recusandae labore pariatur in, vitae
                  corporis delectus repellendus.
                </Text>
              </Collapse.Body>
            </Collapse>
          </Div>
        </MainView>
      </ScrollView>

      <Dropdown
        ref={dropdownRef}
        title={
          <Div alignSelf="center" mb="sm">
            <Text fontSize="2xl" fontWeight="bold">
              Stages
            </Text>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
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

export default function RenderProject(props) {
  // const query = gql`
  //   query User($dbId: Int!) {
  //     user(dbId: $dbId) {
  //       id
  //       name
  //       email
  //     }
  //   }
  // `;

  // const updateNameMutation = gql`
  //   mutation mutateUpdateUser($name: String) {
  //     mutateUpdateUser(name: $name) {
  //       id
  //       name
  //     }
  //   }
  // `;
  // const [mutateName] = useMutation(updateNameMutation);

  // const { loading, error, data } = useQuery(query, {
  //   variables: { dbId: props.data.profile.dbId },
  // });

  // if (loading) return null;
  return (
    <Project
      // create={props.create}
      data={{ topic: "Books" }}
      // mutations={{ mutateName }}
    />
  );
}
