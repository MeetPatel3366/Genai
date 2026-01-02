import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are Jarvis, a smart review grader. Your task is to analyze given review and return the sentiment. Classify the review as positive, neutral or negative. Output must be a single word.",
      },
      {
        role: "user",
        content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after just a week of use.
        Sentiment:`,
      },
    ],
  });
}

async function main() {
  const chatCompletion = await getGroqChatCompletion();

  console.log(chatCompletion?.choices[0]?.message.content);
}

main();
