import * as React from "react";
import { Button, Div, Overlay, Text } from "react-native-magnus";

export default function Component({ visible, success, fail, title, body }) {
  return (
    <Overlay visible={visible}>
      {typeof title === "string" ? (
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
      ) : (
        title
      )}
      <Div my="md">{body}</Div>
      <Div row alignSelf="flex-end">
        {!!fail && (
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={fail.action}
          >
            {fail.title || "Close"}
          </Button>
        )}
        {!!success && (
          <Button
            onPress={success.action}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            {success.title || "Done"}
          </Button>
        )}
      </Div>
    </Overlay>
  );
}
