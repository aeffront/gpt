const textInput = document.getElementById("text-input");
const chatContainer = document.getElementById("chat");
const playButton = document.getElementById("play-button");
const saveButton = document.getElementById("save-button");
const dropDownMenu = document.getElementById("dropdown-content");
const dropdownButton = document.getElementById("dropdown-button");



let savedSongs = [];
saveButton.addEventListener("click", () => {
  const songName = prompt("Enter a name for your song:");
  if (songName) {
    alert(`Song "${songName}" saved!`);
  } else {
    alert("Song saved without a name!");
  }
  if (tracks.length > 0) {
    let newSong = {
      name: songName || "Untitled",
      drums: { ...tracks[0] },
      instruments: { ...tracks[1] },
    };
    savedSongs.push(newSong);
    console.log("Saved Songs: ", savedSongs);
    const songElement = document.createElement("button");
    songElement.className = "saved-song";
    songElement.classList.add('button')
    songElement.textContent = newSong.name;

    songElement.addEventListener("click", () => {
      if (isPlaying) playButton.dispatchEvent(new Event("click"));
      tracks = [];
      let drumTrack = new Track(
        newSong.drums.samplePath,
        "drum",
        newSong.drums.instrumentType,
        newSong.drums.sampleDescription
      );
      let instrumentTrack = new Track(
        newSong.instruments.samplePath,
        "instrument",
        newSong.instruments.instrumentType,
        newSong.instruments.sampleDescription
      );
      tracks.push(drumTrack);
      tracks.push(instrumentTrack);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    dropDownMenu.appendChild(songElement);

    dropdownButton.addEventListener('click', () => {
      songElement.classList.toggle('showContent');
    });
  }
});

let isPlaying = false;
playButton.addEventListener("click", () => {
  if (isPlaying) {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    playButton.textContent = "Play";
    isPlaying = false;
    tracks.forEach((track) => {
      track.player.stop();
    }
    );
  } else {
    Tone.start().then(() => {
      Tone.Transport.start();
      playButton.textContent = "Stop";
      isPlaying = true;
      tracks.forEach((track) => {
       track.player.start();
      });
    });
  }
}
);

import{ melodies, drum_loops } from "./samples.js";
import * as Tone from "tone";





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

function track_creator(data){

  if(isPlaying)playButton.dispatchEvent(new Event("click"));

  tracks = [];
    console.log("Instrument Selector Data: ", data);
    const { drums, instruments } = data;
    const chatLine = document.createElement("div");
    chatLine.classList.add("chat-line");
    chatLine.classList.add("response");

    const responseElement = document.createElement("p");
    responseElement.textContent = "Selected Drums: " + drums.map(drum => drum.samplePath).join(", ") + "\n" +
        "Selected Instruments: " + instruments.map(instrument => instrument.samplePath).join(", ");
    responseElement.className = "responseText";
    chatLine.appendChild(responseElement);

    // Add audio players for drums
    drums.forEach((drum) => {
        const drumContainer = document.createElement("div");
        drumContainer.className = "audio-container";
        const drumLabel = document.createElement("p");
        drumLabel.textContent = "Drum: " + drum;
        const drumAudio = document.createElement("audio");
        drumAudio.controls = true;
        drumAudio.src = drum.samplePath;

        console.log(drum.samplePath);
        drumContainer.appendChild(drumLabel);
        drumContainer.appendChild(drumAudio);
        chatLine.appendChild(drumContainer);

        const track = new Track(drum.samplePath, "drum", drum.instrumentType,drum.sampleDescription); // Fixed property name
        tracks.push(track);
    });

    // Add audio players for instruments
    instruments.forEach((instrument) => {
        const instrumentContainer = document.createElement("div");
        instrumentContainer.className = "audio-container";
        const instrumentLabel = document.createElement("p");
        instrumentLabel.textContent = "Instrument: " + instrument;
        const instrumentAudio = document.createElement("audio");
        instrumentAudio.controls = true;
        instrumentAudio.src = instrument.samplePath;
        instrumentContainer.appendChild(instrumentLabel);
        instrumentContainer.appendChild(instrumentAudio);
        chatLine.appendChild(instrumentContainer);

        const track = new Track(instrument.samplePath, "instrument", instrument.instrumentType,instrument.sampleDescription); // Fixed property name
        tracks.push(track);
    });

    chatContainer.appendChild(chatLine);

    console.log("Tracks: ", tracks);
}

function track_editor(data) {

  if(isPlaying)playButton.dispatchEvent(new Event("click"));
    console.log("Track Editor Data: ", data);

    const drumTrack = tracks[0];
    const instrumentTrack = tracks[1];

    if (data.instrumentType === "drum" || data.instrumentType === "drums" || data.instrumentType === "hihat" || data.instrumentType === "kick" || data.instrumentType === "snare") {
       
        drumTrack.samplePath = data.samplePath;
        drumTrack.sampleDescription = data.sampleDescription;
        drumTrack.audio.src = data.samplePath;
        drumTrack.player.load(data.samplePath);
    }

    if (data.instrumentType === "melody") {
        instrumentTrack.samplePath = data.samplePath;
        instrumentTrack.sampleDescription = data.sampleDescription;
        instrumentTrack.audio.src = data.samplePath;
        instrumentTrack.player.load(data.samplePath);
    }

    const chatLine = document.createElement("div");
    chatLine.classList.add("chat-line");
    chatLine.classList.add("response");
    const responseElement = document.createElement("p");
    responseElement.textContent = "Edited Track: " + (data.samplePath || "No changes made");
    responseElement.className = "responseText";
    chatLine.appendChild(responseElement);
    chatContainer.appendChild(chatLine);

    console.log("Edited Tracks: ", tracks);
}


let tracks = [];


class Track{
    constructor(samplePath, sampleType, instrumentType,sampleDescription) {
      this.samplePath = samplePath;
      this.sampleType = sampleType;
      this.instrumentType = instrumentType;
      this.audio = new Audio(samplePath);
      this.audio.loop = true;
      this.sampleDescription = sampleDescription;


      try {
        this.player = new Tone.Player({
          volume: this.instrumentType=="drums"?-20:-10, // Set volume to -10 dB
          url: this.samplePath,
          loop: true, // Set player to loop
          onload: () => console.log(`Buffer loaded for ${this.samplePath}`),
          onerror: (error) => console.error(`Error loading buffer for ${this.samplePath}:`, error)
        }).toDestination();
      } catch (error) {
        console.error(`Failed to initialize Tone.Player for ${this.samplePath}:`, error);
      }
    }
}

function getInstruments(){
    let instruments = [];
    tracks.forEach((track) => {
        instruments.push(track.instrumentType);
    });
    return instruments;
}





const toolList = [
    {
        name: "track_creator",
        use_case: "Creating, Making, Building, Adding",
        description: "- **USE THIS TOOL TO CREATE, NOT TO EDIT.**\n" +
        "This tool allows you to create a combination of a drumloop and a melody.\n\n" +
        
        
        "\n\n## 🛠️ Selection Rules:\n" +
        
        "- **Select exactly one sample from each category (drums & melodies).**\n" +
        "- **Ensure the selected melody and drum loop match the user's mood or ambiance.**\n" +
        "- **Specify the type for each sample (e.g., drum, melody).**\n" +
        "- **Use descriptive selection criteria (e.g., 'uplifting melody' + 'energetic beat').**\n\n" +
    
        "## 📌 Output Format:\n" +
        "Your response **must** strictly follow this JSON format:\n" +
        "```json\n" +
        "{\n" +
        "  \"tool\": \"instrument_selector\",\n" +
        "  \"data\": {\n" +
        "    \"drums\": [\n" +
        "      {\"sampleName\": \"string\", \"samplePath\": \"string\", \"instrumentType\": \"string\" }\n" +
        "    ],\n" +
        "    \"instruments\": [\n" +
        "      { \"sampleName\": \"string\",\"samplePath\": \"string\", \"instrumentType\": \"string\" }\n" +
        "    ]\n" +
        "  }\n" +
        "}\n" +
        "```",
        output_format: "{ tool: \"instrument_selector\", data: { drums: [{ samplePath: \"string\", instrumentType: \"string\",sampleDescription: \"string\" }], instruments: [{ samplePath: \"string\", instrumentType: \"string\",,sampleDescription: \"string\" }] } }"
    },
    
    {
        name : "track_editor",
        use_case : "Editing, Changing, Replacing",
        description : "- **USE THIS TOOL TO EDIT, NOT TO CREATE.**\n" +
        
        "This tool is to be used to CHANGE, EDIT the following tracks : .\n\n" +
        "- current drum track is : "+ JSON.stringify(tracks[0])+ "\n" +
        "- current melody track is: " + JSON.stringify(tracks[1])+ "\n\n" +
       
        "## 🛠️ Editing Rules:\n" +
        "- **USE THIS TOOL TO EDIT, NOT TO CREATE.**\n" +
        "- **YOU CANNOT RELOAD THE SAME SAMPLE AS BEFORE !!! THE NEW samplePath has to be different from the original**\n" +
        "- **ONLY EDIT THE TRACKS THAT WERE MENTIONNED IN THE PROMPT.**\n",
        output_format: "{ tool: \"track_editor\", data: { samplePath: \"string\", instrumentType: \"string\",sampleDescription: \"string\" } }" +"- **Set instrumentType to either the word drums or the word melody.**\n" ,

    }
];

async function sendPrompt(prompt) {
  try {
    let instruction = `
You are a tool-using assistant. You must always respond by choosing the correct tool from the list and strictly following its response format.

## Available Tools:
${JSON.stringify(toolList, null, 2)}

## Task:
- Analyze the prompt: make me a track for"${prompt}".
- if the prompt is not in english, translate it to english before analyzing.
- Determine if the prompt is asking for a creation or editing task.
- **If the prompt is asking for an EDITING TASK, a change or modification, choose the "track_editor" tool**
- **If the prompt is asking for a CREATION TASK, choose the "track_creator" tool**
- Format the response **exactly** like in the response_format.
- Do **not** explain your answer.
- Do **not** generate anything outside of JSON.

 `+"## Available Samples:\n\n" +
        "### 🎵 Instrumental Samples:\n" +
        JSON.stringify(melodies.map(s => ({
            name: s.name,
            path: s.path,
            key: s.key || "Unknown",
            description: s.description
        })), null, 2) +
        
        "\n\n### 🥁 Percussion Samples:\n" +
        JSON.stringify(drum_loops.map(s => ({
            name: s.name,
            path: s.path,
            type: s.contains,
            description: s.description
        })), null, 2) +`

## Response format example:
\`\`\`json
{ tool: "chosen_tool_name", data: { ... } }
\`\`\`

Now, respond correctly in JSON format.
`;

    const response = await fetch("http://100.103.187.82:3000/api/gemma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma-3-4b-it",
        prompt: instruction,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    console.log("Response Data: ", data);
    const responseText = data.choices[0]?.text || "";

    // Extract JSON using regex
    const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    let responseJson;
    try {
      try {
          responseJson = match ? JSON.parse(match[1]) : JSON.parse(responseText);
      } catch (error) {
        textInput.placeholder = "Error parsing response. Please try again.";
          console.error("Error parsing JSON:", error, "Raw response:", responseText);
          return null;
      }
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
    textInput.style.visibility = "hidden";
    sendPrompt(prompt).then((response) => {
      textInput.placeholder ="What's next ?"
      textInput.dispatchEvent(new Event("input"));
      textInput.style.visibility = "visible";
    const data = response.data;
      eval(response.tool)(data, chat_line_Element);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    textInput.value = ""; // Clear the input field after sending
  }
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


