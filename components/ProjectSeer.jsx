import { gql } from "@apollo/client";
import * as React from "react";
import { Div, Image, Text } from "react-native-magnus";

export default function Component({ data }) {
  const supervisedByUser = React.useMemo(() => {
    if (!data.profile || !data.project.seer) return false;
    return data.project.seer.dbId === data.profile.dbId;
  }, [data.project.seer, data.profile]);

  return (
    <Div row justifyContent="center" alignItems="center">
      <Image
        mx="md"
        w={35}
        h={35}
        source={require("../assets/images/seer.png")}
      />
      <Div>
        <Text color="fruxgreen">
          {supervisedByUser
            ? "Thanks for supervising this project!"
            : `${
                data.project.seer.username ||
                data.project.seer.email.split("@")[0]
              } is supervising this project!`}
        </Text>
      </Div>
    </Div>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectSeer_project on Project {
      id
      seer {
        id
        dbId
        username
        email
      }
    }
  `,
  user: gql`
    fragment ProjectSeer_user on User {
      id
      dbId
    }
  `,
};
