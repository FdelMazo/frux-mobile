import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Input, Text } from "react-native-magnus";
import FruxOverlay from "./FruxOverlay";
import StarRating from "./StarRating";

export default function Component({ data, created, mutations }) {
  const reviewedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.reviews.edges.map((r) => r.node.user.dbId);
    return ids.includes(data.profile.dbId);
  }, [data.project.reviews, data.profile]);

  const investedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.investors.edges.map((i) => i.node.user.dbId);
    return ids.includes(data.profile.dbId);
  }, [data.project.investors, data.profile]);

  const [reviewOverlay, setReviewOverlay] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(0);

  return (
    <>
      <TouchableOpacity onPress={() => setReviewOverlay(true)}>
        <Div row>
          <StarRating
            rating={Math.round(data.project.generalScore * 2) / 2}
            size={25}
          />
        </Div>
      </TouchableOpacity>

      <FruxOverlay
        visible={reviewOverlay}
        title="Reviews"
        body={
          <>
            {data.project.reviews.edges.length ? (
              data.project.reviews.edges.map((r) => (
                <Div key={r.node.user.id}>
                  <Div row justifyContent="space-between" my="xs">
                    <Text color="fruxgreen">
                      {r.node.user.username || r.node.user.email.split("@")[0]}
                    </Text>

                    <Div alignSelf="flex-end" row>
                      <StarRating rating={r.node.score} size={10} />
                    </Div>
                  </Div>
                  <Text
                    borderColor="fruxgreen"
                    borderLeftWidth={2}
                    ml="xs"
                    mb="sm"
                    pl="md"
                  >
                    {r.node.description}
                  </Text>
                </Div>
              ))
            ) : (
              <Text my="sm">
                This project has no reviews yet. But it will soon! I mean...
                probably? Perhaps? C'mon, it can't be that bad... right?
              </Text>
            )}

            {!created && !reviewedByUser && (
              <>
                {investedByUser ? (
                  <Div>
                    <Div row justifyContent="space-between">
                      <Input
                        w="60%"
                        my="md"
                        multiline
                        maxLength={124}
                        numberOfLines={2}
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Leave your Review"
                      />
                      <Div alignSelf="center">
                        <Button
                          bg={undefined}
                          onPress={() => {
                            if (rating === 5) setRating(0);
                            else setRating(rating + 0.5);
                          }}
                        >
                          <Div row alignSelf="center">
                            <StarRating rating={rating} size={12} />
                          </Div>
                        </Button>
                      </Div>
                    </Div>
                  </Div>
                ) : (
                  <Text my="sm">Only investors can leave reviews!</Text>
                )}
              </>
            )}
          </>
        }
        fail={{
          title: "Close",
          action: () => {
            setReviewOverlay(false);
          },
        }}
        success={
          investedByUser && !reviewedByUser
            ? {
                title: "Review",
                action: () => {
                  if (!rating || !comment) return;
                  mutations.mutateReviewProject({
                    variables: {
                      idProject: data.project.dbId,
                      description: comment,
                      score: rating,
                    },
                  });
                  setReviewOverlay(false);
                },
              }
            : undefined
        }
      />
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectRating on Project {
      id
      dbId
      generalScore
      currentState
      investors {
        edges {
          node {
            id
            user {
              dbId
            }
          }
        }
      }
      reviews {
        edges {
          node {
            id
            user {
              id
              dbId
              firstName
              username
              email
            }
            score
            description
          }
        }
      }
    }
  `,
};
