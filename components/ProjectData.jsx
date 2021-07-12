import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Input, Overlay, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import { dateRepresentation, toggler } from "../services/helpers";
import { getAddressName } from "../services/location";
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

  const [dataOverlay, setDataOverlay] = React.useState(false);
  const [hashtagOverlay, setHashtagOverlay] = React.useState(false);

  const [locationSet, setLocationSet] = React.useState(
    data.project.latitude !== "0.0"
  );
  const [locationText, setLocationText] = React.useState("Include my location");

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
        <Div row>
          <UserContainer user={data.project.owner} navigation={navigation} />

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
        <Div>
          {((created && !locationSet) || !!locationSet) && (
            <TouchableOpacity
              activeOpacity={created && !locationSet ? 0.2 : 1}
              onPress={
                created && !locationSet
                  ? async () => {
                      mutations.mutateUpdateProject({
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
        </Div>
        <Div row>
          <Text py="sm" px={0} bg={undefined} color="gray600" fontSize="xs">
            {dateRepresentation(data.project.creationDate)} ~{" "}
            {dateRepresentation(data.project.deadline)}
          </Text>
        </Div>
      </Div>

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
              mutations.mutateUpdateProject({
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
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectData on Project {
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
        dbId
        longitude
        latitude
        ...UserContainer
      }
    }
    ${UserContainer.fragments.user}
  `,
};
