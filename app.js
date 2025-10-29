import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that can answer questions.
You have access to a tool called "webSerach" which lets you search the internet for up-to-date information.`,
      },
      {
        role: "user",
        content: `When was iphone 17 launched?`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "webSerach",
          description:
            "Search the latest information and realtime data on the internet.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The serach query to perform serach on.",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const toolCalls = completion.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${completion.choices[0].message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    console.log("tool: ", tool);
    const functionName = tool.function.name;
    const functionArguments = tool.function.arguments;

    if (functionName == "webSerach") {
      const toolResult = await webSerach(JSON.parse(functionArguments));
      console.log(toolResult);
    }
  }

  // console.log(JSON.stringify(completion.choices[0].message,null,2));
}
main();

async function webSerach({ query }) {
  //Here we will do tavily api call
  console.log("Calling web search : ", query);
  return "Iphone was launched on September 12, 2023.";
}
