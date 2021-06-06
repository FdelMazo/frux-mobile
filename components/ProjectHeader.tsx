import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { Div } from "react-native-magnus";
import TopicContainer from "./TopicContainer";
import Notifications from "./Notifications";
import { useAuth } from "../auth";

type Data = {
  project: {
    categoryName: string;
  };
};
type Navigation = StackNavigationProp<any>;

function Component({
  data,
  navigation,
}: {
  data: Data;
  navigation: Navigation;
}) {
  // @ts-expect-error
  const { user } = useAuth();

  return (
    <Div bgImg={require("../assets/images/nopicture.jpg")} h={200}>
      {user && (
        <>
          <Notifications navigation={navigation} />

          <Div position="absolute" right={0} bottom={0}>
            <TopicContainer
              navigation={navigation}
              name={data.project.categoryName}
              showName={false}
            />
          </Div>
        </>
      )}
    </Div>
  );
}

type Props = {
  navigation: Navigation;
  dbId: number;
};

export default function Render(props: Props) {
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
