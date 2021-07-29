import { gql } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";
import Colors from "../constants/Colors";
import { dateRepresentation, toDollars } from "../services/helpers";
import FruxOverlay from "./FruxOverlay";
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
  const [toSponsor, setToSponsor] = React.useState(0.01);
  const [errors, setErrors] = React.useState("");
  const [toSponsorDollars, setToSponsorDollars] = React.useState(0);

  React.useEffect(() => {
    async function dollars() {
      let _toSponsorDollars = await toDollars(toSponsor);
      setToSponsorDollars(_toSponsorDollars);
    }
    dollars();
  }, [data.project.goal, data.project.amountCollected, toSponsor]);

  return (
    <>
      <Div row justifyContent="center">
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
          <Div mx="xs">
            <Image
              mx="xs"
              w={40}
              h={40}
              source={
                likedByUser
                  ? require("../assets/images/heart.png")
                  : require("../assets/images/no-heart.png")
              }
            />
            <Text textAlign="center" fontWeight="bold" fontSize="sm">
              {data.project.favoritesFrom.edges.length || ""}
            </Text>
          </Div>
        </TouchableOpacity>

        {data.project.currentState !== "CREATED" && (
          <TouchableOpacity
            activeOpacity={data.profile ? 0.2 : 1}
            onPress={data.profile ? () => setSponsorOverlay(true) : undefined}
          >
            <Div mx="xs">
              <Image
                mx="xs"
                w={40}
                h={40}
                source={
                  investedByUser
                    ? require("../assets/images/wallet.png")
                    : require("../assets/images/no-wallet.png")
                }
              />
              <Text textAlign="center" fontWeight="bold" fontSize="sm">
                {data.project.investors.edges.length || ""}
              </Text>
            </Div>
          </TouchableOpacity>
        )}
      </Div>

      <FruxOverlay
        visible={sponsorOverlay}
        title={
          data.project.currentState === "FUNDING" && !created && !investedByUser
            ? "How much do you want to chip in?"
            : "Investors"
        }
        body={
          <>
            {data.project.currentState === "FUNDING" &&
            !created &&
            !investedByUser ? (
              <>
                <Text>
                  By funding this project you are helping it get done! Keep in
                  mind, you <Text fontWeight="bold">won't</Text> be able to take
                  back your investment once it's set, so make sure that you
                  really love this project and would like to contribute to it!
                </Text>

                <Div alignSelf="center">
                  <MultiSlider
                    selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                    markerStyle={{
                      backgroundColor: Colors.fruxgreen,
                    }}
                    enabledOne={false}
                    values={[
                      data.project.amountCollected / data.project.goal,
                      data.project.amountCollected / data.project.goal +
                        toSponsor / data.project.goal,
                    ]}
                    sliderLength={250}
                    minMarkerOverlapDistance={15}
                    onValuesChange={(v) => {
                      setToSponsor(
                        ((v[1] - v[0]) * data.project.goal).toFixed(4)
                      );
                    }}
                    step={0.0001}
                    max={1}
                  />
                </Div>

                <Div row>
                  <Text mx="md" fontSize="3xl" color="gray600">
                    {data.project.amountCollected}
                  </Text>
                  <Div row>
                    <Text fontSize="3xl" color="fruxgreen">
                      {"+ "}
                      {toSponsor}
                      {" ETH"}
                    </Text>
                    <Text fontSize="lg" color="gray600">
                      {"    "}($
                      {toSponsorDollars})
                    </Text>
                  </Div>
                </Div>

                <Div>
                  <Text
                    mx="md"
                    fontSize="sm"
                    fontFamily="latinmodernroman-bold"
                    color="fruxbrown"
                  >
                    {data.profile?.wallet.balance === 0 ? (
                      `You don't have funds in your ETH Wallet!`
                    ) : (
                      <>
                        {data.profile?.wallet.balance - toSponsor < 0
                          ? `You can't seed more than what you have!`
                          : `You'll be left with ${(
                              data.profile?.wallet.balance - toSponsor
                            ).toFixed(4)} ETH`}
                      </>
                    )}
                  </Text>
                </Div>

                {errors !== "" && (
                  <Text color="fruxred" textAlign="right" m="md">
                    {errors}
                  </Text>
                )}
              </>
            ) : (
              <>
                {data.project.investors.edges.length ? (
                  data.project.investors.edges.map((i) => (
                    <Text my="xs" mx="lg" key={i.node.user.dbId}>
                      ◆
                      <Text color="fruxgreen">
                        {" "}
                        {i.node.user.username ||
                          i.node.user.email.split("@")[0]}{" "}
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
                    There are no current investors for your project. But don't
                    cry for me Argentina! Wait a bit more and keep your hopes
                    up! Maybe try sharing a little bit about it on social media?
                  </Text>
                )}
              </>
            )}
          </>
        }
        fail={
          data.project.currentState === "FUNDING" && !created && !investedByUser
            ? {
                title: "Cancel",
                action: () => {
                  setErrors("");
                  setSponsorOverlay(false);
                },
              }
            : undefined
        }
        success={{
          title:
            data.project.currentState === "FUNDING" &&
            !created &&
            !investedByUser
              ? "Seed"
              : "Close",
          action: async () => {
            if (
              data.project.currentState === "FUNDING" &&
              !created &&
              !investedByUser
            ) {
              if (data.profile?.wallet.balance - toSponsor <= 0) {
                setErrors("Insufficient funds!");
                return;
              }
              if (toSponsor <= 0) {
                setErrors("You didn't specify how much!");
                return;
              }
              try {
                await mutations.mutateInvestProject({
                  variables: {
                    investedAmount: toSponsor,
                    idProject: data.project.dbId,
                  },
                });
              } catch (e) {
                if (e.message.includes("Insufficient funds!")) {
                  setErrors(
                    "Every ETH transaction includes a small gas fee. You don't have the funds to cover this tax!"
                  );
                  return;
                }
              }
            }
            setErrors("");
            setSponsorOverlay(false);
          },
        }}
      />
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
      wallet {
        id
        balance
      }
    }
  `,
};
