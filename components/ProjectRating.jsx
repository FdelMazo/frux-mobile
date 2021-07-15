import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Input, Overlay, Text } from "react-native-magnus";
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

  if (data.project.currentState === "CREATED") return null;

  return (
    <>
      <TouchableOpacity onPress={() => setReviewOverlay(true)}>
        <Div row my="lg">
          <StarRating
            rating={parseFloat(data.project.generalScore.toFixed(1))}
            size={35}
          />
        </Div>
      </TouchableOpacity>
      <Overlay visible={reviewOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Reviews
        </Text>
        <Div>
          {data.project.reviews.edges.length ? (
            data.project.reviews.edges.map((r) => (
              <>
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
              </>
            ))
          ) : (
            <Text my="sm">
              This project has no reviews yet. But it will soon! I mean...
              probably? Perhaps? C'mon, it can't be that bad... right?
            </Text>
          )}
        </Div>

        {!created && !reviewedByUser && (
          <>
            {investedByUser ? (
              <Div>
                <Div row justifyContent="space-between">
                  <Input
                    w="60%"
                    my="md"
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

        <Div row alignSelf="flex-end" mt="sm">
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setReviewOverlay(false);
            }}
          >
            Close
          </Button>
          {investedByUser && !reviewedByUser && (
            <Button
              onPress={() => {
                if (!rating || !comment) return;
                mutations.mutateReviewProject({
                  variables: {
                    idProject: data.project.dbId,
                    description: comment,
                    score: rating,
                  },
                });
                setReviewOverlay(false);
              }}
              mx="sm"
              p="md"
              bg="fruxgreen"
              color="white"
            >
              Review
            </Button>
          )}
        </Div>
      </Overlay>
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
