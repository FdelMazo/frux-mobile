import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import { dateRepresentation, toggler } from "../services/helpers";
import { getAddressName } from "../services/location";
import FruxOverlay from "./FruxOverlay";
import StateOverlay from "./StateOverlay";
import UserContainer from "./UserContainer";

export default function Component({ data, created, mutations, navigation }) {
  const [name, setName] = React.useState(data.project.name);
  const [description, setDescription] = React.useState(
    data.project.description
  );
  const [hashtags, setHashtags] = React.useState(
    data.project.hashtags.edges.map((n) => n.node.hashtag) || []
  );

  const [newHashtag, setNewHashtag] = React.useState("");

  const [stateOverlay, setStateOverlay] = React.useState(false);
  const [dataOverlay, setDataOverlay] = React.useState(false);
  const [hashtagOverlay, setHashtagOverlay] = React.useState(false);

  const [locationSet, setLocationSet] = React.useState(
    data.project.latitude !== "0.0"
  );
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [locationText, setLocationText] = React.useState("");

  const overdue = React.useMemo(
    () => new Date() > new Date(data.project.deadline + "-03:00"),
    [data.project.deadline]
  );

  React.useEffect(() => {
    let toAdd = newHashtag;
    if (toAdd.includes(" ")) {
      if (toAdd.includes("#")) toAdd = toAdd.replace("#", "");
      toAdd = toAdd.trim();
      if (toAdd) toggler(hashtags, setHashtags, toAdd);
      setNewHashtag("");
    }
  }, [newHashtag]);

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

  React.useEffect(() => {
    if (created)
      mutations.mutateUpdateProject({
        variables: {
          idProject: data.project.dbId,
          hashtags: hashtags.map((h) => h.toLowerCase()),
        },
      });
  }, [hashtags]);

  return (
    <>
      <Div w="90%" mt="lg">
        <Div>
          <Div row>
            <Div>
              <UserContainer
                user={data.project.owner}
                navigation={navigation}
              />
            </Div>

            <Div flex={1} ml="lg">
              <Div row justifyContent="space-between">
                <Div maxW="70%">
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
                    <Text
                      fontSize="4xl"
                      lineHeight={25}
                      fontFamily="latinmodernroman-bold"
                    >
                      {data.project.name}
                    </Text>
                  </TouchableOpacity>
                </Div>

                <TouchableOpacity onPress={() => setStateOverlay(true)}>
                  <Div
                    alignSelf="flex-start"
                    bg={States[data.project.currentState].color + "500"}
                    rounded="md"
                    px="xs"
                  >
                    <Text color="white" fontSize="xs">
                      {States[data.project.currentState].name.toUpperCase()}
                    </Text>
                  </Div>
                </TouchableOpacity>
              </Div>

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
                        mr="xs"
                        bg={undefined}
                        color="fruxgreen"
                        fontSize="sm"
                      >
                        {"#"}
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
                    ## add hashtags ##
                  </Text>
                )}
              </TouchableOpacity>
            </Div>
          </Div>
        </Div>
        <Div row justifyContent="space-between">
          <Div>
            {((!overdue && created && !locationSet && !!locationText) ||
              (!overdue && !!locationSet && !!locationText)) && (
              <TouchableOpacity
                disabled={locationLoading}
                activeOpacity={created && !locationSet ? 0.2 : 1}
                onPress={
                  created && !locationSet
                    ? async () => {
                        setLocationLoading(true);
                        await mutations.mutateUpdateProject({
                          variables: {
                            idProject: data.project.dbId,
                            latitude: data.project.owner.latitude,
                            longitude: data.project.owner.longitude,
                          },
                        });
                        setLocationLoading(false);
                        setLocationSet(true);
                      }
                    : undefined
                }
              >
                <Div row>
                  <Icon
                    name={locationLoading ? "spinner" : "location-outline"}
                    fontFamily={locationLoading ? "EvilIcons" : "Ionicons"}
                    fontSize="xl"
                    color={locationSet ? "gray600" : "blue600"}
                  />
                  <Text
                    py="sm"
                    px={0}
                    bg={undefined}
                    color={locationSet ? "gray600" : "blue500"}
                    fontSize="sm"
                  >
                    {locationText}
                  </Text>
                </Div>
              </TouchableOpacity>
            )}
          </Div>
          <Div row>
            {overdue ? (
              <Text
                mt="xs"
                p="sm"
                rounded="md"
                textAlign="center"
                color="white"
                bg="fruxred"
              >
                Keep in mind, this project is overdue! It was supposed to end on{" "}
                {dateRepresentation(data.project.deadline + "-03:00")} yet here
                we are! I guess someone got a little bit lazy, huh?
              </Text>
            ) : (
              <Text py="sm" px={0} bg={undefined} color="gray600" fontSize="xs">
                {dateRepresentation(data.project.creationDate)} ~{" "}
                {dateRepresentation(data.project.deadline + "-03:00")}
              </Text>
            )}
          </Div>
        </Div>
        <Div>
          {data.project.owner.isBlocked && (
            <Text
              mt="xs"
              p="sm"
              rounded="md"
              textAlign="center"
              color="white"
              bg="fruxred"
            >
              Keep in mind, the project creator was blocked by the Frux admins.
              You can keep seeding this project, but the creator won't be able
              to develop it until the issues are resolved, so that's probably
              not the best way of spending your money!
            </Text>
          )}
        </Div>
      </Div>

      <FruxOverlay
        visible={dataOverlay}
        title="Your Project"
        body={
          <>
            <Input
              maxLength={35}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />

            <Input
              mt="sm"
              value={description}
              multiline
              maxLength={124}
              numberOfLines={3}
              textAlignVertical="top"
              onChangeText={setDescription}
              placeholder="Description"
            />
          </>
        }
        fail={{
          title: "Cancel",
          action: () => {
            setDataOverlay(false);
          },
        }}
        success={{
          title: "Done",
          action: () => {
            mutations.mutateUpdateProject({
              variables: {
                idProject: data.project.dbId,
                description,
                name,
              },
            });
            setDataOverlay(false);
          },
        }}
      />

      <FruxOverlay
        visible={hashtagOverlay}
        title="#Hashtags"
        body={
          <>
            <Input
              prefix={<Text color="fruxgreen">#</Text>}
              value={newHashtag}
              maxLength={10}
              onChangeText={setNewHashtag}
              onEndEditing={() => {
                let toAdd = newHashtag;
                if (toAdd.includes("#")) toAdd = toAdd.replace("#", "");
                toAdd = toAdd.trim();
                if (toAdd) toggler(hashtags, setHashtags, toAdd);
                setNewHashtag("");
              }}
              focusBorderColor="fruxgreen"
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
          </>
        }
        success={{
          title: "Close",
          action: () => {
            setHashtagOverlay(false);
          },
        }}
      />

      <StateOverlay visible={stateOverlay} setVisible={setStateOverlay} />
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectData on Project {
      id
      name
      description
      currentState
      longitude
      latitude
      creationDate
      deadline
      hashtags {
        edges {
          node {
            hashtag
          }
        }
      }
      dbId
      owner {
        isBlocked
        dbId
        longitude
        latitude
        ...UserContainer
      }
    }
    ${UserContainer.fragments.user}
  `,
};
