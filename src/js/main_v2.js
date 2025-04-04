const textInput = document.getElementById("text-input");
const chatContainer = document.getElementById("chat");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = width = 800;
canvas.height = height = 800;
chatContainer.appendChild(canvas);

const wordList = [
  "mountain",
  "sun",
  "cloud",
  "rain",
  "river",
  "beach",
  "sand",
  "forest",
  "tree",
];

const songList = [
  {
    song_name: "Ask Me How",
    song_path: "./public/Ask Me How.mp3",
    description: "rap, hip-hop, upbeat,calm,chill",
  },
  {
    song_name: "Majestic Blitz",
    song_path: "./public/Majestik Blitz.mp3",
    description: "electronic, techno, dark, agressive",
  },
];

function image_generation(drawInstructions) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  console.log(drawInstructions);

  for (let i = 0; i < drawInstructions.length; i++) {
    const pixel = drawInstructions[i];
    ctx.fillStyle = "black";
    ctx.fillRect(
      pixel[0] * (width / 10),
      pixel[1] * (height / 10),
      width / 10,
      height / 10
    );
  }
}

function text_generation(words) {
  console.log("Words:", words);
}

function music_player(songPath) {
  const audio = new Audio(songPath);
  audio.play();
}

function website_generation(code) {
  const newWindow = window.open("", "_blank");
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated Website</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
        }
      </style>
    </head>
    <body>
    </body>
    </html>
  `);
  newWindow.document.close();
  newWindow.eval(code);
}

const toolList = [
  {
    tool: "text_generation",
    description:
      "This tool selects 5 words from the list: " + JSON.stringify(wordList),
    response_format: `{ "tool": "text_generation", "data": ["mountain", "sun", "cloud", "rain", "river"] }`,
  },
  {
    tool: "music_player",
    description: `This tool choses a song from ${JSON.stringify(
      songList
    )} based on the songs descriptions.`,
    response_format: `{ "tool": "music_player",  "data": "song_path" }`,
  },
  {
    tool: "image_generation",
    description:
      "This tool is to be used to draw, show, illustrate. It provides activated pixel positions to draw in this format : [[0,3],[5,7],[8,2],[2,0]]. THIS IS AN EXEMPLE YOU CAN CREATE UP TO 100 pixels. ",
    response_format: '{ "tool": "image_generation", "data":  }',
  },
  {
    tool: "website_generation",
    description:
      "This tool is to be used to generate a website. It provides a JS code that build the HTML elements, gives them their style and creates the JS interactions.",
    response_format: '{ "tool": "website_generation", "code":  }',
  },
];

async function sendPrompt(prompt) {
  try {
    let instruction = `
You are a tool-using assistant. You must always respond by choosing the correct tool from the list and strictly following its response format.

## Available Tools:
${JSON.stringify(toolList, null, 2)}

## Task:
- Analyze the prompt: "${prompt}".
- Choose exactly one appropriate tool from the list.
- Format the response **exactly** like in the response_format.
- Do **not** explain your answer.
- Do **not** generate anything outside of JSON.

## Response format example:
\`\`\`json
{ "tool": "chosen_tool_name", "parameters": { ... } }
\`\`\`

Now, respond correctly in JSON format.
`;

    const response = await fetch("http://localhost:3000/api/gemma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma-3-4b-it",
        prompt: instruction,
        max_tokens: 1300,
      }),
    });

    const data = await response.json();
    console.log("Full API response:", data);

    const responseText = data.choices[0]?.text || "";

    // Extract JSON using regex
    const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    let responseJson;
    try {
      responseJson = match ? JSON.parse(match[1]) : JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Error parsing JSON:",
        error,
        "Raw response:",
        responseText
      );
      return null;
    }

    return responseJson;
  } catch (error) {
    console.error("Error in API request:", error);
  }
}

textInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const prompt = textInput.value;

    sendPrompt(prompt).then((response) => {
      console.log(response);
      data = response.data;
      eval(response.tool)(data);
    });

    textInput.value = ""; // Clear the input field after sending
  }
});
