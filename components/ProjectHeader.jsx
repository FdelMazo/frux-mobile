import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Icon } from "react-native-magnus";
import { getImageUri, uploadImage } from "../services/media";
import { useUser } from "../services/user";
import Notifications from "./Notifications";
import TopicContainer from "./TopicContainer";

function Component({ data, navigation, mutateEntity }) {
  const { user } = useUser();
  const [uriImage, setUriImage] = React.useState(null);

  React.useEffect(() => {
    getImageUri(data.project.uriImage || "nopicture.jpg").then((r) =>
      setUriImage(r)
    );
  }, []);

  return (
    <Div bgImg={{ uri: uriImage }} h={200} justifyContent="center">
      {!data.project.uriImage && (
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

      {!!data.project.uriImage && (
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
        <TopicContainer name={data.project.categoryName} showName={false} />
      </Div>
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
      }
    }
  `;

  const updateProject = gql`
    mutation updateProject($uriImage: String, $idProject: Int!) {
      mutateUpdateProject(uriImage: $uriImage, idProject: $idProject) {
        id
        uriImage
      }
    }
  `;
  const [mutateEntity] = useMutation(updateProject);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  console.log(data);
  return (
    <Component
      data={data}
      navigation={props.navigation}
      mutateEntity={mutateEntity}
    />
  );
}
