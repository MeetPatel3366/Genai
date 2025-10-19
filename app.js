import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 1,
    // top_p:0.2,
    // stop: "ga", //negative
    // max_completion_tokens: 1000,
    // frequency_penalty:2,
    // presence_penalty: 2,
    response_format: { type: "json_object" },
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are Jarvis, a smart reviwew grader. Your task is to analyze given review and return the sentiment. Classify the review as positive, neutral or negative. You must return the result in valid JSON Structure.
         example: {"sentiment": "Negative"}`,
      },
      {
        role: "user",
        content: `
          Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week.
          Sentiment:
        `,
      },
    ],
  });
  console.log(completion);
  console.log(JSON.parse(completion.choices[0]?.message?.content) || "");
}
main();
