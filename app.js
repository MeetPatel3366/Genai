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
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an interview grader assistant. Your task is to generate candidate evaluation score. Output must be following JSON structure:
        { 
          "confidence": number (1-10 scale),
          "accuracy": number (1-10 scale),
          "pass": boolean (true or false)
        }
        The response must:
          1. Include All fields shown above
          2. Use only the exact field names shown
          3. Follow the exact data types specified
          4. Contain only the JSON object and nothing else  
        `,
      },
      {
        role: "user",
        content: `
          Q: What does === do in JavaScript?
          A: It checks strict equality without type conversion.

          Q: How do you declare a variable in JavaScript?
          A: Use let, const, or var followed by the variable name.

          Q: What is a JavaScript array?
          A: It's a list-like object used to store multiple values in a single variable.

          Q: How do you create a function in JavaScript?
          A: Use the function keyword followed by a name and parentheses.
        `,
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
