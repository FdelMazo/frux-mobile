import { gql } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Image, Overlay, Text } from "react-native-magnus";
import Colors from "../constants/Colors";
import { dateRepresentation, toDollars, toEth } from "../services/helpers";

export default function Component({ data, mutations, created }) {
  const likedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.favoritesFrom.edges.map((i) => i.node.userId);
    return ids.includes(data.profile.dbId.toString());
  }, [data.project.favoritesFrom, data.profile]);

  const investedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.investors.edges.map((i) => i.node.user.dbId);
    return ids.includes(data.profile.dbId);
  }, [data.project.investors, data.profile]);

  const [sponsorOverlay, setSponsorOverlay] = React.useState(false);
  const [toSponsor, setToSponsor] = React.useState(0);
  const [toSponsorETH, setToSponsorETH] = React.useState(0);
  const [goalDollars, setGoalDollars] = React.useState(0);
  const [amountCollectedDollars, setAmountCollectedDollars] = React.useState(0);
  React.useEffect(() => {
    async function convert() {
      let _goalDollars = await toDollars(data.project.goal);
      let _amountCollectedDollars = await toDollars(
        data.project.amountCollected
      );
      let _toSponsorETH = await toEth(toSponsor);
      setGoalDollars(_goalDollars);
      setAmountCollectedDollars(_amountCollectedDollars);
      setToSponsorETH(_toSponsorETH);
    }
    convert();
  }, [data.project.goal, data.project.amountCollected, toSponsor]);

  return (
    <>
      <Div row my="lg">
        <TouchableOpacity
          activeOpacity={data.profile ? 0.2 : 1}
          onPress={
            data.profile
              ? () => {
                  likedByUser
                    ? mutations.mutateUnfavProject({
                        variables: {
                          idProject: data.project.dbId,
                        },
                      })
                    : mutations.mutateFavProject({
                        variables: {
                          idProject: data.project.dbId,
                        },
                      });
                }
              : undefined
          }
        >
          <Div>
            <Image
              mx="xs"
              w={45}
              h={45}
              source={
                likedByUser
                  ? require("../assets/images/heart.png")
                  : require("../assets/images/no-heart.png")
              }
            />
            <Text textAlign="center" fontWeight="bold">
              {data.project.favoritesFrom.edges.length || ""}
            </Text>
          </Div>
        </TouchableOpacity>
        {data.project.currentState !== "CREATED" && (
          <TouchableOpacity
            activeOpacity={data.profile ? 0.2 : 1}
            onPress={data.profile ? () => setSponsorOverlay(true) : undefined}
          >
            <Div>
              <Image
                mx="xs"
                w={45}
                h={45}
                source={
                  investedByUser
                    ? require("../assets/images/wallet.png")
                    : require("../assets/images/no-wallet.png")
                }
              />
              <Text textAlign="center" fontWeight="bold">
                {data.project.investors.edges.length || ""}
              </Text>
            </Div>
          </TouchableOpacity>
        )}
      </Div>

      <Overlay visible={sponsorOverlay}>
        {(data.project.currentState === "FUNDING" && created) ||
        data.project.currentState === "IN_PROGRESS" ||
        data.project.currentState === "COMPLETED" ? (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Investors
            </Text>
            {data.project.investors.edges.length ? (
              data.project.investors.edges.map((i) => (
                <Text m="lg" key={i.node.user.dbId}>
                  <Text color="fruxgreen">
                    {i.node.user.username || i.node.user.email.split("@")[0]}{" "}
                  </Text>
                  invested{" "}
                  <Text color="fruxgreen">
                    {i.node.investedAmount.toFixed(4)} ETH
                  </Text>
                  {" on "}
                  <Text color="fruxbrown">
                    {dateRepresentation(i.node.dateOfInvestment)}
                  </Text>
                </Text>
              ))
            ) : (
              <Text>
                There are no current investors for your project. But don't cry
                for me Argentina! Wait a bit more and keep your hopes up! Maybe
                try sharing a little bit about it on social media?
              </Text>
            )}
            <Div row alignSelf="flex-end" my="lg">
              <Button
                mx="sm"
                fontSize="sm"
                p="md"
                bg={undefined}
                borderWidth={1}
                borderColor="fruxgreen"
                color="fruxgreen"
                onPress={() => {
                  setSponsorOverlay(false);
                }}
              >
                Close
              </Button>
            </Div>
          </>
        ) : (
          <>
            <Text fontSize="xl" fontWeight="bold">
              How much do you want to chip in?
            </Text>
            <Text>
              By funding this project you are helping it get done! After it gets
              all of it's funding covered, it'll enter the{" "}
              <Text color="fruxgreen">In Progress</Text> phase where it'll be
              developed until it's finished, and you won't be able to take back
              your investment.
            </Text>
            <Div alignSelf="center">
              <MultiSlider
                selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                enabledOne={false}
                markerStyle={{
                  borderRadius: 0,
                  width: 7,
                  backgroundColor: Colors.fruxgreen,
                }}
                values={[
                  Math.floor((amountCollectedDollars / goalDollars) * 10),
                  Math.floor(
                    ((amountCollectedDollars + toSponsor) / goalDollars) * 10
                  ),
                ]}
                onValuesChange={(v) => {
                  setToSponsor(
                    Math.floor(
                      v[1] * 0.1 * goalDollars - amountCollectedDollars
                    )
                  );
                }}
                step={0.5}
                sliderLength={250}
              />
            </Div>
            <Div>
              <Div row>
                <Text mx="md" fontSize="5xl" color="gray600">
                  {"$"}
                  {amountCollectedDollars}
                </Text>
                <Div row>
                  <Text fontSize="5xl" color="fruxgreen">
                    {"+ $"}
                    {toSponsor}
                    {"  "}
                  </Text>
                  <Text fontSize="xl" color="gray600">
                    {"("}
                    {toSponsorETH} ETH)
                  </Text>
                </Div>
              </Div>

              <Text
                mx="md"
                lineHeight={20}
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                With a goal of ${goalDollars}
              </Text>
            </Div>
            <Div row alignSelf="flex-end" my="lg">
              <Button
                mx="sm"
                fontSize="sm"
                p="md"
                bg={undefined}
                borderWidth={1}
                borderColor="fruxgreen"
                color="fruxgreen"
                onPress={() => {
                  setSponsorOverlay(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  mutations.mutateInvestProject({
                    variables: {
                      investedAmount: toSponsorETH,
                      idProject: data.project.dbId,
                    },
                  });
                  setSponsorOverlay(false);
                }}
                mx="sm"
                fontSize="sm"
                p="md"
                bg="fruxgreen"
                color="white"
              >
                Seed
              </Button>
            </Div>
          </>
        )}
      </Overlay>
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectFavAndInvest_project on Project {
      id
      dbId
      currentState
      goal
      amountCollected
      favoritesFrom {
        edges {
          node {
            id
            userId
          }
        }
      }
      investors {
        edges {
          node {
            id
            investedAmount
            dateOfInvestment
            user {
              dbId
              username
              email
            }
          }
        }
      }
    }
  `,
  user: gql`
    fragment ProjectFavAndInvest_user on User {
      id
      dbId
    }
  `,
};
