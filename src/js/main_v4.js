import { loading_animation } from "./lottie.js";
import{ melodies, drum_loops,decription_list ,basslines,key_list,vocals} from "./samples.js";
import * as Tone from "tone";
import {make_suggestion} from "./suggestion.js";
import { play } from "bodymovin";

//make_suggestion();

const textInput = document.getElementById("text-input");
const chatContainer = document.getElementById("chat");
const playButton = document.getElementById("play_button");
const saveButton = document.getElementById("save_button");
const dropDownMenu = document.getElementById("dropdown-content");
const dropdownButton = document.getElementById("dropdown-button");




dropdownButton.addEventListener('click', () => {
  let songs = Array.from(document.querySelectorAll('.saved-song'));
  document.getElementById("dropdown-content").classList.toggle('showContent');
  songs.forEach((song) => {
    song.classList.toggle('showContent');
    
  });
}
);

let savedSongs = [];

let saveHitbox ;
let playHitbox;

let key;

let trackColor;

let keywords = [];


// saving_animation.addEventListener("DOMLoaded", () => {

//   const hitbox = document.getElementById("save_hitbox");
//   saveHitbox = hitbox;
//   saveHitbox.style.opacity = 0;

//   saveHitbox.addEventListener("click", (event) => {
//     saving_animation.play();
//     const songName = prompt("Enter a name for your song:");
//     if (tracks.length > 0) {
//       let newSong = {
//         name: songName || "Untitled",
//         tracks: tracks.map((track) => ({
//           samplePath: track.samplePath,
//           sampleType: track.sampleType,
//           instrumentType: track.instrumentType,
//           sampleDescription: track.sampleDescription,
//         })),
//         keywords: keywords,
//         key: key,
//       };
//       savedSongs.push(newSong);
//       console.log("Saved Songs: ", savedSongs);
//       const songElement = document.createElement("button");
//       songElement.className = "saved-song";
//       songElement.classList.add('button');
//       songElement.textContent = newSong.name;

//       songElement.addEventListener("click", () => {
//         // Stop playback if playing
//         if (isPlaying) playHitbox.dispatchEvent(new Event("click"));

//         // Clear current tracks
//         tracks = [];
//         document.getElementById("tracks").innerHTML = "";

//         // Load saved song data
//         keywords = newSong.keywords;
//         trackColor = Math.floor(Math.random() * 360);
//         key = newSong.key;

//         // Rebuild tracks from saved song
//         newSong.tracks.forEach((track) => {
//           const newTrack = new Track(
//             track.samplePath,
//             track.sampleType,
//             track.instrumentType,
//             track.sampleDescription
//           );
//           tracks.push(newTrack);
//         });

//         console.log("Loaded Song: ", newSong);
//         chatContainer.scrollTop = chatContainer.scrollHeight;
//       });

//       dropDownMenu.appendChild(songElement);
//     }
//   });
// });

// playing_animation.addEventListener("DOMLoaded", () => {


//   const hitbox = document.getElementById("play_hitbox");
//   playHitbox = hitbox;
//   playHitbox.style.opacity = 0;

//   playHitbox.addEventListener("click", () => {
//     if (isPlaying) {
//       playing_animation.setDirection(1);
//       playing_animation.goToAndPlay(0, true);
      
//       Tone.Transport.pause();
//       Tone.Transport.cancel();
//       isPlaying = false;
//       tracks.forEach((track) => {
//         track.player.stop();
//       }
      
//       );
//     } else {
//       playing_animation.setDirection(-1);
//       playing_animation.play();
      
      
//       Tone.start().then(() => {
//         Tone.Transport.start();
//         isPlaying = true;
//         showProgress();
//         tracks.forEach((track) => {
//          track.player.start();
//         });
//       });

      

//     }
//   }
//   );
// });

