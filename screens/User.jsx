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
import Error from "../components/Error";
import LocationOverlay from "../components/LocationOverlay";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, View } from "../components/Themed";
import TopicContainer from "../components/TopicContainer";
import TopicsOverlay from "../components/TopicsOverlay";
import UserData from "../components/UserData";
import { UserIcons } from "../constants/Constants";
import { resetPassword, useUser } from "../services/user";

function Screen({ data, navigation, mutateEntity }) {
  const defaultUsername = data.user.username || data.user.email.split("@")[0];
  const { user } = useUser();
  const isViewer = user && data.user.email === user.email; // convertime en useMemo
  const [username, setUsername] = React.useState(defaultUsername);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  const [seerOverlay, setSeerOverlay] = React.useState(false);

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
    data.user.interests.edges.map((n) => n.node.name) || []
  );
  const [myTopicsOverlay, setMyTopicsOverlay] = React.useState(false);

  React.useEffect(() => {
    mutateEntity({
      variables: {
        interests: myTopics,
      },
    });
  }, [myTopics]);

  const [projectsShown, setProjectsShown] = React.useState(
    (!!data.user.projectInvestments.edges.length &&
      data.user.projectInvestments) ||
      (!!data.user.favoritedProjects.edges.length &&
        data.user.favoritedProjects) ||
      (!!data.user.createdProjects.edges.length && data.user.createdProjects)
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
        title={defaultUsername}
        icon={data.user.imagePath || "seed"}
      />

      <MainView>
        <UserData
          data={data}
          isViewer={isViewer}
          mutations={{ mutateUpdateUser: mutateEntity }}
          navigation={navigation}
        />
        {/* <UserHeader /> -> <UserEditDropdown />
          <UserData /> -> UserBasicData and UserWallet
          <UserFavouriteTopics />
          <UserProjects />
          <UserBecomeSupervisorButton /> */}

        <Div w="90%" mt="xl">
          {myTopics.length ? (
            <TouchableOpacity onPress={() => setMyTopicsOverlay(true)}>
              <>
                <Div alignSelf="flex-start">
                  <Text fontSize="xl" fontWeight="bold">
                    {isViewer ? "My Topics" : "Favourite Topics"}
                  </Text>
                </Div>
                <Div row my="md" flexWrap="wrap">
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
            {!!data.user.projectInvestments.edges.length && (
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

            {!!data.user.favoritedProjects.edges.length && (
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

            {!!data.user.createdProjects.edges.length && (
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

        <Div w="65%" mt="2xl">
          <Button
            block
            bg="white"
            onPress={() => {
              setSeerOverlay(true);
            }}
            borderColor="fruxgreen"
            color="fruxgreen"
            borderWidth={1}
            prefix={
              <Icon
                left={0}
                color="fruxgreen"
                position="absolute"
                name="eye-outline"
                fontSize="lg"
                fontFamily="Ionicons"
              />
            }
          >
            Become a project supervisor
          </Button>
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
              value={username}
              onChangeText={setUsername}
              suffix={
                <>
                  {username !== defaultUsername && username !== "" && (
                    <Button
                      bg={undefined}
                      p={0}
                      onPress={() => {
                        mutateEntity({
                          variables: {
                            username,
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

      <TopicsOverlay
        topics={myTopics}
        setTopics={setMyTopics}
        visible={myTopicsOverlay}
        setVisible={setMyTopicsOverlay}
        multiple={true}
      />

      <Overlay visible={seerOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Become a Project Supervisor
        </Text>
        <Div>
          <Text my="md">
            A project supervisor is a volunteer who verifies the correct
            development of a project, guaranteeing that the funds are being
            correctly spent and the deadlines are being met.
          </Text>

          <Text my="md">
            By agreeing on this terms, you'll be selected to supervise a random
            project out of the thousands that make
            <Text color="fruxgreen"> Frux</Text> what it is today.
          </Text>

          <Text my="md">
            Don't worry! When a project is selected for you, you'll see it right
            here in your profile screen.
          </Text>
        </Div>

        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setSeerOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              alert("Mock seer action");
              setSeerOverlay(false);
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
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    ${UserData.fragments.user}
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        ...UserData
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
    }
  `;

  const updateMutation = gql`
    ${UserData.fragments.user}
    mutation updateMutation(
      $username: String
      $imagePath: String
      $latitude: String
      $longitude: String
      $firstName: String
      $lastName: String
      $description: String
      $interests: [String]
    ) {
      mutateUpdateUser(
        username: $username
        imagePath: $imagePath
        latitude: $latitude
        longitude: $longitude
        interests: $interests
        firstName: $firstName
        lastName: $lastName
        description: $description
      ) {
        id
        username
        imagePath
        latitude
        ...UserData
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

  const [mutateUpdateUser, { error: mutateUpdateUserError }] =
    useMutation(updateMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId || props.route?.params.dbId },
  });
  const errors = [error, mutateUpdateUserError];

  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutateEntity={mutateUpdateUser}
    />
  );
}
