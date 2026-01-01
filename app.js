import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Hi",
      },
    ],
  });
}

async function main() {
  const chatCompletion = await getGroqChatCompletion();

  console.log(chatCompletion?.choices[0]?.message.content);
}

main();
