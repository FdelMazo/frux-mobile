import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon } from "react-native-magnus";
import { getImageUri, uploadImage } from "../services/media";
import FruxOverlay from "./FruxOverlay";
import TopicContainer from "./TopicContainer";

export default function Component({ data, mutations, created }) {
  const [uriImage, setUriImage] = React.useState(null);
  const [topic, setTopic] = React.useState(
    data.project.categoryName || "Other"
  );
  const [topicOverlay, setTopicOverlay] = React.useState(false);

  React.useEffect(() => {
    getImageUri(data.project.uriImage || "nopicture.jpg").then((r) =>
      setUriImage(r)
    );
  }, [data.project.uriImage]);

  React.useEffect(() => {
    if (created)
      mutations.mutateUpdateProject({
        variables: {
          idProject: data.project.dbId,
          category: topic,
        },
      });
  }, [topic]);

  return (
    <Div bgImg={{ uri: uriImage }} h={200} justifyContent="center">
      {created && !data.project.uriImage && (
        <TouchableOpacity
          onPress={async () => {
            const id = await uploadImage();
            setUriImage(await getImageUri(id));
            mutations.mutateUpdateProject({
              variables: {
                idProject: data.project.dbId,
                uriImage: id,
              },
            });
          }}
        >
          <Icon
            h={70}
            w={70}
            rounded="circle"
            alignSelf="center"
            bg="white"
            opacity={0.7}
            fontSize="6xl"
            fontFamily="Feather"
            color="gray800"
            name="camera-off"
          />
        </TouchableOpacity>
      )}

      {created && !!data.project.uriImage && (
        <Div position="absolute" left={0} bottom={0} m="sm">
          <TouchableOpacity
            onPress={async () => {
              const id = await uploadImage();
              setUriImage(await getImageUri(id));
              mutations.mutateUpdateProject({
                variables: {
                  idProject: data.project.dbId,
                  uriImage: id,
                },
              });
            }}
          >
            <Icon
              h={30}
              w={30}
              rounded="circle"
              bg="white"
              opacity={0.7}
              fontSize="lg"
              fontFamily="Feather"
              color="gray800"
              name="camera"
            />
          </TouchableOpacity>
        </Div>
      )}

      <Div position="absolute" right={0} bottom={0} m="xs">
        <TouchableOpacity
          activeOpacity={created ? 0.2 : 1}
          onPress={
            created
              ? () => {
                  setTopicOverlay(true);
                }
              : undefined
          }
        >
          <TopicContainer name={topic} showName={false} />
        </TouchableOpacity>
      </Div>

      <FruxOverlay
        visible={topicOverlay}
        title="Project Topic"
        body={
          <Div justifyContent="center" row flexWrap="wrap">
            {data.allCategories.edges.map((item) => (
              <Button
                key={item.node.name}
                bg={undefined}
                p={0}
                underlayColor="fruxgreen"
                onPress={() => {
                  setTopic(item.node.name);
                }}
                m="sm"
              >
                <TopicContainer
                  active={topic === item.node.name}
                  showName={true}
                  name={item.node.name}
                />
              </Button>
            ))}
          </Div>
        }
        success={{
          title: "Done",
          action: () => {
            setTopicOverlay(false);
          },
        }}
      />
    </Div>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectHeader_project on Project {
      id
      dbId
      categoryName
      uriImage
    }
  `,
  allCategories: gql`
    fragment ProjectHeader_allCategories on CategoryConnection {
      edges {
        node {
          id
          name
        }
      }
    }
  `,
};
