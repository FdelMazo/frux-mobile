import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Image, Overlay, Text } from "react-native-magnus";

export default function Component({ data, isViewer, mutations }) {
  const [seerOverlay, setSeerOverlay] = React.useState(false);

  return (
    <>
      {isViewer && !data.user.isSeer && (
        <Div w="65%" mt="2xl">
          <Button
            block
            bg="white"
            onPress={() => {
              setSeerOverlay(true);
            }}
            borderColor="fruxgreen"
            color="fruxgreen"
            borderWidth={1}
            prefix={
              <Image
                mx="md"
                w={35}
                h={35}
                source={require("../assets/images/no-seer.png")}
              />
            }
          >
            Become a project supervisor
          </Button>
        </Div>
      )}

      {data.user.isSeer && (
        <Div row my="2xl" w="50%" justifyContent="center" alignItems="center">
          <Image
            mx="md"
            w={35}
            h={35}
            source={require("../assets/images/seer.png")}
          />
          <TouchableOpacity
            activeOpacity={isViewer ? 1 : 0.2}
            onPress={
              isViewer
                ? undefined
                : () => {
                    setSeerOverlay(true);
                  }
            }
          >
            <Div>
              <Text color="fruxgreen">
                {isViewer
                  ? "Thanks for being a supervisor!"
                  : `${
                      data.user.firstName ||
                      data.user.username ||
                      data.user.email.split("@")[0]
                    } is part of our supervisor program, you can also join us!`}
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>
      )}

      <Overlay visible={seerOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Become a Project Supervisor
        </Text>
        <Div>
          <Text my="md">
            A project supervisor is a volunteer who verifies the correct
            development of a project, guaranteeing that the funds are being
            correctly spent and the deadlines are being met.
          </Text>

          <Text my="md">
            By agreeing on this terms, you'll be selected to supervise a random
            project out of the thousands that make
            <Text color="fruxgreen"> Frux</Text> what it is today.
          </Text>

          <Text my="md">
            Don't worry! When a project is selected for you, you'll see it right
            here in your profile screen.
          </Text>
        </Div>

        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setSeerOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              mutations.mutateSetSeer();
              setSeerOverlay(false);
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Confirm
          </Button>
        </Div>
      </Overlay>
    </>
  );
}

Component.fragments = {
  user: gql`
    fragment UserSupervisorBanner on User {
      isSeer
    }
  `,
};
