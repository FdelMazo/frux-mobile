import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import * as React from "react";
import { Div, Text, Avatar } from "react-native-magnus";

const UserContainer = ({ data }) => {
  return (
    <Div flexDir="column" alignItems="center" m={4}>
      <Div h={50} w={50} rounded="circle" borderWidth={1} />
      <Div>
        <Text fontWeight="bold">{data.user.name}</Text>
      </Div>
    </Div>
  );
};

export default function RenderUserContainer(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        name
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.id },
  });

  if (loading) return null;
  return <UserContainer data={data} />;
}
