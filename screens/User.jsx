import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { Clipboard } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  Div,
  Dropdown,
  Icon,
  Input,
  Overlay,
  Snackbar,
  Tag,
  Text,
} from "react-native-magnus";
import Header from "../components/Header";
import Loading from "../components/Loading";
import LocationOverlay from "../components/LocationOverlay";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, View } from "../components/Themed";
import TopicContainer from "../components/TopicContainer";
import TopicsOverlay from "../components/TopicsOverlay";
import { UserIcons } from "../constants/Constants";
import { resetPassword, useUser } from "../services/user";

function Screen({ data, navigation, mutateEntity }) {
  const defaultUsername = data.user.username || data.user.email.split("@")[0];
  const { user } = useUser();
  const isViewer = user && data.user.email === user.email;
  const [username, setUsername] = React.useState(defaultUsername);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  const [walletOverlay, setWalletOverlay] = React.useState(false);
  const snackbarRef = React.createRef();

  const [basicDataOverlay, setBasicDataOverlay] = React.useState(false);
  const [firstName, setFirstName] = React.useState(data.user.firstName);
  const [lastName, setLastName] = React.useState(data.user.lastName);
  const [description, setDescription] = React.useState(data.user.description);

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
        <Div row w="90%" mt="xl" justifyContent="space-between">
          <Div w="80%" alignSelf="center">
            <TouchableOpacity
              activeOpacity={isViewer ? 0.2 : 1}
              onPress={
                isViewer
                  ? () => {
                      setBasicDataOverlay(true);
                    }
                  : undefined
              }
            >
              {isViewer && !firstName && !lastName && !description && (
                <Text
                  lineHeight={20}
                  fontSize="xl"
                  fontFamily="latinmodernroman-bold"
                  color="gray600"
                >
                  Tell us your name!
                </Text>
              )}
              <Div row>
                {!!lastName && (
                  <Text
                    fontSize="4xl"
                    fontFamily="latinmodernroman-bold"
                    fontWeight="bold"
                    color="fruxgreen"
                  >
                    {firstName ? lastName + ", " : lastName}
                  </Text>
                )}
                {!!firstName && (
                  <Text
                    fontSize="4xl"
                    fontFamily="latinmodernroman-bold"
                    fontWeight="bold"
                    color="fruxbrown"
                  >
                    {firstName}
                  </Text>
                )}
              </Div>
              <Div>
                {!!description && (
                  <Text
                    lineHeight={20}
                    fontSize="xl"
                    fontFamily="latinmodernroman-bold"
                    color="gray600"
                  >
                    {description}
                  </Text>
                )}
              </Div>
            </TouchableOpacity>
          </Div>

          <Div alignSelf="center">
            {isViewer && (
              <TouchableOpacity
                onPress={() => {
                  setWalletOverlay(true);
                }}
              >
                <Icon
                  name="wallet"
                  color="fruxgreen"
                  fontFamily="AntDesign"
                  h={40}
                  w={40}
                  borderColor="fruxgreen"
                  borderWidth={1}
                  rounded="sm"
                  fontSize="xl"
                  bg="white"
                />
              </TouchableOpacity>
            )}
          </Div>
        </Div>

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

      <Overlay visible={basicDataOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Hi, how are you?
        </Text>
        <Div>
          <Div w="70%" row justifyContent="space-between">
            <Input
              w="45%"
              mt="md"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
            <Input
              w="45%"
              mt="md"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
          </Div>
          <Input
            w="70%"
            mt="md"
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
          />
        </Div>

        <Div row alignSelf="flex-end">
          <Button
            onPress={() => {
              mutateEntity({
                variables: {
                  firstName,
                  lastName,
                  description,
                },
              });
              setBasicDataOverlay(false);
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Done
          </Button>
        </Div>
      </Overlay>

      <Overlay visible={walletOverlay} style={{ zIndex: 0 }}>
        <Text fontSize="xl" fontWeight="bold">
          ETH Wallet
        </Text>
        <Div my="md">
          <Text>
            This is your own personal ethereum wallet address, by adding funds
            onto this address you'll be able to sponsor the different seeds
            throught <Text color="fruxgreen">Frux</Text>
          </Text>

          <Button
            bg={undefined}
            p={0}
            onPress={() => {
              Clipboard.setString(data.user.walletAddress);
              if (snackbarRef.current) {
                snackbarRef.current.show(
                  "Wallet address copied to clipboard!",
                  {
                    duration: 2000,
                  }
                );
              }
            }}
          >
            <Text fontFamily="monospace" m="md" color="#af6161">
              {data.user.walletAddress}
            </Text>
          </Button>
        </Div>

        <Snackbar
          ref={snackbarRef}
          bg={undefined}
          fontSize="xs"
          color="fruxgreen"
        />

        <Div row alignSelf="flex-end">
          <Button
            onPress={() => {
              setWalletOverlay(false);
            }}
            mx="sm"
            p="md"
            borderColor="fruxgreen"
            borderWidth={1}
            rounded="sm"
            bg={undefined}
            color="fruxgreen"
          >
            Done
          </Button>
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
        firstName
        lastName
        description
        walletAddress
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
        firstName
        lastName
        description
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
