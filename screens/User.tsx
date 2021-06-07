import { StackNavigationProp } from "@react-navigation/stack";
import * as Location from "expo-location";
import gql from "graphql-tag";
import * as React from "react";
import { MutationFunction, useMutation, useQuery } from "react-apollo";
import {
  Button,
  Div,
  Dropdown,
  Icon,
  Input,
  Overlay,
  Text,
} from "react-native-magnus";
import MapView, { Marker } from "react-native-maps";
import { resetPassword } from "../auth";
import Header from "../components/Header";
import { MainView, ScrollView, View } from "../components/Themed";
import { Topics, UserIcons } from "../constants/Constants";
import TopicContainer from "../components/TopicContainer";
import ProjectContainer from "../components/ProjectContainer";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

type Data = {
  user: {
    name: string;
    email: string;
    imagePath: string;
    latitude: string;
    longitude: string;
    projectInvestments: {
      edges: {
        node: {
          projectId: number;
          investedAmount: number;
        };
      }[];
    };
  };
};
type Navigation = StackNavigationProp<any>;

function Screen({
  data,
  navigation,
  mutateEntity,
  isViewer,
}: {
  data: Data;
  navigation: Navigation;
  mutateEntity: MutationFunction<any>;
  isViewer: boolean;
}) {
  const defaultName = data.user.name || data.user.email.split("@")[0];
  const [name, setName] = React.useState(defaultName);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  const [location, setLocation] = React.useState({
    latitude: data.user.latitude,
    longitude: data.user.longitude,
  });
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [locationOverlay, setLocationOverlay] = React.useState(false);
  const useCurrentLocation = async () => {
    await Location.requestForegroundPermissionsAsync();
    const userLocation = await Location.getCurrentPositionAsync();
    // @ts-expect-error
    setLocation(userLocation.coords);
  };

  const [myTopics, setMyTopics] = React.useState<string[]>([]);
  const [myTopicsOverlay, setMyTopicsOverlay] = React.useState(false);

  const toggleTopic = (t: string) => {
    let newMyTopics = [];
    if (myTopics.includes(t)) newMyTopics = myTopics.filter((to) => t !== to);
    else newMyTopics = [...myTopics, t];
    setMyTopics(newMyTopics);
  };

  return (
    <View>
      <Header
        onPress={
          isViewer
            ? () => {
                // @ts-expect-error
                dropdownRef.current.open();
              }
            : undefined
        }
        navigation={navigation}
        title={defaultName}
        icon={data.user.imagePath || "seed"}
      />

      <ScrollView>
        <MainView>
          <Div w="90%" mt="xl">
            {myTopics.length ? (
              <TouchableOpacity onPress={() => setMyTopicsOverlay(true)}>
                <>
                  <Div alignSelf="flex-start">
                    <Text fontSize="xl" fontWeight="bold">
                      {isViewer ? "My Topics" : "Favourite Topics"}
                    </Text>
                  </Div>
                  <Div row my="md" flexWrap="wrap" justifyContent="center">
                    {myTopics.map((t) => (
                      <TopicContainer
                        navigation={navigation}
                        showName={true}
                        name={t}
                      />
                    ))}
                  </Div>
                </>
              </TouchableOpacity>
            ) : (
              <>
                {isViewer && (
                  <Div row alignItems="center">
                    <TopicContainer active showName={false} name="Other" />
                    <Button
                      bg="white"
                      fontWeight="bold"
                      color="fruxgreen"
                      alignSelf="center"
                      onPress={() => {
                        setMyTopicsOverlay(true);
                      }}
                    >
                      Choose Your Favourite Topics
                    </Button>
                  </Div>
                )}
              </>
            )}
          </Div>

          <Div w="90%" mt="xl">
            {data.user.projectInvestments.edges.length !== 0 && (
              <>
                <Text fontSize="xl" fontWeight="bold">
                  Seeding
                </Text>
                <FlatList
                  horizontal
                  data={data.user.projectInvestments.edges}
                  renderItem={({ item }) => (
                    <ProjectContainer
                      navigation={navigation}
                      dbId={item.node.projectId}
                      seeding={item.node.investedAmount}
                    />
                  )}
                />
              </>
            )}
          </Div>
        </MainView>
      </ScrollView>

      <Dropdown
        // @ts-expect-error
        ref={dropdownRef}
        title={
          <Div alignSelf="center">
            <Div row justifyContent="space-between">
              <Text mb="sm" fontSize="sm">
                {data.user.email}
              </Text>
              <Text
                mb="sm"
                onPress={() => {
                  if (emailSent) return;
                  resetPassword(data.user.email).then(() => setEmailSent(true));
                }}
                color={emailSent ? "black" : "fruxgreen"}
                fontSize="sm"
              >
                {emailSent ? "Mail Sent!" : "Reset password"}
              </Text>
            </Div>
            <Input
              placeholder="Username"
              w="65%"
              focusBorderColor="blue700"
              value={name}
              onChangeText={setName}
              suffix={
                <>
                  {name !== defaultName && (
                    <Button
                      bg={undefined}
                      p={0}
                      onPress={() => {
                        mutateEntity({
                          variables: {
                            name,
                          },
                        });
                      }}
                    >
                      <Icon name="check" color="gray900" fontFamily="Feather" />
                    </Button>
                  )}
                </>
              }
            />
            <Div row justifyContent="flex-end">
              <Button
                py="sm"
                px={0}
                bg={undefined}
                color="blue500"
                underlayColor="blue100"
                fontSize="sm"
                onPress={() => {
                  setLocationOverlay(true);
                }}
                suffix={
                  <Icon
                    name="location-outline"
                    fontFamily="Ionicons"
                    fontSize="xl"
                    color="blue600"
                  />
                }
              >
                {location.longitude ? "Change Location" : "Set Location"}
              </Button>
            </Div>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        {/*@ts-expect-error*/}
        <Dropdown.Option justifyContent="space-evenly">
          {UserIcons.map((item) => (
            <Button
              bg={undefined}
              underlayColor="fruxgreen"
              onPress={() => {
                mutateEntity({ variables: { imagePath: item.name } });
              }}
            >
              <Icon
                bg="fruxbrown"
                h={40}
                w={40}
                rounded="circle"
                name={item.name}
                color="fruxgreen"
                borderWidth={2}
                borderColor={
                  item.name === data.user.imagePath ? "fruxgreen" : "black"
                }
                fontSize="2xl"
                fontFamily={item.fontFamily}
              />
            </Button>
          ))}
        </Dropdown.Option>
      </Dropdown>

      <Overlay visible={locationOverlay}>
        <MapView
          initialRegion={{
            latitude: parseFloat(location.latitude) || -34.5723074,
            longitude: parseFloat(location.longitude) || -58.4346815,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          style={{ height: 400 }}
          showsUserLocation={true}
          // @ts-expect-error
          onLongPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >
          {location.latitude && (
            <Marker
              coordinate={{
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
              }}
            />
          )}
        </MapView>

        <Div my="md" row justifyContent="space-between">
          <Div alignSelf="center">
            <Button
              py={0}
              px={0}
              bg={undefined}
              color="gray800"
              fontSize="md"
              disabled={locationLoading}
              onPress={async () => {
                setLocationLoading(true);
                await useCurrentLocation();
                setLocationLoading(false);
              }}
              prefix={
                <Icon
                  name={locationLoading ? "spinner" : "location-outline"}
                  fontFamily={locationLoading ? "EvilIcons" : "Ionicons"}
                  fontSize="xl"
                  color="gray800"
                />
              }
            >
              Use My Location
            </Button>
          </Div>

          <Div row>
            <Button
              mx="sm"
              fontSize="sm"
              p="md"
              bg={undefined}
              borderWidth={1}
              borderColor="fruxgreen"
              color="fruxgreen"
              onPress={() => {
                setLocationOverlay(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                mutateEntity({
                  variables: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                });
                setLocationOverlay(false);
              }}
              mx="sm"
              fontSize="sm"
              p="md"
              bg="fruxgreen"
              color="white"
            >
              Save
            </Button>
          </Div>
        </Div>
      </Overlay>

      <Overlay visible={myTopicsOverlay}>
        <Div justifyContent="center" row flexWrap="wrap">
          {Topics.map((t) => (
            <Button
              bg={undefined}
              p={0}
              underlayColor="fruxgreen"
              onPress={() => {
                toggleTopic(t);
              }}
            >
              <TopicContainer
                active={myTopics.includes(t)}
                navigation={navigation}
                showName={true}
                name={t}
              />
            </Button>
          ))}
        </Div>

        <Div my="md" row justifyContent="space-between">
          <Div alignSelf="center"></Div>

          <Div row>
            <Button
              onPress={() => {
                mutateEntity({
                  variables: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                });
                setMyTopicsOverlay(false);
              }}
              mx="sm"
              fontSize="sm"
              p="md"
              bg="fruxgreen"
              color="white"
            >
              Done
            </Button>
          </Div>
        </Div>
      </Overlay>
    </View>
  );
}

type Props = {
  navigation: Navigation;
  dbId?: number;
  route?: { params: { dbId: number } };
};

export default function Render(props: Props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        dbId
        id
        name
        email
        imagePath
        latitude
        longitude
        projectInvestments {
          edges {
            node {
              projectId
              investedAmount
            }
          }
        }
      }
      profile {
        dbId
      }
    }
  `;

  const updateMutation = gql`
    mutation updateMutation(
      $name: String
      $imagePath: String
      $latitude: String
      $longitude: String
    ) {
      mutateUpdateUser(
        name: $name
        imagePath: $imagePath
        latitude: $latitude
        longitude: $longitude
      ) {
        id
        name
        imagePath
        latitude
        longitude
      }
    }
  `;
  const [mutateEntity] = useMutation(updateMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId || props.route?.params.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutateEntity={mutateEntity}
      isViewer={data.profile.dbId === data.user.dbId}
    />
  );
}
