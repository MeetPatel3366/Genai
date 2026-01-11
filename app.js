import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are s samrt personal assistant who answers the asked questions.
        You have access to following tools:
        1. searchWeb({query}: {query:string}) //Search the latest information and realtime data on the internet`,
      },
      {
        role: "user",
        content: `What is the current weather in Mumbai?`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the latest information and realtime data on the internet",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query to perform search on.",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });
}

async function main() {
  const chatCompletion = await getGroqChatCompletion();

  // console.log(chatCompletion?.choices[0]?.message);
  // console.log(JSON.stringify(chatCompletion?.choices[0]?.message,null,2));

  const toolCalls = chatCompletion.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${chatCompletion?.choices[0]?.message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    console.log(tool);
    const functionName = tool.function.name;
    const functionArguments = tool.function.arguments;

    if (functionName == "webSearch") {
      const toolResult = await webSearch(JSON.parse(functionArguments));
      console.log("Tool result: ", toolResult);
    }
  }
}

main();

async function webSearch({ query }) {
  console.log("calling webSearch");

  return "Mumbai weather is 28° C";
}
