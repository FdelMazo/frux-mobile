import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Icon } from "react-native-magnus";
import { getImageUri, uploadImage } from "../services/media";
import { useUser } from "../services/user";
import Notifications from "./Notifications";
import TopicContainer from "./TopicContainer";
import TopicsOverlay from "./TopicsOverlay";

function Component({ data, navigation, mutateEntity }) {
  const { user } = useUser();
  const [uriImage, setUriImage] = React.useState(null);
  const [topic, setTopic] = React.useState(
    data.project.categoryName || "Other"
  );
  const [topicOverlay, setTopicOverlay] = React.useState(false);
  const created = user && data.project.owner.email === user.email;

  React.useEffect(() => {
    getImageUri(data.project.uriImage || "nopicture.jpg").then((r) =>
      setUriImage(r)
    );
  }, []);

  React.useEffect(() => {
    mutateEntity({
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
            mutateEntity({
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
              mutateEntity({
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

      {user && <Notifications navigation={navigation} />}
      <Div position="absolute" right={0} bottom={0}>
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

      <TopicsOverlay
        topics={topic}
        setTopics={setTopic}
        visible={topicOverlay}
        setVisible={setTopicOverlay}
        multiple={false}
      />
    </Div>
  );
}

export default function Render(props) {
  const query = gql`
    query ProjectHeader($dbId: Int!) {
      project(dbId: $dbId) {
        dbId
        id
        uriImage
        categoryName
        owner {
          email
        }
      }
    }
  `;

  const updateProject = gql`
    mutation updateProject(
      $uriImage: String
      $idProject: Int!
      $category: String
    ) {
      mutateUpdateProject(
        uriImage: $uriImage
        idProject: $idProject
        category: $category
      ) {
        id
        uriImage
        categoryName
      }
    }
  `;
  const [mutateEntity] = useMutation(updateProject);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return (
    <Component
      data={data}
      navigation={props.navigation}
      mutateEntity={mutateEntity}
    />
  );
}
