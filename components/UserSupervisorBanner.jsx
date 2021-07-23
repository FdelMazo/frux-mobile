import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";
import FruxOverlay from "./FruxOverlay";
export default function Component({ data, isViewer, mutations }) {
  const [seerOverlay, setSeerOverlay] = React.useState(false);
  const [stopSeerOverlay, setStopSeerOverlay] = React.useState(false);

  return (
    <>
      {(data.user.isSeer || isViewer) && (
        <TouchableOpacity
          activeOpacity={isViewer ? 0.2 : 1}
          onPress={
            isViewer
              ? data.user.isSeer
                ? () => {
                    setStopSeerOverlay(true);
                  }
                : () => {
                    setSeerOverlay(true);
                  }
              : undefined
          }
        >
          <Div
            row
            p="lg"
            borderColor="fruxgreen"
            rounded="md"
            borderWidth={data.user.isSeer ? 0 : 1}
          >
            <Image
              w={30}
              h={30}
              source={
                data.user.isSeer
                  ? require("../assets/images/seer.png")
                  : require("../assets/images/no-seer.png")
              }
            />
            <Text mx="md" color="fruxgreen" fontSize="sm">
              {data.user.isSeer
                ? isViewer
                  ? "Thanks for being a project supervisor!"
                  : `${
                      data.user.username || data.user.email.split("@")[0]
                    } is part of our supervisor program!`
                : "Become a project supervisor"}
            </Text>
          </Div>
        </TouchableOpacity>
      )}

      <FruxOverlay
        visible={stopSeerOverlay}
        title="Stop being a Project Supervisor"
        body={
          <>
            <Text my="md">
              Thanks for all your work! We won't assign you any more projects
              for you to supervise.
            </Text>

            <Text my="md">
              Don't forget to see through the rest of your assigned projects
              until they are done!
            </Text>
          </>
        }
        fail={{
          title: "Cancel",
          action: () => {
            setStopSeerOverlay(false);
          },
        }}
        success={{
          title: "Confirm",
          action: () => {
            // mutations.mutateSetSeer();
            setStopSeerOverlay(false);
          },
        }}
      />

      <FruxOverlay
        visible={seerOverlay}
        title="Become a Project Supervisor"
        body={
          <>
            <Text my="md">
              A project supervisor is a volunteer who verifies the correct
              development of a project, guaranteeing that the funds are being
              correctly spent and the deadlines are being met.
            </Text>

            <Text my="md">
              By agreeing on this terms, you'll be selected to supervise a
              random project out of the thousands that make
              <Text color="fruxgreen"> Frux</Text> what it is today.
            </Text>

            <Text my="md">
              Don't worry! When a project is selected for you, you'll see it
              right here in your profile screen.
            </Text>
          </>
        }
        fail={{
          title: "Cancel",
          action: () => {
            setSeerOverlay(false);
          },
        }}
        success={{
          title: "Confirm",
          action: () => {
            mutations.mutateSetSeer();
            setSeerOverlay(false);
          },
        }}
      />
    </>
  );
}

Component.fragments = {
  user: gql`
    fragment UserSupervisorBanner on User {
      id
      isSeer
      username
      email
    }
  `,
};
