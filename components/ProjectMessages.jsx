import { gql } from "@apollo/client";
import * as React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Button, Div, Image, Input, Text } from "react-native-magnus";
import { getProjectConversations, sendMessage } from "../services/chat";
import FruxOverlay from "./FruxOverlay";

export default function Component({ data, created }) {
  const [question, setQuestion] = React.useState("");
  const [replies, setReplies] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [conversationOverlay, setConversationOverlay] = React.useState(false);
  const updateMessages = async () => {
    const conversations = await getProjectConversations(
      data.project.dbId,
      data.profile.dbId,
      created
    );

    const messagesWithNoReply = conversations
      .filter((c) => !c[1])
      .map((c) => ({ [c[0].chat_id]: "" }));

    setReplies(messagesWithNoReply);
    setMessages(conversations);
  };

  React.useEffect(() => {
    if (!data.profile) return;
    updateMessages();
  }, [data.profile]);

  return (
    <>
      {!created && (
        <Div
          row
          mx="xl"
          alignItems="center"
          justifyContent="space-between"
          alignSelf="flex-start"
        >
          <Input
            fontSize="sm"
            maxLength={124}
            w="80%"
            m="md"
            placeholder={`Ask ${
              data.project.owner.username ||
              data.project.owner.email.split("@")[0]
            } a private question about ${data.project.name}`}
            value={question}
            onChangeText={setQuestion}
          />
          <TouchableOpacity
            onPress={async () => {
              await sendMessage(
                data.project.dbId,
                data.profile.dbId,
                data.project.owner.dbId,
                question
              );
              updateMessages();
            }}
          >
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
          </TouchableOpacity>
        </Div>
      )}
      {!!messages.length && (
        <Div>
          <Button
            block
            bg="white"
            onPress={() => {
              setConversationOverlay(true);
            }}
            prefix={
              <Image
                mx="md"
                w={35}
                h={35}
                source={require("../assets/images/pm.png")}
              />
            }
          >
            <Text color="yellow600">
              See {created ? "project" : "my"} questions
            </Text>
          </Button>
        </Div>
      )}

      <FruxOverlay
        visible={conversationOverlay}
        title="Project Conversations"
        body={
          <ScrollView>
            {messages.map((conversation) => {
              const question = conversation[0];
              const reply = conversation[1];

              return (
                <Div key={question.chat_id}>
                  <Div row justifyContent={"flex-start"}>
                    <Text
                      textAlign={"left"}
                      borderColor={"fruxbrown"}
                      borderLeftWidth={2}
                      borderRightWidth={0}
                      mx="xs"
                      mb="sm"
                      px="md"
                    >
                      {question.body}
                    </Text>
                  </Div>
                  {reply ? (
                    <Div row justifyContent={"flex-end"}>
                      <Text
                        textAlign={"right"}
                        borderColor={"fruxgreen"}
                        borderLeftWidth={0}
                        borderRightWidth={2}
                        mx="xs"
                        mb="sm"
                        px="md"
                      >
                        {reply.body}
                      </Text>
                    </Div>
                  ) : (
                    <>
                      {created && (
                        <Div row alignItems="center" justifyContent="flex-end">
                          <TouchableOpacity
                            onPress={async () => {
                              await sendMessage(
                                data.project.dbId,
                                data.project.owner.dbId,
                                question.commenter_id,
                                replies[question.chat_id],
                                question.chat_id
                              );
                              updateMessages();
                            }}
                          >
                            <Image
                              w={20}
                              h={20}
                              mx="md"
                              source={
                                replies[question.chat_id]
                                  ? require("../assets/images/send.png")
                                  : require("../assets/images/no-send.png")
                              }
                            />
                          </TouchableOpacity>
                          <Input
                            fontSize="sm"
                            maxLength={124}
                            w="40%"
                            py={undefined}
                            px="xs"
                            textAlign="right"
                            placeholder={`Reply to this user`}
                            value={replies[question.chat_id]}
                            onChangeText={(e) => {
                              setReplies({ ...replies, [question.chat_id]: e });
                            }}
                          />
                        </Div>
                      )}
                    </>
                  )}
                </Div>
              );
            })}
          </ScrollView>
        }
        fail={{
          title: "Close",
          action: () => {
            setConversationOverlay(false);
          },
        }}
      />
    </>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectMessages_project on Project {
      id
      dbId
      name
      owner {
        id
        dbId
        username
        email
      }
    }
  `,
  profile: gql`
    fragment ProjectMessages_profile on User {
      id
      dbId
    }
  `,
};
