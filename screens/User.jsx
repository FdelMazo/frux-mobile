import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  Div,
  Dropdown,
  Icon,
  Input,
  Overlay,
  Tag,
  Text,
} from "react-native-magnus";
import Header from "../components/Header";
import Loading from "../components/Loading";
import LocationOverlay from "../components/LocationOverlay";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, View } from "../components/Themed";
import TopicContainer from "../components/TopicContainer";
import { UserIcons } from "../constants/Constants";
import { toggler } from "../services/helpers";
import { resetPassword } from "../services/user";

function Screen({ data, navigation, mutateEntity }) {
  const defaultName = data.user.username || data.user.email.split("@")[0];
  const isViewer = data.profile.dbId === data.user.dbId;
  const [name, setName] = React.useState(defaultName);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  const [location, setLocation] = React.useState({
    latitude: data.user.latitude,
    longitude: data.user.longitude,
  });
  const [locationOverlay, setLocationOverlay] = React.useState(false);
  React.useEffect(() => {
    mutateEntity({
      variables: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  }, [location]);

  const [myTopics, setMyTopics] = React.useState(
    data.user.interests.edges.map((n) => n.name) || []
  );
  const [myTopicsOverlay, setMyTopicsOverlay] = React.useState(false);

  const [projectsShown, setProjectsShown] = React.useState(
    data.user.projectInvestments ||
      data.user.favoritedProjects ||
      data.user.createdProjects
  );

  return (
    <View>
      <Header
        onPress={
          isViewer
            ? () => {
                dropdownRef.current.open();
              }
            : undefined
        }
        navigation={navigation}
        title={defaultName}
        icon={data.user.imagePath || "seed"}
      />

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
                    <TopicContainer showName={true} name={t} key={t} />
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
          <Div row>
            {data.user.projectInvestments.edges.length !== 0 && (
              <TouchableOpacity
                onPress={() => setProjectsShown(data.user.projectInvestments)}
              >
                <Tag
                  fontSize="sm"
                  rounded="circle"
                  mx="sm"
                  bg={
                    projectsShown === data.user.projectInvestments
                      ? "blue400"
                      : "blue200"
                  }
                >
                  Seeding
                </Tag>
              </TouchableOpacity>
            )}

            {data.user.favoritedProjects.edges.length !== 0 && (
              <TouchableOpacity
                onPress={() => setProjectsShown(data.user.favoritedProjects)}
              >
                <Tag
                  mx="sm"
                  rounded="circle"
                  fontSize="sm"
                  bg={
                    projectsShown === data.user.favoritedProjects
                      ? "blue400"
                      : "blue200"
                  }
                >
                  Favourites
                </Tag>
              </TouchableOpacity>
            )}

            {data.user.createdProjects.edges.length !== 0 && (
              <TouchableOpacity
                onPress={() => setProjectsShown(data.user.createdProjects)}
              >
                <Tag
                  fontSize="sm"
                  rounded="circle"
                  mx="sm"
                  bg={
                    projectsShown === data.user.createdProjects
                      ? "blue400"
                      : "blue200"
                  }
                >
                  Created
                </Tag>
              </TouchableOpacity>
            )}
          </Div>

          <Div mt="sm">
            <FlatList
              horizontal
              keyExtractor={(item) => item.node.id}
              data={projectsShown.edges}
              renderItem={({ item }) => (
                <ProjectContainer
                  navigation={navigation}
                  dbId={item.node.projectId || item.node.dbId}
                />
              )}
            />
          </Div>
        </Div>
      </MainView>

      <Dropdown
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
                  {name !== defaultName && name !== "" && (
                    <Button
                      bg={undefined}
                      p={0}
                      onPress={() => {
                        mutateEntity({
                          variables: {
                            username: name,
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
        <Dropdown.Option justifyContent="space-evenly">
          {UserIcons.map((item) => (
            <Button
              key={item.name}
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

      <LocationOverlay
        location={location}
        setLocation={setLocation}
        visible={locationOverlay}
        setVisible={setLocationOverlay}
      />

      <Overlay visible={myTopicsOverlay}>
        <Div justifyContent="center" row flexWrap="wrap">
          {data.allCategories.edges.map((item) => (
            <Button
              key={item.node.name}
              bg={undefined}
              p={0}
              underlayColor="fruxgreen"
              onPress={() => {
                toggler(myTopics, setMyTopics, item.node.name);
              }}
            >
              <TopicContainer
                active={myTopics.includes(item.node.name)}
                showName={true}
                name={item.node.name}
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
                    interests: myTopics,
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

export default function Render(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        dbId
        id
        username
        email
        imagePath
        latitude
        longitude
        projectInvestments {
          edges {
            node {
              id
              projectId
            }
          }
        }
        favoritedProjects {
          edges {
            node {
              id
              projectId
            }
          }
        }
        createdProjects {
          edges {
            node {
              id
              dbId
            }
          }
        }
        interests {
          edges {
            node {
              name
            }
          }
        }
      }
      profile {
        dbId
      }
      allCategories {
        edges {
          node {
            name
          }
        }
      }
    }
  `;

  const updateMutation = gql`
    mutation updateMutation(
      $username: String
      $imagePath: String
      $latitude: String
      $longitude: String
      $interests: [String]
    ) {
      mutateUpdateUser(
        username: $username
        imagePath: $imagePath
        latitude: $latitude
        longitude: $longitude
        interests: $interests
      ) {
        id
        username
        imagePath
        latitude
        longitude
        interests {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  `;
  const [mutateEntity] = useMutation(updateMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId || props.route?.params.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutateEntity={mutateEntity}
    />
  );
}
