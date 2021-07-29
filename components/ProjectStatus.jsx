import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import StateOverlay from "./StateOverlay";
export default function Component({ data, created }) {
  const [stateOverlay, setStateOverlay] = React.useState(false);
  const description = {
    CREATED: created ? (
      <>
        <Text textAlign="center" color="fruxgreen">
          Your project is on its first steps. It'll be open to future investors
          once it enters it's{" "}
          <Text fontWeight="bold" color="fruxgreen">
            Funding{" "}
          </Text>
          phase.
        </Text>
        <Text textAlign="center" color="fruxgreen" my="xs">
          Tweak the last bit of info your future investors need to be certain
          that this is a project worth fighting for!
        </Text>
      </>
    ) : (
      <>
        <Text textAlign="center" color="fruxgreen">
          This project is still giving its first steps. You won't be able to
          fund it until it enters its{" "}
          <Text fontWeight="bold" color="fruxgreen">
            Funding{" "}
          </Text>
          phase.
        </Text>
        <Text textAlign="center" color="fruxgreen" my="xs">
          Why don't you come back a little bit later?
        </Text>
      </>
    ),

    FUNDING: created ? (
      <>
        <Text textAlign="center" color="fruxgreen">
          Your project is in it's{" "}
          <Text fontWeight="bold" color="fruxgreen">
            Funding{" "}
          </Text>
          phase! Once it gets all of it's funding covered you'll get to create
          all those marvelous (and promised to be delivered on time...) ideas!
        </Text>
        <Text textAlign="center" color="fruxgreen" my="xs">
          Go! Catch an investor! Catch them all!!
        </Text>
      </>
    ) : (
      <>
        <Text textAlign="center" color="fruxgreen">
          This project is in its{" "}
          <Text fontWeight="bold" color="fruxgreen">
            Funding{" "}
          </Text>
          phase!
        </Text>
        <Text textAlign="center" color="fruxgreen" my="xs">
          It's looking for investors everywhere! Have you seen any??
        </Text>
      </>
    ),

    IN_PROGRESS: created ? (
      <>
        <Text textAlign="center" color="fruxgreen">
          Your project is{" "}
          <Text fontWeight="bold" color="fruxgreen">
            In Progress.{" "}
          </Text>
          <Text color="fruxgreen">
            The project supervisor will progressively release the funds so that
            you can start developing this vision of yours.
          </Text>
        </Text>

        <Text textAlign="center" color="fruxgreen" my="xs">
          If any concern rises, they will get in touch to you through your
          private questions!
        </Text>
      </>
    ) : (
      <>
        <Text textAlign="center" color="fruxgreen">
          This project is{" "}
          <Text fontWeight="bold" color="fruxgreen">
            In Progress.{" "}
          </Text>
          <Text color="fruxgreen">
            The owner is now developing all those promised-to-not-be-overdue
            ideas they have!
          </Text>
        </Text>

        <Text textAlign="center" color="fruxgreen" my="xs">
          You can check the stages list to see how the development is going!
        </Text>
      </>
    ),

    COMPLETE: created ? (
      <>
        <Text textAlign="center" color="fruxgreen">
          Your project is{" "}
          <Text fontWeight="bold" color="fruxgreen">
            Complete!{" "}
          </Text>
          <Text color="fruxgreen">
            You have all the funds you ever needed to finish it, what more do
            you want?
          </Text>
        </Text>

        <Text textAlign="center" color="fruxgreen" my="xs">
          Come on! Go finish the development! People are counting on you!
        </Text>
      </>
    ) : (
      <>
        <Text textAlign="center" color="fruxgreen">
          This project is{" "}
          <Text fontWeight="bold" color="fruxgreen">
            Complete!{" "}
          </Text>
          <Text color="fruxgreen">
            There's not much else to do, but thanks for passing by.
          </Text>
        </Text>

        <Text textAlign="center" color="fruxgreen" my="xs">
          Every investor will now get one sample product from this project and
          everyone will live happily ever after.
        </Text>
      </>
    ),
  };

  return (
    <>
      <TouchableOpacity onPress={() => setStateOverlay(true)}>
        <Div
          p="sm"
          borderColor={States[data.project.currentState].color}
          borderWidth={1}
          rounded="md"
          justifyContent="center"
          alignItems="center"
        >
          {description[data.project.currentState]}
        </Div>
      </TouchableOpacity>

      <StateOverlay visible={stateOverlay} setVisible={setStateOverlay} />
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectStatus on Project {
      id
      currentState
    }
  `,
};
