import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant that can answer questions.
You have access to a tool called "webSearch" which lets you search the internet for up-to-date information.`,
    },
    {
      role: "user",
      content: `When was iphone 17 launched?`,
    },
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
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

    // console.log("3----> ", completion.choices[0].message);

    messages.push(completion.choices[0].message);
    const toolCalls = completion.choices[0].message.tool_calls;

    if (!toolCalls) {
      console.log(`Assistant: ${completion.choices[0].message.content}`);
      break;
    }

    for (const tool of toolCalls) {
      // console.log("tool: ", tool);
      const functionName = tool.function.name;
      const functionArguments = tool.function.arguments;

      if (functionName == "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionArguments));
        // console.log(toolResult);

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}
main();

async function webSearch({ query }) {
  //Here we will do tavily api call
  console.log("Calling web search ...");
  // console.log("Calling web search : ", query);

  const response = await tvly.search(query);
  // console.log("response: ", response);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  // console.log("finalResult : ", finalResult);

  return finalResult;
}
