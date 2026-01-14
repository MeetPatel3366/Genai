import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const messages = [
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
];

async function getGroqChatCompletion() {
  console.log(
    "-------------------------------------------------------------------------"
  );
  console.log("message sent: ", messages);
  console.log("message length: ", messages.length);

  return groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    messages: messages,
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

async function getGroqChatCompletion2() {
  console.log(
    "-------------------------------------------------------------------------"
  );
  console.log("message sent: ", messages);
  console.log("message length: ", messages.length);

  return groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    messages: messages,
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

  messages.push(chatCompletion?.choices[0]?.message); //assistant message

  // console.log(chatCompletion?.choices[0]?.message);
  // console.log(JSON.stringify(chatCompletion?.choices[0]?.message,null,2));

  const toolCalls = chatCompletion.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${chatCompletion?.choices[0]?.message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    console.log("tool: ", tool);
    const functionName = tool.function.name;
    const functionArguments = tool.function.arguments;

    if (functionName == "webSearch") {
      const toolResult = await webSearch(JSON.parse(functionArguments));
      console.log("Tool result: ", toolResult);

      messages.push({
        tool_call_id: tool.id,
        role: "tool", //tool role use for sent result of tool,
        name: functionName,
        content: toolResult,
      }); //tool call result push in messages because next time when llm call so tool result exists in messages history
    }
  }

  const chatCompletion2 = await getGroqChatCompletion2();
  console.log(chatCompletion2?.choices[0]?.message);
  console.log(JSON.stringify(chatCompletion2?.choices[0]?.message, null, 2));
}

main();

async function webSearch({ query }) {
  console.log("calling webSearch");
  const response = await tvly.search(query);
  console.log("Response : ", response);

  const finalResult = response.results.map((r) => r.content).join("\n\n");
  console.log("Final Result : ", finalResult);

  return finalResult;
}
