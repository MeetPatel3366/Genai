import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 1,  
    response_format:{'type':'json_object'}  ,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are Jarvis,a smart review grader. Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. You must return the result in valid JSON structure.
        Example: {"sentiment": "Negative"}
        `,
      },
      {
        role: "user",
        content: `Review : These headphones arrived quickly and look grat, but the left earcup stopped working after a week.
              Sentiment:`,
      },
    ],
  });
  console.log(JSON.parse(completion.choices[0].message.content));
}

main();
