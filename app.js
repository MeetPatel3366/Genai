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
        content: `You are an interview grader assistant. Your task is to generate candidate acore.Output must be following JSON structure:
        {
          "confidence": number (1-10 scale),
          "accuracy": number (1-10 scale),
          "pass": boolean (true or false)
        }
        The response must:
          1. Include All fields shown above
          2. Use only the exact field names shown
          3. Follow the exact data types specified
          4. Contain ONLY the JSON object and nothing else
        `,
      },
      {
        role: "user",
        content: `Q: How do you declare a variable in JavaScript?
                  A: let name = "John";

                  Q: How do you create an array with numbers 1 to 3?
                  A: let arr = [1, 2, 3];

                  Q: How do you check if a number is even?
                  A: let isEven = num => num % 2 === 0;

                  Q: How do you print "Hello World" in the console?
                  A: console.log("Hello World");

                  Q: How do you find the length of a string?
                  A: let len = "JavaScript".length;`,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
}

main();
