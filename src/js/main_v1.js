const textInput = document.getElementById("text-input");
const chatContainer = document.getElementById("chat");

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'en-US'; // Définit la langue
recognition.interimResults = true; // Active les résultats intermédiaires

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

function text_generation(words) {
  const chatLine = document.createElement("div");
  const wordListElement = document.createElement("p");
  wordListElement.className = "responseText";
  wordListElement.textContent = words.join(", ");
  chatLine.classList.add("chat-line");
  chatLine.classList.add("response");
  chatLine.appendChild(wordListElement);
  chatContainer.appendChild(chatLine);
}
function image_generation(drawInstructions) {
  const chatLine = document.createElement("div");
  const canvasElement = document.createElement("canvas");
  const ctx = canvasElement.getContext("2d");
  canvasElement.width = 800;
  canvasElement.height = 800;
  eval(drawInstructions);
  canvasElement.className = "prompt-canvas";
  chatLine.classList.add("chat-line");
  chatLine.classList.add("response");

  chatLine.appendChild(canvasElement);
  chatContainer.appendChild(chatLine);
  const canvasWidth = canvasElement.width;
  const canvasHeight = canvasElement.height;

  console.log("Draw instructions:", drawInstructions);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
  eval(drawInstructions);
}
function music_player(songPath) {
  const chatLine = document.createElement("div");
  const musicPlayer = document.createElement("div");
  musicPlayer.className = "music-player";
  const songName = document.createElement("p");
  songName.innerHTML = songPath.split("/").pop();
  chatLine.appendChild(songName);

  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.autoplay = true;
  audioElement.src = songPath;

  chatLine.classList.add("chat-line");
  chatLine.classList.add("response");
  musicPlayer.appendChild(songName);
  musicPlayer.appendChild(audioElement);

  chatLine.appendChild(musicPlayer);

  chatContainer.appendChild(chatLine);
}
function alpha_tool(data) {
  console.log("Alpha tool response:", data);
  const chatLine = document.createElement("div");
  const alphaText = document.createElement("p");
  alphaText.textContent =data;
  chatLine.classList.add("chat-line");
  chatLine.classList.add("response");
  chatLine.appendChild(alphaText);
  chatContainer.appendChild(chatLine);
}

const toolList = [
  {
    tool: "text_generation",
    description:
      "This tool can ONLY use words from the following list to respond: " + JSON.stringify(wordList),
    response_format: `{ "tool": "text_generation", "data": ["mountain", "sun", "cloud", "rain", "river"] }`,
  },
  {
    tool: "image_generation",
    description:
      "This tool generates complex images based on prompts with words like 'draw', 'paint', 'show'. It returns JavaScript code as a string, which can be executed with eval(). The code must use at least 15 different drawing instructions. Use ctx functions like moveTo(), lineTo(), arc(), bezierCurveTo(), quadraticCurveTo(), fillRect(), fillStyle, strokeStyle, rotate(), scale(), and translate(). BEWARE THE CANVAS SIZE IS 800 BY 800. CORRECTLY USE SOURCE-OVER",
    response_format:
      '{ "tool": "image_generation", "data": "<JavaScript code as a string>" }',
  },
  {
    tool: "music_player",
    description: `This tool choses a song from ${JSON.stringify(
      songList
    )} based on the songs descriptions.`,
    response_format: `{ "tool": "music_player",  "data": "song_path" }`,
  },
  {
    tool: "alpha_tool",
    description:
      "This tool is to be used ONLY if the prompt contains the word 'ALPHA'. The response can be of any necessary length.",
    response_format: `{ "tool": "alpha_tool", "data": "<response>" }`,
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
- if the prompt is not in english, translate it to english beofre analyzing.
- Choose exactly one appropriate tool from the list.
- *Once a tool is chosen, ignore the rest of the tools*.
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
    //console.log("Full API response:", data);

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
    const chat_line_Element = createChatLine(prompt);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    sendPrompt(prompt).then((response) => {
      data = response.data;
      eval(response.tool)(data, chat_line_Element);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    textInput.value = ""; // Clear the input field after sending
  }
});

window.addEventListener("recordingStopped", function (event) {
  const audioRecording = event.detail.audioRecording;

  if (!audioRecording) {
    console.error("No audio recording available.");
    return;
  }

  transcribeAudio(audioRecording);
});

function createChatLine(prompt) {
  const chatLine = document.createElement("div");
  const prompt_Element = document.createElement("p");
  prompt_Element.textContent = prompt;
  prompt_Element.className = "promptText";
  chatLine.classList.add("chat-line");
  chatLine.classList.add("prompt");
  chatLine.appendChild(prompt_Element);
  chatContainer.appendChild(chatLine);
  return chatLine;
}

const apiKey = 'AIzaSyD3QE7-g6thMIo11Z-UTVqvgd1HsnV6OxY';  // Replace with your API key

async function transcribeAudio(audio) {
  if (!audio) {
    console.error("Audio input is null or undefined.");
    return;
  }

  const audioBuffer = await audio.arrayBuffer(); // Ensure audio is valid
  const audioContext = new AudioContext();
  const decodedAudio = await audioContext.decodeAudioData(audioBuffer);

  // Convert audio to LINEAR16 format
  const wavData = await encodeWAV(decodedAudio);

  // Use a proper Base64 encoding function for large binary data
  const audioContent = base64Encode(wavData);

  const requestBody = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: decodedAudio.sampleRate,
      languageCode: "en-US",
    },
    audio: {
      content: audioContent,
    },
  };

  try {
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(requestBody),
      }
    );

    

    if (response.status === 403) {
      console.error("API key is invalid or not authorized for Speech-to-Text API.");
      alert("Error: API key is invalid or not authorized. Please check your API key.");
      return;
    }

    if (!response.ok) {
      console.error("Error in API response:", response.status, response.statusText);
      alert(`Error: ${response.status} - ${response.statusText}`);
      return;
    }

    const transcriptionData = await response.json();
    console.log("API response data:", transcriptionData);

    if (transcriptionData.results && transcriptionData.results.length > 0) {
      const transcription = transcriptionData.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

        const prompt = transcription;
        const chat_line_Element = createChatLine(prompt);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        sendPrompt(prompt).then((response) => {
          console.log("API response:", response);
          data = response.data;
          eval(response.tool)(data, chat_line_Element);
          chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    
        textInput.value = ""; // Clear the input field after sending
      

      
      
    } else {
      console.error("No transcription available.");
    }
  } catch (error) {
    console.error("Error transcribing audio:", error);
    alert("An error occurred while transcribing the audio. Please try again.");
  }
}

// Helper function to encode binary data to Base64
function base64Encode(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binaryString);
}

// Helper function to encode audio as WAV
async function encodeWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + audioBuffer.length * numChannels * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, audioBuffer.length * numChannels * 2, true);

  // Write PCM data
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(
        -1,
        Math.min(1, audioBuffer.getChannelData(channel)[i])
      );
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}