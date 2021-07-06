import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { Div } from "react-native-magnus";
import { useUser } from "../services/user";
import Notifications from "./Notifications";
import TopicContainer from "./TopicContainer";

function Component({ data, navigation }) {
  const { user } = useUser();

  return (
    <Div bgImg={require("../assets/images/nopicture.jpg")} h={200}>
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
        categoryName
      }
    }
  `;
  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Component data={data} navigation={props.navigation} />;
}
