import { NOTIFICATIONS_ENDPOINT } from "@env";
import groupBy from "lodash.groupby";

export const sendMessage = async (
  project_id,
  commenter_id,
  replyto_id,
  body,
  chat_id = undefined
) => {
  await fetch(NOTIFICATIONS_ENDPOINT + `/chat/${project_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commenter_id,
      replyto_id,
      chat_id,
      body,
    }),
  });
};

export const getProjectConversations = async (projectId, userId, isCreator) => {
  let conversations = await fetch(
    NOTIFICATIONS_ENDPOINT + `/chat/${projectId}`
  ).then((res) => res.json());

  conversations.sort(
    (c1, c2) => new Date(c1?.created_at) - new Date(c2?.created_at)
  );

  if (!isCreator) {
    conversations = conversations.filter(
      (c) => parseFloat(c.commenter_id) === userId || c.user_id === userId
    );
  }

  conversations = groupBy(conversations, (c) => c.chat_id);

  const flattened = Object.keys(conversations).map((c) => conversations[c]);
  return flattened;
};
