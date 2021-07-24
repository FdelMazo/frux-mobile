import { gql } from "@apollo/client";
import * as React from "react";
import { Button, Div, Image, Input, Text } from "react-native-magnus";

export default function Component({ data, created }) {
  const [question, setQuestion] = React.useState("");
  const messages = ["a"];
  return created ? (
    <Div>
      <Button
        block
        bg="white"
        onPress={() => {}}
        prefix={
          <Image
            mx="md"
            w={35}
            h={35}
            source={
              messages.length
                ? require("../assets/images/pm.png")
                : require("../assets/images/no-pm.png")
            }
          />
        }
      >
        <Text color="yellow600">
          {messages.length ? "See" : "There are no"} private messages{" "}
          {!!messages.length && (
            <Text color="yellow600" fontWeight="bold">
              ({messages.length})
            </Text>
          )}
        </Text>
      </Button>
    </Div>
  ) : (
    <Div
      row
      mx="xl"
      alignItems="center"
      justifyContent="space-between"
      alignSelf="flex-start"
    >
      <Input
        fontSize="sm"
        w="80%"
        m="md"
        placeholder={`Ask ${
          data.project.owner.username || data.project.owner.email.split("@")[0]
        } a private question about ${data.project.name}`}
        value={question}
        onChangeText={setQuestion}
      />
      <Image
        w={30}
        h={30}
        mx="md"
        source={
          question
            ? require("../assets/images/send.png")
            : require("../assets/images/no-send.png")
        }
      />
    </Div>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectMessages on Project {
      id
      name
      owner {
        id
        username
        email
      }
    }
  `,
};