saveButton.addEventListener("click", (event) => {
  let songs = Array.from(document.querySelectorAll('.saved-song'));
  document.getElementById("dropdown-content").classList.remove('showContent');
  songs.forEach((song) => {
    song.classList.remove('showContent');
    
  });
  const songName = prompt("Enter a name for your song:");
  if (tracks.length > 0) {
    let newSong = {
      name: songName || "Untitled",
      tracks: tracks.map((track) => ({
        samplePath: track.samplePath,
        sampleType: track.sampleType,
        instrumentType: track.instrumentType,
        sampleDescription: track.sampleDescription,
      })),
      keywords: keywords,
      key: key,
    };
    savedSongs.push(newSong);
    console.log("Saved Songs: ", savedSongs);
    const songElement = document.createElement("button");
    songElement.className = "saved-song";
    songElement.classList.add('button');
    songElement.textContent = newSong.name;

    songElement.addEventListener("click", () => {
      // Stop playback if playing
      if (isPlaying) playButton.dispatchEvent(new Event("click"));

      // Clear current tracks
      tracks = [];
      document.getElementById("tracks").innerHTML = "";

      // Load saved song data
      keywords = newSong.keywords;
      trackColor = Math.floor(Math.random() * 360);
      key = newSong.key;

      // Rebuild tracks from saved song
      newSong.tracks.forEach((track) => {
        const newTrack = new Track(
          track.samplePath,
          track.sampleType,
          track.instrumentType,
          track.sampleDescription
        );
        tracks.push(newTrack);
      });

      console.log("Loaded Song: ", newSong);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    dropDownMenu.appendChild(songElement);
  }
});

playButton.addEventListener("click", () => {
  if (isPlaying) {
    
    Tone.Transport.pause();
    Tone.Transport.cancel();
    isPlaying = false;
    tracks.forEach((track) => {
      track.player.stop();
    }
    
    );
    playButton.textContent = "play";
  } else {
    // Ensure all buffers are loaded before starting playback
    const allBuffersLoaded = tracks.every(track => track.player.buffer && track.player.buffer.loaded);
    if (!allBuffersLoaded) {
      console.error("Not all buffers are loaded. Please wait.");
      return;
    }

    playButton.textContent = "pause";
    Tone.start().then(() => {
      Tone.Transport.start();
      isPlaying = true;
      showProgress();
      tracks.forEach((track) => {
       track.player.start();
      });
    });

    

  }
}
);


function startPlaying() {
  // Ensure all buffers are loaded before starting playback
  const waitForBuffers = () => {
    const allBuffersLoaded = tracks.every(track => track.player.buffer && track.player.buffer.loaded);
    if (!allBuffersLoaded) {
      console.log("Waiting for all buffers to load...");
      setTimeout(waitForBuffers, 100); // Check again after 100ms
      return;
    }

    console.log(tracks);
    console.log("All buffers loaded");
    playButton.textContent = "pause";
    Tone.start().then(() => {
      Tone.Transport.start();
      isPlaying = true;
      showProgress();
      tracks.forEach((track) => {
        track.player.start();
      });
    });
  };

  waitForBuffers();
}

let isPlaying = false;



textInput.focus();

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


function keyword_selector(data){
  Tone.Transport.position = 0;
  keywords = data.keywords;
  trackColor = (Math.floor(Math.random()*360))

  if(isPlaying)playButton.dispatchEvent(new Event("click"));

  tracks = [];
  document.getElementById("tracks").innerHTML = "";

  const drums = select_drums(data.keywords);
  const instruments = select_melody(data.keywords);
  key = instruments && instruments.path ? instruments.key : key_list[Math.floor(Math.random()*key_list.length)]; // Default key if not found
  const bass = select_bass(data.keywords, key);
  const vocals = select_vocal(key);

  console.log("KEY: ", key);

  if(drums && drums.path){
    const drum_track = new Track(
    drums.path,
    "drums",
    drums.contains,
    drums.description
  );
  tracks.push(drum_track);
}
  if(instruments && instruments.path){
    trackColor += 180
  const instrument_track = new Track(
    instruments.path,
    "instrument",
    instruments.contains,
    instruments.description
  );
  tracks.push(instrument_track);
}
  if(bass && bass.path){
    trackColor += 90

    const bass_track = new Track(
      bass.path,
      "bass",
      bass.contains,
      bass.description
    );
    tracks.push(bass_track);

    console.log("final tracks: ", tracks);
}
  if(vocals && vocals.path){
    trackColor += 270
    const vocal_track = new Track(
      vocals.path,
      "vocal",
      vocals.contains,
      vocals.description
    );
    tracks.push(vocal_track);
  }

  startPlaying()
}

function track_creator(data){

  if(data.instrumentType == "drums"){
    let newInstrument = select_drums(keywords);
    if(newInstrument){
      console.log("New Instrument: ", newInstrument);
    let new_Track = new Track(newInstrument.path, "drum", newInstrument.contains, newInstrument.description);
    console.log("New Track: ", new_Track);
    tracks.push(new_Track);
    if(isPlaying)playButton.dispatchEvent(new Event("click"));
    }
  }
  else if(data.instrumentType == "melody"){
    let newInstrument = select_melody(keywords);
    if(newInstrument){
      console.log("New Instrument: ", newInstrument);
    let new_Track = new Track(newInstrument.path, "instrument", newInstrument.contains, newInstrument.description);
    console.log("New Track: ", new_Track);
    tracks.push(new_Track);
    if(isPlaying)playButton.dispatchEvent(new Event("click"));
    getKey()
    }
  }
}

function select_drums(keywords,samplePath) {
  if(!samplePath){
  const matchedDrums = drum_loops
    .map(loop => {
      const commonWords = keywords.filter(word => loop.description.includes(word));
      return { loop, score: commonWords.length, commonWords };
    })
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Get the top 3 matches

  if (matchedDrums.length > 0) {
    const randomMatch = matchedDrums[Math.floor(Math.random() * matchedDrums.length)];
    return randomMatch.loop;
  } else {
    console.log("No matching drum loop found.");
    return null;
  }
}
  else {
    const otherDrums = drum_loops.filter(loop => loop.path !== samplePath);
    if (otherDrums.length > 0) {
      const randomDrum = otherDrums[Math.floor(Math.random() * otherDrums.length)];
      return randomDrum;
    } else {
      console.log("No alternative drum loop found.");
      return null;
    }
  }
}

function select_melody(keywords,key, samplePath) {
  if (!samplePath) {
    if (!key) {
      const matchedMelodies = melodies
        .map(melody => {
          const commonWords = keywords.filter(word => melody.description.includes(word));
          return { melody, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedMelodies.length > 0) {
        const randomMatch = matchedMelodies[Math.floor(Math.random() * matchedMelodies.length)];
        return randomMatch.melody;
      } else {
        console.log("No matching melody loop found.");
        return null;
      }
    } else {
      const matchedMelodies = melodies
        .filter(melody => melody.key === key) // Filter by matching key
        .map(melody => {
          const commonWords = keywords.filter(word => melody.description.includes(word));
          return { melody, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedMelodies.length > 0) {
        const randomMatch = matchedMelodies[Math.floor(Math.random() * matchedMelodies.length)];
        return randomMatch.melody;
      } else {
        console.log("No matching melody loop found.");
        return null;
      }
    }
  } else {
    const otherMelodies = melodies.filter(melody => melody.path !== samplePath);
    if (!key) {
      const matchedMelodies = otherMelodies
        .map(melody => {
          const commonWords = keywords.filter(word => melody.description.includes(word));
          return { melody, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedMelodies.length > 0) {
        const randomMatch = matchedMelodies[Math.floor(Math.random() * matchedMelodies.length)];
        return randomMatch.melody;
      } else {
        console.log("No alternative matching melody loop found.");
        return null;
      }
    } else {
      const matchedMelodies = otherMelodies
        .filter(melody => melody.key === key) // Filter by matching key
        .map(melody => {
          const commonWords = keywords.filter(word => melody.description.includes(word));
          return { melody, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedMelodies.length > 0) {
        const randomMatch = matchedMelodies[Math.floor(Math.random() * matchedMelodies.length)];
        return randomMatch.melody;
      } else {
        console.log("No alternative matching melody loop found.");
        return null;
      }
    }
  }
}

function select_bass(keywords, key,samplePath) {
  if (!samplePath) {
    if (!key) {
      const matchedBasslines = basslines
        .map(bassline => {
          const commonWords = keywords.filter(word => bassline.description.includes(word));
          return { bassline, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedBasslines.length > 0) {
        const randomMatch = matchedBasslines[Math.floor(Math.random() * matchedBasslines.length)];
        return randomMatch.bassline;
      } else {
        console.log("No matching bassline found.");
        return null;
      }
    } else {
      const matchedBasslines = basslines
        .filter(bassline => bassline.key === key) // Filter by matching key
        .map(bassline => {
          const commonWords = keywords.filter(word => bassline.description.includes(word));
          return { bassline, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedBasslines.length > 0) {
        const randomMatch = matchedBasslines[Math.floor(Math.random() * matchedBasslines.length)];
        return randomMatch.bassline;
      } else {
        console.log("No matching bassline found.");
        return null;
      }
    }
  } else {
    const otherBasslines = basslines.filter(bassline => bassline.path !== samplePath);
    if (!key) {
      const matchedBasslines = otherBasslines
        .map(bassline => {
          const commonWords = keywords.filter(word => bassline.description.includes(word));
          return { bassline, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedBasslines.length > 0) {
        const randomMatch = matchedBasslines[Math.floor(Math.random() * matchedBasslines.length)];
        return randomMatch.bassline;
      } else {
        console.log("No alternative matching bassline found.");
        return null;
      }
    } else {
      const matchedBasslines = otherBasslines
        .filter(bassline => bassline.key === key) // Filter by matching key
        .map(bassline => {
          const commonWords = keywords.filter(word => bassline.description.includes(word));
          return { bassline, score: commonWords.length, commonWords };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get the top 3 matches

      if (matchedBasslines.length > 0) {
        const randomMatch = matchedBasslines[Math.floor(Math.random() * matchedBasslines.length)];
        return randomMatch.bassline;
      } else {
        console.log("No alternative matching bassline found.");
        return null;
      }
    }
  }
}

function select_vocal(key, samplePath) {
  if (!samplePath) {
    if (!key) {
      const randomVocal = vocals[Math.floor(Math.random() * vocals.length)];
      return randomVocal || null;
    } else {
      const matchedVocals = vocals.filter(vocal => vocal.key === key); // Filter by matching key
      if (matchedVocals.length > 0) {
        const randomMatch = matchedVocals[Math.floor(Math.random() * matchedVocals.length)];
        return randomMatch;
      } else {
        console.log("No matching vocal found.");
        return null;
      }
    }
  } else {
    const otherVocals = vocals.filter(vocal => vocal.path !== samplePath);
    if (!key) {
      if (otherVocals.length > 0) {
        const randomVocal = otherVocals[Math.floor(Math.random() * otherVocals.length)];
        return randomVocal;
      } else {
        console.log("No alternative vocal found.");
        return null;
      }
    } else {
      const matchedVocals = otherVocals.filter(vocal => vocal.key === key); // Filter by matching key
      if (matchedVocals.length > 0) {
        const randomMatch = matchedVocals[Math.floor(Math.random() * matchedVocals.length)];
        return randomMatch;
      } else {
        console.log("No alternative matching vocal found.");
        return null;
      }
    }
  }
}




let tracks = [];


class Track {
  constructor(samplePath, sampleType, instrumentType, sampleDescription) {
    this.samplePath = samplePath;
    this.sampleType = sampleType;
    this.instrumentType = instrumentType;
    this.audio = new Audio(samplePath);
    this.audio.loop = true;
    this.sampleDescription = sampleDescription;
   
    this.player = null; // Initialize as null
    this.panner = new Tone.Panner(0).toDestination();

    try {
      this.player = new Tone.Player({
        volume: this.instrumentType === "drums" ? -20 : -10,
        url: this.samplePath,
        loop: true,
        onload: () => {
          console.log(`Buffer loaded for ${this.samplePath}`);
          this.setupMuteButton(); // Attach mute event only after loading
          this.drawSample();
        },
        onerror: (error) => console.error(`Error loading buffer for ${this.samplePath}:`, error),
      }).connect(this.panner);
    } catch (error) {
      console.error(`Failed to initialize Tone.Player for ${this.samplePath}:`, error);
    }

    this.element = this.buildElement();
    if(this.sampleType == "bass"){
      this.trackContainer_gain.value = -25;
    }
  }

  buildElement() {
    this.trackContainer = document.createElement("div");
    this.trackContainer.className = "trackContainer";

    this.trackContainer_info = document.createElement("div");
    this.trackContainer_info.className = "trackContainer_info";
    this.trackContainer_info.style.backgroundColor = `hsl(${trackColor}, 100%, 40%)`;

    this.trackContainer_canvas = document.createElement("canvas");
    this.trackContainer_canvas.className = "trackCanvas";
    this.trackContainer_canvas.height = window.innerHeight*0.25;
    this.trackContainer_canvas.width = window.innerWidth; // Default width

    this.trackContainer.appendChild(this.trackContainer_info);
    this.trackContainer.appendChild(this.trackContainer_canvas);

    this.trackContainer_trackName = document.createElement("p");
    this.trackContainer_trackName.className = "trackName";
    this.trackContainer_trackName.textContent = (this.sampleType ? this.sampleType.toString().toUpperCase() : "UNKNOWN");

    const gainLabel = document.createElement("label");
    gainLabel.textContent = "Gain:";
    gainLabel.className = "trackLabel";
    gainLabel.style.marginRight = "5px";

    this.trackContainer_gain = document.createElement("input");
    this.trackContainer_gain.type = "range";
    this.trackContainer_gain.className = "trackGain";
    this.trackContainer_gain.min = -50;
    this.trackContainer_gain.max = 0;
    this.trackContainer_gain.value = this.player.volume.value;
    this.trackContainer_gain.addEventListener("input", () => {
      this.player.volume.value = this.trackContainer_gain.value;
    });

    const gainContainer = document.createElement("div");
    gainContainer.className = "paramContainer";
    gainContainer.appendChild(gainLabel);
    gainContainer.appendChild(this.trackContainer_gain);

    

    

    const panLabel = document.createElement("label");
    panLabel.textContent = "Pan:";
    panLabel.className = "trackLabel";
    panLabel.style.marginRight = "5px";

    this.trackContainer_pan = document.createElement("input");
    this.trackContainer_pan.type = "range";
    this.trackContainer_pan.className = "trackPan";
    this.trackContainer_pan.min = -1;
    this.trackContainer_pan.max = 1;
    this.trackContainer_pan.step = 0.1;
    this.trackContainer_pan.value = 0;
    this.trackContainer_pan.addEventListener("input", () => {
      this.panner.pan.setValueAtTime(parseFloat(this.trackContainer_pan.value), Tone.now());
    });

    const panContainer = document.createElement("div");
    panContainer.className = "paramContainer";
    panContainer.appendChild(panLabel);
    panContainer.appendChild(this.trackContainer_pan);
    
    

    this.trackContainer_buttons = document.createElement("div");
    this.trackContainer_buttons.className = "trackContainer_buttons";
    

    this.switchButton = document.createElement("button");
    this.switchButton.className = "audioButton";
    this.switchButton.textContent = "Switch";
    this.switchButton.addEventListener("click", () => {
      console.log("Switching instrument...", "Using these keywords: ", keywords);
      if(isPlaying) playButton.dispatchEvent(new Event("click"));
      Tone.Transport.position = 0;
      tracks.forEach((track) => {
        track.player.stop();
      });
      if(this.sampleType =="drums"){
       
        let newInstrument = select_drums(keywords);
        if(newInstrument){
          this.samplePath = newInstrument.path;
          this.instrumentType = newInstrument.contains;
          this.sampleDescription = newInstrument.description;
          this.player.load(this.samplePath);
          this.trackContainer_trackName.textContent = this.sampleType;
          this.setupMuteButton();
        }
      }
      else if(this.sampleType =="instrument"){
        let newInstrument = select_melody(keywords,key, this.samplePath);
        if(newInstrument){
          this.samplePath = newInstrument.path;
          this.instrumentType = newInstrument.contains;
          this.sampleDescription = newInstrument.description;
          this.player.load(this.samplePath);
          this.trackContainer_trackName.textContent = this.sampleType;
          this.setupMuteButton();
        }
      }
      else if(this.sampleType == "bass"){
        let newInstrument = select_bass(keywords, key, this.samplePath);
        if(newInstrument){
          this.samplePath = newInstrument.path;
          this.instrumentType = newInstrument.contains;
          this.sampleDescription = newInstrument.description;
          this.player.load(this.samplePath);
          this.trackContainer_trackName.textContent = this.sampleType;
          this.setupMuteButton();
        }
      }
      else if(this.sampleType == "vocal"){
        let newInstrument = select_vocal(keywords, key, this.samplePath);
        if(newInstrument){
          this.samplePath = newInstrument.path;
          this.instrumentType = newInstrument.contains;
          this.sampleDescription = newInstrument.description;
          this.player.load(this.samplePath);
          this.trackContainer_trackName.textContent = this.sampleType;
          this.setupMuteButton();
        }
      }
    });
    this.trackContainer_buttons.appendChild(this.switchButton);
    

    // Create the mute button but don't attach the event yet
    this.muteButton = document.createElement("button");
    this.muteButton.className = "audioButton";
    this.muteButton.textContent = "Mute";

    this.trackContainer_buttons.appendChild(this.muteButton);
    this.trackContainer_info.appendChild(this.trackContainer_trackName);
    this.trackContainer_info.appendChild(this.trackContainer_buttons);
    this.trackContainer_info.appendChild(gainContainer);
    this.trackContainer_info.appendChild(panContainer);
   

    document.getElementById("tracks").appendChild(this.trackContainer);

    return this.trackContainer;
  }

  setupMuteButton() {
    if (!this.player) {
      console.error("Player is not initialized yet!");
      return;
    }
    this.player.mute = false;
    this.muteButton.addEventListener("click", () => {
      this.player.mute = !this.player.mute;
      this.muteButton.textContent = this.player.mute ? "Unmute" : "Mute";
    });
  }

  drawSample() {
    const canvas = this.trackContainer_canvas;
    const ctx = canvas.getContext("2d");

    if (!this.player.buffer.loaded) {
      console.error(`Buffer not loaded for ${this.samplePath}`);
      return;
    }

    // Get raw audio data from Tone.js buffer
    const buffer = this.player.buffer.getChannelData(0); // Only take one channel
    const bufferLength = buffer.length;
    const width = canvas.width;
    const height = canvas.height;
    const step = Math.floor(bufferLength / width); // How many samples per pixel
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff"; // Waveform color

    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;

      // Find min/max within this segment
      for (let j = 0; j < step; j++) {
        const sampleIndex = i * step + j;
        if (sampleIndex < bufferLength) {
          const value = buffer[sampleIndex];
          if (value < min) min = value;
          if (value > max) max = value;
        }
      }

      const yMin = centerY + min * centerY;
      const yMax = centerY + max * centerY;

      ctx.moveTo(i, yMin);
      ctx.lineTo(i, yMax);
    }
    ctx.stroke();
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
      tool : "keyword_selector",
      use_case : "Keyword Extraction",
      description : `- **USE THIS TOOL TO FIND BEST KEYWORDS FROM ${JSON.stringify(decription_list)}.**\n` +
      "- Choose the words available in the list that best describe the mood of the prompt.\n\n"+
      "- ONLY RETURN KEYWOARDS THAT ARE AVAILABLE IN THE FOLLOWING LIST : "+JSON.stringify(decription_list)+"\n\n" +
      "- FIND AT LEAST 10 KEYWORDS.\n\n" ,
      output_format: " \`\`\`json{ tool: \"keyword_selector\", data: { keywords: [\"string\", \"string\"] } }\`\`\`"
    },
    // {
    //   tool : "track_creator",
    //   use_case : "ADDS A NEW TRACK",
    //   description : `- **USE THIS TOOL TO CREATE AND ADD A NEW TRACK.**\n` +
    //   "-Determin what kind of track is to be created.\n\n"+
    //   "- Tracks can be either **drums** or **melody**.\n\n",
    //   output_format: " \`\`\`json{ tool: \"track_creator\", data: { instrumentType: \"string\"} }\`\`\`"
    // }
];

async function sendPrompt(prompt) {
  try {
    let instruction = `
You are a tool-using assistant. You must always respond by choosing the correct tool from the list and strictly following its response format.

## Available Tools:
${JSON.stringify(toolList, null, 2)}

## Task:
- Analyze the prompt: '${prompt}'.
- **Choose the correct tool based on intent**:
  - If the prompt is unclear, use **"keyword_selector"**.
  -** USE ONLY ONE TOOL**.

- Format the response **exactly** as shown in output_format.
- Do **not** explain your answer.
- Do **not** generate anything outside of JSON.

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
      if (match) {
        responseJson = JSON.parse(match[1]); // Parse the extracted JSON block
      } else {
        responseJson = JSON.parse(responseText.trim()); // Parse the raw response if no block is found
      }
    } catch (error) {
      textInput.placeholder = "Error parsing response. Please try again.";
      console.error("Error parsing JSON:", error, "Raw response:", responseText);
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
    //const chat_line_Element = createChatLine(prompt);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    promptUpdate(prompt)
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

function showProgress(){
  if (!isPlaying) return; // Ensure it only runs when playing
  

  
  tracks.forEach((track) => {
    if (track.player.buffer.loaded) { // Check if buffer is loaded
      showPlayhead(track);
    }
  });

  if (isPlaying) {
    requestAnimationFrame(showProgress);
  }
}

function showPlayhead(track){
  const position = getPlaybackProgress(track.player);
  track.drawSample(); // Draw waveform

  const canvas = track.trackContainer_canvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  
  const playheadPosition = position * width;

  // Clear previous playhead (if any)
  ctx.clearRect(0, 0, width, height);

  // Redraw waveform
  track.drawSample();

  // Draw the playhead
  ctx.strokeStyle = "red"; // Playhead color
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(playheadPosition, 0);
  ctx.lineTo(playheadPosition, height);
  ctx.stroke();
}

function getPlaybackProgress(player) {
  if (!player.buffer || !player.buffer.loaded) return 0; // Avoid errors if not loaded

  const currentTime = Tone.Transport.seconds; // Get current transport time
  const duration = player.buffer.duration; // Total sample duration (in seconds)

  return duration > 0 ? (currentTime % duration) / duration : 0; // Normalize to 0-1 range
}

function promptUpdate(prompt){
  textInput.style.visibility = "hidden";
   
  loading_animation.goToAndPlay(0, true);
  document.getElementById('tracks').style.display = "none";
  document.getElementById('inputs').style.display = "none";
  sendPrompt(prompt).then((response) => {
    
    loading_animation.addEventListener("complete", () => {
      document.getElementById('tracks').style.display = "flex";
      document.getElementById('inputs').style.display = "flex";
      loading_animation.stop();
      textInput.placeholder = "What's next ?";
      textInput.dispatchEvent(new Event("input"));
      textInput.style.visibility = "visible";
      textInput.focus();
      const data = response.data;
      console.log("tool: ", response.tool, "data: ", data);
      eval(response.tool)(data);
      //chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    
  });

  textInput.value = ""; // Clear the input field after sending
}



export{sendPrompt, promptUpdate}
