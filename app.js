import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    temperature: 1,
    top_p: 0.2,
    /**
     *  1. item 1
        2. item 2
        .....
        10. item 10
        11. item 11
     */
    // stop:"11.",
    // stop: "ga", //Negative
    max_completion_tokens: 100,
    frequency_penalty: 1.0,
    presence_penalty: 1.0,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are Jarvis, a smart review grader. Your task is to analyze given review and return the sentiment. Classify the review as positive, neutral or negative. You must return result valid JSON Structure.
          example : {"sentiment":"Negative"}`,
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
  console.log(JSON.parse(chatCompletion?.choices[0]?.message.content));
}

main();
