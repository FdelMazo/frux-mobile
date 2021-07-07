import { gql, useMutation, useQuery } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  Div,
  Dropdown,
  Fab,
  Icon,
  Image,
  Input,
  Overlay,
  Text,
} from "react-native-magnus";
import Loading from "../components/Loading";
import ProjectHeader from "../components/ProjectHeader";
import { MainView, View } from "../components/Themed";
import UserContainer from "../components/UserContainer";
import Colors from "../constants/Colors";
import { States } from "../constants/Constants";
import { toggler } from "../services/helpers";
import { getAddressName } from "../services/location";
import { useUser } from "../services/user";

function Screen({ data, navigation, mutations }) {
  const [dataOverlay, setDataOverlay] = React.useState(false);
  const [sponsorOverlay, setSponsorOverlay] = React.useState(false);
  const [toSponsor, setToSponsor] = React.useState(0.05 * data.project.goal);
  const [name, setName] = React.useState(data.project.name);
  const [hashtags, setHashtags] = React.useState(
    data.project.hashtags.edges.map((n) => n.node.hashtag) || []
  );
  const [newHashtag, setNewHashtag] = React.useState("");
  const [hashtagOverlay, setHashtagOverlay] = React.useState(false);
  const [description, setDescription] = React.useState(
    data.project.description
  );
  const [locationSet, setLocationSet] = React.useState(
    data.project.latitude !== "0.0"
  );
  const [locationText, setLocationText] = React.useState("Include my location");

  const { user } = useUser();
  const created = user && data.project.owner.email === user.email;

  React.useEffect(() => {
    let toAdd = newHashtag;
    if (toAdd.includes(" ")) {
      if (toAdd.includes("#")) toAdd = toAdd.replace("#", "");
      toAdd = toAdd.trim();
      toggler(hashtags, setHashtags, toAdd);
      setNewHashtag("");
    }
  }, [newHashtag]);

  React.useEffect(() => {
    if (created)
      mutations.mutateEntity({
        variables: {
          idProject: data.project.dbId,
          hashtags: hashtags.map((h) => h.toLowerCase()),
        },
      });
  }, [hashtags]);

  React.useEffect(() => {
    async function _getAddress() {
      let text = "Include my location";
      if (locationSet) {
        text = await getAddressName({
          latitude: parseFloat(data.project.latitude),
          longitude: parseFloat(data.project.longitude),
        });
      }
      setLocationText(text);
    }
    _getAddress();
  }, [locationSet]);

  const dropdownRef = React.createRef();
  return (
    <View>
      <ProjectHeader dbId={data.project.dbId} navigation={navigation} />
      <MainView>
        <Div w="90%" mt="lg">
          <Div row>
            <UserContainer
              navigation={navigation}
              dbId={data.project.owner.dbId}
            />

            <Div flex={1} ml="lg">
              <TouchableOpacity
                activeOpacity={created ? 0.2 : 1}
                onPress={
                  created
                    ? () => {
                        setDataOverlay(true);
                      }
                    : undefined
                }
              >
                <Div row justifyContent="flex-start">
                  <Text
                    fontSize="4xl"
                    fontFamily="latinmodernroman-bold"
                    fontWeight="bold"
                  >
                    {data.project.name}
                  </Text>

                  <Div
                    alignSelf="flex-start"
                    bg={States[data.project.currentState].color + "500"}
                    rounded="md"
                    px="xs"
                  >
                    <Text color="white" fontSize="xs">
                      {data.project.currentState}
                    </Text>
                  </Div>
                </Div>
                <Text
                  lineHeight={20}
                  fontSize="xl"
                  fontFamily="latinmodernroman-bold"
                  color="gray600"
                >
                  {data.project.description}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={created ? 0.2 : 1}
                onPress={
                  created
                    ? () => {
                        setHashtagOverlay(true);
                      }
                    : undefined
                }
              >
                {hashtags.length ? (
                  <Div row flexWrap="wrap">
                    {hashtags.map((h) => (
                      <Text
                        key={h}
                        px={0}
                        mx="xs"
                        bg={undefined}
                        color="fruxgreen"
                        fontSize="sm"
                      >
                        {"# "}
                        {h}
                      </Text>
                    ))}
                  </Div>
                ) : (
                  <Text
                    px={0}
                    bg={undefined}
                    mx="sm"
                    color="fruxgreen"
                    fontSize="sm"
                  >
                    ####
                  </Text>
                )}
              </TouchableOpacity>
            </Div>
          </Div>
        </Div>
        <Div row w="90%" justifyContent="space-between">
          {((created && !locationSet) || !!locationSet) && (
            <TouchableOpacity
              activeOpacity={created && !locationSet ? 0.2 : 1}
              onPress={
                created && !locationSet
                  ? async () => {
                      mutations.mutateEntity({
                        variables: {
                          idProject: data.project.dbId,
                          latitude: data.project.owner.latitude,
                          longitude: data.project.owner.longitude,
                        },
                      });
                      setLocationSet(true);
                    }
                  : undefined
              }
            >
              <Div row>
                <Icon
                  name="location-outline"
                  fontFamily="Ionicons"
                  fontSize="xl"
                  color="blue600"
                />
                <Text
                  py="sm"
                  px={0}
                  bg={undefined}
                  color="blue500"
                  fontSize="sm"
                >
                  {locationText}
                </Text>
              </Div>
            </TouchableOpacity>
          )}
          <Div row>
            <Text py="sm" px={0} bg={undefined} color="violet" fontSize="xs">
              01/01/1970 ~ 01/01/1990
            </Text>
          </Div>
        </Div>
        <Div row my="lg">
          <Image
            mx="xs"
            w={35}
            h={35}
            source={require("../assets/images/star.png")}
          />
          <Image
            mx="xs"
            w={35}
            h={35}
            source={require("../assets/images/star.png")}
          />
          <Image
            mx="xs"
            w={35}
            h={35}
            source={require("../assets/images/half-star.png")}
          />
          <Image
            mx="xs"
            w={35}
            h={35}
            source={require("../assets/images/no-star.png")}
          />
          <Image
            mx="xs"
            w={35}
            h={35}
            source={require("../assets/images/no-star.png")}
          />
        </Div>

        <Div row w="90%" mt="xs" justifyContent="space-between">
          <TouchableOpacity onPress={() => dropdownRef.current.open()}>
            <Div>
              <Text fontSize="lg">
                <Text fontSize="lg" fontWeight="bold">
                  Stage 3:{" "}
                </Text>
                Detective Comics #33
              </Text>
              <MultiSlider
                selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                touchDimensions={{
                  height: 0,
                  width: 0,
                  borderRadius: 0,
                  slipDisplacement: 0,
                }}
                markerStyle={{
                  borderRadius: 0,
                  width: 7,
                  backgroundColor: Colors.fruxgreen,
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

      <Dropdown
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
            selectedStyle={{ backgroundColor: Colors.fruxgreen }}
            enabledOne={false}
            markerStyle={{
              borderRadius: 0,
              width: 7,
              backgroundColor: Colors.fruxgreen,
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

      <Overlay visible={dataOverlay}>
        <Input value={name} onChangeText={setName} placeholder="Name" />

        <Input
          mt="sm"
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
        />

        <Div row alignSelf="flex-end" mt="md">
          <Button
            mx="sm"
            fontSize="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setDataOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              mutations.mutateEntity({
                variables: {
                  idProject: data.project.dbId,
                  description,
                  name,
                },
              });
              setDataOverlay(false);
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
      </Overlay>

      <Overlay visible={hashtagOverlay}>
        <Input
          prefix={<Text color="fruxgreen">#</Text>}
          value={newHashtag}
          onChangeText={setNewHashtag}
          onEndEditing={() => {
            let toAdd = newHashtag;
            if (toAdd.includes("#")) toAdd = toAdd.replace("#", "");
            toAdd = toAdd.trim();
            toggler(hashtags, setHashtags, toAdd);
            setNewHashtag("");
          }}
          focusBorderColor="fruxgreen"
          placeholder="hashtag"
        />

        <Div mt="sm" row flexWrap="wrap">
          {hashtags.map((h) => (
            <Button
              key={h}
              bg={undefined}
              p={0}
              m="xs"
              onPress={() => {
                toggler(hashtags, setHashtags, h);
              }}
            >
              <Div rounded="circle" py="xs" px="lg" bg={"fruxgreen"}>
                <Text fontSize="xs">{`# ${h}`}</Text>
              </Div>
            </Button>
          ))}
        </Div>

        <Div my="md" row justifyContent="space-between">
          <Div alignSelf="center"></Div>

          <Div row>
            <Button
              onPress={() => {
                setHashtagOverlay(false);
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
    query Project($dbId: Int!) {
      project(dbId: $dbId) {
        id
        dbId
        name
        longitude
        latitude
        owner {
          dbId
          email
          latitude
          longitude
        }
        name
        currentState
        description
        amountCollected
        goal
        hashtags {
          edges {
            node {
              hashtag
            }
          }
        }
      }
    }
  `;

  const updateMutation = gql`
    mutation updateMutation(
      $idProject: Int!
      $name: String
      $description: String
      $longitude: String
      $latitude: String
      $hashtags: [String]
    ) {
      mutateUpdateProject(
        idProject: $idProject
        name: $name
        description: $description
        latitude: $latitude
        longitude: $longitude
        hashtags: $hashtags
      ) {
        id
        name
        description
        latitude
        longitude
        hashtags {
          edges {
            node {
              hashtag
            }
          }
        }
      }
    }
  `;
  const [mutateEntity, { error: mutError }] = useMutation(updateMutation);
  if (mutError) alert(JSON.stringify(mutError));
  const investMutation = gql`
    mutation Invest($idProject: Int!, $investedAmount: Float!) {
      mutateInvestProject(
        idProject: $idProject
        investedAmount: $investedAmount
      ) {
        project {
          id
          amountCollected
        }
      }
    }
  `;
  const [invest] = useMutation(investMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.route.params.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{ invest, mutateEntity }}
    />
  );
}
