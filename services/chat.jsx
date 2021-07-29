export const sendMessage = async (
  project_id,
  user_id,
  replyto_id,
  body,
  isQuestion
) => {
  await fetch(`http://192.168.1.100:5500/chat/${project_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      replyto_id,
      body,
      question: isQuestion,
    }),
  });
};
