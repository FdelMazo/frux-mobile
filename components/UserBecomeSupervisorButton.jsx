import * as React from "react";
import { Button, Div, Icon, Overlay, Text } from "react-native-magnus";

export default function Component({ data, isViewer }) {
  const [seerOverlay, setSeerOverlay] = React.useState(false);

  if (!isViewer) return null;
  return (
    <>
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
            <Icon
              left={0}
              color="fruxgreen"
              position="absolute"
              name="eye-outline"
              fontSize="lg"
              fontFamily="Ionicons"
            />
          }
        >
          Become a project supervisor
        </Button>
      </Div>

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
          };
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
              alert("Mock seer action");
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
